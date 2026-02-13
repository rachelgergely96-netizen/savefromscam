"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { SAMPLE_SCAM_TEXT } from "@/data/scenarios";

function ShareCard({ result }) {
  const [copied, setCopied] = useState(false);
  const title = "SaveFromScam result";
  const text = [
    result?.verdict,
    result?.confidence != null ? `${result.confidence}% confidence` : "",
    result?.tactics?.slice(0, 2).map((t) => t.name).join(", "),
    result?.actions?.[0] ? `What to do: ${result.actions[0]}` : "",
    "Check your own: https://savefromscam.com/check",
  ]
    .filter(Boolean)
    .join(" — ");

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: "https://savefromscam.com/check",
        });
      } catch (e) {
        if (e.name !== "AbortError") copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="card-flat rounded-card p-5 border-teal-500/20">
      <div className="text-xs font-bold text-navy-400 uppercase tracking-wider font-sans mb-2">
        Share this result
      </div>
      <p className="text-sm text-navy-300 font-sans mb-3 line-clamp-3">
        {result?.verdict} ({result?.confidence}%).{" "}
        {result?.tactics?.slice(0, 2).map((t) => t.name).join(", ")}.{" "}
        {result?.actions?.[0] || "See full result at savefromscam.com/check"}
      </p>
      <button
        type="button"
        onClick={handleShare}
        className="btn-secondary px-4 py-2 text-sm font-sans cursor-pointer"
      >
        {copied ? "Copied!" : "Share or copy link"}
      </button>
    </div>
  );
}

