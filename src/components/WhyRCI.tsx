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
    <section id="why-rci" aria-labelledby="why-rci-title" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-[#155EEF] bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full">
            The RCI Advantage
          </span>
          <h2 id="why-rci-title" className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-[#07152F] mt-3.5 mb-3 leading-tight">
            Why Choose Rohit Computer Institute?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal">
            We focus on skill mastery and hands-on practice so every student gains genuine technical competence and career confidence.
          </p>
        </div>

        {/* Features Grid: 4-6 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((card, index) => {
            const IconComp = ICON_MAP[card.icon] || GraduationCap;
            return (
              <div
                key={card.id || index}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#155EEF] flex items-center justify-center mb-5 group-hover:bg-[#155EEF] group-hover:text-white transition-colors shadow-2xs">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#07152F] mb-2 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
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
