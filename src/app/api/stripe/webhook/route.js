import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request) {
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.error("Stripe or webhook secret not configured.");
    return NextResponse.json({ received: true });
  }

  let event;
  const body = await request.text();

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const supabaseUserId =
          session.metadata?.supabase_user_id ||
          session.customer_details?.metadata?.supabase_user_id;

        if (supabaseAdmin && supabaseUserId) {
          const { error } = await supabaseAdmin
            .from("profiles")
            .upsert(
              { id: supabaseUserId, is_pro: true },
              { onConflict: "id" }
            );

          if (error) {
            console.error("Error updating profile on webhook:", error);
          }
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const supabaseUserId =
          subscription.metadata?.supabase_user_id ||
          subscription.customer &&
            subscription.customer.metadata?.supabase_user_id;

        if (supabaseAdmin && supabaseUserId) {
          const active = subscription.status === "active";
          const { error } = await supabaseAdmin
            .from("profiles")
            .upsert(
              { id: supabaseUserId, is_pro: active },
              { onConflict: "id" }
            );

          if (error) {
            console.error("Error updating subscription status:", error);
          }
        }
        break;
      }
      default:
        // Ignore other events for now
        break;
    }
  } catch (err) {
    console.error("Error handling Stripe webhook:", err);
    return new NextResponse("Webhook handler error", { status: 500 });
  }

  return NextResponse.json({ received: true });
}

