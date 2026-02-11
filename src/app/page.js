import Link from "next/link";
import AnimatedNumber from "@/components/AnimatedNumber";

function StatCard({ value, suffix, label, color }) {
  return (
    <div className="bg-navy-900/70 rounded-2xl p-5 text-center border border-teal-500/10">
      <div className={`text-3xl font-extrabold font-sans ${color}`}>
        <AnimatedNumber target={value} suffix={suffix} />
      </div>
      <div className="text-xs text-navy-500 mt-1 font-sans">{label}</div>
    </div>
  );
}

function FeatureCard({ number, title, description, icon }) {
  return (
    <div className="bg-navy-900/70 rounded-2xl p-6 border border-teal-500/10 hover:border-teal-500/25 transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-teal-500/12 flex items-center justify-center text-2xl shrink-0">
          {icon}
        </div>
        <div>
          <div className="text-xs text-teal-500 font-bold font-sans mb-1">
            0{number}
          </div>
          <h3 className="text-lg font-bold text-navy-200 mb-2">{title}</h3>
          <p className="text-sm text-navy-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
        <div className="text-xs tracking-[3px] text-gold-500 uppercase mb-4 font-sans font-semibold">
          AI-Powered Scam Protection for Families
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-navy-200 to-teal-500 bg-clip-text text-transparent">
          Outsmart Scammers
          <br />
          Before They Strike
        </h1>
        <p className="text-lg text-navy-400 leading-relaxed max-w-xl mx-auto mb-10">
          Train your instincts. Check suspicious messages instantly. Join a
          community that watches out for each other. Free to start.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/check"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-navy-950 text-lg font-bold font-sans shadow-[0_4px_24px_rgba(46,196,182,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_4px_32px_rgba(46,196,182,0.5)] transition-shadow"
          >
            Check a Suspicious Message
          </Link>
          <Link
            href="/simulator"
            className="px-8 py-4 rounded-2xl border-2 border-teal-500/30 text-teal-500 text-lg font-bold font-sans hover:bg-teal-500/8 transition-colors"
          >
            Try the Simulator
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            value={3.4}
            suffix="B"
            label="Lost to elder fraud (FBI 2024)"
            color="text-danger-500"
          />
          <StatCard
            value={900}
            suffix="%"
            label="Toll scam increase in 2025"
            color="text-gold-500"
          />
          <StatCard
            value={40}
            suffix="x"
            label="More lost per incident by seniors"
            color="text-danger-500"
          />
          <StatCard
            value={0}
            suffix=""
            label="Tools that train — until now"
            color="text-teal-500"
          />
        </div>
      </section>

      {/* Problem statement */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-danger-500/8 border border-danger-500/20 rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold text-navy-200 mb-4">
            The Problem Nobody Is Solving
          </h2>
          <p className="text-navy-400 leading-relaxed mb-4">
            Every scam detection tool works the same way: paste a message, get a
            verdict. But by the time you suspect something is a scam, you already
            have some instinct telling you it&apos;s wrong.
          </p>
          <p className="text-navy-400 leading-relaxed mb-6">
            The real danger is the scams you{" "}
            <span className="text-danger-500 font-bold">don&apos;t</span>{" "}
            suspect. The ones that feel real. The ones that trigger fear, love, or
            urgency before your rational brain can catch up.
          </p>
          <div className="space-y-3">
            {[
              {
                title: "No proactive training",
                desc: "Nobody is building the muscle memory to spot manipulation in real time.",
              },
              {
                title: "No community intelligence",
                desc: "Scams spread locally but no tool surfaces real-time reports from your area.",
              },
              {
                title: "No family coordination",
                desc: "Adult children worry but have no shared dashboard to keep parents safe.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-3 items-start bg-navy-950/50 rounded-xl p-4"
              >
                <span className="text-danger-500 font-bold font-sans text-lg mt-0.5">
                  {i + 1}.
                </span>
                <div>
                  <span className="font-bold text-navy-200">{item.title}.</span>{" "}
                  <span className="text-navy-400">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-200 mb-3">
            Not Just Detection.{" "}
            <span className="text-teal-500">Defense Training.</span>
          </h2>
          <p className="text-navy-400 max-w-lg mx-auto">
            SaveFromScam is a scam fitness gym. The best protection isn&apos;t a
            filter &mdash; it&apos;s a trained human who can feel when something is
            wrong.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FeatureCard
            number={1}
            icon={"\u{1F3AE}"}
            title="Scam Simulator"
            description="Experience realistic scam scenarios safely. Spot red flags, make your call, and build instincts through gamified training with XP and streaks."
          />
          <FeatureCard
            number={2}
            icon={"\u{1F50D}"}
            title="Scam Check AI"
            description="Paste any suspicious text, email, or URL. Get an instant breakdown of manipulation tactics, red flags, and clear next steps."
          />
          <FeatureCard
            number={3}
            icon={"\u{1F465}"}
            title="Community Alerts"
            description="See what scams are hitting your neighborhood right now. Location-aware, crowdsourced, and verified by the community."
          />
          <FeatureCard
            number={4}
            icon={"\u{1F6E1}\uFE0F"}
            title="Scam Score"
            description="Get a personal risk profile from 0-100. Track your improvement and see exactly which scam types you're most vulnerable to."
          />
        </div>

        <div className="mt-4 bg-gradient-to-r from-teal-500/8 to-gold-500/8 rounded-2xl p-6 border border-teal-500/15">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/15 flex items-center justify-center text-2xl shrink-0">
              {"\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}"}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-xs text-teal-500 font-bold font-sans">
                  05
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-gold-500 text-navy-950 font-extrabold font-sans">
                  PREMIUM
                </span>
              </div>
              <h3 className="text-lg font-bold text-navy-200 mb-2">
                Family Dashboard
              </h3>
              <p className="text-sm text-navy-400 leading-relaxed">
                Connect with family members in a shared safety net. See each
                other&apos;s Scam Scores, get alerts when scams trend in a loved
                one&apos;s area, and stay connected on protection. All opt-in and
                transparent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-navy-200 mb-3">
            Free to Start. Affordable to Protect Your Whole Family.
          </h2>
          <p className="text-navy-400">
            The free tier delivers real value. Premium unlocks everything.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Free */}
          <div className="bg-navy-900/70 rounded-2xl p-6 border border-navy-700/50">
            <div className="text-sm font-bold font-sans text-navy-400 mb-1">
              Free
            </div>
            <div className="text-3xl font-extrabold text-navy-200 mb-4 font-sans">
              $0
            </div>
            <ul className="space-y-3 text-sm text-navy-400 mb-6">
              {[
                "5 Scam Checks per day",
                "1 simulator scenario per day",
                "Basic Scam Score",
                "View community alerts",
                "General safety tips",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-teal-500">&#10003;</span> {item}
                </li>
              ))}
            </ul>
            <Link
              href="/check"
              className="block text-center w-full py-3 rounded-xl border-2 border-teal-500/30 text-teal-500 font-bold font-sans hover:bg-teal-500/8 transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Premium */}
          <div className="bg-gradient-to-b from-teal-500/10 to-navy-900/70 rounded-2xl p-6 border border-teal-500/25 relative">
            <div className="absolute -top-3 right-6 text-[10px] px-3 py-1 rounded-full bg-teal-500 text-navy-950 font-extrabold font-sans tracking-wide">
              BEST VALUE
            </div>
            <div className="text-sm font-bold font-sans text-teal-500 mb-1">
              Premium
            </div>
            <div className="text-3xl font-extrabold text-navy-200 mb-1 font-sans">
              $7.99
              <span className="text-base font-normal text-navy-500">/mo</span>
            </div>
            <div className="text-xs text-navy-500 mb-4 font-sans">
              or $59.99/year &middot; covers up to 5 family members
            </div>
            <ul className="space-y-3 text-sm text-navy-300 mb-6">
              {[
                "Unlimited Scam Checks",
                "Full simulator library + new weekly",
                "Detailed Scam Score + monitoring",
                "Post, vote, & local alert notifications",
                "Family Dashboard (up to 5 members)",
                "Weekly personalized scam briefing",
                "Priority AI analysis",
                "State-specific legal guidance",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-teal-500">&#10003;</span> {item}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-navy-950 font-bold font-sans shadow-[0_4px_20px_rgba(46,196,182,0.3)] hover:shadow-[0_4px_28px_rgba(46,196,182,0.45)] transition-shadow cursor-pointer">
              Start Premium
            </button>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-navy-900/80 rounded-3xl p-8 sm:p-12 text-center border border-teal-500/15">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-200 mb-4">
            Make scam awareness as normal as locking your front door.
          </h2>
          <p className="text-navy-400 leading-relaxed mb-8 max-w-lg mx-auto">
            Every simulator session completed, every scam reported, every family
            connected makes the world a little safer for the people who need it
            most.
          </p>
          <Link
            href="/check"
            className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-navy-950 text-lg font-bold font-sans shadow-[0_4px_24px_rgba(46,196,182,0.35)] hover:shadow-[0_4px_32px_rgba(46,196,182,0.5)] transition-shadow"
          >
            Check Your First Message Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-teal-500/10 py-8">
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
