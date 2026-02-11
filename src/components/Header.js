"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/check", label: "Scam Check", icon: "\u{1F50D}" },
  { href: "/simulator", label: "Simulator", icon: "\u{1F3AE}" },
  { href: "/community", label: "Community", icon: "\u{1F465}" },
  { href: "/score", label: "My Score", icon: "\u{1F6E1}\uFE0F" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-teal-500/15 backdrop-blur-xl bg-navy-950/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-xl font-extrabold text-navy-950 shadow-[0_0_20px_rgba(46,196,182,0.3)] group-hover:shadow-[0_0_28px_rgba(46,196,182,0.45)] transition-shadow">
              S
            </div>
            <div>
              <div className="text-lg font-bold text-teal-500 tracking-tight font-sans">
                SaveFromScam
              </div>
              <div className="text-[11px] text-navy-500 tracking-widest uppercase font-sans">
                Protect What Matters
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          {!isHome && (
            <nav className="hidden sm:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold font-sans transition-colors ${
                      active
                        ? "bg-teal-500/12 text-teal-500"
                        : "text-navy-500 hover:text-navy-300 hover:bg-navy-900/50"
                    }`}
                  >
                    <span className="mr-1.5">{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {isHome && (
            <Link
              href="/check"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-navy-950 text-sm font-bold font-sans hover:shadow-[0_4px_20px_rgba(46,196,182,0.35)] transition-shadow"
            >
              Try Free
            </Link>
          )}
        </div>

        {/* Mobile nav */}
        {!isHome && (
          <nav className="sm:hidden flex gap-1 pb-2 overflow-x-auto -mx-4 px-4">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold font-sans whitespace-nowrap transition-colors ${
                    active
                      ? "bg-teal-500/12 text-teal-500"
                      : "text-navy-500 hover:text-navy-300"
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
