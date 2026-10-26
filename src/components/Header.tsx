"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { 
  Menu, X, ChevronDown, ChevronRight, BookOpen, GraduationCap, 
  Award, Home, User, PhoneCall, ShieldCheck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AnnouncementBar from "@/components/AnnouncementBar";
import NoticeRenderer from "@/components/notice/NoticeRenderer";
import { 
  DEFAULT_SITE_SETTINGS, 
  DEFAULT_CONTACT_SETTINGS, 
  DEFAULT_SOCIAL_LINKS, 
  DEFAULT_NAV_LINKS 
} from "@/lib/cms-defaults";
import { NavigationLink, SocialLink } from "@/types/cms";

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getSocialIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("whatsapp")) return <i className="fa-brands fa-whatsapp text-emerald-400 text-sm" aria-hidden="true" />;
  if (p.includes("youtube")) return <i className="fa-brands fa-youtube text-red-500 text-sm" aria-hidden="true" />;
  if (p.includes("facebook") || p.includes("fb")) return <i className="fa-brands fa-facebook text-blue-400 text-sm" aria-hidden="true" />;
  if (p.includes("instagram") || p.includes("insta")) return <i className="fa-brands fa-instagram text-pink-400 text-sm" aria-hidden="true" />;
  if (p.includes("telegram")) return <i className="fa-brands fa-telegram text-sky-400 text-sm" aria-hidden="true" />;
  if (p.includes("twitter") || p.includes("x")) return <i className="fa-brands fa-x-twitter text-slate-300 text-sm" aria-hidden="true" />;
  if (p.includes("linkedin")) return <i className="fa-brands fa-linkedin text-blue-400 text-sm" aria-hidden="true" />;
  if (p.includes("github")) return <i className="fa-brands fa-github text-slate-300 text-sm" aria-hidden="true" />;
  return <i className="bi bi-globe2 text-slate-300 text-sm" aria-hidden="true" />;
}

