import { createClient } from "@supabase/supabase-js";

/**
 * Create a Supabase client that acts as the user identified by the JWT.
 * Use this in API routes to get the current user from Authorization: Bearer <access_token>.
 */
export function createSupabaseUserClient(accessToken) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || !accessToken) return null;
  return createClient(url, anonKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
    auth: { persistSession: false },
  });
}
