"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Search, Gamepad2, Users, Shield } from "lucide-react";

const navLinks = [
  { href: "/check", label: "Scam Check", icon: Search },
  { href: "/simulator", label: "Simulator", icon: Gamepad2 },
  { href: "/community", label: "Community", icon: Users },
  { href: "/score", label: "My Score", icon: Shield },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-navy-600/40 backdrop-blur-xl bg-navy-950/90">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-[var(--radius)] bg-teal-500 flex items-center justify-center text-lg font-bold text-navy-950">
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

          {!isHome && (
            <nav className="hidden sm:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-[var(--radius)] text-sm font-semibold font-sans transition-colors ${
                      active
                        ? "bg-teal-500/12 text-teal-500"
                        : "text-navy-500 hover:text-navy-300 hover:bg-navy-900/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" aria-hidden />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {isHome && (
            <div className="flex items-center gap-3">
              {!loading && user && (
                <button
                  onClick={signOut}
                  className="text-xs text-navy-500 hover:text-navy-300 font-sans cursor-pointer"
                >
                  Sign out
                </button>
              )}
              <Link
                href="/pricing"
                className="px-5 py-2.5 rounded-[var(--radius)] bg-teal-500 text-navy-950 text-sm font-bold font-sans hover:shadow-[var(--shadow-card)] transition-shadow"
              >
                {user ? "Manage plan" : "Free Plan"}
              </Link>
            </div>
          )}
        </div>

        {!isHome && (
          <nav className="sm:hidden flex gap-1 pb-2 overflow-x-auto -mx-4 px-4">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius)] text-xs font-semibold font-sans whitespace-nowrap transition-colors ${
                    active
                      ? "bg-teal-500/12 text-teal-500"
                      : "text-navy-500 hover:text-navy-300"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden />
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
