# Community Features Deployment Guide

This guide walks you through deploying the new user-generated community features to SaveFromScam.

## 📋 What Was Built

### Backend (6 new files)
- ✅ `/supabase-community-schema.sql` - Database schema with 4 tables, RLS policies, and triggers
- ✅ `/src/lib/moderateContent.js` - AI moderation logic using Claude Opus 4.6
- ✅ `/src/app/api/community/posts/route.js` - GET/POST endpoints for posts
- ✅ `/src/app/api/community/posts/[id]/vote/route.js` - Voting endpoint
- ✅ `/src/app/api/community/posts/[id]/comments/route.js` - Comment endpoints
- ✅ `/src/app/api/community/moderate-cron/route.js` - Cron job for AI moderation

### Frontend (3 new components)
- ✅ `/src/components/NewPostModal.js` - Modal for submitting scam reports
- ✅ `/src/components/PostCard.js` - Reusable post card with voting
- ✅ `/src/components/CommentsSection.js` - Comments display and submission

### Updated Files
- ✅ `/src/app/community/page.js` - Now fetches real posts from API
- ✅ `/vercel.json` - Added cron job configuration

---

## 🚀 Deployment Steps

### Step 1: Run Database Migration

1. Log into your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Open the file `/supabase-community-schema.sql` in your text editor
4. Copy the entire contents
5. Paste into Supabase SQL Editor
6. Click **Run**

This will create:
- ✅ `community_posts` table
- ✅ `post_comments` table
- ✅ `post_votes` table
- ✅ `post_rate_limits` table
- ✅ All indexes, RLS policies, and triggers

**Verify it worked:**
Run this query in Supabase:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE '%community%' OR table_name LIKE '%post%';
```

You should see 4 tables: `community_posts`, `post_comments`, `post_votes`, `post_rate_limits`

---

### Step 2: Add Environment Variable (Optional)

For added security, add a cron secret to your Vercel environment variables:

1. Go to **Vercel Dashboard** → Your project → **Settings** → **Environment Variables**
2. Add a new variable:
   - **Key:** `CRON_SECRET`
   - **Value:** Any random string (e.g., generate one with `openssl rand -hex 32`)
   - **Environments:** Production, Preview, Development

This prevents unauthorized access to the moderation cron endpoint.

---

### Step 3: Deploy to Vercel

```bash
git add .
git commit -m "Add user-generated community features with AI moderation"
git push origin main
```

Vercel will automatically:
- ✅ Build and deploy your app
- ✅ Set up the cron job to run every 5 minutes

**Verify deployment:**
1. Check Vercel dashboard for successful deployment
2. Visit your site → Community page
3. You should see "No posts yet" (or any posts you create)

---

### Step 4: Enable Vercel Cron Jobs (Free tier limitation)

⚠️ **Important:** Vercel cron jobs are only available on **Pro plans** or higher.

**If you're on a Free plan:**

**Option A: Upgrade to Vercel Pro** ($20/month)
- Cron jobs included
- Better performance and limits

**Option B: Use an external cron service** (free alternative)
1. Sign up for a free cron service like:
   - [cron-job.org](https://cron-job.org)
   - [EasyCron](https://www.easycron.com)
   - [UptimeRobot](https://uptimerobot.com) (set up HTTP monitor)

2. Configure it to call:
   - **URL:** `https://savefromscam.com/api/community/moderate-cron`
   - **Method:** GET
   - **Schedule:** Every 5 minutes
   - **Headers:** `Authorization: Bearer YOUR_CRON_SECRET` (if you set one)

**Option C: Manual moderation** (temporary solution)
- Posts will remain in "pending" status until you manually call the cron endpoint
- Visit `https://savefromscam.com/api/community/moderate-cron` in your browser periodically
- Or run: `curl https://savefromscam.com/api/community/moderate-cron`

---

### Step 5: Test the Features

#### Test Post Submission
1. **Sign in** to your account
2. Go to **Community** page
3. Click **"+ Report a Scam"**
4. Fill out the form:
   - Scam Type: Phone
   - Content: "Received a call claiming to be from the IRS demanding immediate payment via gift cards. They threatened arrest if I didn't pay within 1 hour. Classic scam tactics."
   - Location: Orlando, FL
5. Click **Submit Report**
6. You should see: "Post submitted for review"

