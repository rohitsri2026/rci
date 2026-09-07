"use client";

import { useState, useEffect } from "react";
import { Users, BookOpen, Award, Clock, Calendar, CheckCircle2, Trophy, LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_STATS } from "@/lib/cms-defaults";
import { HomepageStat } from "@/types/cms";

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  BookOpen,
  Award,
  Clock,
  Calendar,
  CheckCircle2,
  Trophy,
};

export default function StatsSection() {
  const [stats, setStats] = useState<HomepageStat[]>(DEFAULT_STATS);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("homepage_stats")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setStats(data);
      });
  }, []);

  return (
    <section aria-label="Institute Statistics" className="py-10 sm:py-14 bg-white border-b border-slate-200/80 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Compact 2x2 grid on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {stats.slice(0, 4).map((item, index) => {
            const IconComp = ICON_MAP[item.icon] || Users;
            return (
              <div
                key={item.id || index}
                className="bg-slate-50/70 border border-slate-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-blue-50 text-[#155EEF] mx-auto flex items-center justify-center mb-2.5 sm:mb-3 group-hover:bg-[#155EEF] group-hover:text-white transition-colors shadow-2xs">
                  <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#07152F] mb-0.5 tracking-tight">
                  {item.value}
                </div>
                <p className="text-[11px] sm:text-xs font-bold text-slate-600 tracking-tight leading-snug">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
