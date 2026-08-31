"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Megaphone, ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnnouncementItem } from "@/types/cms";

interface TickerNoticeProps {
  notices: AnnouncementItem[];
  onDismiss?: (id: string) => void;
}

export default function TickerNotice({ notices, onDismiss }: TickerNoticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
    }
  }, []);

  useEffect(() => {
    if (notices.length <= 1 || isPaused || prefersReducedMotion) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [notices.length, isPaused, prefersReducedMotion]);

  if (!notices || notices.length === 0) return null;

  const current = notices[currentIndex % notices.length] || notices[0];

  return (
    <aside
      role="region"
      aria-label="News Ticker Announcements"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-slate-900 text-white border-b border-slate-800 text-xs font-semibold py-2 px-4 relative z-40"
    >
      <div className="container mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="bg-red-600 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Megaphone className="w-3 h-3 text-amber-300" />
            <span>RCI TICKER</span>
          </span>

          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="truncate text-xs text-slate-200 font-medium">
              <strong className="font-bold text-white mr-1.5">{current.title}:</strong>
              <span className="text-slate-300">{current.message}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {current.button_url && current.button_text && (
            <Link
              href={current.button_url}
              className="px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black transition-all flex items-center gap-1 shrink-0"
            >
              <span>{current.button_text}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}

          {notices.length > 1 && (
            <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full text-[10.5px] font-mono text-slate-300">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + notices.length) % notices.length)}
                className="hover:text-white p-0.5 cursor-pointer"
                aria-label="Previous ticker item"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold px-1">{currentIndex + 1}/{notices.length}</span>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % notices.length)}
                className="hover:text-white p-0.5 cursor-pointer"
                aria-label="Next ticker item"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {current.is_dismissible && (
            <button
              type="button"
              onClick={() => onDismiss && onDismiss(current.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss ticker"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
