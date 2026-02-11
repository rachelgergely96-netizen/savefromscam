-- Run in Supabase SQL Editor.
-- check_history: saved scam check results per user.
-- anon_homepage_checks: rate limit for one anonymous check per IP per day from homepage.
-- lead_emails: email signups for lead magnet (e.g. scam-proof checklist).

CREATE TABLE IF NOT EXISTS check_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verdict text,
  confidence int,
  summary text,
  tactics jsonb DEFAULT '[]',
  actions jsonb DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_check_history_user_id ON check_history(user_id);
CREATE INDEX IF NOT EXISTS idx_check_history_created_at ON check_history(created_at DESC);

ALTER TABLE check_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own check_history"
  ON check_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own check_history"
  ON check_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own check_history"
  ON check_history FOR DELETE
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS anon_homepage_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  created_at date NOT NULL DEFAULT (current_date AT TIME ZONE 'UTC')
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_anon_homepage_checks_ip_date
  ON anon_homepage_checks(ip_hash, created_at);

CREATE TABLE IF NOT EXISTS lead_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source text DEFAULT 'scam_checklist',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_emails_created_at ON lead_emails(created_at DESC);
