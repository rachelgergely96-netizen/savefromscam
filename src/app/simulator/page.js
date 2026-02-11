"use client";

import { useState } from "react";
import { SCENARIOS } from "@/data/scenarios";

export default function Simulator() {
  const [step, setStep] = useState("intro"); // intro | reading | result
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedFlags, setSelectedFlags] = useState([]);
  const [userChoice, setUserChoice] = useState(null);
  const [xp, setXp] = useState(0);
  const [completedIds, setCompletedIds] = useState([]);

  const scenario = SCENARIOS[currentScenario];

  function startScenario(idx) {
    setCurrentScenario(idx);
    setStep("reading");
    setSelectedFlags([]);
    setUserChoice(null);
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
      {/* XP Bar */}
      <div className="flex items-center justify-end gap-3 mb-6">
        <div className="flex items-center gap-2 bg-teal-500/10 rounded-full px-4 py-1.5 border border-teal-500/20">
          <span className="text-sm font-bold text-teal-500 font-sans">
            {xp} XP
          </span>
        </div>
        <div className="text-xs text-navy-500 font-sans">
          {completedIds.length}/{SCENARIOS.length} completed
        </div>
      </div>

      {/* INTRO — Scenario picker */}
      {step === "intro" && (
        <div>
          <h1 className="text-3xl font-extrabold text-navy-200 mb-2">
            Scam Simulator
          </h1>
          <p className="text-navy-400 mb-8 leading-relaxed">
            Experience realistic scam scenarios in a safe environment. Spot the
            red flags, make your call, and build the instincts that protect you in
            real life.
          </p>
          <div className="space-y-3">
            {SCENARIOS.map((s, i) => {
              const done = completedIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => startScenario(i)}
                  className="w-full bg-navy-900/70 border border-teal-500/10 rounded-2xl p-5 text-left flex items-center gap-4 hover:border-teal-500/25 transition-colors cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-xl bg-teal-500/12 flex items-center justify-center text-2xl shrink-0">
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-navy-200">
                      {s.type} Scenario
                      {done && (
                        <span className="ml-2 text-xs text-teal-500 font-sans">
                          &#10003; Done
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-navy-500 font-sans mt-0.5">
                      {s.difficulty} &middot; {s.redFlags.length} red flags to
                      find &middot; +{25 + s.redFlags.length * 10} XP possible
                    </div>
                  </div>
                  <div className="text-teal-500 text-lg shrink-0">&rarr;</div>
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
          <div className="bg-navy-900/80 rounded-2xl p-6 border border-teal-500/10 mb-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{scenario.icon}</span>
              <div>
                <div className="text-sm font-bold text-navy-200">
                  Incoming {scenario.type}
                </div>
                <div className="text-xs text-navy-500 font-sans">
                  From: {scenario.from}
                </div>
              </div>
            </div>
            <div className="bg-navy-950/60 rounded-xl p-5 text-sm leading-relaxed text-navy-300 border border-navy-600/20 whitespace-pre-wrap">
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
                        : "bg-navy-950/40 border border-navy-600/20 hover:border-navy-500/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded shrink-0 flex items-center justify-center text-xs font-bold ${
                          selected
                            ? "bg-teal-500 text-navy-950"
                            : "border-2 border-navy-600"
                        }`}
                      >
                        {selected ? "\u2713" : ""}
                      </div>
                      <span
                        className={`text-xs font-mono ${selected ? "text-teal-500" : "text-navy-400"}`}
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
          <div className="text-sm font-bold text-navy-200 mb-3">
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
            <div className="text-sm text-navy-400 font-sans">
              You found {selectedFlags.length} of {scenario.redFlags.length} red
              flags &middot; +{correct ? 25 + selectedFlags.length * 10 : 0} XP
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-navy-900/70 rounded-2xl p-5 border border-teal-500/10 mb-4">
            <div className="text-sm font-bold text-navy-200 mb-2">
              What happened here:
            </div>
            <p className="text-sm text-navy-400 leading-relaxed">
              {scenario.explanation}
            </p>
          </div>

          {/* All red flags revealed */}
          <div className="bg-navy-900/70 rounded-2xl p-5 border border-teal-500/10 mb-4">
            <div className="text-sm font-bold text-danger-500 mb-3">
              All Red Flags:
            </div>
            {scenario.redFlags.map((flag, i) => {
              const found = selectedFlags.includes(i);
              return (
                <div
                  key={i}
                  className={`rounded-xl p-3 mb-2 last:mb-0 border ${
                    found
                      ? "bg-teal-500/8 border-teal-500/20"
                      : "bg-danger-500/6 border-danger-500/15"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs">
                      {found ? "\u2705" : "\u274C"}
                    </span>
                    <span className="text-xs font-mono text-navy-300">
                      &quot;{flag.text}&quot;
                    </span>
                  </div>
                  <div className="text-xs text-navy-400 pl-6">{flag.label}</div>
                </div>
              );
            })}
          </div>

          {/* Pro tip */}
          <div className="bg-gold-500/8 rounded-2xl p-5 border border-gold-500/20 mb-6">
            <div className="text-sm font-bold text-gold-500 mb-2">Pro Tip</div>
            <p className="text-sm text-navy-400 leading-relaxed">
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
