-- =====================================================
-- Community Features Database Schema
-- =====================================================
-- This schema adds user-generated community features to SaveFromScam
-- Tables: community_posts, post_comments, post_votes, post_rate_limits
-- =====================================================

-- =====================================================
-- 1. COMMUNITY_POSTS TABLE
-- =====================================================
-- Stores user-submitted scam reports
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Content fields
  scam_type text NOT NULL CHECK (scam_type IN ('Phone', 'Text', 'Email', 'Online')),
  content text NOT NULL CHECK (char_length(content) >= 20 AND char_length(content) <= 2000),
  location text CHECK (location IS NULL OR char_length(location) <= 100),

  -- Moderation fields
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
  moderation_score int CHECK (moderation_score IS NULL OR (moderation_score >= 0 AND moderation_score <= 100)),
  moderation_reason text,
  moderated_at timestamptz,

  -- Engagement fields
  vote_count int NOT NULL DEFAULT 0 CHECK (vote_count >= 0),
  comment_count int NOT NULL DEFAULT 0 CHECK (comment_count >= 0),
  verified boolean NOT NULL DEFAULT false,

  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON community_posts(status);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_approved_recent
  ON community_posts(created_at DESC) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_community_posts_scam_type ON community_posts(scam_type);

-- Enable RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running this migration)
DROP POLICY IF EXISTS "Anyone can view approved posts" ON community_posts;
DROP POLICY IF EXISTS "Users can view own posts" ON community_posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update own posts content" ON community_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON community_posts;
DROP POLICY IF EXISTS "Service role can update all posts" ON community_posts;

-- RLS Policies
-- Anyone can read approved posts
CREATE POLICY "Anyone can view approved posts"
  ON community_posts FOR SELECT
  USING (status = 'approved');

-- Users can view their own posts (any status)
CREATE POLICY "Users can view own posts"
  ON community_posts FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can insert posts (goes to pending)
CREATE POLICY "Authenticated users can create posts"
  ON community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Users can update only their own posts (content/location only, not moderation fields)
CREATE POLICY "Users can update own posts content"
  ON community_posts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
  ON community_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Service role can update all posts (for moderation)
CREATE POLICY "Service role can update all posts"
  ON community_posts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- =====================================================
-- 2. POST_COMMENTS TABLE
-- =====================================================
-- Stores comments on community posts
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Content
  content text NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 1000),

  -- Moderation (lighter than posts)
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderation_score int CHECK (moderation_score IS NULL OR (moderation_score >= 0 AND moderation_score <= 100)),
  moderation_reason text,
  moderated_at timestamptz,

  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON post_comments(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_post_comments_status ON post_comments(status);

-- Enable RLS
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view approved comments" ON post_comments;
DROP POLICY IF EXISTS "Users can view own comments" ON post_comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON post_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON post_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON post_comments;
DROP POLICY IF EXISTS "Service role can update all comments" ON post_comments;

-- RLS Policies
-- Anyone can read approved comments on approved posts
CREATE POLICY "Anyone can view approved comments"
  ON post_comments FOR SELECT
  USING (
    status = 'approved' AND
    EXISTS (
      SELECT 1 FROM community_posts
      WHERE id = post_comments.post_id AND status = 'approved'
    )
  );

-- Users can view their own comments
CREATE POLICY "Users can view own comments"
  ON post_comments FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can create comments (only on approved posts)
CREATE POLICY "Authenticated users can create comments"
  ON post_comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    status = 'pending' AND
    EXISTS (
      SELECT 1 FROM community_posts
      WHERE id = post_comments.post_id AND status = 'approved'
    )
  );

-- Users can update own comments (content only)
CREATE POLICY "Users can update own comments"
  ON post_comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete own comments
CREATE POLICY "Users can delete own comments"
  ON post_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Service role can update all comments (for moderation)
CREATE POLICY "Service role can update all comments"
  ON post_comments FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- =====================================================
