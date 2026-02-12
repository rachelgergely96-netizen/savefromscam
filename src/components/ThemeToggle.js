"use client";

import { useTheme } from "@/components/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 rounded-full bg-sage-100 dark:bg-dark-bg-tertiary border-2 border-sage-300 dark:border-dark-border flex items-center justify-center hover:scale-110 transition-transform duration-200"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-dark-teal-primary" />
      ) : (
        <Moon className="w-5 h-5 text-navy-700" />
      )}
    </button>
  );
}
