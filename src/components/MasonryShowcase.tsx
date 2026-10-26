"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface MasonryCardItem {
  id: string;
  category: "labs" | "certificates" | "projects" | "campus";
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  badgeIcon: string;
  imageUrl: string;
  stats?: string;
  ctaText?: string;
  ctaUrl?: string;
  aspectClass: string;
}

const SHOWCASE_ITEMS: MasonryCardItem[] = [
  {
    id: "lab-workstations",
    category: "labs",
    title: "High-Performance Computer Lab",
    subtitle: "1:1 Dedicated PC per Student",
    description: "Fully air-conditioned lab with modern high-speed Core i5/i7 workstations, uninterrupted power backup, and fast optical fiber internet for seamless practical learning.",
    badge: "Practical Infrastructure",
    badgeIcon: "bi bi-display",
    imageUrl: "/banner.png",
    stats: "30+ Modern PCs",
    ctaText: "Explore Courses",
    ctaUrl: "/courses",
    aspectClass: "aspect-[4/3]",
  },
  {
    id: "qr-certificate-trust",
    category: "certificates",
    title: "ISO 9001:2015 & QR Verifiable Diplomas",
    subtitle: "Recognized Nationwide",
    description: "Every student receives a tamper-proof digital certificate featuring an encrypted QR code verifiable 24/7 on our central government-grade verification portal.",
    badge: "Official Credential",
    badgeIcon: "fa-solid fa-certificate",
    imageUrl: "/banner.png",
    stats: "100% Verifiable",
    ctaText: "Verify Certificate",
    ctaUrl: "/verify",
    aspectClass: "aspect-[16/10]",
  },
  {
    id: "tally-gst-projects",
    category: "projects",
    title: "Tally Prime & GST Real Billing Practice",
    subtitle: "Hands-on Accounting Mastery",
    description: "Students work on real company vouchers, B2B invoices, GST returns, e-way bills, and balance sheet finalization under certified accountant guidance.",
    badge: "Industry Skills",
    badgeIcon: "fa-solid fa-calculator",
    imageUrl: "/banner.png",
    stats: "Real Case Studies",
    ctaText: "View Tally Course",
    ctaUrl: "/courses",
    aspectClass: "aspect-[4/3]",
  },
  {
    id: "web-dev-coding",
    category: "projects",
    title: "Full-Stack Web Coding & UI Design",
    subtitle: "Building Live Web Projects",
    description: "Master modern HTML5, CSS3, JavaScript, React, and backend database connectivity by developing real web applications and interactive portals.",
    badge: "Tech Curriculum",
    badgeIcon: "fa-solid fa-code",
    imageUrl: "/banner.png",
    stats: "Live Projects",
    ctaText: "Learn Web Dev",
    ctaUrl: "/courses",
    aspectClass: "aspect-[16/11]",
  },
  {
    id: "student-felicitation",
    category: "campus",
    title: "Certificate Convocation & Student Honors",
    subtitle: "Celebrating Academic Excellence",
    description: "Annual award ceremonies honoring top scorers in DCA, ADCA, and accounting with trophies, letters of recommendation, and placement assistance.",
    badge: "Student Success",
    badgeIcon: "fa-solid fa-trophy",
    imageUrl: "/banner.png",
    stats: "5000+ Alumni",
    ctaText: "Student Portal",
    ctaUrl: "/student/login",
    aspectClass: "aspect-[4/3]",
  },
  {
    id: "typing-speed-arena",
    category: "labs",
    title: "Bilingual Typing & Speed Testing Arena",
    subtitle: "Hindi (Kruti Dev / Mangal) & English",
    description: "Dedicated speed typing software and timed mock tests preparing students for high-scoring government typist, clerical, and banking examinations.",
    badge: "Exam Readiness",
    badgeIcon: "fa-solid fa-keyboard",
    imageUrl: "/banner.png",
    stats: "45+ WPM Target",
    ctaText: "Apply Now",
    ctaUrl: "/admission",
    aspectClass: "aspect-[16/10]",
  },
];

type CategoryFilter = "all" | "labs" | "certificates" | "projects" | "campus";

export default function MasonryShowcase() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");

  const filteredItems = activeFilter === "all"
    ? SHOWCASE_ITEMS
    : SHOWCASE_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <section aria-labelledby="showcase-heading" className="py-12 sm:py-20 bg-white border-b border-slate-200/80 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-black uppercase tracking-wider text-[#155EEF] mb-3 animate__animated animate__fadeIn">
            <i className="bi bi-stars text-[#D4A72C] text-sm animate__animated animate__pulse animate__infinite" />
            <span>Institute Highlights &amp; Life</span>
          </div>
          
          <h2 id="showcase-heading" className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-[#07152F] tracking-tight leading-tight">
            Explore Institute Infrastructure &amp; Projects
          </h2>
          
          <p className="text-xs sm:text-base text-slate-600 mt-2 font-normal leading-relaxed">
            Take a look inside Rohit Computer Institute: modern lab systems, hands-on software training, and recognized student credentials.
          </p>

          {/* Interactive Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              { id: "all", label: "All Highlights", icon: "bi bi-grid-fill" },
              { id: "labs", label: "Computer Labs", icon: "bi bi-display" },
              { id: "certificates", label: "Certifications", icon: "fa-solid fa-certificate" },
              { id: "projects", label: "Practical Projects", icon: "fa-solid fa-laptop-code" },
              { id: "campus", label: "Student Life", icon: "fa-solid fa-award" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as CategoryFilter)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-[#155EEF] text-white shadow-md shadow-blue-500/25 scale-[1.02]"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <i className={`${tab.icon} text-xs`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Masonry Layout */}
        <div className="masonry-columns">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="masonry-item animate__animated animate__fadeInUp"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 group flex flex-col justify-between">
                
                {/* Visual Image with Overlay */}
                <div className={`relative ${item.aspectClass} w-full overflow-hidden bg-slate-900`}>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07152F] via-[#07152F]/40 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs text-[#07152F] text-[10.5px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
                      <i className={`${item.badgeIcon} text-[#155EEF] text-[10px]`} />
                      <span>{item.badge}</span>
                    </span>
                  </div>

                  {/* Top Right Stat */}
                  {item.stats && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-amber-300 border border-white/15 text-[10.5px] font-black px-2.5 py-0.5 rounded-md">
                        <i className="bi bi-patch-check-fill text-amber-400 text-xs" />
                        <span>{item.stats}</span>
                      </span>
                    </div>
                  )}

                  {/* Bottom Image Overlay Title */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 text-left">
                    <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider block mb-0.5">
                      {item.subtitle}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white leading-snug drop-shadow-sm group-hover:text-sky-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-4">
                    {item.description}
                  </p>

                  {item.ctaUrl && (
                    <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                      <Link
                        href={item.ctaUrl}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:text-blue-700 transition-colors group/btn"
                      >
                        <span>{item.ctaText || "Learn More"}</span>
                        <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover/btn:translate-x-1" />
                      </Link>

                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <i className="bi bi-shield-check text-emerald-500" />
                        <span>Verified</span>
                      </span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
