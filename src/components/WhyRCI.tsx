"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_FEATURES } from "@/lib/cms-defaults";
import { HomepageFeature } from "@/types/cms";

function getFeatureIcon(iconName: string) {
  switch (iconName?.toLowerCase()) {
    case "monitor":
    case "laptop":
      return <i className="fa-solid fa-laptop-code text-sm sm:text-base text-[#155EEF] group-hover:text-white transition-colors" />;
    case "cpu":
      return <i className="fa-solid fa-microchip text-sm sm:text-base text-[#155EEF] group-hover:text-white transition-colors" />;
    case "code2":
    case "code":
      return <i className="fa-solid fa-code text-sm sm:text-base text-[#155EEF] group-hover:text-white transition-colors" />;
    case "users":
      return <i className="fa-solid fa-chalkboard-user text-sm sm:text-base text-[#155EEF] group-hover:text-white transition-colors" />;
    case "award":
      return <i className="bi bi-award-fill text-sm sm:text-base text-[#D4A72C] group-hover:text-white transition-colors" />;
    case "badgecheck":
    case "shieldcheck":
      return <i className="bi bi-patch-check-fill text-sm sm:text-base text-blue-600 group-hover:text-white transition-colors" />;
    case "briefcase":
      return <i className="fa-solid fa-briefcase text-sm sm:text-base text-[#155EEF] group-hover:text-white transition-colors" />;
    case "server":
      return <i className="fa-solid fa-server text-sm sm:text-base text-[#155EEF] group-hover:text-white transition-colors" />;
    default:
      return <i className="fa-solid fa-graduation-cap text-sm sm:text-base text-[#155EEF] group-hover:text-white transition-colors" />;
  }
}

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
    <section id="why-rci" aria-labelledby="why-rci-title" className="py-10 sm:py-16 bg-white border-b border-slate-200/80">
      <div className="container mx-auto px-3.5 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-xs font-black uppercase tracking-widest text-[#155EEF] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full animate__animated animate__fadeIn">
            <i className="bi bi-stars text-[#D4A72C] text-xs" />
            <span>The RCI Advantage</span>
          </span>
          <h2 id="why-rci-title" className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-[#07152F] mt-2.5 mb-2 leading-tight">
            Why Choose Rohit Computer Institute?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            We prioritize hands-on practice, personalized lab guidance, and industry-oriented IT skills.
          </p>
        </div>

        {/* Clean 2-column mobile grid, 3-column desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {features.slice(0, 6).map((card, index) => (
            <div
              key={card.id || index}
              className="bg-slate-50/80 border border-slate-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xs hover:shadow-lg hover:border-blue-300 hover:bg-white transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white text-[#155EEF] border border-slate-200/80 flex items-center justify-center mb-3 group-hover:bg-[#155EEF] transition-colors shadow-2xs">
                  {getFeatureIcon(card.icon)}
                </div>
                <h3 className="text-xs sm:text-base font-extrabold text-[#07152F] mb-1.5 group-hover:text-blue-600 transition-colors leading-snug">
                  {card.title}
                </h3>
                <p className="text-[10.5px] sm:text-xs text-slate-500 leading-relaxed font-normal line-clamp-2 sm:line-clamp-3">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
