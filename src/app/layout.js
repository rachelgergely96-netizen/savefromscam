import "./globals.css";
import HeaderSwitcher from "@/components/HeaderSwitcher";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { AuthProvider } from "@/components/AuthContext";
import { ThemeProvider } from "@/components/ThemeContext";

export const metadata = {
  title: "SaveFromScam — AI-Powered Scam Detection & Training",
  description:
    "Protect yourself and your family from scams with AI-powered detection, interactive training simulations, and community-driven alerts. Built for seniors and their families.",
  openGraph: {
    title: "SaveFromScam — Outsmart Scammers Before They Strike",
    description:
      "AI-powered scam detection, interactive training, and community alerts. Free to use.",
    url: "https://savefromscam.com",
    siteName: "SaveFromScam",
    type: "website",
  },
};

// Inline script to prevent FOUC (Flash of Unstyled Content)
const themeScript = `
  (function() {
    const theme = localStorage.getItem('savefromscam-theme') || 'system';
    let resolved = theme;
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (resolved === 'dark') {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-warm-bg dark:bg-dark-bg-primary antialiased">
        {/* Solid background with very subtle texture */}
        <div className="fixed inset-0 bg-warm-bg dark:bg-dark-bg-primary pointer-events-none" />
        <div className="fixed inset-0 bg-grid-pattern dark:opacity-10 pointer-events-none opacity-30" />

        <div className="relative z-10 pb-20 sm:pb-0">
          <ThemeProvider>
            <AuthProvider>
              <HeaderSwitcher />
              {children}
              <StickyMobileCTA />
            </AuthProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
