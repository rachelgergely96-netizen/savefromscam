import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - SaveFromScam",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-extrabold text-navy-200 mb-2 font-sans">
        Privacy Policy
      </h1>
      <p className="text-navy-500 text-sm mb-10 font-sans">
        Last updated: February 12, 2026
      </p>

      <div className="space-y-8 text-navy-300 text-sm leading-relaxed font-sans">
        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">1. Information We Collect</h2>
          <p className="mb-3">When you use SaveFromScam, we may collect:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong className="text-navy-200">Account information:</strong> email address and
              password (or Google account details if using Google sign-in)
            </li>
            <li>
              <strong className="text-navy-200">Content you submit:</strong> text messages, emails,
              or other content you paste into the Scam Check tool for analysis
            </li>
            <li>
              <strong className="text-navy-200">Community posts:</strong> scam reports, comments,
              and other content you voluntarily share in the Community section
            </li>
            <li>
              <strong className="text-navy-200">Usage data:</strong> number of checks performed,
              feature usage, and basic analytics
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide and operate the scam detection service</li>
            <li>To analyze submitted content using AI (Anthropic Claude API) for scam detection</li>
            <li>To maintain your account and track usage limits</li>
            <li>To moderate community content for safety and quality</li>
            <li>To improve the accuracy and quality of our service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">3. AI Processing</h2>
          <p>
            Content you submit for scam analysis is sent to a third-party AI service
            (Anthropic Claude) for processing. This content is used solely to generate your
            scam analysis result and is not used to train AI models. We recommend that you
            remove or redact personal information (names, phone numbers, addresses, financial
            details) from messages before submitting them for analysis.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">4. Data Storage and Security</h2>
          <p>
            Your data is stored securely using Supabase (hosted on AWS) with row-level security
            policies. Passwords are hashed and never stored in plain text. We use HTTPS encryption
            for all data in transit. While we take reasonable measures to protect your data, no
            method of electronic storage is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">5. Data Sharing</h2>
          <p>We do not sell your personal information. We may share data with:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>
              <strong className="text-navy-200">Anthropic:</strong> Content submitted for scam
              analysis is processed through their API
            </li>
            <li>
              <strong className="text-navy-200">Supabase:</strong> Our database and authentication
              provider
            </li>
            <li>
              <strong className="text-navy-200">Vercel:</strong> Our hosting provider
            </li>
            <li>
              <strong className="text-navy-200">Stripe:</strong> Payment processing for premium
              plans (if applicable)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">6. Community Content</h2>
          <p>
            Scam reports and posts you share in the Community section are visible to other users.
            Do not include personal information in community posts. Community content may be
            moderated by AI and human reviewers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">7. Cookies and Local Storage</h2>
          <p>
            We use browser local storage to maintain your authentication session. We do not use
            third-party tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">8. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and associated data</li>
            <li>Export your data in a portable format</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, contact us at{" "}
            <a href="mailto:support@savefromscam.com" className="text-teal-500 hover:underline">
              support@savefromscam.com
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">9. Children&apos;s Privacy</h2>
          <p>
            The Service is not intended for children under 13. We do not knowingly collect
            personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify users of
            significant changes by posting a notice on the site. Continued use of the Service
            after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">11. Contact</h2>
          <p>
            For privacy-related questions or requests, contact us at{" "}
            <a href="mailto:support@savefromscam.com" className="text-teal-500 hover:underline">
              support@savefromscam.com
            </a>.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-navy-600/30 flex gap-6 text-sm text-navy-500 font-sans">
        <Link href="/terms" className="text-teal-500 hover:underline">Terms of Service</Link>
        <Link href="/disclaimer" className="text-teal-500 hover:underline">Disclaimer</Link>
      </div>
    </main>
  );
}
