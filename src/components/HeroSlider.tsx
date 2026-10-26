"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_HOMEPAGE_SETTINGS } from "@/lib/cms-defaults";
import { HomepageBanner, HomepageSettings } from "@/types/cms";
import HeroTypingTagline from "./HeroTypingTagline";

export default function HeroSlider() {
  const [heroSettings, setHeroSettings] = useState<HomepageSettings>(DEFAULT_HOMEPAGE_SETTINGS);
  const [banners, setBanners] = useState<HomepageBanner[]>([]);

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

  const slideBanners = banners.length > 0 ? banners : [
    {
      id: "fallback-banner",
      title: "State-of-the-Art Computer Education",
      description: "Join Kanpur's most trusted practical IT institute with modern computer labs and ISO recognized certification.",
      desktop_image_url: heroSettings.hero_image_url || "/banner.png",
      mobile_image_url: heroSettings.hero_image_url || "/banner.png",
      display_order: 1,
      is_active: true,
    } as HomepageBanner
  ];

  return (
    <section
      aria-label="Institute Hero"
      className="relative bg-[#07152F] text-white overflow-hidden"
    >
      {/* Animated Blue-Cyan-Violet Ambient Gradient Mesh Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Layer 1: Royal Blue Mesh */}
        <div className="absolute -top-[15%] -left-[10%] w-[680px] h-[680px] bg-gradient-to-br from-blue-600/35 via-blue-500/20 to-transparent rounded-full blur-[140px] animate-hero-mesh-1" />

        {/* Layer 2: Electric Cyan Mesh */}
        <div className="absolute top-[20%] -right-[10%] w-[620px] h-[620px] bg-gradient-to-bl from-cyan-400/25 via-sky-500/15 to-transparent rounded-full blur-[130px] animate-hero-mesh-2" />

        {/* Layer 3: Deep Violet Mesh */}
        <div className="absolute -bottom-[20%] left-[15%] w-[640px] h-[640px] bg-gradient-to-tr from-violet-600/25 via-purple-500/15 to-transparent rounded-full blur-[150px] animate-hero-mesh-3" />

        {/* Subtle Micro-Grid Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 py-6 sm:py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-center w-full">

          {/* Core Message & CTAs */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4 lg:space-y-5 text-left">
            {/* Small Badge with Bootstrap Icon & Animate.css */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs font-bold text-blue-200 animate__animated animate__fadeInDown">
              <i className="bi bi-stars text-[#D4A72C] text-sm animate__animated animate__pulse animate__infinite" />
              <span className="tracking-wider uppercase font-semibold">
                {heroSettings.hero_badge || "Trusted Computer Education"}
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Large Mobile-First Heading with Google Fonts Outfit */}
            <h1 className="text-[28px] xs:text-[32px] sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black font-display tracking-tight text-white leading-[1.18] sm:leading-[1.15] animate__animated animate__fadeInUp">
              {heroSettings.hero_title || "Build Your Digital Future"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-[#D4A72C]">
                {heroSettings.hero_highlight || "With Practical IT Skills"}
              </span>
            </h1>

            {/* Dynamic Typing Tagline: Learn Computer Skills | Build Your Career | Get Job Ready */}
            <div className="animate__animated animate__fadeInUp">
              <HeroTypingTagline />
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-xl font-normal animate__animated animate__fadeInUp animate__delay-1s">
              {heroSettings.hero_description ||
                "Master modern computer applications, Tally Prime accounting, and software skills with hands-on lab practice and QR-verifiable certificates."}
            </p>

            {/* CTA Buttons: Explore Courses, Student Login & Verify Certificate with Font Awesome & Bootstrap Icons */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3.5 pt-1 animate__animated animate__fadeInUp animate__delay-1s">
              <Link
                href={heroSettings.primary_cta_url || "/courses"}
                className="flex items-center justify-center gap-2 bg-[#155EEF] hover:bg-blue-600 active:bg-blue-700 text-white px-3 sm:px-6 py-3 sm:py-3.5 rounded-xl font-extrabold text-xs sm:text-base transition-all shadow-lg shadow-blue-600/35 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-98 min-h-[46px]"
              >
                <i className="fa-solid fa-book-open text-xs sm:text-sm" />
                <span className="truncate">{heroSettings.primary_cta_text || "Explore Courses"}</span>
              </Link>

              <Link
                href={heroSettings.secondary_cta_url || "/student/login"}
                className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 active:bg-slate-200 text-[#07152F] px-3 sm:px-6 py-3 sm:py-3.5 rounded-xl font-extrabold text-xs sm:text-base transition-all shadow-md hover:scale-[1.02] active:scale-98 min-h-[46px]"
              >
                <i className="fa-solid fa-graduation-cap text-xs sm:text-sm text-[#155EEF]" />
                <span className="truncate">{heroSettings.secondary_cta_text || "Student Login"}</span>
                <i className="fa-solid fa-arrow-right text-[11px] ml-0.5" />
              </Link>

              <Link
                href="/verify"
                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/20 text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-base transition-all backdrop-blur-md active:scale-98 min-h-[46px]"
              >
                <i className="fa-solid fa-shield-halved text-[#D4A72C] text-sm" />
                <span className="truncate">Verify Certificate</span>
              </Link>
            </div>
          </div>

          {/* RIGHT: Prominent Swiper Banner Slider */}
          <div className="lg:col-span-5 relative mt-1 sm:mt-0 animate__animated animate__fadeIn">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-slate-900/80 p-1 sm:p-2 backdrop-blur-sm group/banner">
              
              <Swiper
                modules={[Autoplay, EffectFade, Pagination, Navigation]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={750}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                navigation={{
                  nextEl: ".hero-swiper-next",
                  prevEl: ".hero-swiper-prev",
                }}
                loop={slideBanners.length > 1}
                className="relative aspect-[4/3] xs:aspect-[16/10] sm:aspect-[16/10] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950"
              >
                {slideBanners.map((banner, index) => {
                  const imageUrl = banner.mobile_image_url || banner.desktop_image_url || "/banner.png";
                  return (
                    <SwiperSlide key={banner.id || index} className="relative w-full h-full">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07152F]/90 via-[#07152F]/20 to-transparent" />

                      {/* Banner Caption */}
                      {(banner.title || banner.description) && (
                        <div className="absolute bottom-3 sm:bottom-4 left-3.5 right-3.5 text-left z-10">
                          {banner.title && (
                            <h3 className="text-xs sm:text-base font-bold text-white mb-0.5 drop-shadow-md flex items-center gap-1.5">
                              <i className="bi bi-patch-check-fill text-blue-400 text-xs shrink-0" />
                              <span>{banner.title}</span>
                            </h3>
                          )}
                          {banner.description && (
                            <p className="text-[10.5px] sm:text-xs text-slate-200 line-clamp-1 sm:line-clamp-2 drop-shadow">
                              {banner.description}
                            </p>
                          )}
                        </div>
                      )}
                    </SwiperSlide>
                  );
                })}

                {/* Swiper Navigation Buttons with Font Awesome */}
                {slideBanners.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous slide"
                      className="hero-swiper-prev hidden sm:flex absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-[#155EEF] text-white border border-white/20 items-center justify-center backdrop-blur-xs transition-all opacity-0 group-hover/banner:opacity-100 cursor-pointer shadow-lg"
                    >
                      <i className="fa-solid fa-chevron-left text-xs" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next slide"
                      className="hero-swiper-next hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-[#155EEF] text-white border border-white/20 items-center justify-center backdrop-blur-xs transition-all opacity-0 group-hover/banner:opacity-100 cursor-pointer shadow-lg"
                    >
                      <i className="fa-solid fa-chevron-right text-xs" />
                    </button>
                  </>
                )}
              </Swiper>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
