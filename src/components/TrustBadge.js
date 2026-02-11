"use client";
import { ShieldCheck, Lock, Eye, CheckCircle } from "lucide-react";

export default function TrustBadge({ variant = "secure", size = "sm" }) {
  const badges = {
    secure: {
      icon: ShieldCheck,
      text: "Secure Analysis",
      color: "sage",
      description: "Your data is encrypted"
    },
    private: {
      icon: Lock,
      text: "Private by Default",
      color: "teal",
      description: "We redact sensitive info automatically"
    },
    verified: {
      icon: CheckCircle,
      text: "AI-Verified",
      color: "teal",
      description: "Analyzed with advanced AI"
    },
    redacted: {
      icon: Eye,
      text: "Auto-Redacted",
      color: "sage",
      description: "Phone, email, SSN removed"
    }
  };

  const badge = badges[variant];
  const Icon = badge.icon;

  const sizeClasses = {
    sm: "px-3 py-2 text-sm gap-2",
    md: "px-4 py-2.5 text-base gap-2",
    lg: "px-5 py-3 text-lg gap-3"
  };

  const colorClasses = {
    sage: {
      bg: "bg-sage-100",
      border: "border-sage-400/30",
      icon: "text-sage-600",
      text: "text-sage-700"
    },
    teal: {
      bg: "bg-teal-100",
      border: "border-teal-400/30",
      icon: "text-teal-600",
      text: "text-teal-700"
    }
  };

  const colors = colorClasses[badge.color];

  return (
    <div
      className={`inline-flex items-center ${colors.bg} border ${colors.border} rounded-full ${sizeClasses[size]}`}
      style={{ boxShadow: 'var(--shadow-trust)' }}
      title={badge.description}
    >
      <Icon className={`w-4 h-4 ${colors.icon}`} />
      <span className={`font-medium ${colors.text}`}>
        {badge.text}
      </span>
    </div>
  );
}
