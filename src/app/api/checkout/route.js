import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured on the server." },
        { status: 500 }
      );
    }

    // Authenticate user from Authorization header (not client request body!)
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader?.replace(/^Bearer\s+/i, "").trim();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to upgrade." },
        { status: 401 }
      );
    }

    const userClient = getSupabaseUserFromToken(accessToken);
    if (!userClient) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to upgrade." },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await userClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to upgrade." },
        { status: 401 }
      );
    }

    // Use server-verified user ID and email (NOT from client!)
    const userId = user.id;
    const email = user.email;

    const {
      priceId = process.env.STRIPE_PRICE_ID,
    } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price ID is missing." },
        { status: 400 }
      );
    }

    let stripeCustomerId = null;

    // If we have Supabase admin configured and a userId, reuse / create customer record.
    if (supabaseAdmin && userId) {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("stripe_customer_id")
        .eq("id", userId)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching profile:", profileError);
      }

      stripeCustomerId = profile?.stripe_customer_id ?? null;

      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: email || undefined,
          metadata: {
            supabase_user_id: userId,
          },
        });

        stripeCustomerId = customer.id;

        const upsertPayload = {
          id: userId,
          stripe_customer_id: stripeCustomerId,
        };

        const { error: upsertError } = await supabaseAdmin
          .from("profiles")
          .upsert(upsertPayload, { onConflict: "id" });

        if (upsertError) {
          console.error("Error upserting profile:", upsertError);
        }
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: stripeCustomerId || undefined,
      customer_email: !stripeCustomerId && email ? email : undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://savefromscam.vercel.app"}/?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://savefromscam.vercel.app"}/pricing?checkout=cancelled`,
      metadata: {
        supabase_user_id: userId || "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}