export default function ScamCheck() {
  const { user, session, loading } = useAuth();
  const [checkText, setCheckText] = useState("");
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [limitReached, setLimitReached] = useState(false);
  const [usage, setUsage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

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
      setSaved(false);
      setSaveError(null);
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
    ? "border-danger-500/30 bg-danger-500/5"
    : result?.verdict?.includes("MEDIUM")
      ? "border-gold-500/30 bg-gold-500/5"
      : "border-teal-500/30 bg-teal-500/5";

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-navy-200 mb-2 font-sans">
        Scam Check
      </h1>
      <p className="text-navy-400 mb-8 leading-relaxed">
        Got a suspicious message, email, or call? Paste it below and our AI will
        break down exactly what&apos;s going on.
      </p>

      {!loading && !user && (
        <div className="card-flat rounded-card p-4 mb-6 border-gold-500/25 bg-gold-500/5">
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
      <div className="card-flat rounded-card p-6 mb-6">
        <textarea
          id="check-textarea"
          value={checkText}
          onChange={(e) => setCheckText(e.target.value)}
          placeholder="Paste the suspicious message here..."
          className="w-full min-h-[160px] bg-navy-950/60 border border-navy-600/40 rounded-[var(--radius)] p-4 text-navy-300 text-base leading-relaxed resize-y outline-none focus:border-teal-500/50 transition-colors placeholder:text-navy-600 font-sans"
        />
        <div className="flex gap-3 mt-4 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setCheckText(SAMPLE_SCAM_TEXT);
              setResult(null);
            }}
            className="btn-secondary px-4 py-2 text-sm font-sans cursor-pointer"
          >
            Try sample scam
          </button>
          <div className="flex-1" />
          <button
            type="button"
            onClick={runScamCheck}
            disabled={analyzing || !checkText.trim() || !user}
            className="btn-primary px-7 py-3 text-base font-sans cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? "Analyzing…" : !user ? "Sign in to check" : "Check this"}
          </button>
        </div>
        <p className="text-xs text-navy-600 mt-3 font-sans">
          Results are AI-generated and may not be accurate. Not legal or financial advice.{" "}
          <Link href="/disclaimer" className="text-teal-500/70 hover:underline">Full disclaimer</Link>
        </p>
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
        <div className="card-flat rounded-card p-6 text-center border-danger-500/30 bg-danger-500/5">
          <div className="text-danger-500 font-bold mb-2 font-sans">
            {limitReached ? "Daily limit reached" : "Analysis failed"}
          </div>
          <div className="text-navy-400 text-sm font-sans">{error}</div>
          {limitReached ? (
            <Link
              href="/pricing"
              className="inline-block mt-4 btn-primary px-6 py-2 text-sm font-sans"
            >
              Upgrade to Premium
            </Link>
          ) : (
            <button
              type="button"
              onClick={runScamCheck}
              className="mt-4 btn-secondary px-6 py-2 text-sm font-sans cursor-pointer"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {result && !analyzing && (
        <div className="space-y-4">
          {/* Verdict banner */}
          <div
            className={`card-flat rounded-card p-6 text-center border ${verdictBg}`}
          >
            <div
              className={`text-sm tracking-widest font-bold font-sans mb-2 ${verdictColor}`}
            >
              {result.verdict}
            </div>
            <div className={`text-5xl font-bold font-sans ${verdictColor}`}>
              {result.confidence}%
            </div>
            <div className="text-xs text-navy-400 font-sans mt-1">
              confidence score
            </div>
          </div>

          {/* Share card — right after verdict */}
          <ShareCard result={result} />

          {/* Summary */}
          {result.summary && (
            <div className="card-flat rounded-card p-5">
              <div className="text-xs font-bold text-navy-400 uppercase tracking-wider font-sans mb-2">
                Summary
              </div>
              <p className="text-sm text-navy-400 leading-relaxed font-sans">
                {result.summary}
              </p>
            </div>
          )}

          {/* Tactics */}
          <div>
            <div className="text-xs font-bold text-navy-400 uppercase tracking-wider font-sans mb-3">
              Manipulation tactics detected
            </div>
            {result.tactics?.map((t, i) => (
              <div
                key={i}
                className="card-flat rounded-card p-4 mb-2.5"
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
            <div className="card-flat rounded-card p-5 border-teal-500/20 bg-teal-500/5">
              <div className="text-xs font-bold text-teal-500 uppercase tracking-wider font-sans mb-3">
                Recommended actions
              </div>
              {result.actions.map((a, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start mb-2 last:mb-0"
                >
                  <span className="text-teal-500 font-bold font-sans text-sm">
                    {i + 1}.
                  </span>
                  <span className="text-sm text-navy-400 leading-relaxed font-sans">
                    {a}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Post-result actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            {!user ? (
              <Link
                href="/auth"
                className="btn-primary px-5 py-2.5 text-sm font-sans"
              >
                Create account to save
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={async () => {
                    if (!session?.access_token || !result || saving || saved) return;
                    setSaving(true);
                    setSaveError(null);
                    try {
                      const res = await fetch("/api/check-history", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${session.access_token}`,
                        },
                        body: JSON.stringify({
                          verdict: result.verdict,
                          confidence: result.confidence,
                          summary: result.summary,
                          tactics: result.tactics,
                          actions: result.actions,
                        }),
                      });
                      const data = await res.json().catch(() => ({}));
                      if (res.ok) setSaved(true);
                      else setSaveError(data.error || "Could not save");
                    } catch (e) {
                      setSaveError("Could not save");
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving || saved}
                  className="btn-secondary px-5 py-2.5 text-sm font-sans cursor-pointer disabled:opacity-60"
                >
                  {saved ? "Saved" : saving ? "Saving…" : "Save to your history"}
                </button>
                {saveError && (
                  <span className="text-xs text-danger-500 font-sans">{saveError}</span>
                )}
              </>
            )}
            <button
              type="button"
              onClick={() => {
                setCheckText("");
                setResult(null);
                setError(null);
                document.getElementById("check-textarea")?.focus();
              }}
              className="btn-secondary px-5 py-2.5 text-sm font-sans cursor-pointer"
            >
              Run another check
            </button>
            <Link
              href="/simulator"
              className="btn-secondary px-5 py-2.5 text-sm font-sans inline-flex items-center"
            >
              Simulate this scam type
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
