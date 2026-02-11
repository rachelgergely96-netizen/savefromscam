"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { SAMPLE_SCAM_TEXT } from "@/data/scenarios";

export default function HomepageCheckDemo() {
  const { user, session } = useAuth();
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [limitReached, setLimitReached] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const runCheck = useCallback(async () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setResult(null);
    setError(null);
    setLimitReached(false);
    try {
      const headers = {
        "Content-Type": "application/json",
        "X-From-Homepage": "true",
      };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers,
        body: JSON.stringify({ text: text.trim() }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        setError(data.error || "Sign in to run a check, or try the sample below.");
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
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setAnalyzing(false);
    }
  }, [text, session?.access_token]);

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
    <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8">
      <div className="card-flat rounded-card p-6 mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a suspicious message here..."
          className="w-full min-h-[140px] bg-navy-950/60 border border-navy-600/40 rounded-[var(--radius)] p-4 text-navy-300 text-base leading-relaxed resize-y outline-none focus:border-teal-500/50 transition-colors placeholder:text-navy-600 font-sans"
          disabled={analyzing}
        />
        <div className="flex flex-wrap gap-3 mt-4">
          <button
            type="button"
            onClick={runCheck}
            disabled={analyzing || !text.trim()}
            className="btn-primary px-6 py-3 text-base font-sans disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {analyzing ? "Analyzing…" : "Check this message"}
          </button>
          <button
            type="button"
            onClick={() => {
              setText(SAMPLE_SCAM_TEXT);
              setResult(null);
              setError(null);
            }}
            className="btn-secondary px-4 py-2.5 text-sm font-sans cursor-pointer"
          >
            Try a sample
          </button>
        </div>
      </div>

      {error && (
        <div className="card-flat rounded-card p-5 mb-6 border-danger-500/20 bg-danger-500/5">
          <p className="text-navy-200 text-sm font-sans">{error}</p>
          {!user && (
            <Link
              href="/auth"
              className="inline-block mt-3 text-teal-500 font-bold text-sm font-sans hover:underline"
            >
              Create account to check →
            </Link>
          )}
          {limitReached && user && (
            <Link
              href="/pricing"
              className="inline-block mt-3 text-teal-500 font-bold text-sm font-sans hover:underline"
            >
              Upgrade to Premium →
            </Link>
          )}
        </div>
      )}

      {analyzing && (
        <div className="text-center py-10">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 border-2 border-teal-500/20 border-t-teal-500 animate-spin-slow" />
          <p className="text-navy-400 text-sm font-sans">
            Analyzing manipulation patterns…
          </p>
        </div>
      )}

      {result && !analyzing && (
        <div className="space-y-4 mb-8">
          <div
            className={`card-flat rounded-card p-6 text-center border ${verdictBg}`}
          >
            <div className={`text-xs tracking-widest font-bold font-sans mb-1 ${verdictColor}`}>
              {result.verdict}
            </div>
            <div className={`text-4xl font-bold font-sans ${verdictColor}`}>
              {result.confidence}%
            </div>
            <div className="text-xs text-navy-400 font-sans mt-1">
              confidence
            </div>
          </div>

          {result.summary && (
            <div className="card-flat rounded-card p-5">
              <div className="text-xs font-bold text-navy-400 uppercase tracking-wider font-sans mb-2">
                Summary
              </div>
              <p className="text-sm text-navy-300 leading-relaxed font-sans">
                {result.summary}
              </p>
            </div>
          )}

          {result.tactics?.length > 0 && (
            <div className="card-flat rounded-card p-5">
              <div className="text-xs font-bold text-navy-400 uppercase tracking-wider font-sans mb-3">
                Tactics detected
              </div>
              <ul className="space-y-2">
                {result.tactics.slice(0, 4).map((t, i) => (
                  <li key={i} className="text-sm text-navy-300 font-sans">
                    <span className="font-bold text-navy-200">{t.name}</span>
                    <span className="text-navy-500"> — {t.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.actions?.length > 0 && (
            <div className="card-flat rounded-card p-5 border-teal-500/20 bg-teal-500/5">
              <div className="text-xs font-bold text-teal-500 uppercase tracking-wider font-sans mb-2">
                What to do next
              </div>
              <ol className="list-decimal list-inside space-y-1 text-sm text-navy-300 font-sans">
                {result.actions.slice(0, 3).map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ol>
            </div>
          )}

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
                  className="btn-secondary px-5 py-2.5 text-sm font-sans cursor-pointer disabled:opacity-60"
                  disabled={saving || saved}
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
                setText("");
                setResult(null);
                setError(null);
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
    </section>
  );
}
