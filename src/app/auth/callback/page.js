"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Signing you in...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase not configured.");
      return;
    }

    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (errorParam) {
      setError(errorDescription || errorParam);
      setTimeout(() => router.replace("/auth"), 3000);
      return;
    }

    // PKCE / OAuth: exchange code for session
    if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
        .then(() => {
          setStatus("Success! Redirecting...");
          router.replace("/");
        })
        .catch((err) => {
          setError(err.message || "Sign-in failed.");
          setTimeout(() => router.replace("/auth"), 3000);
        });
      return;
    }

    // Fallback: already have session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setStatus("Success! Redirecting...");
        router.replace("/");
      } else {
        setError("No authorization received. Try the link again or sign in again.");
        setTimeout(() => router.replace("/auth"), 3000);
      }
    });
  }, [searchParams, router]);

  return (
    <main className="max-w-md mx-auto px-4 sm:px-6 py-16 text-center">
      {error ? (
        <>
          <p className="text-danger-500 font-semibold mb-2">{error}</p>
          <p className="text-navy-400 text-sm">Redirecting to sign-in...</p>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-navy-300 font-sans">{status}</p>
        </>
      )}
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="max-w-md mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-navy-300 font-sans">Signing you in...</p>
        </main>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
