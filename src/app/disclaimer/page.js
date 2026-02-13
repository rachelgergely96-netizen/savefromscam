import Link from "next/link";

export const metadata = {
  title: "Disclaimer - SaveFromScam",
};

export default function DisclaimerPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-extrabold text-navy-200 mb-2 font-sans">
        Disclaimer
      </h1>
      <p className="text-navy-500 text-sm mb-10 font-sans">
        Last updated: February 12, 2026
      </p>

      <div className="space-y-8 text-navy-300 text-sm leading-relaxed font-sans">
        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">AI-Generated Results</h2>
          <p>
            SaveFromScam uses artificial intelligence to analyze content for potential scam
            indicators. AI analysis may produce inaccurate, incomplete, or misleading results.
            A &quot;low risk&quot; result does not guarantee that something is safe, and a
            &quot;high risk&quot; result does not guarantee that something is a scam.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">Not a Substitute for Professional Advice</h2>
          <p>
            The information provided by SaveFromScam is for educational and informational
            purposes only. It is not a substitute for professional legal, financial, or
            law enforcement advice. If you believe you are the victim of a scam or fraud:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1">
            <li>Contact your local law enforcement</li>
            <li>Report to the FTC at <span className="text-navy-200">reportfraud.ftc.gov</span></li>
            <li>Contact your bank or financial institution immediately</li>
            <li>File a complaint with the FBI&apos;s IC3 at <span className="text-navy-200">ic3.gov</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">No Liability for Losses</h2>
          <p>
            SaveFromScam and its operators are not liable for any financial losses, damages,
            or harm resulting from reliance on our analysis results. Users are solely responsible
            for their own decisions regarding suspicious messages, offers, and communications.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">User-Generated Content</h2>
          <p>
            The Community section contains user-submitted scam reports and experiences. These
            posts represent the views and experiences of individual users, not SaveFromScam.
            We do not verify the accuracy of user-submitted reports and are not responsible
            for any actions taken based on community content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">Simulator Disclaimer</h2>
          <p>
            The Scam Simulator is an educational tool designed to help users recognize common
            scam tactics in a safe environment. Simulated scenarios are fictional and created
            for training purposes only. They do not represent real people, organizations, or events.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">Scam Score</h2>
          <p>
            Your Scam Score is a gamified metric based on your activity within SaveFromScam
            (checks performed, simulator completions, community participation). It is not a
            certified measure of scam awareness or vulnerability. It is intended to encourage
            engagement and learning, not to provide a security assessment.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">Third-Party Services</h2>
          <p>
            SaveFromScam relies on third-party services including Anthropic (AI analysis),
            Supabase (data storage), Vercel (hosting), and potentially Stripe (payments).
            We are not responsible for the availability, accuracy, or policies of these
            third-party services.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-navy-600/30 flex gap-6 text-sm text-navy-500 font-sans">
        <Link href="/terms" className="text-teal-500 hover:underline">Terms of Service</Link>
        <Link href="/privacy" className="text-teal-500 hover:underline">Privacy Policy</Link>
      </div>
    </main>
  );
}
