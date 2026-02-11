"use client";

import {
  FileText,
  Sparkles,
  Shield,
  Truck,
  CreditCard,
  Mail,
  UserCircle,
  Wrench,
} from "lucide-react";

const STEPS = [
  {
    title: "Explain why it's risky",
    description: "We break down the manipulation tactics so you see exactly how the scam works.",
    icon: FileText,
  },
  {
    title: "Give safe next action",
    description: "Clear recommended steps—what to do and what not to do.",
    icon: Sparkles,
  },
  {
    title: "Train your instincts",
    description: "Use the simulator to practice spotting scams in a safe environment.",
    icon: Shield,
  },
];

const SCAM_PATTERNS = [
  { label: "USPS / delivery", icon: Truck },
  { label: "Zelle / payment", icon: CreditCard },
  { label: "IRS / government", icon: FileText },
  { label: "PayPal / accounts", icon: Mail },
  { label: "Grandparent / emergency", icon: UserCircle },
  { label: "Tech support", icon: Wrench },
];

export default function HomepageIconSections() {
  return (
    <>
      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl font-bold text-navy-200 mb-8 font-sans text-center">
          How it works
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="card-flat rounded-card p-6 text-center"
              >
                <div className="w-12 h-12 rounded-[var(--radius)] bg-teal-500/12 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-teal-500" aria-hidden />
                </div>
                <h3 className="text-lg font-bold text-navy-200 mb-2 font-sans">
                  {step.title}
                </h3>
                <p className="text-sm text-navy-400 leading-relaxed font-sans">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Top scam patterns */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-xl font-bold text-navy-200 mb-6 font-sans text-center">
          Top scam patterns we catch
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {SCAM_PATTERNS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-2 bg-navy-700 text-navy-200 rounded-full px-4 py-2 text-sm font-sans"
              >
                <Icon className="w-4 h-4 text-navy-400" aria-hidden />
                {item.label}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
