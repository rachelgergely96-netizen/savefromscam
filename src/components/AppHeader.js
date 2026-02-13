"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import { LayoutDashboard, Search, Gamepad2, Users, Shield, Clock } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/check", label: "Scam Check", icon: Search },
  { href: "/simulator", label: "Simulator", icon: Gamepad2 },
  { href: "/community", label: "Community", icon: Users },
  { href: "/score", label: "My Score", icon: Shield },
  { href: "/history", label: "History", icon: Clock },
];

export default function AppHeader() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-sage-200 dark:border-dark-border backdrop-blur-xl bg-white/95 dark:bg-dark-bg-secondary/95 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo — links to dashboard */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-[var(--radius)] bg-teal-500 flex items-center justify-center text-lg font-bold text-white">
              S
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-teal-600 dark:text-dark-teal-primary tracking-tight font-sans">
                SaveFromScam
              </div>
              <div className="text-[11px] text-navy-600 dark:text-dark-text-tertiary tracking-widest uppercase font-sans">
                Protect What Matters
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
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
                      ? "bg-teal-100 dark:bg-dark-teal-bg text-teal-700 dark:text-dark-teal-primary"
                      : "text-navy-600 dark:text-dark-text-secondary hover:text-teal-600 dark:hover:text-dark-teal-primary hover:bg-sage-50 dark:hover:bg-dark-bg-tertiary"
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side — user info */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            {!loading && user && (
              <>
                <div className="w-8 h-8 rounded-full bg-teal-500/15 dark:bg-dark-teal-bg border border-teal-500/30 dark:border-dark-teal-primary/30 flex items-center justify-center text-xs font-bold text-teal-600 dark:text-dark-teal-primary">
                  {user.email?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-xs text-navy-500 dark:text-dark-text-tertiary truncate max-w-[120px] font-sans">
                  {user.email}
                </span>
                <Link
                  href="/pricing"
                  className="text-xs text-teal-600 dark:text-dark-teal-primary font-semibold font-sans hover:underline"
                >
                  Manage plan
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

        {/* Mobile nav — horizontal scroll */}
        <div className="sm:hidden relative">
          <nav className="flex gap-1 pb-2 overflow-x-auto -mx-4 px-4">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius)] text-xs font-semibold font-sans whitespace-nowrap transition-colors ${
                    active
                      ? "bg-teal-100 dark:bg-dark-teal-bg text-teal-700 dark:text-dark-teal-primary"
                      : "text-navy-600 dark:text-dark-text-secondary hover:text-teal-600 dark:hover:text-dark-teal-primary hover:bg-sage-50 dark:hover:bg-dark-bg-tertiary"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white dark:from-dark-bg-secondary pointer-events-none" />
        </div>
        <div className="sm:hidden flex items-center justify-between pb-2 px-1">
          <ThemeToggle />
          {!loading && user && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-navy-600 dark:text-dark-text-secondary truncate max-w-[140px] font-sans">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="text-xs text-navy-500 dark:text-dark-text-tertiary hover:text-teal-600 dark:hover:text-dark-teal-primary font-sans cursor-pointer"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
