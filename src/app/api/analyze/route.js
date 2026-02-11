import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const FREE_CHECKS_PER_DAY = 5;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function getSupabaseUserFromToken(accessToken) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || !accessToken) return null;
  const userClient = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false },
  });
  return userClient;
}

function getIpHash(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function POST(request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not set on the server.");
      return Response.json(
        { error: "Server is missing AI configuration." },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader?.replace(/^Bearer\s+/i, "").trim();
    const fromHomepage = request.headers.get("X-From-Homepage") === "true";

    // Optional: one anonymous check per IP per day from homepage only
    if (!accessToken && fromHomepage && supabaseAdmin) {
      const { text } = await request.json().catch(() => ({}));
      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return Response.json({ error: "No text provided" }, { status: 400 });
      }
      if (text.length > 5000) {
        return Response.json(
          { error: "Text too long. Maximum 5000 characters." },
          { status: 400 }
        );
      }
      const todayUtc = new Date().toISOString().slice(0, 10);
      const ipHash = getIpHash(request);
      const { data: existing } = await supabaseAdmin
        .from("anon_homepage_checks")
        .select("id")
        .eq("ip_hash", ipHash)
        .eq("created_at", todayUtc)
        .limit(1)
        .maybeSingle();
      if (existing) {
        return Response.json(
          { error: "You've used your one free homepage check. Create an account for 5 checks per day." },
          { status: 401 }
        );
      }
      const message = await client.messages.create({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `You are a scam detection expert. Analyze the following message and determine if it is likely a scam or legitimate.

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "verdict": "HIGH RISK — LIKELY SCAM" or "MEDIUM RISK — SUSPICIOUS" or "LOW RISK — LIKELY SAFE",
  "confidence": <number 0-100>,
  "tactics": [
    {
      "name": "<tactic name like 'Urgency Pressure' or 'Emotional Manipulation'>",
      "score": <severity 0-100>,
      "desc": "<one sentence explaining how this tactic is used in the message>"
    }
  ],
  "summary": "<2-3 sentence explanation of why this is or isn't a scam>",
  "actions": ["<recommended action 1>", "<recommended action 2>", "<recommended action 3>"]
}

Include 2-5 tactics. If the message appears legitimate, still analyze it but give low scores.

Message to analyze:
"""
${text}
"""`,
          },
        ],
      });
      const result = JSON.parse(message.content[0].text);
      await supabaseAdmin.from("anon_homepage_checks").insert({
        ip_hash: ipHash,
        created_at: todayUtc,
      });
      return Response.json(result);
    }

    if (!accessToken) {
      return Response.json(
        { error: "Please sign in to use Scam Check." },
        { status: 401 }
      );
    }

    const userClient = getSupabaseUserFromToken(accessToken);
    if (!userClient) {
      return Response.json(
        { error: "Please sign in to use Scam Check." },
        { status: 401 }
      );
    }
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) {
      return Response.json(
        { error: "Please sign in to use Scam Check." },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return Response.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, is_pro, checks_used_today, checks_reset_at")
      .eq("id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Profile fetch error:", profileError);
      return Response.json(
        { error: "Could not load your account." },
        { status: 500 }
      );
    }

    const now = new Date();
    const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
    let checksUsedToday = profile?.checks_used_today ?? 0;
    const resetAt = profile?.checks_reset_at ? new Date(profile.checks_reset_at) : null;
    const resetAtUtc = resetAt ? new Date(Date.UTC(resetAt.getUTCFullYear(), resetAt.getUTCMonth(), resetAt.getUTCDate())).toISOString() : null;

    if (!resetAtUtc || resetAtUtc < todayUtc) {
      checksUsedToday = 0;
      await supabaseAdmin
        .from("profiles")
        .upsert(
          {
            id: user.id,
            checks_used_today: 0,
            checks_reset_at: now.toISOString(),
          },
          { onConflict: "id" }
        );
    }

    const isPro = !!profile?.is_pro;
    if (!isPro && checksUsedToday >= FREE_CHECKS_PER_DAY) {
      return Response.json(
        {
          error: "You've used your 5 free checks for today. Upgrade to Premium for unlimited.",
          limitReached: true,
        },
        { status: 403 }
      );
    }

    const { text } = await request.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return Response.json({ error: "No text provided" }, { status: 400 });
    }

    if (text.length > 5000) {
      return Response.json(
        { error: "Text too long. Maximum 5000 characters." },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      // Use a stable, current model identifier
      model: "claude-3-5-sonnet-latest",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a scam detection expert. Analyze the following message and determine if it is likely a scam or legitimate.

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "verdict": "HIGH RISK — LIKELY SCAM" or "MEDIUM RISK — SUSPICIOUS" or "LOW RISK — LIKELY SAFE",
  "confidence": <number 0-100>,
  "tactics": [
    {
      "name": "<tactic name like 'Urgency Pressure' or 'Emotional Manipulation'>",
      "score": <severity 0-100>,
      "desc": "<one sentence explaining how this tactic is used in the message>"
    }
  ],
  "summary": "<2-3 sentence explanation of why this is or isn't a scam>",
  "actions": ["<recommended action 1>", "<recommended action 2>", "<recommended action 3>"]
}

Include 2-5 tactics. If the message appears legitimate, still analyze it but give low scores.

Message to analyze:
"""
${text}
"""`,
        },
      ],
    });

    const responseText = message.content[0].text;
    const result = JSON.parse(responseText);

    const newChecksUsed = checksUsedToday + 1;
    const newResetAt = !resetAtUtc || resetAtUtc < todayUtc ? now.toISOString() : profile?.checks_reset_at;
    await supabaseAdmin
      .from("profiles")
      .update({
        checks_used_today: newChecksUsed,
        checks_reset_at: newResetAt,
      })
      .eq("id", user.id);

    return Response.json(result);
  } catch (error) {
    console.error("Scam analysis error:", error);

    if (error instanceof SyntaxError) {
      return Response.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const message = error?.message || "Unknown error";
    const isAnthropic = message.includes("anthropic") || message.includes("API key") || message.includes("401") || message.includes("429");
    const userMessage = isAnthropic
      ? "AI service error. Check that ANTHROPIC_API_KEY is set and valid in Vercel."
      : "Analysis failed. Please try again.";

    return Response.json(
      { error: userMessage },
      { status: 500 }
    );
  }
}
