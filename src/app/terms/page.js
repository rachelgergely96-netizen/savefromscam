import Link from "next/link";

export const metadata = {
  title: "Terms of Service - SaveFromScam",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-extrabold text-navy-200 mb-2 font-sans">
        Terms of Service
      </h1>
      <p className="text-navy-500 text-sm mb-10 font-sans">
        Last updated: February 12, 2026
      </p>

      <div className="space-y-8 text-navy-300 text-sm leading-relaxed font-sans">
        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using SaveFromScam.com (&quot;the Service&quot;), you agree to be bound by
            these Terms of Service. If you do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">2. Description of Service</h2>
          <p>
            SaveFromScam provides AI-powered scam detection analysis, a scam awareness simulator,
            community reporting features, and personal scam score tracking. The Service is designed
            to help users identify potential scams and learn about common fraud tactics.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">3. No Guarantee of Accuracy</h2>
          <p>
            Our scam detection tool uses artificial intelligence to analyze messages and content.
            AI analysis is not infallible and may produce incorrect results. SaveFromScam does
            not guarantee the accuracy, completeness, or reliability of any analysis.
            You should not rely solely on our tool to determine whether something is a scam.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">4. Not Professional Advice</h2>
          <p>
            The Service does not provide legal, financial, or professional advice. Results are
            for informational and educational purposes only. If you believe you have been the
            victim of a scam or fraud, contact your local law enforcement, your bank or financial
            institution, and relevant consumer protection agencies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">5. User Accounts</h2>
          <p>
            You may create an account using email and password or Google sign-in. You are
            responsible for maintaining the confidentiality of your credentials and for all
            activity under your account. You must provide accurate information and must not
            create accounts for fraudulent or abusive purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">6. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Use the Service to facilitate, plan, or carry out scams or fraud</li>
            <li>Submit content that is illegal, abusive, or violates the rights of others</li>
            <li>Attempt to reverse-engineer, exploit, or abuse the AI analysis system</li>
            <li>Circumvent usage limits or rate restrictions</li>
            <li>Use automated tools to access the Service beyond normal usage</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">7. User-Generated Content</h2>
          <p>
            The Community feature allows users to share scam reports and experiences.
            User-submitted posts represent the views of their authors, not SaveFromScam.
            We are not responsible for the accuracy or reliability of user-generated content.
            Community posts may be moderated by AI and/or human reviewers, and we reserve the
            right to remove content that violates these terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">8. Free and Premium Plans</h2>
          <p>
            Free accounts are limited to a set number of checks per day. Premium plans may be
            offered with additional features and higher limits. We reserve the right to modify
            plan features, pricing, and limits at any time. Paid subscriptions are governed by
            the terms presented at checkout.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, SaveFromScam and its operators shall not be
            liable for any indirect, incidental, special, consequential, or punitive damages
            arising from your use of the Service, including but not limited to financial losses
            resulting from reliance on scam analysis results.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">10. Termination</h2>
          <p>
            We may suspend or terminate your account at any time for violations of these terms
            or for any other reason at our sole discretion. You may delete your account at any
            time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">11. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the Service after
            changes constitutes acceptance of the updated terms. We will make reasonable efforts
            to notify users of significant changes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy-200 mb-3">12. Contact</h2>
          <p>
            For questions about these Terms, contact us at{" "}
            <a href="mailto:support@savefromscam.com" className="text-teal-500 hover:underline">
              support@savefromscam.com
            </a>.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-navy-600/30 flex gap-6 text-sm text-navy-500 font-sans">
        <Link href="/privacy" className="text-teal-500 hover:underline">Privacy Policy</Link>
        <Link href="/disclaimer" className="text-teal-500 hover:underline">Disclaimer</Link>
      </div>
    </main>
  );
}