function getNavIcon(url: string, label: string) {
  const l = label.toLowerCase();
  const u = url.toLowerCase();
  if (u === "/" || l === "home") return <i className="bi bi-house-door-fill text-xs" />;
  if (u === "/about" || l.includes("about")) return <i className="bi bi-info-circle-fill text-xs" />;
  if (u.includes("course") || l.includes("course")) return <i className="fa-solid fa-graduation-cap text-xs" />;
  if (u.includes("verify") || l.includes("verify") || l.includes("certificate")) return <i className="bi bi-patch-check-fill text-amber-500 text-xs" />;
  if (u.includes("admission") || l.includes("admission") || l.includes("apply")) return <i className="fa-solid fa-file-signature text-xs" />;
  if (u.includes("notice") || l.includes("notice")) return <i className="bi bi-megaphone-fill text-xs" />;
  if (u.includes("contact") || l.includes("contact")) return <i className="bi bi-telephone-fill text-xs" />;
  return <i className="bi bi-chevron-right text-[10px]" />;
}

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [mobileCourseOpen, setMobileCourseOpen] = useState(false);
  const [courses, setCourses] = useState<{ id: string; course_name: string; slug?: string }[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [siteSettings, setSiteSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [contactSettings, setContactSettings] = useState(DEFAULT_CONTACT_SETTINGS);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(DEFAULT_SOCIAL_LINKS);
  const [announcement, setAnnouncement] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [headerNavLinks, setHeaderNavLinks] = useState<NavigationLink[]>([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // 1. Fetch site settings
    supabase
      .from("site_settings")
      .select("site_name, short_name, tagline, logo_url")
      .eq("id", "default")
      .single()
      .then(({ data }) => {
        if (data) {
          setSiteSettings((prev) => ({
            ...prev,
            site_name: data.site_name || prev.site_name,
            short_name: data.short_name || prev.short_name,
            tagline: data.tagline || prev.tagline,
            logo_url: data.logo_url || prev.logo_url,
          }));
        }
      });

    // 2. Fetch contact settings
    supabase
      .from("contact_settings")
      .select("*")
      .eq("id", "default")
      .single()
      .then(({ data }) => {
        if (data) setContactSettings((prev) => ({ ...prev, ...data }));
      });

    // 3. Fetch social links
    supabase
      .from("social_links")
      .select("*")
      .eq("is_active", true)
      .order("display_order")
      .then(({ data }) => {
        if (data && data.length > 0) setSocialLinks(data);
      });

    // 4. Fetch active website announcements
    supabase
      .from("website_announcements")
      .select("*")
      .eq("is_enabled", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setAnnouncements(data);
      });

    // 5. Fetch announcement settings fallback
    supabase
      .from("announcement_settings")
      .select("*")
      .eq("id", "default")
      .single()
      .then(({ data }) => {
        if (data) setAnnouncement(data);
      });

    // 6. Fetch navigation links (CANONICAL SOURCE)
    supabase
      .from("navigation_links")
      .select("*")
      .eq("location", "header")
      .eq("is_active", true)
      .order("display_order")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setHeaderNavLinks(data);
        }
      });

    // 7. Fetch courses for dropdown
    supabase
      .from("courses")
      .select("id, course_name, slug")
      .or("status.eq.Active,status.is.null")
      .order("course_name")
      .then(({ data }) => {
        setCourses(data || []);
      });
  }, []);

  // Dropdown accessibility: outside click & Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCoursesOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCoursesOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setCoursesOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setCoursesOpen(false), 180);
  };

  // Canonical navigation items: Use headerNavLinks if available, else controlled fallback
  const canonicalNavItems = useMemo(() => {
    if (headerNavLinks.length > 0) return headerNavLinks;
    return DEFAULT_NAV_LINKS.filter((l) => l.location === "header");
  }, [headerNavLinks]);

  const topStripNotices = announcements.filter((n) => !n.display_format || n.display_format === "top_strip");
  const tickerNotices = announcements.filter((n) => n.display_format === "ticker");
  const popupNotice = announcements.find((n) => n.display_format === "popup");
  const stickyNotice = announcements.find((n) => n.display_format === "sticky");

  const cleanPhone = contactSettings.phone ? contactSettings.phone.replace(/\s+/g, "") : "";
  const cleanWhatsapp = contactSettings.whatsapp ? contactSettings.whatsapp.replace(/\D/g, "") : "";
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Hello RCI, I have an inquiry about computer courses.")}`;

  return (
    <>
      {/* Off-header floating notices */}
      {popupNotice && <NoticeRenderer notice={popupNotice} forcedFormat="popup" />}
      {stickyNotice && <NoticeRenderer notice={stickyNotice} forcedFormat="sticky" />}

      <header className="sticky top-0 left-0 right-0 z-40 transition-all duration-300">
        
        {/* ============================================================ */}
        {/* 1. TOP INFORMATION STRIP                                     */}
        {/* ============================================================ */}
        <div 
          className={`bg-[#07152F] text-slate-200 border-b border-white/10 transition-all duration-300 ${
            isScrolled ? "hidden md:block h-8 py-1 opacity-95" : "h-8 sm:h-9 py-1"
          }`}
        >
          <div className="container mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-3 text-[11px] sm:text-xs">
            {/* Left: Address / Location + Trust Badge */}
            <div className="flex items-center gap-2 text-slate-300 truncate">
              <span className="flex items-center gap-1.5 font-medium truncate">
                <i className="fa-solid fa-location-dot text-[#D4A72C] text-xs shrink-0 animate__animated animate__pulse animate__infinite" />
                <span className="truncate">
                  {(contactSettings.address || "Sanjay Nagar Cantt, Kanpur, UP")
                    .replace(/Uttar Pradesh/gi, "UP")}
                </span>
              </span>

              <span className="hidden xl:inline-flex items-center gap-1 bg-white/10 text-blue-200 px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/10">
                <i className="bi bi-patch-check-fill text-[#D4A72C] text-[10px]" />
                ISO 9001:2015 Certified
              </span>
            </div>

            {/* Right: Phone, WhatsApp, Email, Socials */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {contactSettings.email && (
                <a
                  href={`mailto:${contactSettings.email}`}
                  className="hidden md:inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                >
                  <i className="bi bi-envelope-fill text-blue-400 text-xs" />
                  <span className="truncate max-w-[180px]">{contactSettings.email}</span>
                </a>
              )}

              {contactSettings.phone && (
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors font-semibold"
                >
                  <i className="fa-solid fa-phone-volume text-emerald-400 text-xs" />
                  <span>{contactSettings.phone}</span>
                </a>
              )}

              {cleanWhatsapp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-500/30 transition-all font-bold"
                >
                  <i className="fa-brands fa-whatsapp text-emerald-400 text-sm" />
                  <span>WhatsApp</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </a>
              )}

              {socialLinks.length > 0 && (
                <div className="hidden lg:flex items-center gap-2 border-l border-white/15 pl-3">
                  {socialLinks.slice(0, 4).map((soc) => (
                    <a
                      key={soc.id}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-[#D4A72C] transition-all hover:scale-110"
                      title={soc.platform}
                      aria-label={`Visit RCI on ${soc.platform}`}
                    >
                      {getSocialIcon(soc.platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. MAIN ULTRA-BEAUTIFUL NAVBAR WITH GLASSMORPHISM & EFFECTS   */}
        {/* ============================================================ */}
        <div
          className={`transition-all duration-300 relative ${
            isScrolled
              ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-lg shadow-blue-950/5 h-[60px] sm:h-[68px]"
              : "bg-white/95 backdrop-blur-md border-b border-slate-200/70 h-[64px] sm:h-[76px]"
          }`}
        >
          {/* Subtle Dynamic Bottom Glow Gradient Line when scrolled */}
          {isScrolled && (
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#155EEF] via-sky-400 to-[#D4A72C] opacity-90 transition-opacity" />
          )}

          <div className="container mx-auto px-3.5 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-3">
            
            {/* Institute Logo & Name Branding with Hover Animation */}
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl p-1 shrink min-w-0"
            >
              <div className="relative p-1 rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 border border-slate-200/80 shadow-2xs group-hover:shadow-md group-hover:border-blue-300 transition-all duration-300">
                <Image
                  src={siteSettings.logo_url || "/logo.png"}
                  alt={siteSettings.site_name}
                  width={44}
                  height={44}
                  className="object-contain h-8 sm:h-10 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105"
                  priority
                  unoptimized
                />
              </div>
              
              {/* Mobile Institute Name */}
              <div className="sm:hidden flex items-center min-w-0">
                <span className="text-xs xs:text-[13px] font-black text-[#07152F] tracking-tight leading-tight truncate">
                  {siteSettings.site_name || "Rohit Computer Institute"}
                  {siteSettings.short_name && !siteSettings.site_name.includes(siteSettings.short_name) ? (
                    <span className="text-blue-600 font-extrabold ml-1">({siteSettings.short_name})</span>
                  ) : (
                    !siteSettings.site_name.includes("RCI") && (
                      <span className="text-blue-600 font-extrabold ml-1">(RCI)</span>
                    )
                  )}
                </span>
              </div>

              {/* Desktop Full Branding */}
              <div className="hidden sm:flex flex-col justify-center min-w-0">
                <span className="text-sm sm:text-base font-black font-display text-[#07152F] tracking-tight leading-tight group-hover:text-[#155EEF] transition-colors truncate max-w-[260px] lg:max-w-[320px]">
                  {siteSettings.site_name}
                  {siteSettings.short_name && !siteSettings.site_name.includes(siteSettings.short_name) && (
                    <span className="text-blue-600 font-extrabold ml-1">({siteSettings.short_name})</span>
                  )}
                </span>
                {siteSettings.tagline && (
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-blue-600 tracking-wider uppercase truncate max-w-[240px] leading-tight mt-0.5">
                    {siteSettings.tagline}
                  </span>
                )}
              </div>
            </Link>

            {/* Desktop Navigation Links with Pill Indicator & Hover Effects */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {canonicalNavItems.map((item) => {
                const isCourses = item.url === "/courses" || item.label.toLowerCase() === "courses";
                const isActive = pathname === item.url || (isCourses && pathname.startsWith("/courses"));

                if (isCourses) {
                  return (
                    <div
                      key={item.id || item.url}
                      ref={dropdownRef}
                      className="relative"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        type="button"
                        onClick={() => setCoursesOpen((prev) => !prev)}
                        aria-expanded={coursesOpen}
                        aria-haspopup="menu"
                        className={`group relative flex items-center gap-1.5 text-xs xl:text-sm font-bold tracking-tight transition-all rounded-xl px-3 py-2 cursor-pointer ${
                          isActive || coursesOpen
                            ? "text-[#155EEF] bg-blue-50/90 shadow-2xs border border-blue-200/60"
                            : "text-slate-700 hover:text-[#155EEF] hover:bg-slate-100/70"
                        }`}
                      >
                        <i className={`fa-solid fa-graduation-cap text-xs transition-colors ${
                          isActive || coursesOpen ? "text-[#155EEF]" : "text-slate-400 group-hover:text-[#155EEF]"
                        }`} />
                        <span>{item.label}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          coursesOpen ? "rotate-180 text-[#155EEF]" : "text-slate-400 group-hover:text-[#155EEF]"
                        }`} />
                        {/* Hover bar indicator */}
                        <span className="absolute bottom-1 left-3 right-3 h-[2px] bg-gradient-to-r from-[#155EEF] to-sky-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                      </button>

                      {/* Mega Dropdown Card with Glassmorphism */}
                      {coursesOpen && (
                        <div
                          role="menu"
                          aria-label="Courses menu"
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[360px] bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200/90 py-3 px-2.5 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                        >
                          <div className="px-3 py-2 border-b border-slate-100 mb-2 flex items-center justify-between">
                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                              <i className="bi bi-stars text-amber-500" />
                              Programs Offered
                            </p>
                            <span className="text-[10px] bg-blue-50 text-[#155EEF] border border-blue-100 px-2 py-0.5 rounded-full font-bold">
                              {courses.length} Programs
                            </span>
                          </div>

                          <div className="max-h-[320px] overflow-y-auto space-y-1 pr-1">
                            {courses.map((course) => {
                              const courseSlug = course.slug?.trim() || toSlug(course.course_name);
                              const courseActive = pathname === `/courses/${courseSlug}`;

                              return (
                                <Link
                                  key={course.id}
                                  href={`/courses/${courseSlug}`}
                                  role="menuitem"
                                  onClick={() => setCoursesOpen(false)}
                                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group/item ${
                                    courseActive
                                      ? "bg-blue-50 text-blue-600 font-bold border border-blue-100"
                                      : "hover:bg-blue-50/70 text-slate-700 hover:text-[#155EEF]"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div
                                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                                        courseActive
                                          ? "bg-[#155EEF] text-white shadow-xs"
                                          : "bg-slate-100 text-slate-500 group-hover/item:bg-[#155EEF] group-hover/item:text-white"
                                      }`}
                                    >
                                      <BookOpen className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-semibold leading-snug line-clamp-1 group-hover/item:translate-x-0.5 transition-transform">
                                      {course.course_name}
                                    </span>
                                  </div>

                                  <i className="fa-solid fa-arrow-right text-[10px] text-blue-600 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all shrink-0" />
                                </Link>
                              );
                            })}
                          </div>

                          <div className="border-t border-slate-100 mt-2.5 pt-2 px-1">
                            <Link
                              href="/courses"
                              role="menuitem"
                              onClick={() => setCoursesOpen(false)}
                              className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-[#155EEF] text-xs font-extrabold rounded-xl transition-all shadow-2xs group/all"
                            >
                              <span>Explore All Courses</span>
                              <i className="fa-solid fa-arrow-right text-xs group-hover/all:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id || item.url}
                    href={item.url}
                    target={item.open_new_tab ? "_blank" : undefined}
                    rel={item.open_new_tab ? "noopener noreferrer" : undefined}
                    className={`group relative flex items-center gap-1.5 text-xs xl:text-sm font-bold tracking-tight rounded-xl px-3 py-2 transition-all ${
                      isActive
                        ? "text-[#155EEF] bg-blue-50/90 shadow-2xs border border-blue-200/60"
                        : "text-slate-700 hover:text-[#155EEF] hover:bg-slate-100/70"
                    }`}
                  >
                    <span className={`transition-colors ${
                      isActive ? "text-[#155EEF]" : "text-slate-400 group-hover:text-[#155EEF]"
                    }`}>
                      {getNavIcon(item.url, item.label)}
                    </span>
                    <span>{item.label}</span>
                    {/* Animated underline indicator */}
                    <span className="absolute bottom-1 left-3 right-3 h-[2px] bg-gradient-to-r from-[#155EEF] to-sky-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Action Buttons: Student Login, Admin Login & Shimmer Apply Now */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <Link
                href="/student/login"
                className="flex items-center gap-1.5 border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-800 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-xs hover:border-blue-400 group"
              >
                <i className="fa-solid fa-graduation-cap text-[#155EEF] text-xs transition-transform group-hover:scale-110" />
                <span>Student Login</span>
              </Link>

              <Link
                href="/admin/login"
                className="flex items-center gap-1.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-[#155EEF] px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs"
                title="Admin Management Portal"
              >
                <i className="bi bi-shield-lock-fill text-slate-500 text-xs" />
                <span>Admin</span>
              </Link>

              {/* Apply Now with Shimmer Light Sweep Effect */}
              <Link
                href="/admission"
                className="relative overflow-hidden group flex items-center gap-2 bg-gradient-to-r from-[#155EEF] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md shadow-blue-600/30 hover:shadow-lg hover:shadow-blue-500/40 hover:scale-[1.03] active:scale-98"
              >
                {/* Diagonal Shimmer Sweep */}
                <span className="absolute inset-0 w-1/2 h-full bg-white/25 -skew-x-12 -translate-x-full group-hover:translate-x-[350%] transition-transform duration-700 pointer-events-none" />
                <i className="fa-solid fa-file-signature text-xs" />
                <span>Apply Now</span>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <div className="lg:hidden flex items-center shrink-0">
              <button
                type="button"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                className="p-2.5 text-slate-700 hover:text-[#155EEF] hover:bg-blue-50 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer border border-transparent hover:border-blue-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 animate__animated animate__rotateIn animate__faster" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. ANNOUNCEMENT BAR                                           */}
        {/* ============================================================ */}
        <AnnouncementBar notices={topStripNotices} settings={announcement} />
        {tickerNotices.length > 0 && <NoticeRenderer notices={tickerNotices} forcedFormat="ticker" />}

        {/* Mobile Slide-down Drawer with Glassmorphism */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute left-0 right-0 top-full bg-white/98 backdrop-blur-2xl border-b border-slate-200 shadow-2xl py-4 px-4 sm:px-6 flex flex-col gap-2 max-h-[calc(100vh-120px)] overflow-y-auto animate-in slide-in-from-top-3 duration-200 z-50">
            {canonicalNavItems.map((item) => {
              const isCourses = item.url === "/courses" || item.label.toLowerCase() === "courses";
              const isActive = pathname === item.url || (isCourses && pathname.startsWith("/courses"));

              if (isCourses) {
                return (
                  <div key={item.id || item.url} className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      aria-expanded={mobileCourseOpen}
                      onClick={() => setMobileCourseOpen(!mobileCourseOpen)}
                      className="flex items-center justify-between w-full p-3.5 bg-slate-50 text-slate-800 text-sm font-bold min-h-[44px]"
                    >
                      <span className="flex items-center gap-2.5">
                        <i className="fa-solid fa-graduation-cap text-[#155EEF]" />
                        <span>{item.label} Offered</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileCourseOpen ? "rotate-180 text-blue-600" : ""}`} />
                    </button>

                    {mobileCourseOpen && (
                      <div className="p-2 bg-white space-y-1 border-t border-slate-100">
                        {courses.map((course) => {
                          const slug = course.slug || toSlug(course.course_name);
                          const active = pathname === `/courses/${slug}`;
                          return (
                            <Link
                              key={course.id}
                              href={`/courses/${slug}`}
                              onClick={() => {
                                setMobileCourseOpen(false);
                                setMobileMenuOpen(false);
                              }}
                              className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold transition-colors min-h-[44px] ${
                                active ? "bg-blue-50 text-[#155EEF] font-bold" : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full shrink-0 ${active ? "bg-[#155EEF]" : "bg-slate-300"}`} />
                              <span className="line-clamp-2 leading-snug">{course.course_name}</span>
                            </Link>
                          );
                        })}
                        <Link
                          href="/courses"
                          onClick={() => {
                            setMobileCourseOpen(false);
                            setMobileMenuOpen(false);
                          }}
                          className="text-center py-2.5 text-[#155EEF] text-xs font-black uppercase tracking-wider bg-blue-50/80 hover:bg-blue-100 rounded-xl mt-1 min-h-[44px] flex items-center justify-center gap-1.5"
                        >
                          <span>View All Courses</span>
                          <i className="fa-solid fa-arrow-right text-[10px]" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id || item.url}
                  href={item.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold min-h-[44px] transition-all ${
                    isActive
                      ? "bg-blue-50 text-[#155EEF] shadow-2xs border border-blue-200/60"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#155EEF]"
                  }`}
                >
                  <span className={isActive ? "text-[#155EEF]" : "text-slate-400"}>
                    {getNavIcon(item.url, item.label)}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Auth and Action Buttons */}
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/student/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 border border-slate-200 text-slate-800 bg-white py-2.5 rounded-xl font-bold text-xs shadow-2xs min-h-[44px]"
                >
                  <i className="fa-solid fa-graduation-cap text-[#155EEF] text-xs" />
                  <span>Student Login</span>
                </Link>

                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 border border-slate-200 text-slate-800 bg-slate-50 py-2.5 rounded-xl font-bold text-xs shadow-2xs min-h-[44px]"
                >
                  <i className="bi bi-shield-lock-fill text-slate-600 text-xs" />
                  <span>Admin</span>
                </Link>
              </div>

              <Link
                href="/admission"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#155EEF] to-blue-600 text-white py-3 rounded-xl font-black text-sm shadow-md shadow-blue-500/25 min-h-[44px]"
              >
                <i className="fa-solid fa-file-signature text-xs" />
                <span>Apply for Admission</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
