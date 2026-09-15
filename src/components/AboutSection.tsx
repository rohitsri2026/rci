"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Building2, Award } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_ABOUT_SECTIONS, DEFAULT_SITE_SETTINGS } from "@/lib/cms-defaults";
import { AboutSection as AboutSectionType, SiteSettings } from "@/types/cms";

export default function AboutSection() {
  const [aboutRci, setAboutRci] = useState<AboutSectionType>(DEFAULT_ABOUT_SECTIONS[0]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("about_sections")
      .select("*")
      .eq("section_key", "about_rci")
      .single()
      .then(({ data }) => {
        if (data) setAboutRci((prev) => ({ ...prev, ...data }));
      });

    supabase
      .from("site_settings")
      .select("*")
      .eq("id", "default")
      .single()
      .then(({ data }) => {
        if (data) setSiteSettings((prev) => ({ ...prev, ...data }));
      });
  }, []);

  return (
    <section aria-labelledby="about-rci-title" className="py-10 sm:py-14 bg-slate-50 border-b border-slate-200/80 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* Mobile Image First */}
          <div className="lg:col-span-5 relative max-w-md mx-auto w-full">
            <div className="relative bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm">
              <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100">
                <Image
                  src={aboutRci.image_url || "/banner.png"}
                  alt={aboutRci.heading || siteSettings.site_name}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Verified Badge */}
              <div className="mt-2 bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#155EEF] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Award className="w-4 h-4 text-[#D4A72C]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#07152F] truncate">
                    {siteSettings.site_name}
                  </h4>
                  <p className="text-[10.5px] text-blue-600 font-bold truncate">
                    ISO 9001:2015 &amp; MSME Registered
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Second */}
          <div className="lg:col-span-7 text-left">
            <span className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-xs font-black uppercase tracking-widest text-[#155EEF] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-2">
              <Building2 className="w-3 h-3" />
              About RCI
            </span>

            <h2 id="about-rci-title" className="text-2xl sm:text-3xl font-black font-display text-[#07152F] tracking-tight leading-tight mb-2.5">
              {aboutRci.heading || `About ${siteSettings.site_name}`}
            </h2>

            {/* Shortened content on mobile to avoid giant walls of text */}
            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed mb-4 font-normal line-clamp-3 sm:line-clamp-none">
              {aboutRci.content}
            </p>

            {/* 4 Trust Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
              {[
                "Government & MSME Recognized Curriculum",
                "100% Practical Computer Lab Training",
                "Dedicated Student Digital Portal & Notes",
                "QR-Coded Online Certificate Verification",
              ].map((point, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{point}</span>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 bg-[#07152F] hover:bg-slate-800 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-98 min-h-[42px]"
            >
              <span>Learn More About RCI</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4A72C]" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
