"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, X, Star, Bell, AlertTriangle } from "lucide-react";
import { AnnouncementItem } from "@/types/cms";

interface StickyNoticeProps {
  notice: AnnouncementItem;
  onDismiss?: (id: string) => void;
}

export default function StickyNotice({ notice, onDismiss }: StickyNoticeProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleClose = () => {
    setDismissed(true);
    if (onDismiss) onDismiss(notice.id);
  };

  return (
    <aside
      role="region"
      aria-label="Sticky Notice"
      className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div
        className={`rounded-2xl p-4 sm:p-5 border shadow-xl space-y-3 backdrop-blur-xl relative transition-all ${
          notice.priority === "urgent"
            ? "bg-slate-950/95 text-white border-red-500/50 shadow-red-500/20"
            : notice.priority === "important"
            ? "bg-[#07152F]/95 text-white border-amber-500/40 shadow-amber-500/20"
            : "bg-[#07152F]/95 text-white border-blue-500/40 shadow-blue-500/20"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {notice.priority === "urgent" ? (
              <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shrink-0">
                STICKY URGENT
              </span>
            ) : notice.priority === "important" ? (
              <span className="px-2 py-0.5 rounded-md bg-[#D4A72C] text-slate-950 text-[10px] font-black uppercase tracking-wider shrink-0">
                STICKY IMPORTANT
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-blue-600/40 text-blue-200 text-[10px] font-black uppercase tracking-wider shrink-0">
                STICKY NOTICE
              </span>
            )}

            <h4 className="text-xs sm:text-sm font-black truncate font-display text-white">
              {notice.title}
            </h4>
          </div>

          {notice.is_dismissible && (
            <button
              type="button"
              onClick={handleClose}
              className="text-slate-300 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Dismiss sticky notice"
              title="Dismiss notice"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-xs text-slate-200 font-medium leading-relaxed line-clamp-2">
          {notice.message}
        </p>

        {notice.button_url && notice.button_text && (
          <div className="pt-1 flex justify-end">
            <Link
              href={notice.button_url}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all inline-flex items-center gap-1.5 shadow-xs shrink-0 min-h-[36px] ${
                notice.priority === "urgent"
                  ? "bg-red-600 hover:bg-red-500 text-white"
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
    </aside>
  );
}
