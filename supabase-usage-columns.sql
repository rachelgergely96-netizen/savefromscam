-- Run this in Supabase SQL Editor to add usage tracking for free vs premium limits.
-- Free: 5 Scam Checks per day, 1 Simulator scenario per day. Premium: unlimited.

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS checks_used_today int NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS checks_reset_at timestamptz,
ADD COLUMN IF NOT EXISTS scenarios_used_today int NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS scenarios_reset_at timestamptz;
