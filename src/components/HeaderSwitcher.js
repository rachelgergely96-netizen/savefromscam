"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import AppHeader from "@/components/AppHeader";
import MarketingHeader from "@/components/MarketingHeader";
import Header from "@/components/Header";

const MARKETING_PATHS = ["/", "/pricing", "/privacy", "/terms", "/disclaimer"];

export default function HeaderSwitcher() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) return <Header />;
  if (!user || MARKETING_PATHS.includes(pathname)) return <MarketingHeader />;
  return <AppHeader />;
}
