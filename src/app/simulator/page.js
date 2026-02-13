"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { SCENARIOS } from "@/data/scenarios";

export default function Simulator() {
  const { user, session, loading } = useAuth();
  const [step, setStep] = useState("intro"); // intro | reading | result
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedFlags, setSelectedFlags] = useState([]);
  const [userChoice, setUserChoice] = useState(null);
  const [xp, setXp] = useState(0);
  const [completedIds, setCompletedIds] = useState([]);
  const [useError, setUseError] = useState(null);
  const [useLoading, setUseLoading] = useState(false);
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

  const scenario = SCENARIOS[currentScenario];

  function startScenario(idx) {
    setCurrentScenario(idx);
    setStep("reading");
    setSelectedFlags([]);
    setUserChoice(null);
    setUseError(null);
  }

  async function handleStartScenario(idx) {
    setUseError(null);
    if (!user) {
      setUseError("Sign in to use the Simulator. Free accounts get 1 scenario per day.");
      return;
    }
    setUseLoading(true);
    try {
      const res = await fetch("/api/simulator/use", {
        method: "POST",
        headers: session?.access_token
          ? { Authorization: `Bearer ${session.access_token}` }
          : {},
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setUseError(data.error || "Please sign in to use the Simulator.");
        return;
      }
      if (res.status === 403 && data.limitReached) {
        setUseError(data.error || "You've used your 1 free scenario for today.");
        return;
      }
      if (!res.ok || !data.allowed) {
        setUseError(data.error || "Could not start scenario.");
        return;
      }
      startScenario(idx);
      fetchUsage();
    } catch (err) {
      setUseError(err.message || "Something went wrong.");
    } finally {
      setUseLoading(false);
    }
  }

  function toggleFlag(idx) {
    setSelectedFlags((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  }

  function submitAnswer(choice) {
    setUserChoice(choice);
    setStep("result");
    const correct =
      (choice === "scam" && scenario.isScam) ||
      (choice === "safe" && !scenario.isScam);
    if (correct) {
      setXp((prev) => prev + 25 + selectedFlags.length * 10);
    }
    setCompletedIds((prev) =>
      prev.includes(scenario.id) ? prev : [...prev, scenario.id]
    );
  }

  const correct =
    userChoice &&
    ((userChoice === "scam" && scenario.isScam) ||
      (userChoice === "safe" && !scenario.isScam));

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* XP Bar + Usage */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="text-xs text-navy-600 dark:text-dark-text-secondary font-sans">
          {user && usage != null
            ? usage.scenariosLimit == null
              ? "Unlimited scenarios (Premium)"
              : usage.scenariosLimit - usage.scenariosUsed <= 0
                ? "No scenarios remaining today"
                : `${usage.scenariosLimit - usage.scenariosUsed} scenario${usage.scenariosLimit - usage.scenariosUsed !== 1 ? "s" : ""} remaining today`
            : null}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-teal-500/10 dark:bg-dark-teal-bg rounded-full px-4 py-1.5 border border-teal-500/20 dark:border-dark-teal-primary/30">
            <span className="text-sm font-bold text-teal-600 dark:text-dark-teal-primary font-sans">
              {xp} XP
            </span>
          </div>
          <div className="text-xs text-navy-600 dark:text-dark-text-secondary font-sans">
            {completedIds.length}/{SCENARIOS.length} completed
          </div>
        </div>
      </div>

      {/* INTRO — Scenario picker */}
      {step === "intro" && (
        <div>
          <h1 className="text-3xl font-extrabold text-navy-900 dark:text-dark-text-primary mb-2 font-sans">
            Scam Simulator
          </h1>
          <p className="text-navy-700 dark:text-dark-text-secondary mb-8 leading-relaxed font-sans">
            Experience realistic scam scenarios in a safe environment. Spot the
            red flags, make your call, and build the instincts that protect you in
            real life.
          </p>
          {!loading && !user && (
            <div className="bg-gold-50 dark:bg-dark-warning-bg border border-gold-500/25 dark:border-dark-border rounded-2xl p-4 mb-6">
              <p className="text-navy-900 dark:text-dark-text-primary text-sm font-sans">
                Sign in to use the Simulator. Free accounts get 1 scenario per day.
              </p>
              <Link
                href="/auth"
                className="inline-block mt-2 text-teal-600 dark:text-dark-teal-primary font-bold text-sm font-sans hover:underline"
              >
                Sign in →
              </Link>
            </div>
          )}
          {useError && (
            <div className="bg-danger-50 dark:bg-dark-danger-bg border border-danger-400 dark:border-dark-border rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-2">
              <p className="text-navy-900 dark:text-dark-text-primary text-sm font-sans">{useError}</p>
              <Link
                href="/pricing"
                className="text-teal-500 font-bold text-sm font-sans hover:underline"
              >
                Upgrade →
              </Link>
            </div>
          )}
          <div className="space-y-3">
            {SCENARIOS.map((s, i) => {
              const done = completedIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => handleStartScenario(i)}
                  disabled={!user || useLoading}
                  className="w-full card-flat border border-sage-200 dark:border-dark-border rounded-2xl p-5 text-left flex items-center gap-4 hover:border-teal-500 dark:hover:border-dark-teal-primary transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <div className="w-13 h-13 rounded-xl bg-teal-500/12 dark:bg-dark-teal-bg flex items-center justify-center text-2xl shrink-0">
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-navy-900 dark:text-dark-text-primary font-sans">
                      {s.type} Scenario
                      {done && (
                        <span className="ml-2 text-xs text-teal-600 dark:text-dark-teal-primary font-sans font-semibold">
                          &#10003; Done
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-navy-600 dark:text-dark-text-secondary font-sans mt-0.5">
                      {s.difficulty} &middot; {s.redFlags.length} red flags to
                      find &middot; +{25 + s.redFlags.length * 10} XP possible
                    </div>
                  </div>
                  <div className="text-teal-600 dark:text-dark-teal-primary text-lg shrink-0">&rarr;</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* READING — Active scenario */}
      {step === "reading" && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => setStep("intro")}
              className="text-navy-500 text-sm font-sans cursor-pointer hover:text-navy-300 transition-colors"
            >
              &larr; Back
            </button>
            <span className="text-xs px-3 py-1 rounded-full font-bold font-sans bg-gold-500/15 text-gold-500 border border-gold-500/30">
              {scenario.difficulty}
            </span>
          </div>

          {/* Message */}
          <div className="bg-navy-100 dark:bg-dark-bg-secondary rounded-2xl p-6 border border-sage-200 dark:border-dark-border mb-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{scenario.icon}</span>
              <div>
                <div className="text-sm font-bold text-navy-900 dark:text-dark-text-primary">
                  Incoming {scenario.type}
                </div>
                <div className="text-xs text-navy-600 dark:text-dark-text-tertiary font-sans">
                  From: {scenario.from}
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-dark-bg-tertiary rounded-xl p-5 text-sm leading-relaxed text-navy-900 dark:text-dark-text-secondary border border-sage-200 dark:border-dark-border whitespace-pre-wrap">
              {scenario.message}
            </div>
          </div>

          {/* Red flag picker */}
          <div className="bg-teal-500/6 rounded-2xl p-5 border border-teal-500/15 mb-5">
            <div className="text-sm font-bold text-teal-500 mb-3">
              Tap the red flags you spot:
            </div>
            <div className="space-y-2">
              {scenario.redFlags.map((flag, i) => {
                const selected = selectedFlags.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleFlag(i)}
                    className={`w-full text-left rounded-xl p-3 transition-all cursor-pointer ${
                      selected
                        ? "bg-teal-500/15 border border-teal-500"
                        : "bg-sage-50 dark:bg-dark-bg-tertiary border border-sage-200 dark:border-dark-border hover:border-sage-400 dark:hover:border-dark-text-disabled"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded shrink-0 flex items-center justify-center text-xs font-bold ${
                          selected
                            ? "bg-teal-500 text-navy-950"
                            : "border-2 border-navy-400 dark:border-dark-text-disabled"
                        }`}
                      >
                        {selected ? "\u2713" : ""}
                      </div>
                      <span
                        className={`text-xs font-mono ${selected ? "text-teal-500" : "text-navy-700 dark:text-dark-text-secondary"}`}
                      >
                        &quot;{flag.text}&quot;
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verdict buttons */}
          <div className="text-sm font-bold text-navy-900 dark:text-dark-text-primary mb-3">
            What&apos;s your verdict?
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => submitAnswer("scam")}
              className="py-4 rounded-xl border-2 border-danger-500 bg-danger-500/10 text-danger-500 text-base font-bold cursor-pointer hover:bg-danger-500/20 transition-colors"
            >
              It&apos;s a Scam
            </button>
            <button
              onClick={() => submitAnswer("safe")}
              className="py-4 rounded-xl border-2 border-teal-500 bg-teal-500/10 text-teal-500 text-base font-bold cursor-pointer hover:bg-teal-500/20 transition-colors"
            >
              It&apos;s Legit
            </button>
          </div>
        </div>
      )}

      {/* RESULT */}
      {step === "result" && (
        <div>
          {/* Result banner */}
          <div
            className={`text-center rounded-2xl p-8 mb-6 border ${
              correct
                ? "bg-gradient-to-br from-teal-500/15 to-teal-500/5 border-teal-500/30"
                : "bg-gradient-to-br from-danger-500/15 to-danger-500/5 border-danger-500/30"
            }`}
          >
            <div className="text-5xl mb-3">{correct ? "\u{1F389}" : "\u{1F62C}"}</div>
            <div
              className={`text-2xl font-extrabold mb-2 ${correct ? "text-teal-500" : "text-danger-500"}`}
            >
              {correct ? "You caught it!" : "This one got you!"}
            </div>
            <div className="text-sm text-navy-600 dark:text-dark-text-secondary font-sans">
              You found {selectedFlags.length} of {scenario.redFlags.length} red
              flags &middot; +{correct ? 25 + selectedFlags.length * 10 : 0} XP
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-navy-100 dark:bg-dark-bg-secondary rounded-2xl p-5 border border-sage-200 dark:border-dark-border mb-4">
            <div className="text-sm font-bold text-navy-900 dark:text-dark-text-primary mb-2">
              What happened here:
            </div>
            <p className="text-sm text-navy-700 dark:text-dark-text-secondary leading-relaxed">
              {scenario.explanation}
            </p>
          </div>

          {/* All red flags revealed */}
          <div className="bg-navy-100 dark:bg-dark-bg-secondary rounded-2xl p-5 border border-sage-200 dark:border-dark-border mb-4">
            <div className="text-sm font-bold text-danger-600 dark:text-dark-danger mb-3">
              All Red Flags:
            </div>
            {scenario.redFlags.map((flag, i) => {
              const found = selectedFlags.includes(i);
              return (
                <div
                  key={i}
                  className={`rounded-xl p-3 mb-2 last:mb-0 border ${
                    found
                      ? "bg-teal-500/8 dark:bg-dark-teal-bg border-teal-500/20 dark:border-dark-teal-primary/30"
                      : "bg-danger-500/6 dark:bg-dark-danger-bg border-danger-500/15 dark:border-dark-danger/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs">
                      {found ? "\u2705" : "\u274C"}
                    </span>
                    <span className="text-xs font-mono text-navy-700 dark:text-dark-text-secondary">
                      &quot;{flag.text}&quot;
                    </span>
                  </div>
                  <div className="text-xs text-navy-600 dark:text-dark-text-tertiary pl-6">{flag.label}</div>
                </div>
              );
            })}
          </div>

          {/* Pro tip */}
          <div className="bg-gold-50 dark:bg-dark-warning-bg rounded-2xl p-5 border border-gold-500/20 dark:border-dark-border mb-6">
            <div className="text-sm font-bold text-gold-600 dark:text-dark-warning mb-2">Pro Tip</div>
            <p className="text-sm text-navy-700 dark:text-dark-text-secondary leading-relaxed">
              {scenario.tip}
            </p>
          </div>

          <button
            onClick={() => setStep("intro")}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-navy-950 text-base font-bold font-sans cursor-pointer shadow-[0_4px_20px_rgba(46,196,182,0.3)] hover:shadow-[0_4px_28px_rgba(46,196,182,0.45)] transition-shadow"
          >
            Try Another Scenario &rarr;
          </button>
        </div>
      )}
    </main>
  );
}
