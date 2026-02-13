import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-sage-200 dark:border-dark-border py-8 bg-cream-bg dark:bg-dark-bg-secondary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-base text-navy-600 dark:text-dark-text-tertiary font-sans">
          &copy; {new Date().getFullYear()} SaveFromScam.com. All rights reserved.
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
  );
}
