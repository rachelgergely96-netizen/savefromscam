"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import AppAuthGuard from "@/components/AppAuthGuard";

function verdictColor(verdict) {
  if (verdict?.includes("HIGH")) return "text-danger-500";
  if (verdict?.includes("MEDIUM")) return "text-gold-500";
  return "text-teal-500";
}

function verdictBg(verdict) {
  if (verdict?.includes("HIGH")) return "border-danger-500/30 bg-danger-500/5";
  if (verdict?.includes("MEDIUM")) return "border-gold-500/30 bg-gold-500/5";
  return "border-teal-500/30 bg-teal-500/5";
}

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}

function HistoryContent() {
  const { session } = useAuth();
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!session?.access_token) return;
    async function fetchHistory() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/check-history", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setChecks(data);
        } else {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Could not load history.");
        }
      } catch {
        setError("Could not load history.");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [session?.access_token]);

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-3xl font-extrabold text-navy-900 dark:text-dark-text-primary mb-2 font-sans">
        Check History
      </h1>
      <p className="text-navy-700 dark:text-dark-text-secondary mb-8 leading-relaxed font-sans">
        Your saved scam check results.
      </p>

      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 border-2 border-teal-500/20 border-t-teal-500 animate-spin" />
          <div className="text-navy-600 dark:text-dark-text-secondary font-sans">Loading history...</div>
        </div>
      )}

      {error && (
        <div className="card-flat rounded-card p-5 text-center border-danger-500/30 bg-danger-500/5">
          <p className="text-danger-500 font-sans text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && checks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-navy-600 dark:text-dark-text-secondary font-sans mb-4">
            No saved checks yet.
          </div>
          <Link
            href="/check"
            className="btn-primary px-6 py-3 text-sm font-sans"
          >
            Go to Scam Check
          </Link>
        </div>
      )}

      {!loading && checks.length > 0 && (
        <div className="space-y-3">
          {checks.map((check) => {
            const expanded = expandedId === check.id;
            return (
              <div key={check.id} className="card-flat rounded-card border border-sage-200 dark:border-dark-border overflow-hidden">
                <button
                  onClick={() => setExpandedId(expanded ? null : check.id)}
                  className="w-full text-left p-4 cursor-pointer hover:bg-sage-50/50 dark:hover:bg-dark-bg-tertiary/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className={`text-xs tracking-widest font-bold font-sans ${verdictColor(check.verdict)}`}>
                      {check.verdict}
                    </span>
                    <span className="text-xs text-navy-500 dark:text-dark-text-tertiary font-sans">
                      {timeAgo(check.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold font-sans ${verdictColor(check.verdict)}`}>
                      {check.confidence}%
                    </span>
                    {check.summary && (
                      <p className="text-sm text-navy-600 dark:text-dark-text-secondary font-sans line-clamp-2 flex-1">
                        {check.summary}
                      </p>
                    )}
                  </div>
                </button>

                {expanded && (
                  <div className="px-4 pb-4 border-t border-sage-200 dark:border-dark-border pt-3 space-y-3">
                    {check.tactics?.length > 0 && (
                      <div>
                        <div className="text-xs font-bold text-navy-600 dark:text-dark-text-tertiary uppercase tracking-wider font-sans mb-2">
                          Tactics Detected
                        </div>
                        {check.tactics.map((t, i) => (
                          <div key={i} className="flex items-center gap-2 mb-1.5">
                            <span className={`text-xs font-bold font-sans ${t.score > 80 ? "text-danger-500" : t.score > 50 ? "text-gold-500" : "text-teal-500"}`}>
                              {t.score}%
                            </span>
                            <span className="text-sm text-navy-700 dark:text-dark-text-secondary font-sans">{t.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {check.actions?.length > 0 && (
                      <div className="bg-teal-500/5 dark:bg-dark-teal-bg rounded-xl p-3">
                        <div className="text-xs font-bold text-teal-500 uppercase tracking-wider font-sans mb-2">
                          Recommended Actions
                        </div>
                        {check.actions.map((a, i) => (
                          <div key={i} className="flex gap-2 items-start mb-1 last:mb-0">
                            <span className="text-teal-500 font-bold font-sans text-xs">{i + 1}.</span>
                            <span className="text-sm text-navy-700 dark:text-dark-text-secondary font-sans">{a}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default function HistoryPage() {
  return (
    <AppAuthGuard>
      <HistoryContent />
    </AppAuthGuard>
  );
}
