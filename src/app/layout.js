import "./globals.css";
import Header from "@/components/Header";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { AuthProvider } from "@/components/AuthContext";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-warm-bg antialiased">
        {/* Solid background with very subtle texture */}
        <div className="fixed inset-0 bg-warm-bg pointer-events-none" />
        <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-30" />

        <div className="relative z-10 pb-20 sm:pb-0">
          <AuthProvider>
            <Header />
            {children}
            <StickyMobileCTA />
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
