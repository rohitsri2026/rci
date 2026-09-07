"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, ArrowRight, Calendar, ChevronRight } from "lucide-react";
import { AnnouncementItem } from "@/types/cms";
import { createClient } from "@/lib/supabase/client";

function formatISTDate(isoStr?: string | null): string {
  if (!isoStr) return "";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(isoStr));
  } catch {
    return isoStr;
  }
}

export default function LatestNoticesSection() {
  const [notices, setNotices] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotices() {
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
            
            // Homepage or Global targeting
            const displayOn = item.display_on || "global";
            return displayOn === "global" || displayOn === "homepage" || displayOn === "global_student";
          });

          // Priority Sort: urgent > important > normal
          const getWeight = (p: string) => (p === "urgent" ? 1 : p === "important" ? 2 : 3);
          const sorted = active.sort((a, b) => {
            const wA = getWeight(a.priority);
            const wB = getWeight(b.priority);
            if (wA !== wB) return wA - wB;
            return (a.display_order ?? 0) - (b.display_order ?? 0);
          });

          setNotices(sorted.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch homepage notices:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotices();
  }, []);

  if (loading || notices.length === 0) return null;

  return (
    <section aria-labelledby="latest-notices-title" className="py-10 sm:py-16 bg-white border-b border-slate-200/80 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-[10.5px] sm:text-xs font-black uppercase tracking-wider">
              <Megaphone className="w-3.5 h-3.5 text-blue-600" />
              <span>Official RCI Notice Board</span>
            </div>
            <h2 id="latest-notices-title" className="text-2xl sm:text-3xl font-black font-display text-[#07152F] tracking-tight">
              Latest Notices &amp; Updates
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-lg">
              Official institute announcements for exams, batch admissions, and schedules.
            </p>
          </div>

          <Link
            href="/notices"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#07152F] border border-slate-300 text-xs font-bold transition-all shadow-2xs hover:shadow-xs shrink-0 self-start sm:self-auto"
          >
            <span>View All Notices</span>
            <ChevronRight className="w-4 h-4 text-[#155EEF]" />
          </Link>
        </div>

        {/* Max 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border shadow-2xs space-y-3 flex flex-col justify-between transition-all hover:shadow-md ${
                notice.priority === "urgent"
                  ? "border-red-200"
                  : notice.priority === "important"
                  ? "border-amber-200"
                  : "border-slate-200/90"
              }`}
            >
              <div className="space-y-2.5">
                {/* Priority & Date */}
                <div className="flex items-center justify-between gap-2">
                  {notice.priority === "urgent" ? (
                    <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[9.5px] font-black uppercase tracking-wider">
                      URGENT
                    </span>
                  ) : notice.priority === "important" ? (
                    <span className="px-2 py-0.5 rounded-md bg-[#D4A72C] text-slate-950 text-[9.5px] font-black uppercase tracking-wider">
                      IMPORTANT
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-[9.5px] font-black uppercase tracking-wider">
                      NORMAL
                    </span>
                  )}

                  <span className="text-[10.5px] font-bold text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {formatISTDate(notice.start_at)}
                  </span>
                </div>

                {/* Title & Message */}
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-black text-[#07152F] leading-snug font-display line-clamp-2">
                    {notice.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {notice.message}
                  </p>
                </div>
              </div>

              {/* Link Button */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                {notice.button_url && notice.button_text ? (
                  <Link
                    href={notice.button_url}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#155EEF] hover:text-blue-700 hover:underline"
                  >
                    <span>{notice.button_text}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link
                    href="/notices"
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900"
                  >
                    <span>Read Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
