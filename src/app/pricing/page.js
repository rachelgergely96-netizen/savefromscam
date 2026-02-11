"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthContext";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  async function startPremiumCheckout() {
    try {
      setLoading(true);
      setError(null);

      // TEMP: no auth yet, so we only send email if user enters it later.
      // For now this just creates a generic checkout session.
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || null,
          email: user?.email || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to start checkout.");
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <section className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-200 mb-3">
          Protect Your Whole Family for $9/mo
        </h1>
        <p className="text-navy-400 max-w-xl mx-auto">
          Start with a simple subscription that unlocks unlimited Scam Checks,
          full simulator access, advanced Scam Scores, and the Family Dashboard.
        </p>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        {/* Free */}
        <div className="bg-navy-900/70 rounded-2xl p-6 border border-navy-700/50">
          <div className="text-sm font-bold font-sans text-navy-400 mb-1">
            Free
          </div>
          <div className="text-3xl font-extrabold text-navy-200 mb-4 font-sans">
            $0
          </div>
          <ul className="space-y-3 text-sm text-navy-400 mb-6">
            {[
              "5 Scam Checks per day",
              "1 simulator scenario per day",
              "Basic Scam Score",
              "View community alerts",
              "General safety tips",
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-teal-500">&#10003;</span> {item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-navy-500">
            No credit card required. Perfect for trying SaveFromScam.
          </p>
        </div>

        {/* Premium */}
        <div className="bg-gradient-to-b from-teal-500/10 to-navy-900/70 rounded-2xl p-6 border border-teal-500/25 relative">
          <div className="absolute -top-3 right-6 text-[10px] px-3 py-1 rounded-full bg-teal-500 text-navy-950 font-extrabold font-sans tracking-wide">
            BEST VALUE
          </div>
          <div className="text-sm font-bold font-sans text-teal-500 mb-1">
            Premium Family
          </div>
          <div className="text-3xl font-extrabold text-navy-200 mb-1 font-sans">
            $9.00
            <span className="text-base font-normal text-navy-500">/mo</span>
          </div>
          <div className="text-xs text-navy-500 mb-4 font-sans">
            Covers up to 5 family members.
          </div>
          <ul className="space-y-3 text-sm text-navy-300 mb-6">
            {[
              "Unlimited Scam Checks",
              "Full simulator library + new weekly",
              "Advanced Scam Score + monitoring",
              "Post, vote, & local alert notifications",
              "Family Dashboard (up to 5 members)",
              "Weekly personalized scam briefing",
              "Priority AI analysis",
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-teal-500">&#10003;</span> {item}
              </li>
            ))}
          </ul>
          <button
            onClick={user ? startPremiumCheckout : () => (window.location.href = "/auth")}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold font-sans cursor-pointer transition-all ${
              loading
                ? "bg-navy-700 text-navy-500 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-500 to-teal-600 text-navy-950 shadow-[0_4px_20px_rgba(46,196,182,0.3)] hover:shadow-[0_4px_28px_rgba(46,196,182,0.45)]"
            }`}
          >
            {loading
              ? "Redirecting to checkout..."
              : user
                ? "Upgrade to Premium"
                : "Sign in to upgrade"}
          </button>
          {error && (
            <p className="mt-3 text-xs text-danger-500 text-center">{error}</p>
          )}
        </div>
      </section>
    </main>
  );
}

