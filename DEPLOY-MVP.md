# SaveFromScam - MVP Deployment Guide

## ✅ Completed Pre-Launch Tasks

1. **Critical Security Fix**: Checkout endpoint now requires authentication (can't accept client-provided userId)
2. **RLS Policies Created**: `supabase-rls-policies.sql` ready to run in Supabase
3. **Build Verified**: All code compiles successfully

---

## 🚀 MVP Launch Checklist (30-45 minutes)

### Step 1: Run SQL Migrations in Supabase (5 minutes)

Navigate to your Supabase project → SQL Editor and run these files **in order**:

1. **First**: `supabase-check-history-and-leads.sql`
   - Creates `check_history`, `anon_homepage_checks`, `lead_emails` tables
   - ✅ Verify: Run `SELECT * FROM check_history LIMIT 1;` (should work, not error)

2. **Second**: `supabase-usage-columns.sql`
   - Adds usage tracking columns to profiles table
   - ✅ Verify: Run `SELECT id, checks_used_today FROM profiles LIMIT 1;` (should show column exists)

3. **Third**: `supabase-rls-policies.sql` ⚠️ **NEW - CRITICAL**
   - Enables Row Level Security on profiles table
   - ✅ Verify: Run `SELECT rowsecurity FROM pg_tables WHERE tablename = 'profiles';` (should return `true`)

4. **Fourth** (Optional for MVP): `supabase-premium-setup.sql`
   - Only needed if you're launching with Stripe integration
   - Skip for MVP if accepting manual payments initially

---

### Step 2: Verify Environment Variables in Vercel (10 minutes)

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Required for MVP:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-xxx...

# App Config
NEXT_PUBLIC_SITE_URL=https://savefromscam.com
```

**Optional (for Stripe - can add later):**
```bash
STRIPE_SECRET_KEY=sk_live_xxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx...
STRIPE_WEBHOOK_SECRET=whsec_xxx...
STRIPE_PRICE_ID=price_xxx...
```

⚠️ **Important:**
- Use **LIVE** keys, not test keys (no `_test_` in the string)
- Supabase should be your production project
- NEXT_PUBLIC_SITE_URL must match your actual domain

---

### Step 3: Configure Supabase Auth (5 minutes)

In Supabase Dashboard → Authentication:

1. **Email Provider**: ✅ Enabled
   - Confirm email: **ON** (prevents fake signups)
   - Customize email templates (optional but recommended)

2. **Google OAuth** (if using):
   - Add OAuth credentials
   - Add authorized redirect URLs: `https://savefromscam.com/auth/callback`

3. **Rate Limiting**:
   - Default settings are OK for MVP
   - Review after first week of traffic

4. **Site URL**:
   - Set to `https://savefromscam.com`

---

### Step 4: Deploy to Vercel (5 minutes)

```bash
# Option A: Deploy via Git (recommended)
git add .
git commit -m "MVP launch: Fix checkout auth, add RLS policies"
git push origin main

# Option B: Deploy via Vercel CLI
vercel --prod
```

**Vercel will:**
- Build your app (should succeed - we verified locally)
- Deploy to production
- Issue SSL certificate automatically

---

### Step 5: Post-Deploy Verification (10 minutes)

#### Test Critical Flows:

1. **Homepage** ✅
   - Visit https://savefromscam.com
   - Check light/dark mode toggle works
   - Verify hero section and CTA display

2. **Anonymous Check** ✅
   - Go to /check (or use homepage demo)
   - Paste a test message
   - Click "Check for scams"
   - Verify AI analysis returns results
   - Try 2nd check - should work (1 free on homepage, 5 on /check page)

3. **Sign Up** ✅
   - Click "Sign in" button
   - Enter email
   - Check inbox for magic link
   - Click link → should redirect to /check
   - Verify signed-in state shows in UI

4. **Signed-In Check** ✅
   - Perform scam check while signed in
   - Verify 5/day limit for free users
   - Check that counter resets next day

5. **Checkout** ✅ (if Stripe enabled)
   - Click "Upgrade" or pricing CTA
   - Should redirect to Stripe checkout
   - ⚠️ DO NOT complete payment in test mode
   - Cancel and verify user returns to site

#### Verify Database:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';
-- Expected: rowsecurity = true

-- Check policies exist
SELECT policyname FROM pg_policies WHERE tablename = 'profiles';
-- Expected: 5 policies (view, update, insert, service view, service update)

-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';
-- Expected: profiles, check_history, anon_homepage_checks, lead_emails
```

---

### Step 6: Enable Monitoring (5 minutes)

1. **Vercel Analytics**:
   - Go to Vercel Dashboard → Analytics
   - Enable (free tier is fine)

2. **Supabase Logs**:
   - Go to Supabase Dashboard → Logs
   - Review for any errors from API calls

3. **Create Alerts** (optional):
   - Vercel: Enable email notifications for deployment failures
   - Supabase: Enable email for database errors

---

## 🎯 What's NOT in MVP (Save for v2)

These were deliberately deferred to ship faster:

- ❌ **Atomic Rate Limiting SQL Function**: Current implementation works, minor race condition acceptable for MVP
- ❌ **Rate Limiting on /api/lead**: Has duplicate email protection via UNIQUE constraint
- ❌ **Community Backend**: Page shows UI only, make "Coming Soon"
- ❌ **Real Scam Score Calculation**: Shows vanity metric (total checks)
- ❌ **Stripe Customer Portal**: Users can't self-manage subscriptions yet
- ❌ **Full Webhook Handling**: Only handles checkout.session.completed

---

## 🚨 Known Issues & Workarounds

### Issue: User tries to checkout without signing in
**Behavior**: Will get 401 error from /api/checkout
**Workaround**: Frontend should redirect to /auth before calling checkout API
**Fix in v2**: Add client-side auth check before checkout

### Issue: Rate limit race condition on concurrent requests
**Impact**: Very unlikely in practice (requires malicious user sending 5+ concurrent requests)
**Workaround**: None needed for MVP
**Fix in v2**: Implement atomic rate limiting SQL function

### Issue: Community page is non-functional
**Impact**: Users see UI but can't vote/reply/report
**Workaround**: Add "Coming Soon" banner to page
**Fix in v2**: Implement community backend APIs

---

## 📊 Post-Launch Monitoring (First 48 Hours)

### Metrics to Watch:

1. **Vercel Logs** (hourly):
   - Any 500 errors?
   - API response times (<2s?)
   - Build status: green?

2. **Supabase Dashboard** (hourly):
   - Database errors?
   - Auth errors?
   - Table growth rate normal?

3. **User Behavior** (daily):
   - Signup conversion rate
   - Scam check usage
   - Error feedback from users

### Critical Alerts:

- 🔴 **If API error rate >5%**: Check Anthropic API key, Supabase connection
- 🔴 **If auth failures spike**: Check Supabase auth config, email delivery
- 🔴 **If checkout fails**: Check Stripe keys, webhook endpoint

---

## 🔄 Rollback Plan

If critical bug found after deploy:

```bash
# Option 1: Revert to previous deploy (fastest)
# Go to Vercel Dashboard → Deployments → Previous → Promote to Production

# Option 2: Revert via Git
git revert HEAD
git push origin main
```

Then fix issue in dev, test locally, re-deploy.

---

## ✅ Launch Complete!

After completing Steps 1-6, your MVP is live. Monitor for 24-48 hours and address any issues that come up.

**Next Steps:**
- Share with beta testers
- Collect feedback
- Plan v2 features based on usage data

---

## 📞 Support

**Issues during deployment?**
- Check `/home/codespace/.claude/plans/recursive-sparking-puppy.md` for full launch checklist
- Review error logs in Vercel and Supabase dashboards
- Test locally first: `npm run build && npm run dev`

**External Dashboards:**
- Supabase: https://supabase.com/dashboard
- Vercel: https://vercel.com/dashboard
- Stripe: https://dashboard.stripe.com (if enabled)
- Anthropic: https://console.anthropic.com
