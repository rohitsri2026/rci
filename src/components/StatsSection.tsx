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
    <section aria-label="Institute Statistics and Milestone" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/80 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((item, index) => {
            const IconComp = ICON_MAP[item.icon] || Users;
            return (
              <div
                key={item.id || index}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-7 text-center shadow-2xs hover:shadow-lg hover:border-blue-300 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#155EEF] mx-auto flex items-center justify-center mb-3.5 group-hover:bg-[#155EEF] group-hover:text-white transition-colors shadow-2xs">
                  <IconComp className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#07152F] mb-1 tracking-tight">
                  {item.value}
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-600 tracking-tight">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
