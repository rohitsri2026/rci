"use client";

import { useState, useEffect } from "react";
import { 
  Users, Monitor, Award, GraduationCap, ShieldCheck, 
  Laptop, CheckCircle2, LucideIcon 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { HomepageFeature } from "@/types/cms";

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Monitor,
  Award,
  GraduationCap,
  ShieldCheck,
  Laptop,
};

const DEFAULT_BENEFITS = [
  {
    title: "Experienced Faculty",
    description: "Industry-certified instructors with practical IT & software training expertise.",
    icon: "Users",
  },
  {
    title: "Practical Training",
    description: "100% lab-based curriculum with hands-on computer systems practice.",
    icon: "Monitor",
  },
  {
    title: "Recognized Certificates",
    description: "ISO & MSME recognized credentials with instant online QR verification.",
    icon: "Award",
  },
  {
    title: "Student Support",
    description: "Dedicated digital student portal, batch flexibility & career guidance.",
    icon: "GraduationCap",
  },
];

export default function BenefitsStrip() {
  const [benefits, setBenefits] = useState(DEFAULT_BENEFITS);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("homepage_features")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(4)
      .then(({ data }) => {
        if (data && data.length >= 4) {
          setBenefits(
            data.map((item: HomepageFeature) => ({
              title: item.title,
              description: item.description,
              icon: item.icon,
            }))
          );
        }
      });
  }, []);

  return (
    <section aria-label="Key Benefits and Features" className="py-8 sm:py-10 bg-white border-b border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {benefits.map((item, idx) => {
            const IconComp = ICON_MAP[item.icon] || CheckCircle2;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-4 sm:p-5 hover:bg-blue-50/40 hover:border-blue-200 transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-slate-200/80 text-[#155EEF] flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-[#07152F] tracking-tight leading-snug group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
