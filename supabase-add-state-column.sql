-- =====================================================
-- Migration: Add state column to community_posts
-- =====================================================
-- Enables nationwide location filtering by US state
-- Run this in Supabase SQL Editor after the initial community schema
-- =====================================================

-- Step 1: Add the state column (2-letter code, regex-checked)
ALTER TABLE community_posts
ADD COLUMN IF NOT EXISTS state text CHECK (state IS NULL OR state ~ '^[A-Z]{2}$');

-- Step 2: Backfill existing posts (all current posts are Central Florida)
UPDATE community_posts
SET state = 'FL'
WHERE state IS NULL AND location IS NOT NULL;

-- Step 3: Index for state-based filtering
CREATE INDEX IF NOT EXISTS idx_community_posts_state
  ON community_posts(state);

-- Step 4: Composite index for primary query (state + approved + recent)
CREATE INDEX IF NOT EXISTS idx_community_posts_state_approved_recent
  ON community_posts(state, created_at DESC) WHERE status = 'approved';

-- Step 5: Composite index for trending queries (state + scam_type + time)
CREATE INDEX IF NOT EXISTS idx_community_posts_trending
  ON community_posts(state, scam_type, created_at DESC) WHERE status = 'approved';

-- =====================================================
-- MIGRATION NOTES:
-- - The state column is nullable so old posts without location still work
-- - All current posts are Central Florida, so backfill sets state = 'FL'
-- - Going forward, the API will REQUIRE state on new posts
-- - The location field remains for optional city text
-- =====================================================
