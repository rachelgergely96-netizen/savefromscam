import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

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

export async function POST(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader?.replace(/^Bearer\s+/i, "").trim();
    if (!accessToken) {
      return Response.json(
        { allowed: false, error: "Please sign in to use the Simulator." },
        { status: 401 }
      );
    }

    const userClient = getSupabaseUserFromToken(accessToken);
    if (!userClient) {
      return Response.json(
        { allowed: false, error: "Please sign in to use the Simulator." },
        { status: 401 }
      );
    }
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) {
      return Response.json(
        { allowed: false, error: "Please sign in to use the Simulator." },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return Response.json(
        { allowed: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, is_pro, scenarios_used_today, scenarios_reset_at")
      .eq("id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Profile fetch error:", profileError);
      return Response.json(
        { allowed: false, error: "Could not load your account." },
        { status: 500 }
      );
    }

    const now = new Date();
    const todayUtc = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    ).toISOString();
    const resetAt = profile?.scenarios_reset_at
      ? new Date(profile.scenarios_reset_at)
      : null;
    const resetAtUtc = resetAt
      ? new Date(
          Date.UTC(
            resetAt.getUTCFullYear(),
            resetAt.getUTCMonth(),
            resetAt.getUTCDate()
          )
        ).toISOString()
      : null;

    let scenariosUsedToday = profile?.scenarios_used_today ?? 0;
    if (!resetAtUtc || resetAtUtc < todayUtc) {
      scenariosUsedToday = 0;
      await supabaseAdmin
        .from("profiles")
        .upsert(
          {
            id: user.id,
            scenarios_used_today: 0,
            scenarios_reset_at: now.toISOString(),
          },
          { onConflict: "id" }
        );
    }

    const isPro = !!profile?.is_pro;
    if (!isPro && scenariosUsedToday >= FREE_SCENARIOS_PER_DAY) {
      return Response.json(
        {
          allowed: false,
          limitReached: true,
          error:
            "You've used your 1 free scenario for today. Upgrade to Premium for unlimited.",
        },
        { status: 403 }
      );
    }

    await supabaseAdmin
      .from("profiles")
      .update({
        scenarios_used_today: scenariosUsedToday + 1,
        scenarios_reset_at:
          !resetAtUtc || resetAtUtc < todayUtc
            ? now.toISOString()
            : profile?.scenarios_reset_at,
      })
      .eq("id", user.id);

    return Response.json({ allowed: true });
  } catch (error) {
    console.error("Simulator use error:", error);
    return Response.json(
      { allowed: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
