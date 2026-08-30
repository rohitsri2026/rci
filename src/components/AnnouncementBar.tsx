"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Megaphone, ArrowRight, X } from "lucide-react";
import { AnnouncementSettings } from "@/types/cms";

interface AnnouncementBarProps {
  settings?: AnnouncementSettings | null;
}

export default function AnnouncementBar({ settings }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!settings || !settings.is_enabled || !settings.message || dismissed) {
    return null;
  }

  // Date range check
  const now = new Date();
  if (settings.start_at && new Date(settings.start_at) > now) return null;
  if (settings.end_at && new Date(settings.end_at) < now) return null;

  return (
    <div className="bg-gradient-to-r from-[#07152F] via-[#155EEF] to-[#07152F] text-white py-2 px-4 text-xs font-semibold relative z-50 border-b border-blue-500/30">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0 mx-auto sm:mx-0">
          <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Megaphone className="w-3 h-3 text-amber-300" />
            Notice
          </span>
          <p className="truncate text-slate-100 text-xs sm:text-xs">
            {settings.message}
          </p>
        </div>

        {settings.link_url && settings.link_text && (
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={settings.link_url}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1 rounded-full text-[11px] font-black transition-all flex items-center gap-1 shadow-xs hover:scale-105"
            >
              <span>{settings.link_text}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="text-slate-300 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
