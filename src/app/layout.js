import "./globals.css";
import Header from "@/components/Header";

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
      <body className="min-h-screen bg-navy-950 antialiased">
        {/* Subtle grid texture */}
        <div className="fixed inset-0 bg-grid-pattern pointer-events-none" />

        {/* Background gradient */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          }}
        />

        <div className="relative z-10">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
