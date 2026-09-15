"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Megaphone, ArrowRight, X, ChevronLeft, ChevronRight, Star, Bell,
  GraduationCap, FileText, DollarSign, Award, BookOpen, Calendar, Sparkles
} from "lucide-react";
import { AnnouncementItem, AnnouncementSettings, AnnouncementType } from "@/types/cms";

interface AnnouncementBarProps {
  settings?: AnnouncementSettings | null;
  notices?: AnnouncementItem[] | null;
  target?: "global" | "homepage" | "student";
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

export default function AnnouncementBar({ settings, notices, target = "global" }: AnnouncementBarProps) {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Safely load dismissed notice IDs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("rci_dismissed_notices");
      if (stored) {
        setDismissedIds(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Filter & sort active notices
  const activeList: AnnouncementItem[] = useMemo(() => {
    const now = new Date();
    let rawItems: AnnouncementItem[] = [];

    if (notices && Array.isArray(notices) && notices.length > 0) {
      rawItems = notices;
    } else if (settings && settings.is_enabled && settings.message) {
      // Legacy fallback
      rawItems = [
        {
          id: "legacy-default",
          title: "Notice",
          message: settings.message,
          announcement_type: "admission",
          priority: "important",
          display_on: "global",
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

    // Filter active, non-dismissed & targeted items
    const filtered = rawItems.filter((item) => {
      if (!item.is_enabled) return false;
      if (dismissedIds.includes(item.id)) return false;
      if (item.start_at && new Date(item.start_at) > now) return false;
      if (!item.no_expiry && item.end_at && new Date(item.end_at) < now) return false;

      // Target filtering
      if (target === "global") {
        const displayOn = item.display_on || "global";
        if (displayOn !== "global" && displayOn !== "global_student") return false;
      }

      return true;
    });

    // Priority sorting: urgent (1) > important (2) > normal (3)
    const getPriorityWeight = (p: string) => {
      if (p === "urgent") return 1;
      if (p === "important") return 2;
      return 3;
    };

    return filtered.sort((a, b) => {
      const pA = getPriorityWeight(a.priority);
      const pB = getPriorityWeight(b.priority);
      if (pA !== pB) return pA - pB;
      return (a.display_order ?? 0) - (b.display_order ?? 0);
    });
  }, [notices, settings, dismissedIds, target]);

  // Auto Rotation Timer (6 seconds) if > 1 notice
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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeList.length) % activeList.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeList.length);
  };

  const handleDismiss = (id: string) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    try {
      localStorage.setItem("rci_dismissed_notices", JSON.stringify(updated));
    } catch {}
    if (currentIndex >= activeList.length - 1) {
      setCurrentIndex(0);
    }
  };

  const IconComp = TYPE_ICONS[currentNotice.announcement_type] || Bell;

  return (
    <aside
      role="region"
      aria-label="Institutional Notices"
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
      <div className="container mx-auto px-3 sm:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-2">
        {/* Left Section: Badge & Message */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Priority Badge */}
          {currentNotice.priority === "urgent" ? (
            <span className="bg-red-600 text-white px-2 py-0.5 rounded-md text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              URGENT
            </span>
          ) : currentNotice.priority === "important" ? (
            <span className="bg-[#D4A72C] text-slate-950 px-2 py-0.5 rounded-md text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-950 fill-slate-950" />
              IMPORTANT
            </span>
          ) : (
            <span className="bg-blue-600/40 text-blue-100 border border-blue-400/30 px-2 py-0.5 rounded-md text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
              <IconComp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-300" />
              NOTICE
            </span>
          )}

          {/* Title & Description Message */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="truncate text-[11.5px] sm:text-xs text-slate-200 font-medium">
              <strong className="font-bold text-white mr-1">{currentNotice.title}:</strong>
              <span className="text-slate-300">{currentNotice.message}</span>
            </p>
          </div>
        </div>

        {/* Right Section: CTA Button, Multi-notice Nav & Close */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 shrink-0">
          {/* CTA Link Button */}
          {currentNotice.button_url && currentNotice.button_text && (
            <Link
              href={currentNotice.button_url}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[10.5px] sm:text-[11px] font-extrabold transition-all flex items-center gap-1 shrink-0 min-h-[30px] sm:min-h-[34px] ${
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

          {/* Navigation Controls (ONLY IF > 1 NOTICE) */}
          {activeList.length > 1 && (
            <div className="flex items-center gap-0.5 sm:gap-1 bg-white/10 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[10.5px] font-mono text-slate-300 shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                className="hover:text-white p-0.5 cursor-pointer transition-colors"
                aria-label="Previous notice"
                title="Previous notice"
              >
                <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <span className="font-bold px-0.5">{safeIndex + 1}/{activeList.length}</span>
              <button
                type="button"
                onClick={handleNext}
                className="hover:text-white p-0.5 cursor-pointer transition-colors"
                aria-label="Next notice"
                title="Next notice"
              >
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          )}

          {/* Dismiss Close Button */}
          {currentNotice.is_dismissible && (
            <button
              type="button"
              onClick={() => handleDismiss(currentNotice.id)}
              className="text-slate-300 hover:text-white p-1 rounded-lg transition-colors cursor-pointer shrink-0 min-w-[30px] min-h-[30px] sm:min-w-[34px] sm:min-h-[34px] flex items-center justify-center"
              aria-label="Dismiss announcement notice"
              title="Dismiss notice"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
