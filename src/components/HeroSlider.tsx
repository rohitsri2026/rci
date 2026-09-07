"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeft, ChevronRight, BookOpen, Award, ArrowRight, 
  Sparkles, CheckCircle2 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_HOMEPAGE_SETTINGS } from "@/lib/cms-defaults";
import { HomepageBanner, HomepageSettings } from "@/types/cms";

export default function HeroSlider() {
  const [heroSettings, setHeroSettings] = useState<HomepageSettings>(DEFAULT_HOMEPAGE_SETTINGS);
  const [banners, setBanners] = useState<HomepageBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Fetch CMS hero settings & active banners
  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("homepage_settings")
      .select("*")
      .eq("id", "default")
      .single()
      .then(({ data }) => {
        if (data) setHeroSettings((prev) => ({ ...prev, ...data }));
      });

    supabase
      .from("homepage_banners")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setBanners(data);
        }
      });
  }, []);

  const totalSlides = banners.length > 0 ? banners.length : 1;

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto slide rotation every 5.5s (respects hover, focus & reduced motion)
  useEffect(() => {
    if (totalSlides <= 1 || isHovered || isFocused) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(timer);
  }, [totalSlides, isHovered, isFocused, nextSlide]);

  // Mobile swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      nextSlide();
    } else if (distance < -45) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  return (
    <section
      aria-label="Institute Hero"
      className="relative bg-[#07152F] text-white overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Subtle Deep Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-5%] w-[550px] h-[550px] bg-blue-600/35 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] bg-indigo-600/25 rounded-full blur-[130px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 py-10 sm:py-14 md:py-16 lg:py-18 min-h-[500px] sm:min-h-[540px] lg:min-h-[560px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* ============================================================ */}
          {/* LEFT: ~55% Institutional Presentation & CTAs                  */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
              <span className="tracking-wider uppercase">
                {heroSettings.hero_badge || "Trusted Computer Education"}
              </span>
            </div>

            {/* Large Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black font-display tracking-tight text-white leading-[1.15]">
              {heroSettings.hero_title || "Build Your Digital Future"} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-[#D4A72C]">
                {heroSettings.hero_highlight || "With Practical IT Skills"}
              </span>
            </h1>

            {/* Professional Description */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
              {heroSettings.hero_description ||
                "Master modern computer applications, Tally Prime accounting, web development, and programming with hands-on lab training and QR-verifiable certificates."}
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={heroSettings.primary_cta_url || "/courses"}
                className="inline-flex items-center justify-center gap-2 bg-[#155EEF] hover:bg-blue-600 text-white px-6 sm:px-7 py-3.5 rounded-xl font-extrabold text-sm sm:text-base transition-all shadow-lg shadow-blue-600/30 active:scale-98"
              >
                <BookOpen className="w-4 h-4" />
                <span>{heroSettings.primary_cta_text || "Explore Courses"}</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>

              <Link
                href={heroSettings.secondary_cta_url || "/admission"}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-[#07152F] px-6 sm:px-7 py-3.5 rounded-xl font-extrabold text-sm sm:text-base transition-all shadow-md active:scale-98"
              >
                <span>{heroSettings.secondary_cta_text || "Apply Now"}</span>
              </Link>

              <Link
                href="/verify"
                className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 sm:px-5 py-3.5 rounded-xl font-bold text-sm transition-all backdrop-blur-xs active:scale-98"
              >
                <Award className="w-4 h-4 text-[#D4A72C]" />
                <span>Verify</span>
              </Link>
            </div>

            {/* Trust Highlights Strip */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">ISO 9001:2015 Registered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-semibold">100% Practical Lab Training</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4A72C] shrink-0" />
                <span className="font-semibold">QR Verifiable Diplomas</span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: ~45% Large Banner Image Slider                         */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-slate-900/80 p-2 sm:p-2.5 backdrop-blur-sm group/banner">
              <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950">
                
                {banners.length > 0 ? (
                  banners.map((banner, index) => {
                    const isActive = index === currentIndex;
                    const imageUrl = banner.desktop_image_url || "/banner.png";
                    return (
                      <div
                        key={banner.id || index}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                          isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                        }`}
                      >
                        <Image
                          src={imageUrl}
                          alt={banner.title || "Rohit Computer Institute Campus & Training Banner"}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 550px"
                          priority={index === 0}
                          className="object-cover"
                          unoptimized
                        />
                        
                        {/* Gradient Overlay for Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07152F]/90 via-[#07152F]/25 to-transparent" />

                        {/* Banner Caption */}
                        {(banner.title || banner.description) && (
                          <div className="absolute bottom-3 sm:bottom-4 left-4 right-4 text-left">
                            {banner.title && (
                              <h3 className="text-sm sm:text-base font-bold text-white mb-0.5 drop-shadow-md">
                                {banner.title}
                              </h3>
                            )}
                            {banner.description && (
                              <p className="text-[11px] sm:text-xs text-slate-200 line-clamp-2 drop-shadow">
                                {banner.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  /* Fallback when no CMS banners exist */
                  <div className="relative w-full h-full">
                    <Image
                      src={heroSettings.hero_image_url || "/banner.png"}
                      alt="Rohit Computer Institute Campus & Training Banner"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 550px"
                      priority
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07152F]/80 via-transparent to-transparent" />
                  </div>
                )}

                {/* Navigation Arrows (if > 1 banner) */}
                {totalSlides > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevSlide}
                      aria-label="Previous slide"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/60 hover:bg-[#155EEF] text-white border border-white/20 flex items-center justify-center backdrop-blur-xs transition-all opacity-80 group-hover/banner:opacity-100"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Next slide"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/60 hover:bg-[#155EEF] text-white border border-white/20 flex items-center justify-center backdrop-blur-xs transition-all opacity-80 group-hover/banner:opacity-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-2 right-3 z-20 flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      {banners.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentIndex(idx)}
                          aria-label={`Go to slide ${idx + 1}`}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === currentIndex
                              ? "w-5 bg-[#155EEF]"
                              : "w-1.5 bg-white/50 hover:bg-white"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
