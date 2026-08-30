"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award, BookOpen, ShieldCheck, Sparkles, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_HOMEPAGE_SETTINGS } from "@/lib/cms-defaults";
import { HomepageBanner } from "@/types/cms";

export default function Hero() {
  const [heroSettings, setHeroSettings] = useState(DEFAULT_HOMEPAGE_SETTINGS);
  const [banners, setBanners] = useState<HomepageBanner[]>([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    // Fetch homepage hero settings
    supabase
      .from("homepage_settings")
      .select("*")
      .eq("id", "default")
      .single()
      .then(({ data }) => {
        if (data) setHeroSettings((prev) => ({ ...prev, ...data }));
      });

    // Fetch homepage banners
    supabase
      .from("homepage_banners")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setBanners(data);
      });
  }, []);

  // Automatic banner slide rotation if multiple active banners exist
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const currentBanner = banners.length > 0 ? banners[activeBannerIndex] : null;

  return (
    <section className="relative pt-28 sm:pt-32 pb-14 overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/20 to-white">
      {/* Background Gradients & Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[12%] left-[8%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[8%] w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-xs mb-6 sm:mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              {heroSettings.hero_badge}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-display text-slate-900 mb-6 leading-[1.15] tracking-tight"
          >
            {heroSettings.hero_title} <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600">
              {heroSettings.hero_highlight}
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-9 sm:mb-10 leading-relaxed"
          >
            {heroSettings.hero_description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-12 sm:mb-14"
          >
            <Link
              href={heroSettings.primary_cta_url || "/courses"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-extrabold text-base transition-all shadow-lg shadow-blue-500/25 active:scale-98"
            >
              <BookOpen className="w-5 h-5" />
              {heroSettings.primary_cta_text || "Explore Courses"}
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>

            <Link
              href={heroSettings.secondary_cta_url || "/student/login"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-extrabold text-base transition-all shadow-md active:scale-98"
            >
              <GraduationCap className="w-5 h-5 text-blue-400" />
              {heroSettings.secondary_cta_text || "Student Login"}
            </Link>

            <Link
              href="/verify"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 px-7 py-4 rounded-2xl font-extrabold text-base transition-all shadow-2xs active:scale-98"
            >
              <Award className="w-5 h-5 text-blue-600" />
              Verify Certificate
            </Link>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left mb-12 sm:mb-14"
          >
            {[
              { title: "Practical Training", desc: "100% lab-based practice" },
              { title: "Experienced Faculty", desc: "Expert IT instructors" },
              { title: "Verified Certificates", desc: "QR-coded online verification" },
              { title: "Career Guidance", desc: "Resume & interview prep" },
            ].map((trust, idx) => (
              <div key={idx} className="bg-white/90 backdrop-blur-xs border border-slate-200/80 p-4 rounded-2xl shadow-2xs flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{trust.title}</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500">{trust.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Hero Banner Image Slider */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-slate-200/90 bg-white p-2.5 max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[16/8.2] bg-slate-950">
              <Image
                src={
                  currentBanner?.desktop_image_url ||
                  heroSettings.hero_image_url ||
                  "/banner.png"
                }
                alt={currentBanner?.title || "Rohit Computer Institute Campus & Training Banner"}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover transition-all duration-700"
                priority
                unoptimized
              />

              {/* Slider Dots */}
              {banners.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-xs px-3 py-1.5 rounded-full z-20">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveBannerIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === activeBannerIndex ? "w-6 bg-blue-500" : "w-2 bg-white/60 hover:bg-white"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
