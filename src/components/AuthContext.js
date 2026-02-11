"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  signInWithMagicLink: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let ignore = false;

    async function init() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      if (!ignore) {
        setUser(currentSession?.user ?? null);
        setSession(currentSession ?? null);
        setLoading(false);
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (!ignore) {
          setUser(newSession?.user ?? null);
          setSession(newSession ?? null);
        }
      });

      return () => {
        ignore = true;
        subscription.unsubscribe();
      };
    }

    init();
  }, [supabase]);

  async function signInWithMagicLink(email) {
    if (!supabase) return { error: new Error("Supabase not configured") };
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : undefined,
      },
    });
    return { error };
  }

  async function signInWithGoogle() {
    if (!supabase) return { error: new Error("Supabase not configured") };
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : undefined;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    return { error };
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithMagicLink, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

