# Stripe Premium Subscription Setup Guide

## Overview
After a user completes payment on Stripe, this is what happens:
1. User pays on Stripe checkout page
2. Stripe webhook sends `checkout.session.completed` event to your server
3. Server updates `profiles.is_pro = true` in Supabase
4. User redirected back to your site with premium unlocked
5. All API endpoints check `is_pro` to allow unlimited usage

---

## Step 1: Database Setup

Run this SQL in your Supabase SQL Editor:

```bash
# Copy the SQL file content
cat supabase-premium-setup.sql
```

Then paste it into: Supabase Dashboard → SQL Editor → New query → Run

This creates the `is_pro` column and related subscription tracking fields.

---

## Step 2: Stripe Webhook Configuration

### A. Get your webhook signing secret

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Set endpoint URL to: `https://yourdomain.com/api/stripe/webhook`
   - For testing: `https://your-vercel-preview.vercel.app/api/stripe/webhook`
4. Select events to listen for:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_...`)

### B. Add webhook secret to environment variables

Add to your `.env.local` (development) and Vercel environment variables (production):

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

**Important:** The webhook secret is different from your Stripe API key!

---

## Step 3: Test the Payment Flow

### Testing in Development (Local)

1. **Use Stripe CLI to forward webhooks:**
   ```bash
   # Install Stripe CLI: https://stripe.com/docs/stripe-cli
   stripe listen --forward-to localhost:3000/api/stripe/webhook

   # Copy the webhook signing secret (whsec_...) and add to .env.local
   ```

2. **Use test credit card:**
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/34)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)

3. **Complete test payment:**
   - Sign in to your app
   - Go to Score or Pricing page
   - Click "Upgrade to Premium"
   - Complete checkout with test card
   - You'll be redirected back to `/?checkout=success`

4. **Verify premium is unlocked:**
   ```bash
   # Check Supabase profiles table - is_pro should be true
   # Check Stripe CLI output - should show checkout.session.completed event
   # Try using unlimited scam checks or simulator scenarios
   ```

### Testing in Production

1. **Set webhook endpoint** to your production URL:
   ```
   https://savefromscam.com/api/stripe/webhook
   ```

2. **Add STRIPE_WEBHOOK_SECRET** to Vercel:
   - Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `STRIPE_WEBHOOK_SECRET` with the production webhook signing secret

3. **Test with real credit card** (or use test mode in production)

---

## Step 4: How Premium Features Work

### API Endpoints That Check Premium Status

1. **`/api/analyze`** (Scam Check):
   - Free: 1 check per day
   - Premium: Unlimited checks
   - Code: Checks `profile.is_pro` and skips rate limit if true

2. **`/api/simulator/use`** (Simulator):
   - Free: 1 scenario per day
   - Premium: Unlimited scenarios
   - Code: Checks `profile.is_pro` and skips rate limit if true

3. **`/api/usage`** (Usage Stats):
   - Returns different limits based on `is_pro`
   - Shows "Unlimited" for premium users

### Frontend Components That Show Premium Status

1. **Simulator page**: Shows usage counter
2. **Score page**: Shows "Upgrade to Premium" button
3. **Pricing page**: Shows current plan

---

## Step 5: Verify Everything Works

### Checklist

- [ ] Ran `supabase-premium-setup.sql` in Supabase SQL Editor
- [ ] Added Stripe webhook endpoint in Stripe Dashboard
- [ ] Added `STRIPE_WEBHOOK_SECRET` to environment variables
- [ ] Tested checkout flow with test card (4242...)
- [ ] Verified `is_pro = true` in Supabase after payment
- [ ] Verified unlimited scam checks work for premium users
- [ ] Verified unlimited simulator scenarios work for premium users
- [ ] Tested subscription cancellation (should set `is_pro = false`)

---

## Troubleshooting

### Webhook not receiving events

1. **Check webhook endpoint is correct** in Stripe Dashboard
2. **Check STRIPE_WEBHOOK_SECRET is set** correctly
3. **Check webhook logs** in Stripe Dashboard → Webhooks → Your endpoint → View logs
4. **Check server logs** for errors in the webhook handler

### Premium not unlocking after payment

1. **Check webhook received `checkout.session.completed` event**
2. **Check Supabase profiles table** - is `is_pro` true?
3. **Check webhook includes `supabase_user_id` in metadata**
4. **Check user is signed in** when clicking upgrade button

### User shows as premium but features still limited

1. **Check `/api/usage` endpoint** - does it return `is_pro: true`?
2. **Refresh the page** - AuthContext might be stale
3. **Sign out and sign in again** - clear session cache
4. **Check Supabase RLS policies** - ensure profiles table is readable

---

## Environment Variables Needed

```bash
# Stripe (required)
STRIPE_SECRET_KEY=sk_test_xxxxx  # or sk_live_xxxxx for production
STRIPE_PRICE_ID=price_xxxxx      # Your $9/mo price ID from Stripe
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Site URL (required for redirects)
NEXT_PUBLIC_SITE_URL=https://savefromscam.com  # or your domain
```

---

## What Happens Step-by-Step

1. **User clicks "Upgrade to Premium"**
   - Frontend calls `/api/checkout` with `userId` and `email`

2. **Checkout API creates Stripe session**
   - Creates/retrieves Stripe customer
   - Passes `supabase_user_id` in metadata
   - Returns checkout URL

3. **User completes payment on Stripe**
   - Enters card details
   - Stripe processes payment

4. **Stripe sends webhook to server**
   - Event: `checkout.session.completed`
   - Server verifies webhook signature
   - Server updates `profiles.is_pro = true` in Supabase

5. **User redirected back to site**
   - URL: `/?checkout=success`
   - Premium is now active!

6. **User makes API request**
   - API checks `profile.is_pro`
   - If true, skips rate limits
   - Unlimited checks/scenarios work

---

## Optional: Add Success Message

You can add a success toast/message when users return from payment. See the checkout URL has `?checkout=success` parameter. You could detect this on the homepage and show a congratulations message.
