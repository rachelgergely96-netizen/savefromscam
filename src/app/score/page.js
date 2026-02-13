"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
      <h1 className="text-3xl font-extrabold text-navy-900 dark:text-dark-text-primary mb-8 font-sans">
        Your Scam Shield
      </h1>

      {/* Score ring */}
      <div className="card-flat rounded-3xl p-8 border border-sage-200 dark:border-dark-border text-center mb-6">
        <CircularScore score={visible ? 72 : 0} />
        <div className="text-sm text-navy-700 dark:text-dark-text-secondary mt-3 font-sans">
          Your Scam Detection Score
        </div>
        <div className="inline-block mt-3 px-4 py-1.5 rounded-full bg-teal-500/12 dark:bg-dark-teal-bg border border-teal-500/20 dark:border-dark-teal-primary/30 text-sm text-teal-600 dark:text-dark-teal-primary font-semibold font-sans">
          Intermediate Defender
        </div>
        {/* Score tier legend */}
        <div className="mt-4 text-sm text-navy-600 dark:text-dark-text-secondary font-sans">
          <span className="font-bold">0-39:</span> Vulnerable &middot;{" "}
          <span className="font-bold">40-69:</span> Aware &middot;{" "}
          <span className="font-bold">70-100:</span> Defender
        </div>
        <p className="text-xs text-navy-500 dark:text-dark-text-tertiary font-sans mt-2">
          Complete simulator scenarios to improve your score.{" "}
          <Link href="/pricing" className="text-teal-600 dark:text-dark-teal-primary hover:underline font-semibold">
            See Premium features
          </Link>
        </p>
      </div>

      {/* Vulnerability breakdown */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-navy-900 dark:text-dark-text-primary mb-4 font-sans">
          Vulnerability Breakdown
        </h2>
        <div className="space-y-2">
          {vulnerabilities.map((v, i) => (
            <div
              key={i}
              className="card-flat rounded-xl p-4 border border-sage-200 dark:border-dark-border"
              style={{ borderLeftWidth: "4px", borderLeftColor: v.color }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-navy-900 dark:text-dark-text-primary font-sans">{v.type}</span>
                <span
                  className="text-sm font-bold font-sans"
                  style={{ color: v.color }}
                >
                  {v.score}/100
                </span>
              </div>
              <div className="h-2 rounded-full bg-navy-200 dark:bg-dark-bg-tertiary">
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
      <div className="bg-gold-500/8 dark:bg-dark-warning-bg rounded-2xl p-5 border border-gold-500/20 dark:border-dark-border mb-6">
        <div className="text-sm font-bold text-gold-600 dark:text-dark-warning mb-2 font-sans">
          Recommended Training
        </div>
        <p className="text-sm text-navy-700 dark:text-dark-text-secondary leading-relaxed font-sans">
          Your online shopping and romance scam detection could use some work.
          Complete 3 more simulator scenarios in these categories to boost your
          score.
        </p>
      </div>

      {/* Family dashboard upsell — subtle */}
      <div className="card-flat rounded-2xl p-5 border border-sage-200 dark:border-dark-border">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-bold text-navy-900 dark:text-dark-text-primary font-sans">
                Family Dashboard
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-gold-500 dark:bg-dark-warning text-navy-950 dark:text-dark-bg-primary font-extrabold font-sans">
                PREMIUM
              </span>
            </div>
            <p className="text-sm text-navy-600 dark:text-dark-text-secondary font-sans">
              Share alerts and monitor training progress across your family.
            </p>
          </div>
          <button
            onClick={user ? startPremiumCheckout : () => (window.location.href = "/auth")}
            disabled={loading}
            className="btn-primary px-5 py-2.5 text-sm font-sans whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Loading..."
              : user
                ? "Upgrade $9/mo"
                : "Sign in"}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-xs text-danger-500 text-center font-sans">{error}</p>
        )}
      </div>
    </main>
  );
}
