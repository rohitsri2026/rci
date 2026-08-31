"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Megaphone, ArrowRight, X, ChevronLeft, ChevronRight, Star, Bell,
  GraduationCap, FileText, DollarSign, Award, BookOpen, Sparkles
} from "lucide-react";
import { AnnouncementItem, AnnouncementSettings } from "@/types/cms";

interface TopStripNoticeProps {
  notices?: AnnouncementItem[] | null;
  settings?: AnnouncementSettings | null;
  onDismiss?: (id: string) => void;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  notice: Bell,
  admission: GraduationCap,
  exam: FileText,
  fee: DollarSign,
  course: BookOpen,
  certificate: Award,
  update: Sparkles,
  urgent: Megaphone,
};

export default function TopStripNotice({ notices, settings, onDismiss }: TopStripNoticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const activeList = useMemo(() => {
    if (notices && notices.length > 0) return notices;
    if (settings && settings.is_enabled && settings.message) {
      return [
        {
          id: "legacy-default",
          title: "Notice",
          message: settings.message,
          announcement_type: "admission" as const,
          priority: "important" as const,
          display_on: "global" as const,
          display_format: "top_strip" as const,
          is_enabled: settings.is_enabled,
          no_expiry: !settings.end_at,
          start_at: settings.start_at || new Date(0).toISOString(),
          end_at: settings.end_at,
          button_text: settings.link_text,
          button_url: settings.link_url,
          display_order: 1,
          is_dismissible: true,
        },
      ];
    }
    return [];
  }, [notices, settings]);

  useEffect(() => {
    if (activeList.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeList.length, isHovered]);

  if (activeList.length === 0) return null;

  const safeIndex = currentIndex % activeList.length;
  const currentNotice = activeList[safeIndex] || activeList[0];
  const IconComp = TYPE_ICONS[currentNotice.announcement_type] || Bell;

  return (
    <aside
      role="region"
      aria-label="Top Strip Announcement"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className={`text-white text-xs font-semibold relative z-50 border-b transition-colors duration-300 ${
        currentNotice.priority === "urgent"
          ? "bg-slate-950 border-red-500/40 text-red-100"
          : currentNotice.priority === "important"
          ? "bg-[#07152F] border-amber-500/30 text-amber-50"
          : "bg-[#07152F] border-blue-500/20 text-slate-100"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="container mx-auto px-3 sm:px-6 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {currentNotice.priority === "urgent" ? (
            <span className="bg-red-600 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              URGENT
            </span>
          ) : currentNotice.priority === "important" ? (
            <span className="bg-[#D4A72C] text-slate-950 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Star className="w-3 h-3 text-slate-950 fill-slate-950" />
              IMPORTANT
            </span>
          ) : (
            <span className="bg-blue-600/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
              <IconComp className="w-3 h-3 text-blue-300" />
              NOTICE
            </span>
          )}

          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="truncate text-xs text-slate-200 font-medium">
              <strong className="font-bold text-white mr-1.5">{currentNotice.title}:</strong>
              <span className="text-slate-300">{currentNotice.message}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
          {currentNotice.button_url && currentNotice.button_text && (
            <Link
              href={currentNotice.button_url}
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all flex items-center gap-1.5 shrink-0 min-h-[32px] sm:min-h-[36px] ${
                currentNotice.priority === "urgent"
                  ? "bg-red-600 hover:bg-red-500 text-white shadow-xs"
                  : currentNotice.priority === "important"
                  ? "bg-[#D4A72C] hover:bg-amber-300 text-slate-950 shadow-xs"
                  : "bg-[#155EEF] hover:bg-blue-500 text-white shadow-xs"
              }`}
            >
              <span>{currentNotice.button_text}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}

          {activeList.length > 1 && (
            <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full text-[10.5px] font-mono text-slate-300 shrink-0">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + activeList.length) % activeList.length)}
                className="hover:text-white p-1 cursor-pointer transition-colors"
                aria-label="Previous notice"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold px-1">{safeIndex + 1} / {activeList.length}</span>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % activeList.length)}
                className="hover:text-white p-1 cursor-pointer transition-colors"
                aria-label="Next notice"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {currentNotice.is_dismissible && (
            <button
              type="button"
              onClick={() => onDismiss && onDismiss(currentNotice.id)}
              className="text-slate-300 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Dismiss notice"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
