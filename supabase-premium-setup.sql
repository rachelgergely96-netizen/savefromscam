-- Run this in Supabase SQL Editor to set up premium subscription tracking
-- This adds the is_pro column and stripe_customer_id if they don't exist

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_pro boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS subscription_status text,
ADD COLUMN IF NOT EXISTS subscription_id text;

-- Create index for faster premium user queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_pro ON profiles(is_pro) WHERE is_pro = true;

-- Add helpful comment
COMMENT ON COLUMN profiles.is_pro IS 'True if user has active premium subscription';
COMMENT ON COLUMN profiles.stripe_customer_id IS 'Stripe customer ID for billing';
COMMENT ON COLUMN profiles.subscription_status IS 'Current subscription status: active, canceled, past_due, etc';
COMMENT ON COLUMN profiles.subscription_id IS 'Stripe subscription ID';
