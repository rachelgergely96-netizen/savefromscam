"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import CircularScore from "@/components/CircularScore";

const vulnerabilities = [
  { type: "Phone Scams", score: 85, color: "#2EC4B6" },
  { type: "Phishing Texts", score: 68, color: "#F4A261" },
  { type: "Email Scams", score: 72, color: "#2EC4B6" },
  { type: "Online Shopping", score: 45, color: "#E63946" },
  { type: "Romance/Impersonation", score: 55, color: "#E63946" },
];

export default function ScamScore() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  async function startPremiumCheckout() {
    try {
      setLoading(true);
      setError(null);

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
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-3xl font-extrabold text-navy-900 mb-8 font-sans">
        Your Scam Shield
      </h1>

      {/* Score ring */}
      <div className="card-flat rounded-3xl p-8 border border-sage-200 text-center mb-6">
        <CircularScore score={visible ? 72 : 0} />
        <div className="text-sm text-navy-700 mt-3 font-sans">
          Your Scam Detection Score
        </div>
        <div className="inline-block mt-3 px-4 py-1.5 rounded-full bg-teal-500/12 border border-teal-500/20 text-sm text-teal-600 font-semibold font-sans">
          Intermediate Defender
        </div>
      </div>

      {/* Vulnerability breakdown */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-navy-900 mb-4 font-sans">
          Vulnerability Breakdown
        </h2>
        <div className="space-y-2">
          {vulnerabilities.map((v, i) => (
            <div
              key={i}
              className="card-flat rounded-xl p-4 border border-sage-200"
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm text-navy-900 font-sans">{v.type}</span>
                <span
                  className="text-sm font-bold font-sans"
                  style={{ color: v.color }}
                >
                  {v.score}/100
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-navy-950/60">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: visible ? `${v.score}%` : "0%",
                    background: v.color,
                    transitionDelay: `${i * 150}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-gold-500/8 rounded-2xl p-5 border border-gold-500/20 mb-6">
        <div className="text-sm font-bold text-gold-500 mb-2 font-sans">
          Recommended Training
        </div>
        <p className="text-sm text-navy-700 leading-relaxed font-sans">
          Your online shopping and romance scam detection could use some work.
          Complete 3 more simulator scenarios in these categories to boost your
          score.
        </p>
      </div>

      {/* Family dashboard upsell */}
      <div className="bg-gradient-to-br from-teal-500/8 to-teal-500/2 rounded-2xl p-6 border border-teal-500/15">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">{"\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}"}</span>
          <span className="text-base font-bold text-navy-900 font-sans">
            Family Dashboard
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-gold-500 text-navy-950 font-extrabold font-sans">
            PREMIUM
          </span>
        </div>
        <p className="text-sm text-navy-700 leading-relaxed mb-4 font-sans">
          Connect with family members to share scam alerts, monitor training
          progress, and keep each other safe.
        </p>
        <button
          onClick={user ? startPremiumCheckout : () => (window.location.href = "/auth")}
          disabled={loading}
          className={`w-full py-3.5 rounded-xl font-bold font-sans cursor-pointer transition-all ${
            loading
              ? "bg-navy-700 text-navy-500 cursor-not-allowed"
              : "bg-gradient-to-r from-gold-500 to-amber-500 text-navy-950 shadow-[0_4px_20px_rgba(244,162,97,0.3)] hover:shadow-[0_4px_28px_rgba(244,162,97,0.45)]"
          }`}
        >
          {loading
            ? "Redirecting to checkout..."
            : user
              ? "Upgrade to Premium — $9.00/mo"
              : "Sign in to upgrade"}
        </button>
        {error && (
          <p className="mt-3 text-xs text-danger-500 text-center font-sans">{error}</p>
        )}
      </div>
    </main>
  );
}
