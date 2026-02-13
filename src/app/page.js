import Link from "next/link";
import { ShieldCheck, CheckCircle, Info } from "lucide-react";
import HomepageCheckDemo from "@/components/HomepageCheckDemo";
import HomepageIconSections from "@/components/HomepageIconSections";
import TrustBadge from "@/components/TrustBadge";
import FeatureValueBoxes from "@/components/FeatureValueBoxes";

export default function Home() {
  return (
    <main>
      {/* Hero with gradient background */}
      <section className="relative overflow-hidden">
        {/* Background gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-sage-50 to-cream-bg dark:from-dark-bg-tertiary dark:via-dark-bg-secondary dark:to-dark-bg-primary opacity-90"
             aria-hidden="true" />

        {/* Optional: Subtle pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20" aria-hidden="true" />

        {/* Content layer */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-32 pb-16 sm:pb-20">
          <div className="text-center max-w-3xl mx-auto">
            {/* Value proposition badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-dark-bg-secondary/80 backdrop-blur-sm border-2 border-teal-500/30 dark:border-dark-teal-primary/30 rounded-full px-5 py-2.5 mb-6 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-dark-teal-primary" />
              <span className="text-base font-bold text-navy-900 dark:text-dark-text-primary font-sans">
                Free Scam Detection Tool
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-navy-900 dark:text-dark-text-primary font-sans">
              Know if it's a scam—<span className="text-teal-600 dark:text-dark-teal-primary">before you respond.</span>
            </h1>

            <Link
              href="/simulator"
              className="inline-flex items-center gap-2 text-base font-semibold text-teal-600 dark:text-dark-teal-primary hover:text-teal-700 dark:hover:text-dark-teal-hover mb-6 font-sans transition-colors"
            >
              Or practice with the Scam Simulator →
            </Link>

            <p className="text-xl sm:text-2xl text-navy-700 dark:text-dark-text-secondary leading-relaxed mb-8 font-sans">
              We explain the manipulation tactics and give safe next steps. Built for older adults and families.
            </p>

            {/* Trust signals in hero */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <TrustBadge variant="secure" size="md" />
              <TrustBadge variant="private" size="md" />
              <TrustBadge variant="redacted" size="md" />
            </div>

            {/* CTA button */}
            <div className="flex justify-center">
              <a
                href="#check-demo"
                className="btn-primary px-8 py-4 text-lg font-sans font-bold shadow-lg hover:shadow-xl"
              >
                Check a message now (free)
              </a>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-warm-bg dark:to-dark-bg-primary"
             aria-hidden="true" />
      </section>

      {/* Feature value boxes */}
      <FeatureValueBoxes />

      {/* Scroll anchor for hero CTA */}
      <div id="check-demo" />

      <HomepageCheckDemo />

      {/* Trust strip - enhanced with icons */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8 border-t border-sage-200 dark:border-dark-border">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-base text-navy-700 dark:text-dark-text-secondary font-sans">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sage-600 dark:text-dark-success flex-shrink-0" />
            No SSNs. No bank logins. Redaction on by default.
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-teal-600 dark:text-dark-teal-primary flex-shrink-0" />
            Free: 1 check per day.
          </span>
          <span className="flex items-center gap-2">
            <Info className="w-5 h-5 text-navy-500 dark:text-dark-text-tertiary flex-shrink-0" />
            Not affiliated with banks or government.
          </span>
        </div>
      </section>

      <HomepageIconSections />

      {/* Credibility */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="card-flat rounded-card p-6 text-center bg-sage-light-bg dark:bg-dark-bg-tertiary border-sage-300 dark:border-dark-border">
          <p className="text-base text-navy-700 dark:text-dark-text-secondary leading-relaxed font-sans mb-4">
            Built to help older adults and families. We redact phone, email, and
            SSNs before saving. Not affiliated with banks or government.
          </p>
          <p className="text-sm text-navy-600 dark:text-dark-text-tertiary font-sans">
            Built for the 3.4B lost to elder fraud and the families who want to
            prevent it.
          </p>
        </div>
      </section>

      {/* Signup CTA */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-12 pb-16">
        <div className="card-flat rounded-card p-8 text-center bg-gradient-to-br from-teal-50 to-sage-50 dark:from-dark-bg-tertiary dark:to-dark-bg-secondary border-teal-300 dark:border-dark-border">
          <h2 className="text-2xl font-bold text-navy-900 dark:text-dark-text-primary mb-3 font-sans">
            Create a free account to save results and track your Scam Score
          </h2>
          <p className="text-base text-navy-700 dark:text-dark-text-secondary mb-6 font-sans">
            Free plan: 1 check per day, simulator, and community alerts.
          </p>
          <Link
            href="/auth"
            className="btn-primary inline-block px-8 py-3 text-lg font-sans"
          >
            Create free account
          </Link>
          <p className="mt-4 text-sm text-navy-600 dark:text-dark-text-tertiary font-sans">
            Or see <Link href="/pricing" className="text-teal-600 dark:text-dark-teal-primary hover:underline font-semibold">Free Plan &amp; Premium</Link> details.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sage-200 dark:border-dark-border py-8 bg-cream-bg dark:bg-dark-bg-secondary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-base text-navy-600 dark:text-dark-text-tertiary font-sans">
            &copy; 2026 SaveFromScam.com. All rights reserved.
          </div>
          <div className="flex gap-6 text-base text-navy-600 dark:text-dark-text-secondary font-sans">
            <Link href="/privacy" className="hover:text-teal-600 dark:hover:text-dark-teal-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-teal-600 dark:hover:text-dark-teal-primary transition-colors">
              Terms
            </Link>
            <Link href="/disclaimer" className="hover:text-teal-600 dark:hover:text-dark-teal-primary transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
