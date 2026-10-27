"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import { motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_HOMEPAGE_SETTINGS } from "@/lib/cms-defaults";
import { HomepageBanner, HomepageSettings } from "@/types/cms";
import HeroTypingTagline from "./HeroTypingTagline";
import HeroParticles from "./HeroParticles";
import { RCIConfig } from "@/lib/config";

// Staggered Entrance Animation Variants (500–800ms duration per element)
const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as const, // Smooth, modern easeOut curve
    },
  },
};

const TRENDING_COURSES = [
  { name: "ADCA (1 Year)", icon: "fa-solid fa-laptop-code", color: "hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/15" },
  { name: "Tally Prime + GST", icon: "fa-solid fa-calculator", color: "hover:border-amber-400 hover:text-amber-300 hover:bg-amber-500/15" },
  { name: "Web Design & Dev", icon: "fa-solid fa-code", color: "hover:border-blue-400 hover:text-blue-300 hover:bg-blue-500/15" },
  { name: "Python Programming", icon: "fa-brands fa-python", color: "hover:border-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/15" },
  { name: "CCC & MS Office", icon: "fa-solid fa-file-excel", color: "hover:border-purple-400 hover:text-purple-300 hover:bg-purple-500/15" },
];

export default function HeroSlider() {
  const [heroSettings, setHeroSettings] = useState<HomepageSettings>(DEFAULT_HOMEPAGE_SETTINGS);
  const [banners, setBanners] = useState<HomepageBanner[]>([]);
  const [whatsappNum, setWhatsappNum] = useState(RCIConfig.whatsappNumber);

  // 3D Interactive Mouse Tilt Setup for Showcase Card
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 140 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], ["6.5deg", "-6.5deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-6.5deg", "6.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

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

    supabase
      .from("contact_settings")
      .select("whatsapp")
      .eq("id", "default")
      .single()
      .then(({ data }) => {
        if (data?.whatsapp) {
          setWhatsappNum(data.whatsapp.replace(/\D/g, ""));
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

  const whatsappInquiryUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent("Hello RCI Admissions Team, I would like to get information regarding courses, fees, and batch timings.")}`;

  // Formatted main heading with RCI suffix
  const highlightText = heroSettings.hero_highlight
    ? heroSettings.hero_highlight.includes("with RCI")
      ? heroSettings.hero_highlight
      : `${heroSettings.hero_highlight} with RCI.`
    : "With Practical IT Skills with RCI.";

  return (
    <section
      aria-label="Institute Hero"
      className="relative bg-[#050C1A] text-white overflow-hidden pt-4 sm:pt-6 pb-8 sm:pb-12"
    >
      {/* 1. Animated Gradient Background (15–25s cycle, low-opacity soft atmospheric glow) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Layer 1: Royal Blue Aurora (22s loop) */}
        <div className="absolute -top-[20%] -left-[10%] w-[720px] h-[720px] bg-gradient-to-br from-blue-600/30 via-blue-500/18 to-transparent rounded-full blur-[140px] animate-hero-mesh-1" />

        {/* Layer 2: Electric Cyan Aurora (20s loop) */}
        <div className="absolute top-[15%] -right-[10%] w-[680px] h-[680px] bg-gradient-to-bl from-cyan-400/22 via-sky-500/15 to-transparent rounded-full blur-[130px] animate-hero-mesh-2" />

        {/* Layer 3: Deep Violet Neon Glow (24s loop) */}
        <div className="absolute -bottom-[25%] left-[20%] w-[700px] h-[700px] bg-gradient-to-tr from-violet-600/22 via-purple-500/15 to-transparent rounded-full blur-[150px] animate-hero-mesh-3" />

        {/* Rotating Geometric Blueprint Ring (Subtle Architectural Tech Accent) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] pointer-events-none opacity-[0.03] select-none text-cyan-300">
          <svg viewBox="0 0 850 850" className="w-full h-full animate-[spin_120s_linear_infinite]">
            <circle cx="425" cy="425" r="400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="10 10" />
            <circle cx="425" cy="425" r="300" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="425" cy="425" r="200" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
            <line x1="425" y1="0" x2="425" y2="850" stroke="currentColor" strokeWidth="1" strokeDasharray="8 8" />
            <line x1="0" y1="425" x2="850" y2="425" stroke="currentColor" strokeWidth="1" strokeDasharray="8 8" />
          </svg>
        </div>

        {/* Subtle Micro-Grid Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
        
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050C1A]/20 to-[#050C1A]" />
      </div>

      {/* 2. Subtle Particles with Desktop Mouse Parallax (z-[1], pointer-events-none) */}
      <HeroParticles />

      {/* 3. Hero Content Container with Sequential Entrance Animation (z-10) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 py-4 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">

          {/* LEFT: Sequential Entrance Animation for Hero Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={heroContainerVariants}
            className="lg:col-span-7 space-y-4 sm:space-y-5 text-left"
          >
            
            {/* 1. Trust / Announcement Badges */}
            <motion.div variants={heroItemVariants} className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[11px] sm:text-xs font-bold text-blue-200 shadow-lg shadow-blue-950/30">
                <span className="w-5 h-5 rounded-md bg-blue-500/20 text-[#D4A72C] flex items-center justify-center border border-blue-400/30">
                  <i className="bi bi-mortarboard-fill text-xs" />
                </span>
                <span className="tracking-wider uppercase font-extrabold text-slate-100">
                  {heroSettings.hero_badge || "Online Admissions Open Session 2026-27"}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live
                </span>
              </div>

              {/* Urgency Chip */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 text-amber-200 text-[11px] font-bold shadow-xs">
                <i className="fa-solid fa-fire text-amber-400 text-xs animate-pulse" />
                <span>Next Lab Batch Starts Monday</span>
              </div>
            </motion.div>

            {/* 2. Main Heading: “Build Your Digital Future With Practical IT Skills with RCI.” */}
            <motion.h1
              variants={heroItemVariants}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[3.75rem] font-black font-display tracking-tight text-white leading-[1.12] sm:leading-[1.1]"
            >
              {heroSettings.hero_title || "Build Your Digital Future"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-[#D4A72C] drop-shadow-sm">
                {highlightText}
              </span>
            </motion.h1>

            {/* 3. Supporting Description (including Typing Tagline) */}
            <motion.div variants={heroItemVariants} className="space-y-3">
              {/* Dynamic Typing Tagline: Learn Computer Skills | Build Your Career | Get Job Ready */}
              <HeroTypingTagline />

              {/* Description Paragraph */}
              <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
                {heroSettings.hero_description ||
                  "Master modern computer applications, Tally Prime accounting, web design, and programming with 100% individual lab practice and government-recognized certifications."}
              </p>
            </motion.div>

            {/* 4. Popular Career Course Badges */}
            <motion.div variants={heroItemVariants} className="pt-1">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-cyan-300">
                  Popular Career Courses:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_COURSES.map((course, idx) => (
                  <Link
                    key={idx}
                    href="/courses"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-200 transition-all duration-200 ${course.color} hover:scale-105 active:scale-95 shadow-2xs group/chip cursor-pointer`}
                  >
                    <i className={`${course.icon} text-xs text-cyan-400 group-hover/chip:text-inherit transition-colors`} />
                    <span>{course.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* 5. CTA Buttons */}
            <motion.div
              variants={heroItemVariants}
              className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 pt-2"
            >
              <Link
                href={heroSettings.primary_cta_url || "/courses"}
                className="relative overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-r from-[#155EEF] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:from-blue-700 active:to-indigo-800 text-white px-4 sm:px-7 py-3.5 rounded-2xl font-black text-xs sm:text-base transition-all shadow-xl shadow-blue-600/35 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-98 min-h-[48px] group/btn cursor-pointer"
              >
                {/* Light Sweep Reflection */}
                <span className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-12 -translate-x-full group-hover/btn:translate-x-[350%] transition-transform duration-700 pointer-events-none" />
                <i className="fa-solid fa-book-open text-xs sm:text-sm" />
                <span className="truncate">{heroSettings.primary_cta_text || "Explore Courses"}</span>
                <i className="fa-solid fa-arrow-right text-[11px] transition-transform group-hover/btn:translate-x-1" />
              </Link>

              <Link
                href={heroSettings.secondary_cta_url || "/student/login"}
                className="flex items-center justify-center gap-2 bg-white/95 hover:bg-white text-[#07152F] px-4 sm:px-6 py-3.5 rounded-2xl font-black text-xs sm:text-base transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-98 min-h-[48px]"
              >
                <i className="fa-solid fa-graduation-cap text-xs sm:text-sm text-[#155EEF]" />
                <span className="truncate">{heroSettings.secondary_cta_text || "Student Login"}</span>
              </Link>

              <Link
                href="/verify"
                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/20 text-white px-4 sm:px-5 py-3.5 rounded-2xl font-bold text-xs sm:text-base transition-all backdrop-blur-md active:scale-98 min-h-[48px]"
              >
                <i className="fa-solid fa-shield-halved text-[#D4A72C] text-sm" />
                <span className="truncate">Verify Certificate</span>
              </Link>
            </motion.div>

            {/* 6. Supporting Trust & Contact Information */}
            <motion.div variants={heroItemVariants} className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <i className="fa-brands fa-whatsapp text-emerald-400 text-sm" />
                <span>Have questions about fees or syllabus?</span>
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-bold hover:underline"
                >
                  Chat with Counselor →
                </a>
              </div>

              {/* 3 Micro-Proof Badges */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-slate-200">
                  <i className="fa-solid fa-check text-emerald-400 text-[11px]" />
                  100% Practical Desktop Labs
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-slate-200">
                  <i className="fa-solid fa-check text-emerald-400 text-[11px]" />
                  ISO 9001:2015 & MSME Accredited
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-slate-200">
                  <i className="fa-solid fa-check text-emerald-400 text-[11px]" />
                  Small Batches: Max 15 Seats
                </span>
              </div>
            </motion.div>

          </motion.div>

          {/* RIGHT: Interactive 3D Showcase Card with Floating Badges */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="lg:col-span-5 relative mt-4 sm:mt-0 [perspective:1200px]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative"
            >
              {/* Glowing Border Halo behind card */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/35 via-cyan-400/30 to-violet-500/35 rounded-[2.5rem] blur-2xl opacity-75 pointer-events-none" />

              {/* Floating Top-Left Badge: Rating & Alumni */}
              <div
                style={{ transform: "translateZ(40px)" }}
                className="hidden sm:inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#07152F]/95 backdrop-blur-xl border border-white/25 text-white shadow-2xl absolute -top-4 -left-4 z-30 animate-gentle-float pointer-events-none"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30 shrink-0">
                  <i className="fa-solid fa-star text-xs" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1 text-[11px] font-black leading-tight">
                    <span>4.9 / 5.0 Rating</span>
                    <span className="text-amber-400 text-[10px]">★★★★★</span>
                  </div>
                  <p className="text-[10px] text-slate-300">1,200+ Verified Reviews</p>
                </div>
              </div>

              {/* Floating Bottom-Right Badge: 1:1 Lab Seat */}
              <div
                style={{ transform: "translateZ(40px)" }}
                className="hidden sm:inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#07152F]/95 backdrop-blur-xl border border-white/25 text-white shadow-2xl absolute -bottom-4 -right-3 z-30 animate-gentle-float-reverse pointer-events-none"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30 shrink-0">
                  <i className="fa-solid fa-desktop text-xs" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5 text-[11px] font-black leading-tight">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>1:1 Dedicated PC</span>
                  </div>
                  <p className="text-[10px] text-slate-300">Individual Student Seat</p>
                </div>
              </div>

              {/* Floating Top-Right Mini Badge: ISO Quality */}
              <div
                style={{ transform: "translateZ(30px)" }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#07152F]/90 backdrop-blur-md border border-cyan-400/40 text-cyan-300 shadow-xl absolute -top-3.5 right-6 z-30 pointer-events-none text-[11px] font-bold"
              >
                <i className="bi bi-shield-check text-[#D4A72C] text-xs" />
                <span>ISO 9001:2015</span>
              </div>

              {/* Main Showcase Swiper Box with Illuminated Bevel */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-b from-white/10 to-slate-900/90 p-1.5 sm:p-2 backdrop-blur-xl group/banner">
                
                {/* Dynamic Gradient Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-[#D4A72C] z-20" />

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
                  className="relative aspect-[4/3] xs:aspect-[16/10] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950"
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

                        {/* Cinematic Multi-Stop Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050C1A] via-[#050C1A]/30 to-transparent" />

                        {/* Banner Caption with Illuminated Tag */}
                        {(banner.title || banner.description) && (
                          <div className="absolute bottom-3 sm:bottom-4 left-3.5 right-3.5 text-left z-10">
                            {banner.title && (
                              <h3 className="text-xs sm:text-base font-extrabold text-white mb-0.5 drop-shadow-md flex items-center gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-blue-500/80 text-white flex items-center justify-center text-[9px] shrink-0">
                                  <i className="fa-solid fa-award" />
                                </span>
                                <span>{banner.title}</span>
                              </h3>
                            )}
                            {banner.description && (
                              <p className="text-[10.5px] sm:text-xs text-slate-200 line-clamp-1 sm:line-clamp-2 drop-shadow font-normal">
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
                        className="hero-swiper-prev hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-[#155EEF] text-white border border-white/20 items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover/banner:opacity-100 cursor-pointer shadow-lg"
                      >
                        <i className="fa-solid fa-chevron-left text-xs" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next slide"
                        className="hero-swiper-next hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-[#155EEF] text-white border border-white/20 items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover/banner:opacity-100 cursor-pointer shadow-lg"
                      >
                        <i className="fa-solid fa-chevron-right text-xs" />
                      </button>
                    </>
                  )}
                </Swiper>

              </div>
            </motion.div>
          </div>

        </div>

        {/* 4. Bottom Fast-Fact Ribbon (Integrated into Hero Base) */}
        <div className="mt-8 sm:mt-12 pt-6 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-cyan-400 border border-blue-400/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-graduation-cap text-base" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-white leading-tight">10,000+</h4>
                <p className="text-[11px] text-slate-400">Students Certified</p>
              </div>
            </div>

            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-400/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-laptop-code text-base" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-white leading-tight">1:1 Practical</h4>
                <p className="text-[11px] text-slate-400">Individual PC Desks</p>
              </div>
            </div>

            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-400/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-stamp text-base" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-white leading-tight">ISO 9001:2015</h4>
                <p className="text-[11px] text-slate-400">Govt. Registered MSME</p>
              </div>
            </div>

            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-400/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-qrcode text-base" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-white leading-tight">Online QR</h4>
                <p className="text-[11px] text-slate-400">Verifiable Diplomas</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
