import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const FREE_CHECKS_PER_DAY = 5;
const FREE_SCENARIOS_PER_DAY = 1;

function getSupabaseUserFromToken(accessToken) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || !accessToken) return null;
  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false },
  });
}

function toUtcDate(isoOrDate) {
  const d = isoOrDate ? new Date(isoOrDate) : null;
  if (!d) return null;
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  ).toISOString();
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader?.replace(/^Bearer\s+/i, "").trim();
    if (!accessToken) {
      return Response.json(
        { error: "Sign in to see usage." },
        { status: 401 }
      );
    }

    const userClient = getSupabaseUserFromToken(accessToken);
    if (!userClient) {
      return Response.json({ error: "Sign in to see usage." }, { status: 401 });
    }
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) {
      return Response.json({ error: "Sign in to see usage." }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return Response.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("is_pro, checks_used_today, checks_reset_at, scenarios_used_today, scenarios_reset_at")
      .eq("id", user.id)
      .single();

    const now = new Date();
    const todayUtc = toUtcDate(now);
    const checksResetAt = toUtcDate(profile?.checks_reset_at);
    const scenariosResetAt = toUtcDate(profile?.scenarios_reset_at);

    const isPro = !!profile?.is_pro;
    let checksUsed = profile?.checks_used_today ?? 0;
    let scenariosUsed = profile?.scenarios_used_today ?? 0;
    if (!checksResetAt || checksResetAt < todayUtc) checksUsed = 0;
    if (!scenariosResetAt || scenariosResetAt < todayUtc) scenariosUsed = 0;

    return Response.json({
      checksUsed,
      checksLimit: isPro ? null : FREE_CHECKS_PER_DAY,
      scenariosUsed,
      scenariosLimit: isPro ? null : FREE_SCENARIOS_PER_DAY,
      isPro,
    });
  } catch (error) {
    console.error("Usage API error:", error);
    return Response.json(
      { error: "Could not load usage." },
      { status: 500 }
    );
  }
}
