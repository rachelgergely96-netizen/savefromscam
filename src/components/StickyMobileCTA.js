"use client";

import Link from "next/link";

export default function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-navy-950/95 dark:bg-dark-bg-secondary/95 border-t border-navy-600/40 dark:border-dark-border sm:hidden">
      <Link
        href="/check"
        className="btn-primary block w-full py-3 text-center text-sm font-sans rounded-card"
      >
        Check a message
      </Link>
    </div>
  );
}
