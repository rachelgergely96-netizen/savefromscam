import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return Response.json(
        { error: "Signup is temporarily unavailable." },
        { status: 503 }
      );
    }

    const { error } = await supabaseAdmin
      .from("lead_emails")
      .upsert(
        { email: email.toLowerCase(), source: "scam_checklist" },
        { onConflict: "email", ignoreDuplicates: true }
      );

    if (error) {
      if (error.code === "42P01") {
        return Response.json(
          { error: "Coming soon. Try again later." },
          { status: 503 }
        );
      }
      console.error("lead_emails insert error:", error);
      return Response.json(
        { error: "Something went wrong. Try again." },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
      message: "Thanks! We'll send the guide soon.",
    });
  } catch (err) {
    console.error("Lead API error:", err);
    return Response.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
