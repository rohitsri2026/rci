"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { HomepageFeature } from "@/types/cms";

function getBenefitIcon(iconName: string) {
  switch (iconName?.toLowerCase()) {
    case "users":
      return <i className="fa-solid fa-chalkboard-user text-sm sm:text-base text-[#155EEF] group-hover:text-white transition-colors" />;
    case "monitor":
    case "laptop":
      return <i className="fa-solid fa-laptop-code text-sm sm:text-base text-[#155EEF] group-hover:text-white transition-colors" />;
    case "award":
      return <i className="bi bi-patch-check-fill text-sm sm:text-base text-[#D4A72C] group-hover:text-white transition-colors" />;
    case "graduationcap":
      return <i className="fa-solid fa-graduation-cap text-sm sm:text-base text-[#155EEF] group-hover:text-white transition-colors" />;
    case "shieldcheck":
      return <i className="fa-solid fa-shield-halved text-sm sm:text-base text-[#155EEF] group-hover:text-white transition-colors" />;
    default:
      return <i className="bi bi-check2-circle text-sm sm:text-base text-[#155EEF] group-hover:text-white transition-colors" />;
  }
}

const DEFAULT_BENEFITS = [
  {
    title: "Experienced Faculty",
    description: "Industry-certified instructors with practical IT & software training expertise.",
    icon: "Users",
  },
  {
    title: "100% Practical Training",
    description: "Lab-based curriculum with individual computer workstations for hands-on mastery.",
    icon: "Monitor",
  },
  {
    title: "Recognized Certificates",
    description: "ISO 9001:2015 & MSME recognized credentials with instant online QR verification.",
    icon: "Award",
  },
  {
    title: "Student Support & Portal",
    description: "Dedicated digital student portal, batch flexibility, and career guidance.",
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
    <section aria-label="Key Benefits and Features" className="py-6 sm:py-8 lg:py-10 bg-white border-b border-slate-200/80">
      <div className="container mx-auto px-3.5 sm:px-6 lg:px-8 max-w-7xl">
        {/* Clean 2-column mobile grid, 4-column on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50/80 border border-slate-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-blue-50/40 hover:border-blue-300 transition-all duration-300 group flex flex-col justify-between shadow-2xs hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-2.5 sm:gap-3.5">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-slate-200/90 flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#155EEF] transition-colors">
                  {getBenefitIcon(item.icon)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#07152F] tracking-tight leading-snug group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[10.5px] sm:text-xs text-slate-500 leading-snug mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
