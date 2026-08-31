"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, ArrowRight, Star, Bell, X } from "lucide-react";
import { AnnouncementItem } from "@/types/cms";
import { createClient } from "@/lib/supabase/client";

export default function StudentPortalNoticeBanner() {
  const [notices, setNotices] = useState<AnnouncementItem[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    async function fetchStudentNotices() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("website_announcements")
          .select("*")
          .eq("is_enabled", true)
          .order("display_order", { ascending: true });

        if (data && data.length > 0) {
          const now = new Date();
          const active = data.filter((item: AnnouncementItem) => {
            if (item.start_at && new Date(item.start_at) > now) return false;
            if (!item.no_expiry && item.end_at && new Date(item.end_at) < now) return false;
            
            // Student or Global+Student targeting
            const displayOn = item.display_on || "global";
            return displayOn === "student" || displayOn === "global_student";
          });

          // Priority Sort: urgent > important > normal
          const getWeight = (p: string) => (p === "urgent" ? 1 : p === "important" ? 2 : 3);
          const sorted = active.sort((a, b) => {
            const wA = getWeight(a.priority);
            const wB = getWeight(b.priority);
            if (wA !== wB) return wA - wB;
            return (a.display_order ?? 0) - (b.display_order ?? 0);
          });

          setNotices(sorted);
        }
      } catch (err) {
        console.error("Failed to fetch student portal notices:", err);
      }
    }

    fetchStudentNotices();
  }, []);

  const visibleNotices = notices.filter((n) => !dismissed.includes(n.id));

  if (visibleNotices.length === 0) return null;

  const topNotice = visibleNotices[0];

  return (
    <div
      className={`rounded-2xl p-4 border shadow-2xs space-y-2 transition-all ${
        topNotice.priority === "urgent"
          ? "bg-red-950/90 text-white border-red-500/40"
          : topNotice.priority === "important"
          ? "bg-[#07152F] text-white border-amber-500/30"
          : "bg-blue-900/90 text-white border-blue-500/30"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {topNotice.priority === "urgent" ? (
            <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shrink-0 animate-pulse">
              URGENT NOTICE
            </span>
          ) : topNotice.priority === "important" ? (
            <span className="px-2 py-0.5 rounded-md bg-[#D4A72C] text-slate-950 text-[10px] font-black uppercase tracking-wider shrink-0">
              IMPORTANT NOTICE
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-white/20 text-white text-[10px] font-black uppercase tracking-wider shrink-0">
              STUDENT NOTICE
            </span>
          )}

          <h4 className="text-xs sm:text-sm font-black truncate font-display text-white">
            {topNotice.title}
          </h4>
        </div>

        {topNotice.is_dismissible && (
          <button
            type="button"
            onClick={() => setDismissed((prev) => [...prev, topNotice.id])}
            className="text-slate-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer shrink-0"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <p className="text-xs text-slate-200 font-medium leading-relaxed">
        {topNotice.message}
      </p>

      {topNotice.button_url && topNotice.button_text && (
        <div className="pt-2 flex justify-end">
          <Link
            href={topNotice.button_url}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all inline-flex items-center gap-1.5 shadow-2xs ${
              topNotice.priority === "urgent"
                ? "bg-white text-red-700 hover:bg-slate-100"
                : topNotice.priority === "important"
                ? "bg-[#D4A72C] hover:bg-amber-300 text-slate-950"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            <span>{topNotice.button_text}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
