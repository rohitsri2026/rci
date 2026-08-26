"use client";

import React from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import NotificationTrigger from "./NotificationTrigger";
import { NotificationType, NotificationVariables } from "@/lib/notifications/types";

interface PostActionNotificationProps {
  type?: "success" | "danger" | "warning" | "info";
  title: string;
  subtitle?: string;
  studentName: string;
  studentPhone: string;
  studentId?: string;
  notificationType: NotificationType;
  variables: NotificationVariables;
  details?: Array<{ label: string; value: string }>;
  className?: string;
}

export default function PostActionNotification({
  type = "success",
  title,
  subtitle,
  studentName,
  studentPhone,
  studentId,
  notificationType,
  variables,
  details = [],
  className = "",
}: PostActionNotificationProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "danger":
        return <XCircle className="w-5 h-5 text-rose-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getContainerStyles = () => {
    switch (type) {
      case "success":
        return "bg-emerald-50/90 border-emerald-200/80 text-emerald-950";
      case "danger":
        return "bg-rose-50/90 border-rose-200/80 text-rose-950";
      case "warning":
        return "bg-amber-50/90 border-amber-200/80 text-amber-950";
      default:
        return "bg-blue-50/90 border-blue-200/80 text-blue-950";
    }
  };

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 space-y-4 shadow-xs transition-all ${getContainerStyles()} ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white shadow-2xs shrink-0 mt-0.5 border border-slate-100">
            {getIcon()}
          </div>
          <div>
            <h4 className="text-base font-extrabold tracking-tight font-display text-slate-950">{title}</h4>
            {subtitle && <p className="text-xs text-slate-600 mt-0.5 font-medium">{subtitle}</p>}
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-white/95 rounded-xl border border-slate-200/80 p-3.5 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">Student Name</span>
          <span className="font-extrabold text-slate-950">{studentName || "Student Candidate"}</span>
        </div>

        {details.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between pt-1.5 border-t border-slate-100">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">{item.label}</span>
            <span className="font-mono font-bold text-slate-800">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Notification Shortcut Action Bar */}
      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
          Instant Student Notification:
        </span>
        <NotificationTrigger
          studentId={studentId}
          studentName={studentName}
          studentPhone={studentPhone}
          type={notificationType}
          variables={variables}
          size="sm"
        />
      </div>
    </div>
  );
}