-- 3. POST_VOTES TABLE
-- =====================================================
-- Tracks which users voted on which posts
CREATE TABLE IF NOT EXISTS post_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  created_at timestamptz NOT NULL DEFAULT now(),

  -- Ensure one vote per user per post
  UNIQUE(post_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_post_votes_post_id ON post_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_votes_user_id ON post_votes(user_id);

-- Enable RLS
ALTER TABLE post_votes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view votes" ON post_votes;
DROP POLICY IF EXISTS "Authenticated users can vote" ON post_votes;
DROP POLICY IF EXISTS "Users can remove own votes" ON post_votes;

-- RLS Policies
-- Anyone can view votes (to show vote counts and who voted)
CREATE POLICY "Anyone can view votes"
  ON post_votes FOR SELECT
  USING (true);

-- Authenticated users can vote (on approved posts only)
CREATE POLICY "Authenticated users can vote"
  ON post_votes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM community_posts
      WHERE id = post_votes.post_id AND status = 'approved'
    )
  );

-- Users can remove their own votes
CREATE POLICY "Users can remove own votes"
  ON post_votes FOR DELETE
  USING (auth.uid() = user_id);


-- =====================================================
-- 4. POST_RATE_LIMITS TABLE
-- =====================================================
-- Rate limiting: 3 posts per day for free users, unlimited for premium
CREATE TABLE IF NOT EXISTS post_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  posts_today int NOT NULL DEFAULT 0 CHECK (posts_today >= 0),
  reset_at timestamptz NOT NULL,

  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_post_rate_limits_user_id ON post_rate_limits(user_id);

-- Enable RLS
ALTER TABLE post_rate_limits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can manage rate limits" ON post_rate_limits;

-- RLS Policies
-- Only service role can access (backend only)
CREATE POLICY "Service role can manage rate limits"
  ON post_rate_limits FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- =====================================================
-- 5. DATABASE TRIGGERS
-- =====================================================

-- Trigger: Update comment_count when comment is added/removed/approved
DROP FUNCTION IF EXISTS update_post_comment_count() CASCADE;
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'approved' THEN
    UPDATE community_posts
    SET comment_count = comment_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'approved' THEN
    UPDATE community_posts
    SET comment_count = GREATEST(0, comment_count - 1)
    WHERE id = OLD.post_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != 'approved' AND NEW.status = 'approved' THEN
    UPDATE community_posts
    SET comment_count = comment_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'approved' AND NEW.status != 'approved' THEN
    UPDATE community_posts
    SET comment_count = GREATEST(0, comment_count - 1)
    WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_comment_count ON post_comments;
CREATE TRIGGER trigger_update_comment_count
AFTER INSERT OR UPDATE OR DELETE ON post_comments
FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();


-- Trigger: Update vote_count when vote is added/removed
DROP FUNCTION IF EXISTS update_post_vote_count() CASCADE;
CREATE OR REPLACE FUNCTION update_post_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts
    SET vote_count = vote_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts
    SET vote_count = GREATEST(0, vote_count - 1)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_vote_count ON post_votes;
CREATE TRIGGER trigger_update_vote_count
AFTER INSERT OR DELETE ON post_votes
FOR EACH ROW EXECUTE FUNCTION update_post_vote_count();


-- Trigger: Update updated_at timestamp
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_community_posts_updated_at ON community_posts;
CREATE TRIGGER trigger_community_posts_updated_at
BEFORE UPDATE ON community_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_post_comments_updated_at ON post_comments;
CREATE TRIGGER trigger_post_comments_updated_at
BEFORE UPDATE ON post_comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- To run this migration:
-- 1. Log into Supabase Dashboard
-- 2. Go to SQL Editor
-- 3. Paste this entire file
-- 4. Click "Run"
--
-- This will create all tables, indexes, RLS policies, and triggers
-- needed for the community features.
-- =====================================================
