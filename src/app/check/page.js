"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { SAMPLE_SCAM_TEXT } from "@/data/scenarios";

export default function ScamCheck() {
  const { user, session, loading } = useAuth();
  const [checkText, setCheckText] = useState("");
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [limitReached, setLimitReached] = useState(false);
  const [usage, setUsage] = useState(null);

  const fetchUsage = useCallback(async () => {
    if (!session?.access_token) return;
    try {
      const res = await fetch("/api/usage", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsage(data);
      }
    } catch {
      // ignore
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (user && session) fetchUsage();
    else setUsage(null);
  }, [user, session, fetchUsage]);

  async function runScamCheck() {
    if (!checkText.trim()) return;
    setAnalyzing(true);
    setResult(null);
    setError(null);
    setLimitReached(false);

    try {
      const headers = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers,
        body: JSON.stringify({ text: checkText }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        setError(data.error || "Please sign in to use Scam Check.");
        return;
      }
      if (res.status === 403 && data.limitReached) {
        setLimitReached(true);
        setError(data.error || "You've used your 5 free checks for today.");
        return;
      }
      if (!res.ok) {
        setError(data.error || "Analysis failed");
        return;
      }

      setResult(data);
      fetchUsage();
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  }

  const verdictColor = result?.verdict?.includes("HIGH")
    ? "text-danger-500"
    : result?.verdict?.includes("MEDIUM")
      ? "text-gold-500"
      : "text-teal-500";

  const verdictBg = result?.verdict?.includes("HIGH")
    ? "from-danger-500/15 to-danger-500/5 border-danger-500/30"
    : result?.verdict?.includes("MEDIUM")
      ? "from-gold-500/15 to-gold-500/5 border-gold-500/30"
      : "from-teal-500/15 to-teal-500/5 border-teal-500/30";

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-3xl font-extrabold text-navy-200 mb-2">
        Scam Check
      </h1>
      <p className="text-navy-400 mb-8 leading-relaxed">
        Got a suspicious message, email, or call? Paste it below and our AI will
        break down exactly what&apos;s going on.
      </p>

      {!loading && !user && (
        <div className="bg-gold-500/10 border border-gold-500/25 rounded-2xl p-4 mb-6">
          <p className="text-navy-200 text-sm font-sans">
            Sign in to use Scam Check. Free accounts get 5 checks per day.
          </p>
          <Link
            href="/auth"
            className="inline-block mt-2 text-teal-500 font-bold text-sm font-sans hover:underline"
          >
            Sign in →
          </Link>
        </div>
      )}

      {user && usage != null && (
        <p className="text-navy-500 text-sm font-sans mb-4">
          {usage.checksLimit == null
            ? "Unlimited checks (Premium)"
            : `${usage.checksUsed} / ${usage.checksLimit} checks used today`}
        </p>
      )}

      {/* Input area */}
      <div className="bg-navy-900/70 rounded-2xl p-6 border border-teal-500/10 mb-6">
        <textarea
          value={checkText}
          onChange={(e) => setCheckText(e.target.value)}
          placeholder="Paste the suspicious message here..."
          className="w-full min-h-[160px] bg-navy-950/60 border border-navy-600/30 rounded-xl p-4 text-navy-300 text-base leading-relaxed resize-y outline-none focus:border-teal-500/40 transition-colors placeholder:text-navy-600"
        />
        <div className="flex gap-3 mt-4 flex-wrap">
          <button
            onClick={() => {
              setCheckText(SAMPLE_SCAM_TEXT);
              setResult(null);
            }}
            className="px-4 py-2 rounded-lg border border-navy-600/30 text-navy-500 text-xs font-sans cursor-pointer hover:border-navy-500/50 hover:text-navy-400 transition-colors"
          >
            Try sample scam
          </button>
          <div className="flex-1" />
          <button
            onClick={runScamCheck}
            disabled={analyzing || !checkText.trim() || !user}
            className={`px-7 py-3 rounded-xl font-bold text-base font-sans cursor-pointer transition-all ${
              analyzing || !checkText.trim() || !user
                ? "bg-navy-700 text-navy-500 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-500 to-teal-600 text-navy-950 shadow-[0_4px_20px_rgba(46,196,182,0.3)] hover:shadow-[0_4px_28px_rgba(46,196,182,0.45)]"
            }`}
          >
            {analyzing ? "Analyzing..." : !user ? "Sign in to check" : "Check This"}
          </button>
        </div>
      </div>

      {/* Loading state */}
      {analyzing && (
        <div className="text-center py-12">
          <div className="w-14 h-14 rounded-full mx-auto mb-5 border-3 border-teal-500/20 border-t-teal-500 animate-spin-slow" />
          <div className="text-navy-400">
            Analyzing manipulation patterns...
          </div>
          <div className="text-xs text-navy-600 mt-2 font-sans">
            Powered by Claude AI
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-danger-500/10 border border-danger-500/25 rounded-2xl p-6 text-center">
          <div className="text-danger-500 font-bold mb-2">
            {limitReached ? "Daily limit reached" : "Analysis Failed"}
          </div>
          <div className="text-navy-400 text-sm">{error}</div>
          {limitReached ? (
            <Link
              href="/pricing"
              className="inline-block mt-4 px-6 py-2 rounded-lg bg-teal-500 text-navy-950 text-sm font-bold font-sans hover:bg-teal-400 transition-colors"
            >
              Upgrade to Premium
            </Link>
          ) : (
            <button
              onClick={runScamCheck}
              className="mt-4 px-6 py-2 rounded-lg bg-danger-500/15 text-danger-500 text-sm font-bold font-sans cursor-pointer hover:bg-danger-500/25 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {result && !analyzing && (
        <div className="space-y-4">
          {/* Verdict banner */}
          <div
            className={`bg-gradient-to-r ${verdictBg} border rounded-2xl p-6 text-center`}
          >
            <div
              className={`text-sm tracking-widest font-bold font-sans mb-2 ${verdictColor}`}
            >
              {result.verdict}
            </div>
            <div className={`text-5xl font-extrabold font-sans ${verdictColor}`}>
              {result.confidence}%
            </div>
            <div className="text-xs text-navy-400 font-sans mt-1">
              confidence score
            </div>
          </div>

          {/* Summary */}
          {result.summary && (
            <div className="bg-navy-900/70 rounded-2xl p-5 border border-teal-500/10">
              <div className="text-sm font-bold text-navy-200 mb-2">
                Summary
              </div>
              <p className="text-sm text-navy-400 leading-relaxed">
                {result.summary}
              </p>
            </div>
          )}

          {/* Tactics */}
          <div>
            <div className="text-base font-bold text-navy-200 mb-3">
              Manipulation Tactics Detected:
            </div>
            {result.tactics?.map((t, i) => (
              <div
                key={i}
                className="bg-navy-900/70 rounded-xl p-4 border border-teal-500/10 mb-2.5"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-navy-200">
                    {t.name}
                  </span>
                  <span
                    className={`text-sm font-bold font-sans ${t.score > 80 ? "text-danger-500" : t.score > 50 ? "text-gold-500" : "text-teal-500"}`}
                  >
                    {t.score}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-navy-950/60 overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${t.score}%`,
                      background:
                        t.score > 80
                          ? "linear-gradient(90deg, #E63946, #ff6b6b)"
                          : t.score > 50
                            ? "linear-gradient(90deg, #F4A261, #fbbf24)"
                            : "linear-gradient(90deg, #2EC4B6, #5dd4c8)",
                    }}
                  />
                </div>
                <div className="text-xs text-navy-400 leading-relaxed">
                  {t.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Recommended actions */}
          {result.actions && (
            <div className="bg-teal-500/6 rounded-2xl p-5 border border-teal-500/15">
              <div className="text-sm font-bold text-teal-500 mb-3">
                Recommended Actions:
              </div>
              {result.actions.map((a, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start mb-2 last:mb-0"
                >
                  <span className="text-teal-500 font-bold font-sans text-sm">
                    {i + 1}.
                  </span>
                  <span className="text-sm text-navy-400 leading-relaxed">
                    {a}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
