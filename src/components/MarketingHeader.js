"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function MarketingHeader() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-sage-200 dark:border-dark-border backdrop-blur-xl bg-white/95 dark:bg-dark-bg-secondary/95 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-[var(--radius)] bg-teal-500 flex items-center justify-center text-lg font-bold text-white">
              S
            </div>
            <div>
              <div className="text-lg font-bold text-teal-600 dark:text-dark-teal-primary tracking-tight font-sans">
                SaveFromScam
              </div>
              <div className="text-[11px] text-navy-600 dark:text-dark-text-tertiary tracking-widest uppercase font-sans">
                Protect What Matters
              </div>
            </div>
          </Link>

          {/* Desktop: nav + auth CTAs */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm font-semibold text-navy-600 dark:text-dark-text-secondary hover:text-teal-600 dark:hover:text-dark-teal-primary font-sans transition-colors"
            >
              Pricing
            </Link>
            <ThemeToggle />

            {!loading && !user && (
              <>
                <Link
                  href="/auth?mode=signin"
                  className="px-4 py-2 rounded-[var(--radius)] text-sm font-bold text-navy-900 dark:text-dark-text-primary border border-sage-300 dark:border-dark-border hover:border-teal-500 dark:hover:border-dark-teal-primary font-sans transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth?mode=signup"
                  className="px-5 py-2.5 rounded-[var(--radius)] bg-teal-500 text-white text-sm font-bold font-sans hover:bg-teal-600 transition-colors shadow-sm"
                >
                  Sign up free
                </Link>
              </>
            )}
            {!loading && user && (
              <>
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-[var(--radius)] bg-teal-500 text-white text-sm font-bold font-sans hover:bg-teal-600 transition-colors shadow-sm"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="text-xs text-navy-600 dark:text-dark-text-secondary hover:text-teal-600 dark:hover:text-dark-teal-primary font-sans cursor-pointer"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile: auth CTAs */}
        <div className="sm:hidden flex items-center gap-2 pb-3">
          <ThemeToggle />
          {!loading && !user && (
            <>
              <Link
                href="/auth?mode=signin"
                className="flex-1 text-center px-3 py-2 rounded-[var(--radius)] text-xs font-bold text-navy-900 dark:text-dark-text-primary border border-sage-300 dark:border-dark-border font-sans"
              >
                Log in
              </Link>
              <Link
                href="/auth?mode=signup"
                className="flex-1 text-center px-3 py-2 rounded-[var(--radius)] bg-teal-500 text-white text-xs font-bold font-sans"
              >
                Sign up free
              </Link>
            </>
          )}
          {!loading && user && (
            <Link
              href="/dashboard"
              className="flex-1 text-center px-3 py-2 rounded-[var(--radius)] bg-teal-500 text-white text-xs font-bold font-sans"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
