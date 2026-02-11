"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthContext";

export default function AuthPage() {
  const { user, loading, signInWithMagicLink } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    </main>
  );
}

