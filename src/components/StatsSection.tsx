"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_STATS } from "@/lib/cms-defaults";
import { HomepageStat } from "@/types/cms";

function getStatIcon(iconName: string) {
  switch (iconName?.toLowerCase()) {
    case "users":
      return <i className="fa-solid fa-user-graduate text-sm sm:text-base text-[#155EEF] group-hover:text-white transition-colors" />;
    case "bookopen":
      return <i className="fa-solid fa-book-open-reader text-sm sm:text-base text-[#155EEF] group-hover:text-white transition-colors" />;
    case "award":
    case "trophy":
      return <i className="bi bi-award-fill text-sm sm:text-base text-[#D4A72C] group-hover:text-white transition-colors" />;
    case "clock":
    case "calendar":
      return <i className="fa-solid fa-clock-rotate-left text-sm sm:text-base text-[#155EEF] group-hover:text-white transition-colors" />;
    default:
      return <i className="bi bi-patch-check-fill text-sm sm:text-base text-emerald-600 group-hover:text-white transition-colors" />;
  }
}

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
    <section aria-label="Institute Statistics" className="py-8 sm:py-12 bg-white border-b border-slate-200/80 relative">
      <div className="container mx-auto px-3.5 sm:px-6 lg:px-8 max-w-7xl">
        {/* Compact 2x2 grid on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stats.slice(0, 4).map((item, index) => (
            <div
              key={item.id || index}
              className="bg-slate-50/80 border border-slate-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-2xs hover:shadow-lg hover:border-blue-300 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 text-[#155EEF] mx-auto flex items-center justify-center mb-3 group-hover:bg-[#155EEF] transition-colors shadow-2xs">
                {getStatIcon(item.icon)}
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-[#07152F] mb-1 tracking-tight">
                {item.value}
              </div>
              <p className="text-[11px] sm:text-xs font-bold text-slate-600 tracking-tight leading-snug">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
