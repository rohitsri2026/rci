"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ChevronRight, CreditCard, Award, Bell } from "lucide-react";

interface AttentionPanelProps {
  remainingFee?: number;
  hasCertificates?: boolean;
  unreadNotifCount?: number;
}

import { useStudentNotifications } from "@/context/StudentNotificationContext";

export default function AttentionPanel({
  remainingFee = 0,
  hasCertificates = false,
  unreadNotifCount: initialUnreadCount = 0,
}: AttentionPanelProps) {
  const { unreadCount: realtimeUnreadCount } = useStudentNotifications();
  const unreadNotifCount = realtimeUnreadCount ?? initialUnreadCount;
  const needsFeeAttention = remainingFee > 0;
  const hasUnreadNotifs = unreadNotifCount > 0;

  return (
    <div className="space-y-3">
      {/* Notification Updates Banner */}
      {hasUnreadNotifs ? (
        <div className="bg-[#155EEF]/10 border border-[#155EEF]/30 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#155EEF] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-slate-950 font-display flex items-center gap-2">
                <span>🔔 {unreadNotifCount} new update{unreadNotifCount > 1 ? "s" : ""}</span>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              </h4>
              <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
                You have unread notifications in your Student Center.
              </p>
            </div>
          </div>

          <Link
            href="/student/notifications"
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#155EEF] hover:bg-blue-700 text-white font-extrabold text-xs shrink-0 transition-colors min-h-[44px] shadow-2xs"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-emerald-800 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>✓ You&apos;re all caught up! No unread notifications.</span>
          </div>
          <Link
            href="/student/notifications"
            className="text-xs font-extrabold text-emerald-700 hover:underline shrink-0"
          >
            Notifications History
          </Link>
        </div>
      )}

      {/* Action Items Grid (if fees or certificates need attention) */}
      {(needsFeeAttention || hasCertificates) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {needsFeeAttention && (
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0 text-xs">
                  <h4 className="font-extrabold text-amber-950 truncate font-display">Fee Payment Pending</h4>
                  <p className="text-amber-800/90 font-medium truncate mt-0.5">
                    Remaining balance: ₹{remainingFee.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <Link
                href="/student/fees"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shrink-0 transition-colors min-h-[44px]"
              >
                <span>View Fee</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {hasCertificates && (
            <div className="bg-blue-50/80 border border-blue-200/90 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0 text-xs">
                  <h4 className="font-extrabold text-blue-950 truncate font-display">Certificate Available</h4>
                  <p className="text-blue-800/90 font-medium truncate mt-0.5">
                    Your official RCI certificate is ready.
                  </p>
                </div>
              </div>

              <Link
                href="/student/certificates"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#155EEF] hover:bg-blue-700 text-white font-extrabold text-xs shrink-0 transition-colors min-h-[44px]"
              >
                <span>View Certificate</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
