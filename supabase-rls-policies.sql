-- Run in Supabase SQL Editor
-- Row Level Security (RLS) Policies for Profiles Table
-- This ensures users can only access their own profile data

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Policy: Service role can read all profiles (for admin/analytics)
CREATE POLICY "Service role can read all profiles"
ON profiles FOR SELECT
TO service_role
USING (true);

-- Policy: Service role can update all profiles (for webhooks, admin operations)
CREATE POLICY "Service role can update all profiles"
ON profiles FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Verification queries (run these after applying policies):
-- 1. Check RLS is enabled:
--    SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';
--    Expected: rowsecurity = true
--
-- 2. List all policies:
--    SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'profiles';
--    Expected: 5 policies listed
