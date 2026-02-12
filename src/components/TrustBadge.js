"use client";
import { ShieldCheck, Lock, Eye, CheckCircle } from "lucide-react";

export default function TrustBadge({ variant = "secure", size = "sm" }) {
  const badges = {
    secure: {
      icon: ShieldCheck,
      text: "Secure",
      description: "Your data is encrypted"
    },
    private: {
      icon: Lock,
      text: "Private",
      description: "We redact sensitive info automatically"
    },
    verified: {
      icon: CheckCircle,
      text: "AI-Verified",
      description: "Analyzed with advanced AI"
    },
    redacted: {
      icon: Eye,
      text: "Redacted",
      description: "Phone, email, SSN removed"
    }
  };

  const badge = badges[variant];
  const Icon = badge.icon;

  // Size classes
  const sizeClasses = size === "sm"
    ? "px-3 py-2 text-sm gap-2"
    : size === "md"
    ? "px-4 py-2.5 text-base gap-2.5"
    : "px-5 py-3 text-lg gap-3";

  // Saturated colors with white text for high visibility on light and dark backgrounds
  const colorClasses = variant === "secure" || variant === "redacted"
    ? "bg-sage-500 dark:bg-dark-success border-2 border-sage-600 dark:border-dark-success text-white"
    : "bg-teal-600 dark:bg-dark-teal-primary border-2 border-teal-700 dark:border-dark-teal-hover text-white dark:text-dark-bg-primary";

  return (
    <div
      className={`inline-flex items-center rounded-full whitespace-nowrap ${sizeClasses} ${colorClasses} shadow-sm`}
      style={{ boxShadow: 'var(--shadow-trust)' }}
      title={badge.description}
    >
      <Icon className="w-4 h-4 flex-shrink-0 text-white" />
      <span className="font-semibold">
        {badge.text}
      </span>
    </div>
  );
}
