"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import AppAuthGuard from "@/components/AppAuthGuard";
import { Search, Gamepad2, Users, Shield, Clock } from "lucide-react";

function verdictColor(verdict) {
  if (verdict?.includes("HIGH")) return "text-danger-500";
  if (verdict?.includes("MEDIUM")) return "text-gold-500";
  return "text-teal-500";
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

const quickActions = [
  { href: "/check", label: "Check a message", icon: Search, desc: "Paste a suspicious message for AI analysis" },
  { href: "/simulator", label: "Run a simulation", icon: Gamepad2, desc: "Practice spotting scams in a safe environment" },
  { href: "/community", label: "Community alerts", icon: Users, desc: "See what scams are trending in your area" },
  { href: "/score", label: "Your Scam Score", icon: Shield, desc: "View your vulnerability breakdown" },
];

function DashboardContent() {
  const { user, session } = useAuth();
  const [usage, setUsage] = useState(null);
  const [recentChecks, setRecentChecks] = useState([]);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchData = useCallback(async () => {
    if (!session?.access_token) return;
    const headers = { Authorization: `Bearer ${session.access_token}` };

    // Fetch usage and history in parallel
    const [usageRes, historyRes] = await Promise.allSettled([
      fetch("/api/usage", { headers }),
      fetch("/api/check-history", { headers }),
    ]);

    if (usageRes.status === "fulfilled" && usageRes.value.ok) {
      setUsage(await usageRes.value.json());
    }
    setLoadingUsage(false);

    if (historyRes.status === "fulfilled" && historyRes.value.ok) {
      const data = await historyRes.value.json();
      setRecentChecks(Array.isArray(data) ? data.slice(0, 3) : []);
    }
    setLoadingHistory(false);
  }, [session?.access_token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-navy-900 dark:text-dark-text-primary mb-1 font-sans">
          Welcome back
        </h1>
        <p className="text-navy-600 dark:text-dark-text-secondary font-sans">
          {user?.email}
        </p>
      </div>

      {/* Usage summary */}
      {!loadingUsage && usage && (
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="card-flat rounded-xl p-4 border border-sage-200 dark:border-dark-border text-center">
            <div className="text-2xl font-bold text-teal-600 dark:text-dark-teal-primary font-sans">
              {usage.checksLimit == null
                ? "\u221E"
                : Math.max(0, usage.checksLimit - usage.checksUsed)}
            </div>
            <div className="text-xs text-navy-600 dark:text-dark-text-tertiary font-sans mt-1">
              checks remaining
            </div>
          </div>
          <div className="card-flat rounded-xl p-4 border border-sage-200 dark:border-dark-border text-center">
            <div className="text-2xl font-bold text-teal-600 dark:text-dark-teal-primary font-sans">
              {usage.scenariosLimit == null
                ? "\u221E"
                : Math.max(0, usage.scenariosLimit - usage.scenariosUsed)}
            </div>
            <div className="text-xs text-navy-600 dark:text-dark-text-tertiary font-sans mt-1">
              scenarios remaining
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <h2 className="text-base font-bold text-navy-900 dark:text-dark-text-primary mb-3 font-sans">
        Quick Actions
      </h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="card-flat rounded-xl p-4 border border-sage-200 dark:border-dark-border flex items-start gap-3 hover:border-teal-500 dark:hover:border-dark-teal-primary transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 dark:bg-dark-teal-bg flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-teal-600 dark:text-dark-teal-primary" />
              </div>
              <div>
                <div className="text-sm font-bold text-navy-900 dark:text-dark-text-primary font-sans">
                  {action.label}
                </div>
                <div className="text-xs text-navy-600 dark:text-dark-text-secondary font-sans mt-0.5">
                  {action.desc}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent checks */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-navy-900 dark:text-dark-text-primary font-sans">
          Recent Checks
        </h2>
        <Link href="/history" className="text-xs text-teal-600 dark:text-dark-teal-primary font-semibold font-sans hover:underline">
          View all
        </Link>
      </div>

      {loadingHistory ? (
        <div className="text-center py-6">
          <div className="text-sm text-navy-600 dark:text-dark-text-secondary font-sans">Loading...</div>
        </div>
      ) : recentChecks.length === 0 ? (
        <div className="card-flat rounded-card p-5 text-center border border-sage-200 dark:border-dark-border">
          <p className="text-sm text-navy-600 dark:text-dark-text-secondary font-sans mb-3">
            No saved checks yet.
          </p>
          <Link href="/check" className="text-teal-600 dark:text-dark-teal-primary font-semibold text-sm font-sans hover:underline">
            Run your first Scam Check
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {recentChecks.map((check) => (
            <Link
              key={check.id}
              href="/history"
              className="card-flat rounded-xl p-4 border border-sage-200 dark:border-dark-border flex items-center gap-3 hover:border-teal-500 dark:hover:border-dark-teal-primary transition-colors"
            >
              <span className={`text-xl font-bold font-sans ${verdictColor(check.verdict)}`}>
                {check.confidence}%
              </span>
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-bold font-sans ${verdictColor(check.verdict)}`}>
                  {check.verdict}
                </span>
                {check.summary && (
                  <p className="text-xs text-navy-600 dark:text-dark-text-secondary font-sans line-clamp-1 mt-0.5">
                    {check.summary}
                  </p>
                )}
              </div>
              <span className="text-xs text-navy-500 dark:text-dark-text-tertiary font-sans shrink-0">
                {timeAgo(check.created_at)}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Score preview */}
      <div className="mt-8 card-flat rounded-xl p-5 border border-sage-200 dark:border-dark-border flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-navy-900 dark:text-dark-text-primary font-sans">
            Scam Shield Score
          </div>
          <div className="text-xs text-navy-600 dark:text-dark-text-secondary font-sans mt-0.5">
            Intermediate Defender
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-teal-600 dark:text-dark-teal-primary font-sans">72</span>
          <Link href="/score" className="text-xs text-teal-600 dark:text-dark-teal-primary font-semibold font-sans hover:underline">
            Details
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <AppAuthGuard>
      <DashboardContent />
    </AppAuthGuard>
  );
}