#### Test AI Moderation
1. Wait 5 minutes (or manually trigger the cron job)
2. Check Supabase → `community_posts` table
3. Your post should now have:
   - `status = 'approved'` (if quality score ≥60)
   - `moderation_score` (0-100)
   - `moderation_reason` (explanation from Claude)
4. Refresh the Community page - your post should appear!

#### Test Voting
1. Click the **△** (upvote) button on a post
2. Count should increase by 1
3. Click again - it should decrease (removes vote)
4. Sign in with a different account - vote count should persist

#### Test Comments
1. Click **"Reply"** on a post
2. Type a comment: "Thanks for sharing! I got the same call yesterday."
3. Click **Post Comment**
4. Wait for moderation (~5 minutes)
5. Refresh - comment should appear

#### Test Rate Limiting
1. As a free user, submit 3 posts successfully
2. Try to submit a 4th post
3. You should see: "You've reached your daily post limit (3). Upgrade to Premium for unlimited posts."

---

## 🔧 Troubleshooting

### Posts not appearing after moderation
- Check Supabase → `community_posts` table
- Look at `status` field - should be `approved`
- Check `moderation_score` - needs to be ≥60 for auto-approval
- Check Vercel logs for cron job errors

### Cron job not running
- Verify you're on Vercel Pro plan (or using external cron service)
- Check Vercel → Deployments → Cron Jobs tab
- Test manually: Visit `https://savefromscam.com/api/community/moderate-cron`

### Rate limiting not working
- Check Supabase → `post_rate_limits` table
- Verify `posts_today` is incrementing
- Check user's `is_pro` status in `profiles` table

### Authentication errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` is set in Vercel
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set in Vercel
- Check that Supabase auth is working (test on /auth page)

### RLS policy errors
- In Supabase, verify RLS is enabled on all tables:
  ```sql
  SELECT tablename, rowsecurity
  FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename LIKE '%community%' OR tablename LIKE '%post%';
  ```
- All should show `rowsecurity = true`

---

## 📊 Monitoring

### Check Moderation Queue
```sql
-- See pending posts awaiting moderation
SELECT id, user_id, scam_type, content, created_at
FROM community_posts
WHERE status = 'pending'
ORDER BY created_at DESC;
```

### Check Moderation Results
```sql
-- See recent moderation decisions
SELECT id, status, moderation_score, moderation_reason, created_at
FROM community_posts
WHERE moderated_at IS NOT NULL
ORDER BY moderated_at DESC
LIMIT 10;
```

### Check User Activity
```sql
-- See most active users
SELECT
  u.email,
  COUNT(p.id) as total_posts,
  COUNT(c.id) as total_comments
FROM auth.users u
LEFT JOIN community_posts p ON u.id = p.user_id
LEFT JOIN post_comments c ON u.id = c.user_id
GROUP BY u.id, u.email
ORDER BY total_posts DESC
LIMIT 10;
```

---

## 🎯 Success Metrics

After deployment, you should see:
- ✅ Users can submit scam reports (with "Report a Scam" button)
- ✅ Posts are moderated by Claude AI within 5 minutes
- ✅ Approved posts appear in the community feed
- ✅ Users can vote on posts (toggle on/off)
- ✅ Users can comment on posts
- ✅ Free users limited to 3 posts/day
- ✅ Premium users have unlimited posts
- ✅ All content is moderated for spam/PII

---

## 🚦 Next Steps (Optional Enhancements)

After everything is working, consider these improvements:

1. **Real-time updates** - Use Supabase Realtime to show new posts without refresh
2. **Email notifications** - Notify users when their post is approved/rejected
3. **Admin dashboard** - Manual moderation queue for flagged content
4. **User profiles** - Public profiles showing user contributions and reputation
5. **Trending algorithm** - Sort by `vote_count / age_in_hours` instead of just recency
6. **Location filtering** - "Show scams near me" based on user's location
7. **Report abuse** - Flag button for inappropriate content
8. **Image uploads** - Allow users to attach screenshots

---

## 📝 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase logs (Database → Logs)
3. Check browser console for frontend errors
4. Review this deployment guide again
5. Test in staging environment first before production

---

## 🎉 You're Done!

Your community features are now live! Users can:
- 📝 Submit scam reports
- 💬 Comment and discuss
- 👍 Vote on helpful posts
- 🤖 Get AI-moderated content
- 🛡️ Trust verified, high-quality scam alerts

Welcome to your community-powered scam database! 🚀
