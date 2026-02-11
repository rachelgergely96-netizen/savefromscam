"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { SAMPLE_SCAM_TEXT } from "@/data/scenarios";
import TrustBadge from "@/components/TrustBadge";
import AnimatedDot from "@/components/AnimatedDot";

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
        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <TrustBadge variant="secure" size="md" />
          <TrustBadge variant="private" size="md" />
          <TrustBadge variant="redacted" size="md" />
        </div>

        {/* Enhanced textarea */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a suspicious message here..."
            className="w-full min-h-[180px] bg-white border-2 border-sage-300 rounded-[var(--radius)] p-5 text-navy-900 text-lg leading-relaxed resize-y outline-none focus:border-teal-500 transition-all duration-200 placeholder:text-navy-500 font-sans"
            style={{ boxShadow: 'var(--shadow-sm)' }}
            disabled={analyzing}
          />

          {/* Character count */}
          {text.length > 0 && (
            <div className="absolute bottom-3 right-3 text-xs text-navy-600 bg-white/95 px-2 py-1 rounded border border-sage-200">
              {text.length} characters
            </div>
          )}
        </div>

        {/* Enhanced buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          <button
            type="button"
            onClick={runCheck}
            disabled={analyzing || !text.trim()}
            className="btn-primary px-8 py-4 text-lg font-sans font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          >
            {analyzing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Check this message
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setText(SAMPLE_SCAM_TEXT);
              setResult(null);
              setError(null);
            }}
            className="btn-secondary px-5 py-3.5 text-base font-sans cursor-pointer hover:bg-navy-800 transition-all duration-200"
          >
            Try a sample
          </button>
        </div>
      </div>

      {error && (
        <div className="card-flat rounded-card p-5 mb-6 border-danger-400 bg-danger-50 animate-fade-in">
          <p className="text-navy-900 text-base font-sans">{error}</p>
          {!user && (
            <Link
              href="/auth"
              className="inline-block mt-3 text-teal-500 font-bold text-base font-sans hover:underline"
            >
              Create account to check →
            </Link>
          )}
          {limitReached && user && (
            <Link
              href="/pricing"
              className="inline-block mt-3 text-teal-500 font-bold text-base font-sans hover:underline"
            >
              Upgrade to Premium →
            </Link>
          )}
        </div>
      )}

      {analyzing && (
        <div className="text-center py-12">
          {/* Animated pulse circle with gradient */}
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-sage-500 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-8 h-8 text-white animate-gentle-pulse" />
            </div>
          </div>

          {/* Progress steps */}
          <div className="space-y-2">
            <p className="text-navy-700 text-lg font-medium font-sans">
              Analyzing message...
            </p>
            <div className="flex items-center justify-center gap-1.5">
              <AnimatedDot delay={0} />
              <AnimatedDot delay={200} />
              <AnimatedDot delay={400} />
            </div>
            <p className="text-navy-600 text-base font-sans">
              Checking manipulation patterns • Evaluating risk • Generating report
            </p>
          </div>
        </div>
      )}

      {result && !analyzing && (
        <div className="space-y-4 mb-8 animate-fade-in">
          <div
            className={`card-flat rounded-card p-6 text-center border ${verdictBg}`}
          >
            <div className={`text-xs tracking-widest font-bold font-sans mb-1 ${verdictColor}`}>
              {result.verdict}
            </div>
            <div className={`text-5xl font-bold font-sans ${verdictColor}`}>
              {result.confidence}%
            </div>
            <div className="text-sm text-navy-600 font-sans mt-1">
              confidence
            </div>
          </div>

          {result.summary && (
            <div className="card-flat rounded-card p-5">
              <div className="text-sm font-bold text-navy-600 uppercase tracking-wider font-sans mb-2">
                Summary
              </div>
              <p className="text-base text-navy-700 leading-relaxed font-sans">
                {result.summary}
              </p>
            </div>
          )}

          {result.tactics?.length > 0 && (
            <div className="card-flat rounded-card p-5">
              <div className="text-sm font-bold text-navy-600 uppercase tracking-wider font-sans mb-3">
                Tactics detected
              </div>
              <ul className="space-y-2">
                {result.tactics.slice(0, 4).map((t, i) => (
                  <li key={i} className="text-base text-navy-700 font-sans">
                    <span className="font-bold text-navy-900">{t.name}</span>
                    <span className="text-navy-600"> — {t.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.actions?.length > 0 && (
            <div className="card-flat rounded-card p-5 border-teal-400 bg-teal-50">
              <div className="text-sm font-bold text-teal-700 uppercase tracking-wider font-sans mb-2">
                What to do next
              </div>
              <ol className="list-decimal list-inside space-y-1 text-base text-navy-700 font-sans">
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
                className="btn-primary px-5 py-2.5 text-base font-sans"
              >
                Create account to save
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-secondary px-5 py-2.5 text-base font-sans cursor-pointer disabled:opacity-60"
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
                  <span className="text-sm text-danger-500 font-sans">{saveError}</span>
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
              className="btn-secondary px-5 py-2.5 text-base font-sans cursor-pointer"
            >
              Run another check
            </button>
            <Link
              href="/simulator"
              className="btn-secondary px-5 py-2.5 text-base font-sans inline-flex items-center"
            >
              Simulate this scam type
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
