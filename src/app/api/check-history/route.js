import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

function getSupabaseUserFromToken(accessToken) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || !accessToken) return null;
  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false },
  });
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader?.replace(/^Bearer\s+/i, "").trim();
    if (!accessToken) {
      return Response.json(
        { error: "Sign in to view your check history." },
        { status: 401 }
      );
    }

    const userClient = getSupabaseUserFromToken(accessToken);
    if (!userClient) {
      return Response.json(
        { error: "Sign in to view your check history." },
        { status: 401 }
      );
    }
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) {
      return Response.json(
        { error: "Sign in to view your check history." },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return Response.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const { data: rows, error } = await supabaseAdmin
      .from("check_history")
      .select("id, verdict, confidence, summary, tactics, actions, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      if (error.code === "42P01") {
        return Response.json(
          { error: "Check history not available yet." },
          { status: 503 }
        );
      }
      console.error("check_history GET error:", error);
      return Response.json(
        { error: "Could not load history." },
        { status: 500 }
      );
    }

    return Response.json(rows || []);
  } catch (err) {
    console.error("check-history GET error:", err);
    return Response.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader?.replace(/^Bearer\s+/i, "").trim();
    if (!accessToken) {
      return Response.json(
        { error: "Create an account to save results." },
        { status: 401 }
      );
    }

    const userClient = getSupabaseUserFromToken(accessToken);
    if (!userClient) {
      return Response.json(
        { error: "Create an account to save results." },
        { status: 401 }
      );
    }
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) {
      return Response.json(
        { error: "Create an account to save results." },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return Response.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { verdict, confidence, summary, tactics, actions } = body;

    if (!verdict || confidence == null) {
      return Response.json(
        { error: "Missing verdict or confidence." },
        { status: 400 }
      );
    }

    const { data: row, error } = await supabaseAdmin
      .from("check_history")
      .insert({
        user_id: user.id,
        verdict: String(verdict),
        confidence: Number(confidence) || 0,
        summary: summary ? String(summary) : null,
        tactics: Array.isArray(tactics) ? tactics : null,
        actions: Array.isArray(actions) ? actions : null,
      })
      .select("id, created_at")
      .single();

    if (error) {
      if (error.code === "42P01") {
        return Response.json(
          { error: "Save not available yet. Table check_history may need to be created." },
          { status: 503 }
        );
      }
      console.error("check_history POST error:", error);
      return Response.json(
        { error: "Could not save to history." },
        { status: 500 }
      );
    }

    return Response.json({ ok: true, id: row?.id, created_at: row?.created_at });
  } catch (err) {
    console.error("check-history POST error:", err);
    return Response.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
