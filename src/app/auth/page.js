"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthContext";

export default function AuthPage() {
  const { user, loading, signInWithMagicLink, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");

    const { error } = await signInWithMagicLink(email);
    if (error) {
      setStatus(error.message || "Failed to send magic link.");
    } else {
      setStatus("Check your email for a sign-in link.");
    }
    setSubmitting(false);
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setStatus("");
    const { error } = await signInWithGoogle();
    if (error) {
      setStatus(error.message || "Google sign-in failed.");
      setGoogleLoading(false);
    }
    // If no error, the browser is redirecting to Google; leave loading on
  }

  return (
    <main className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-extrabold text-navy-200 mb-3">
        Sign in to SaveFromScam
      </h1>
      <p className="text-navy-400 mb-8 text-sm">
        No passwords. Enter your email and we&apos;ll send you a secure
        one-time link.
      </p>

      {user && !loading && (
        <div className="mb-6 text-sm text-teal-500">
          You are signed in as {user.email}.
        </div>
      )}

      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="w-full py-3 rounded-xl font-bold font-sans text-sm cursor-pointer transition-all flex items-center justify-center gap-3 bg-white text-navy-900 border border-navy-600/40 hover:bg-navy-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-navy-600/40" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-navy-950 px-3 text-navy-500 font-sans">
              or sign in with email
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-navy-900/70 rounded-2xl p-6 border border-teal-500/10"
        >
          <label className="block text-xs font-semibold text-navy-400 mb-2">
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-navy-950/60 border border-navy-600/40 px-4 py-3 text-sm text-navy-200 outline-none focus:border-teal-500/60 transition-colors mb-4"
            placeholder="you@example.com"
          />
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 rounded-xl font-bold font-sans text-sm cursor-pointer transition-all ${
              submitting
                ? "bg-navy-700 text-navy-500 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-500 to-teal-600 text-navy-950 shadow-[0_4px_20px_rgba(46,196,182,0.3)] hover:shadow-[0_4px_28px_rgba(46,196,182,0.45)]"
            }`}
          >
            {submitting ? "Sending link..." : "Send magic link"}
          </button>
          {status && (
            <p className="mt-3 text-xs text-navy-400 text-center">{status}</p>
          )}
        </form>
      </div>
    </main>
  );
}

