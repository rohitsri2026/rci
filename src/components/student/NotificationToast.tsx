"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Bell, X, ArrowRight } from "lucide-react";
import { useStudentNotifications } from "@/context/StudentNotificationContext";

export default function NotificationToast() {
  const { toastNotification, dismissToast, markAsRead } = useStudentNotifications();

  // Auto dismiss toast after 6 seconds
  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [toastNotification, dismissToast]);

  if (!toastNotification) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-top-4 fade-in zoom-in-95 duration-200">
      <div className="bg-[#07152F] text-white rounded-2xl p-4 shadow-2xl border border-blue-500/40 space-y-2.5 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#155EEF] text-white flex items-center justify-center shrink-0 shadow-md">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider">
                New Notification
              </span>
              <h5 className="text-xs sm:text-sm font-extrabold text-white leading-tight truncate max-w-[200px]">
                {toastNotification.title}
              </h5>
            </div>
          </div>

          <button
            onClick={dismissToast}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
          {toastNotification.message}
        </p>

        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
          <Link
            href="/student/notifications"
            onClick={() => {
              markAsRead(toastNotification.id);
              dismissToast();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#155EEF] hover:bg-blue-600 text-white font-extrabold text-xs transition-colors shadow-2xs"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
