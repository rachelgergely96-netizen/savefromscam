import Link from "next/link";
import HomepageCheckDemo from "@/components/HomepageCheckDemo";
import HomepageIconSections from "@/components/HomepageIconSections";

export default function Home() {
  return (
    <main>
      {/* Hero + inline demo */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-4 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-navy-200 font-sans">
          Know if it&apos;s a scam—before you respond.
        </h1>
        <p className="text-xl text-navy-400 leading-relaxed max-w-xl mx-auto mb-8 font-sans">
          We explain the manipulation tactics and give safe next steps.
        </p>
      </section>

      <HomepageCheckDemo />

      {/* Trust strip */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-6 border-t border-navy-600/40">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-base text-navy-400 font-sans">
          <span>No SSNs. No bank logins. Redaction on by default.</span>
          <span>Free: 5 checks per day.</span>
          <span>Not affiliated with banks or government.</span>
        </div>
      </section>

      <HomepageIconSections />

      {/* Credibility */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="card-flat rounded-card p-6 text-center">
          <p className="text-base text-navy-400 leading-relaxed font-sans mb-4">
            Built to help older adults and families. We redact phone, email, and
            SSNs before saving. Not affiliated with banks or government.
          </p>
          <p className="text-sm text-navy-500 font-sans">
            Built for the 3.4B lost to elder fraud and the families who want to
            prevent it.
          </p>
        </div>
      </section>

      {/* Signup CTA */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-12 pb-16">
        <div className="card-flat rounded-card p-8 text-center">
          <h2 className="text-2xl font-bold text-navy-200 mb-3 font-sans">
            Create a free account to save results and track your Scam Score
          </h2>
          <p className="text-base text-navy-400 mb-6 font-sans">
            Free plan: 5 checks per day, simulator, and community alerts.
          </p>
          <Link
            href="/auth"
            className="btn-primary inline-block px-8 py-3 text-lg font-sans"
          >
            Create free account
          </Link>
          <p className="mt-4 text-sm text-navy-500 font-sans">
            Or see <Link href="/pricing" className="text-teal-500 hover:underline">Free Plan &amp; Premium</Link> details.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-600/40 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-base text-navy-500 font-sans">
            &copy; 2026 SaveFromScam.com. All rights reserved.
          </div>
          <div className="flex gap-6 text-base text-navy-500 font-sans">
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
