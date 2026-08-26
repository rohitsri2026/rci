"use client";

import React from "react";
import Link from "next/link";
import {
  Bell,
  BookMarked,
  FlaskConical,
  CreditCard,
  Award,
  AlertCircle,
  ArrowRight,
  Check,
} from "lucide-react";

export type NotificationCategory =
  | "NOTICE"
  | "STUDY_MATERIAL"
  | "TEST"
  | "FEE_REMINDER"
  | "CERTIFICATE"
  | "IMPORTANT"
  | string;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type?: NotificationCategory;
  is_read?: boolean;
  created_at: string;
  metadata?: {
    action_url?: string;
    category?: NotificationCategory;
    link?: string;
    [key: string]: any;
  } | null;
}

interface StudentNotificationCardProps {
  notification: NotificationItem;
  onMarkAsRead: (id: string) => void;
}

export default function StudentNotificationCard({
  notification,
  onMarkAsRead,
}: StudentNotificationCardProps) {
  const { id, title, message, is_read, created_at, metadata } = notification;

  // Determine category from type or metadata
  const rawType = (metadata?.category || notification.type || "NOTICE").toUpperCase();

  let category: NotificationCategory = "NOTICE";
  if (rawType.includes("MATERIAL") || rawType.includes("STUDY")) category = "STUDY_MATERIAL";
  else if (rawType.includes("TEST") || rawType.includes("EXAM")) category = "TEST";
  else if (rawType.includes("FEE") || rawType.includes("PAYMENT")) category = "FEE_REMINDER";
  else if (rawType.includes("CERT")) category = "CERTIFICATE";
  else if (rawType.includes("IMPORTANT") || rawType.includes("URGENT")) category = "IMPORTANT";
  else category = "NOTICE";

  // Action URL fallback based on category
  const actionUrl =
    metadata?.action_url ||
    metadata?.link ||
    (category === "STUDY_MATERIAL"
      ? "/student/materials"
      : category === "TEST"
      ? "/student/exams"
      : category === "FEE_REMINDER"
      ? "/student/fees"
      : category === "CERTIFICATE"
      ? "/student/certificates"
      : undefined);

  // Category Configuration (Icon, Color Badge, Action Button Text)
  const getCategoryConfig = (cat: NotificationCategory) => {
    switch (cat) {
      case "STUDY_MATERIAL":
        return {
          label: "New Study Material",
          icon: BookMarked,
          badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
          iconBg: "bg-purple-100 text-purple-600",
          actionText: "View Material",
        };
      case "TEST":
        return {
          label: "New Test",
          icon: FlaskConical,
          badgeBg: "bg-violet-50 text-violet-700 border-violet-200",
          iconBg: "bg-violet-100 text-violet-600",
          actionText: "View Exam Schedule",
        };
      case "FEE_REMINDER":
        return {
          label: "Fee Reminder",
          icon: CreditCard,
          badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
          iconBg: "bg-amber-100 text-amber-700",
          actionText: "View Fee Ledger",
        };
      case "CERTIFICATE":
        return {
          label: "Certificate Issued",
          icon: Award,
          badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          iconBg: "bg-emerald-100 text-emerald-700",
          actionText: "View Certificate",
        };
      case "IMPORTANT":
        return {
          label: "Important Announcement",
          icon: AlertCircle,
          badgeBg: "bg-rose-50 text-rose-800 border-rose-200",
          iconBg: "bg-rose-100 text-rose-700",
          actionText: "Read Notice",
        };
      default:
        return {
          label: "New Notice",
          icon: Bell,
          badgeBg: "bg-blue-50 text-blue-800 border-blue-200",
          iconBg: "bg-blue-100 text-blue-600",
          actionText: "View Details",
        };
    }
  };

  const config = getCategoryConfig(category);
  const CategoryIcon = config.icon;

  // Format Indian Date & Time e.g. "26 Aug 2026 · 10:30 AM"
  const formattedDateTime = created_at
    ? `${new Date(created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })} · ${new Date(created_at).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`
    : "Just now";

  const handleCardClick = () => {
    if (!is_read) {
      onMarkAsRead(id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative rounded-2xl border transition-all duration-150 p-5 cursor-pointer ${
        !is_read
          ? "bg-blue-50/40 border-slate-300 shadow-2xs border-l-4 border-l-[#155EEF]"
          : "bg-white border-slate-200/90 hover:bg-slate-50/70"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          {/* Category Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${config.iconBg}`}>
            <CategoryIcon className="w-5 h-5" />
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            {/* Category Tag & Unread Dot */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider border ${config.badgeBg}`}>
                {config.label}
              </span>

              {!is_read && (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  NEW
                </span>
              )}
            </div>

            {/* Title */}
            <h4
              className={`text-sm sm:text-base tracking-tight leading-snug font-display ${
                !is_read ? "font-black text-slate-950" : "font-extrabold text-slate-800"
              }`}
            >
              {title}
            </h4>

            {/* Message Body */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pt-0.5">
              {message}
            </p>

            {/* Timestamp & Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <span className="text-[11px] font-bold text-slate-400 font-mono">
                {formattedDateTime}
              </span>

              {actionUrl && (
                <Link
                  href={actionUrl}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!is_read) onMarkAsRead(id);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#155EEF] hover:text-blue-700 hover:underline min-h-[36px] py-1 px-2.5 rounded-lg bg-blue-50 border border-blue-100 transition-colors"
                >
                  <span>{config.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mark as read button if unread */}
        {!is_read && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(id);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Mark as read"
            aria-label="Mark notification as read"
          >
            <Check className="w-4 h-4 text-blue-600" />
          </button>
        )}
      </div>
    </div>
  );
}
