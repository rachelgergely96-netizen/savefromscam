"use client";

import { ShieldCheck, Users, Zap, Brain, Eye, Clock } from "lucide-react";

const FEATURES = [
  {
    title: "Instant Scam Analysis",
    description: "Paste any suspicious message and get a detailed risk assessment in seconds. No technical knowledge required.",
    icon: Zap,
    color: "teal",
  },
  {
    title: "Explain the Manipulation",
    description: "We break down exactly how scammers try to trick you—so you recognize it next time.",
    icon: Brain,
    color: "sage",
  },
  {
    title: "Built for Older Adults",
    description: "Large text, high contrast, and plain language. Designed with accessibility in mind.",
    icon: Users,
    color: "teal",
  },
  {
    title: "Privacy First",
    description: "We automatically redact phone numbers, emails, and SSNs before saving. Your data stays private.",
    icon: Eye,
    color: "sage",
  },
  {
    title: "1 Free Check Daily",
    description: "No credit card required. Check 1 message per day free, forever.",
    icon: Clock,
    color: "teal",
  },
  {
    title: "Safe Next Steps",
    description: "Clear recommendations on what to do—and what NOT to do—after receiving a suspicious message.",
    icon: ShieldCheck,
    color: "sage",
  },
];

export default function FeatureValueBoxes() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 dark:text-dark-text-primary mb-4 font-sans">
          Why families trust SaveFromScam
        </h2>
        <p className="text-xl text-navy-600 dark:text-dark-text-secondary max-w-2xl mx-auto font-sans">
          The only free tool that explains scam tactics in plain language—and helps you train your instincts.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          const colorClasses = feature.color === "teal"
            ? "bg-teal-500/12 dark:bg-dark-teal-bg text-teal-600 dark:text-dark-teal-primary"
            : "bg-sage-500/12 dark:bg-dark-success-bg text-sage-600 dark:text-dark-success";

          return (
            <div
              key={i}
              className="card-flat rounded-card p-6 hover:shadow-lg dark:hover:shadow-dark-card transition-all duration-200 group"
            >
              <div className={`w-16 h-16 rounded-[var(--radius)] ${colorClasses} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-8 h-8" aria-hidden />
              </div>

              <h3 className="text-xl font-bold text-navy-900 dark:text-dark-text-primary mb-3 font-sans">
                {feature.title}
              </h3>

              <p className="text-base text-navy-600 dark:text-dark-text-secondary leading-relaxed font-sans">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
