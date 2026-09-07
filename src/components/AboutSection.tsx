"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Building2, Award, Sparkles } from "lucide-react";
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
    <section aria-labelledby="about-rci-title" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left: Institute Visual Presentation */}
          <div className="lg:col-span-5 relative max-w-md mx-auto w-full">
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative bg-white p-3 rounded-3xl border border-slate-200/90 shadow-xl">
              <div className="relative aspect-[4/3] sm:aspect-[4/3.5] rounded-2xl overflow-hidden bg-slate-100">
                <Image
                  src={aboutRci.image_url || "/banner.png"}
                  alt={aboutRci.heading || siteSettings.site_name}
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Floating Verified Badge */}
              <div className="mt-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#155EEF] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Award className="w-5 h-5 text-[#D4A72C]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#07152F]">
                    {siteSettings.site_name}
                  </h4>
                  <p className="text-[11px] text-blue-600 font-bold">
                    ISO 9001:2015 & MSME Registered Institute
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Institutional Story & Credentials */}
          <div className="lg:col-span-7 text-left">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#155EEF] bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full mb-3.5">
              <Building2 className="w-3.5 h-3.5" />
              About RCI
            </span>

            <h2 id="about-rci-title" className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-[#07152F] tracking-tight leading-tight mb-4">
              {aboutRci.heading}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-normal">
              {aboutRci.content}
            </p>

            {/* Core Institutional Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                "Government & MSME Recognized Curriculum",
                "ISO Certified Quality Practical Training",
                "Dedicated Digital Student Portal & Notes",
                "QR-Coded Online Certificate Verification",
              ].map((point, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{point}</span>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-[#07152F] hover:bg-slate-800 text-white px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-98"
            >
              <span>Learn More About RCI</span>
              <ArrowRight className="w-4 h-4 text-[#D4A72C]" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
