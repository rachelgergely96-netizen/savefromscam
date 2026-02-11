import Link from "next/link";
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
import HomepageCheckDemo from "@/components/HomepageCheckDemo";
import LeadMagnet from "@/components/LeadMagnet";

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

export default function Home() {
  return (
    <main>
      {/* Hero + inline demo */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-4 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-navy-200 font-sans">
          Know if it&apos;s a scam—before you respond.
        </h1>
        <p className="text-lg text-navy-400 leading-relaxed max-w-xl mx-auto mb-8 font-sans">
          We explain the manipulation tactics and give safe next steps.
        </p>
      </section>

      <HomepageCheckDemo />

      {/* Trust strip */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-6 border-t border-navy-600/40">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-navy-400 font-sans">
          <span>No SSNs. No bank logins. Redaction on by default.</span>
          <span>Free: 5 checks per day.</span>
          <span>Not affiliated with banks or government.</span>
        </div>
      </section>

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

      {/* Credibility */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="card-flat rounded-card p-6 text-center">
          <p className="text-sm text-navy-400 leading-relaxed font-sans mb-4">
            Built to help older adults and families. We redact phone, email, and
            SSNs before saving. Not affiliated with banks or government.
          </p>
          <p className="text-xs text-navy-500 font-sans">
            Built for the 3.4B lost to elder fraud and the families who want to
            prevent it.
          </p>
        </div>
      </section>

      {/* Signup CTA */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-12 pb-16">
        <div className="card-flat rounded-card p-8 text-center">
          <h2 className="text-xl font-bold text-navy-200 mb-3 font-sans">
            Create a free account to save results and track your Scam Score
          </h2>
          <p className="text-sm text-navy-400 mb-6 font-sans">
            Free plan: 5 checks per day, simulator, and community alerts.
          </p>
          <Link
            href="/auth"
            className="btn-primary inline-block px-8 py-3 text-base font-sans"
          >
            Create free account
          </Link>
          <p className="mt-4 text-xs text-navy-500 font-sans">
            Or see <Link href="/pricing" className="text-teal-500 hover:underline">Free Plan &amp; Premium</Link> details.
          </p>
        </div>
      </section>

      <LeadMagnet />

      {/* Footer */}
      <footer className="border-t border-navy-600/40 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-navy-500 font-sans">
            &copy; 2026 SaveFromScam.com. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-navy-500 font-sans">
            <a href="#" className="hover:text-navy-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-navy-300 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-navy-300 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
