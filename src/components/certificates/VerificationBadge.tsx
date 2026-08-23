import React from "react";
import { CheckCircle2, ShieldAlert, AlertTriangle } from "lucide-react";
import { CertificateStatus } from "@/types/certificate";

interface VerificationBadgeProps {
  status: CertificateStatus;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function VerificationBadge({
  status,
  className = "",
  size = "md",
}: VerificationBadgeProps) {
  const configs = {
    Valid: {
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      icon: CheckCircle2,
      label: "Verified Certificate",
    },
    Revoked: {
      color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
      icon: ShieldAlert,
      label: "Revoked / Invalid",
    },
    Expired: {
      color: "bg-slate-500/10 text-slate-600 border-slate-500/20",
      icon: AlertTriangle,
      label: "Expired",
    },
  };

  const config = configs[status] || configs.Valid;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1.5 border",
    md: "px-4 py-2 text-sm gap-2 border-2",
    lg: "px-6 py-3 text-base gap-2.5 border-2",
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-bold rounded-full ${sizeClasses[size]} ${config.color} ${className}`}
    >
      <Icon className={size === "sm" ? "w-3.5 h-3.5" : size === "md" ? "w-4 h-4" : "w-5 h-5"} />
      <span>{config.label}</span>
    </span>
  );
}
