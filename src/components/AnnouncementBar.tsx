"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Megaphone, ArrowRight, X, ChevronLeft, ChevronRight, Star, Bell,
  GraduationCap, FileText, DollarSign, Award, BookOpen, Calendar, Sparkles
} from "lucide-react";
import { AnnouncementItem, AnnouncementSettings, AnnouncementType } from "@/types/cms";

interface AnnouncementBarProps {
  settings?: AnnouncementSettings | null;
  notices?: AnnouncementItem[] | null;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  notice: Bell,
  important: Star,
  admission: GraduationCap,
  exam: FileText,
  fee: DollarSign,
  event: Calendar,
  update: Sparkles,
  certificate: Award,
  material: BookOpen,
};

export default function AnnouncementBar({ settings, notices }: AnnouncementBarProps) {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Normalize notices list
  const activeList: AnnouncementItem[] = React.useMemo(() => {
    const now = new Date();
    let rawItems: AnnouncementItem[] = [];

    if (notices && Array.isArray(notices) && notices.length > 0) {
      rawItems = notices;
    } else if (settings && settings.is_enabled && settings.message) {
      // Legacy fallback
      rawItems = [
        {
          id: "legacy-default",
          title: "Announcement",
          message: settings.message,
          announcement_type: "admission",
          priority: "important",
          is_enabled: settings.is_enabled,
          start_at: settings.start_at || new Date(0).toISOString(),
          end_at: settings.end_at,
          button_text: settings.link_text,
          button_url: settings.link_url,
          display_order: 1,
          is_dismissible: true,
        },
      ];
    }

    // Filter active & non-dismissed
    const filtered = rawItems.filter((item) => {
      if (!item.is_enabled) return false;
      if (dismissedIds.includes(item.id)) return false;
      if (item.start_at && new Date(item.start_at) > now) return false;
      if (item.end_at && new Date(item.end_at) < now) return false;
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
  }, [notices, settings, dismissedIds]);

  // Auto Rotation Timer (6 seconds)
  useEffect(() => {
    if (activeList.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeList.length, isHovered]);

  if (activeList.length === 0) return null;

  // Safe Index bounds
  const safeIndex = currentIndex % activeList.length;
  const currentNotice = activeList[safeIndex] || activeList[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeList.length) % activeList.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeList.length);
  };

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
    if (currentIndex >= activeList.length - 1) {
      setCurrentIndex(0);
    }
  };

  const IconComp = TYPE_ICONS[currentNotice.announcement_type] || Megaphone;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`text-white py-2 px-3 sm:px-4 text-xs font-semibold relative z-50 border-b shadow-xs transition-colors duration-300 ${
        currentNotice.priority === "urgent"
          ? "bg-gradient-to-r from-red-950 via-red-700 to-red-950 border-red-500/40"
          : currentNotice.priority === "important"
          ? "bg-gradient-to-r from-[#07152F] via-[#155EEF] to-[#07152F] border-blue-500/30"
          : "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700/50"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Priority / Type Badge & Notice Text */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Badge */}
          {currentNotice.priority === "urgent" ? (
            <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1 shadow-xs animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              URGENT
            </span>
          ) : currentNotice.priority === "important" ? (
            <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Star className="w-3 h-3 text-slate-900 fill-slate-900" />
              NOTICE
            </span>
          ) : (
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
              <IconComp className="w-3 h-3 text-blue-300" />
              ANNOUNCEMENT
            </span>
          )}

          {/* Notice Message */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="truncate text-slate-100 text-xs sm:text-xs font-medium">
              <strong className="font-bold text-white mr-1.5">{currentNotice.title}:</strong>
              <span>{currentNotice.message}</span>
            </p>
          </div>
        </div>

        {/* Right Controls: Rotation Arrows, CTA Button & Close */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Rotation Controls if multiple active */}
          {activeList.length > 1 && (
            <div className="hidden sm:flex items-center gap-1 bg-black/20 px-1.5 py-0.5 rounded-full text-[10px] font-mono text-slate-300">
              <button
                type="button"
                onClick={handlePrev}
                className="hover:text-white p-0.5 cursor-pointer"
                title="Previous Notice"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span>{safeIndex + 1}/{activeList.length}</span>
              <button
                type="button"
                onClick={handleNext}
                className="hover:text-white p-0.5 cursor-pointer"
                title="Next Notice"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* CTA Link Button */}
          {currentNotice.button_url && currentNotice.button_text && (
            <Link
              href={currentNotice.button_url}
              className={`px-3 py-1 rounded-full text-[10.5px] sm:text-[11px] font-black transition-all flex items-center gap-1 shadow-xs hover:scale-105 shrink-0 ${
                currentNotice.priority === "urgent"
                  ? "bg-white text-red-700 hover:bg-slate-100"
                  : "bg-amber-400 hover:bg-amber-300 text-slate-950"
              }`}
            >
              <span className="truncate max-w-[120px] sm:max-w-none">{currentNotice.button_text}</span>
              <ArrowRight className="w-3 h-3 shrink-0" />
            </Link>
          )}

          {/* Dismiss Button */}
          {currentNotice.is_dismissible && (
            <button
              type="button"
              onClick={() => handleDismiss(currentNotice.id)}
              className="text-slate-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
