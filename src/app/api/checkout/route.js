import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// IMPORTANT: For now we accept a userId from the client.
// Once Supabase Auth is wired into the app, this should come
// from the authenticated session on the server instead.

export async function POST(request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured on the server." },
        { status: 500 }
      );
    }

    const {
      priceId = process.env.STRIPE_PRICE_ID,
      userId,
      email,
    } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price ID is missing." },
        { status: 400 }
      );
    }

    if (!userId && !email) {
      return NextResponse.json(
        { error: "userId or email is required to create a checkout session." },
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

