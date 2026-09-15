"use client";

import { useState, useEffect } from "react";
import { 
  Monitor, Cpu, Code2, Users, Compass, Award, Laptop, 
  BadgeCheck, Briefcase, Server, GraduationCap, CheckCircle2,
  LucideIcon 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_FEATURES } from "@/lib/cms-defaults";
import { HomepageFeature } from "@/types/cms";

const ICON_MAP: Record<string, LucideIcon> = {
  Monitor,
  Cpu,
  Code2,
  Users,
  Compass,
  Award,
  Laptop,
  BadgeCheck,
  Briefcase,
  Server,
  GraduationCap,
};

export default function WhyRCI() {
  const [features, setFeatures] = useState<HomepageFeature[]>(DEFAULT_FEATURES);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("homepage_features")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(6)
      .then(({ data }) => {
        if (data && data.length > 0) setFeatures(data);
      });
  }, []);

  return (
    <section id="why-rci" aria-labelledby="why-rci-title" className="py-10 sm:py-14 bg-white border-b border-slate-200/80">
      <div className="container mx-auto px-3.5 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <span className="text-[10.5px] sm:text-xs font-black uppercase tracking-widest text-[#155EEF] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
            The RCI Advantage
          </span>
          <h2 id="why-rci-title" className="text-2xl sm:text-3xl font-black font-display text-[#07152F] mt-2 mb-1.5 leading-tight">
            Why Choose Rohit Computer Institute?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            We prioritize hands-on practice, personalized lab guidance, and industry-oriented IT skills.
          </p>
        </div>

        {/* Clean 2-column mobile grid, 3-column desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6">
          {features.slice(0, 6).map((card, index) => {
            const IconComp = ICON_MAP[card.icon] || GraduationCap;
            return (
              <div
                key={card.id || index}
                className="bg-slate-50/80 border border-slate-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-2xs hover:shadow-xs hover:border-blue-300 hover:bg-white transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white text-[#155EEF] border border-slate-200/80 flex items-center justify-center mb-2 sm:mb-3.5 group-hover:bg-[#155EEF] group-hover:text-white transition-colors shadow-2xs">
                    <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-xs sm:text-base font-extrabold text-[#07152F] mb-1 group-hover:text-blue-600 transition-colors leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-[10.5px] sm:text-xs text-slate-500 leading-snug font-normal line-clamp-2 sm:line-clamp-3">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
