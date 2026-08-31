"use client";

import React from "react";
import Link from "next/link";
import { Megaphone, ArrowRight, X, AlertTriangle, Star, Bell, Calendar } from "lucide-react";
import { AnnouncementItem } from "@/types/cms";

interface AlertBoxNoticeProps {
  notice: AnnouncementItem;
  onDismiss?: (id: string) => void;
}

export default function AlertBoxNotice({ notice, onDismiss }: AlertBoxNoticeProps) {
  return (
    <div
      role="alert"
      className={`rounded-2xl p-5 border shadow-sm space-y-3 relative transition-all ${
        notice.priority === "urgent"
          ? "bg-red-950/90 text-white border-red-500/50 shadow-red-500/10"
          : notice.priority === "important"
          ? "bg-[#07152F] text-white border-amber-500/40 shadow-amber-500/10"
          : "bg-blue-900/90 text-white border-blue-500/40 shadow-blue-500/10"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {notice.priority === "urgent" ? (
            <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white text-[10.5px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1 shadow-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              URGENT ALERT
            </span>
          ) : notice.priority === "important" ? (
            <span className="px-2.5 py-0.5 rounded-md bg-[#D4A72C] text-slate-950 text-[10.5px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-slate-950" />
              IMPORTANT NOTICE
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-md bg-blue-500/30 border border-blue-400/40 text-blue-200 text-[10.5px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5" />
              ALERT BOX
            </span>
          )}

          <h3 className="text-sm sm:text-base font-black truncate font-display text-white">
            {notice.title}
          </h3>
        </div>

        {notice.is_dismissible && (
          <button
            type="button"
            onClick={() => onDismiss && onDismiss(notice.id)}
            className="text-slate-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
        {notice.message}
      </p>

      {notice.button_url && notice.button_text && (
        <div className="pt-2 flex justify-end">
          <Link
            href={notice.button_url}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all inline-flex items-center gap-1.5 shadow-xs shrink-0 min-h-[40px] ${
              notice.priority === "urgent"
                ? "bg-white text-red-700 hover:bg-slate-100"
                : notice.priority === "important"
                ? "bg-[#D4A72C] hover:bg-amber-300 text-slate-950"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            <span>{notice.button_text}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
