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
    ? "px-4 py-2.5 text-base gap-2"
    : "px-5 py-3 text-lg gap-3";

  // Color classes based on variant
  const colorClasses = variant === "secure" || variant === "redacted"
    ? "bg-sage-100 border-sage-400/30 text-sage-700"
    : "bg-teal-100 border-teal-400/30 text-teal-700";

  const iconColorClass = variant === "secure" || variant === "redacted"
    ? "text-sage-600"
    : "text-teal-600";

  return (
    <div
      className={`inline-flex items-center border rounded-full whitespace-nowrap ${sizeClasses} ${colorClasses}`}
      style={{ boxShadow: 'var(--shadow-trust)' }}
      title={badge.description}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${iconColorClass}`} />
      <span className="font-medium">
        {badge.text}
      </span>
    </div>
  );
}
