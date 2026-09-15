"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { 
  Menu, X, ChevronDown, ChevronRight, BookOpen, GraduationCap, 
  Award, Home, User, PhoneCall, ShieldCheck, MapPin, Mail, Phone,
  MessageCircle, Globe
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
  return <Globe className="w-3.5 h-3.5" aria-hidden="true" />;
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
    hoverTimeout.current = setTimeout(() => setCoursesOpen(false), 150);
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

      <header className="sticky top-0 left-0 right-0 z-40 bg-white shadow-2xs transition-all duration-300">
        {/* ============================================================ */}
        {/* 1. TOP CONTACT / INFORMATION STRIP (~34px height)            */}
        {/* ============================================================ */}
        <div 
          className={`bg-[#07152F] text-slate-200 border-b border-white/10 transition-all duration-300 ${
            isScrolled ? "hidden md:block h-8 py-1 opacity-95" : "h-8 sm:h-9 py-1"
          }`}
        >
          <div className="container mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-3 text-[11px] sm:text-xs">
            {/* Left: Address / Location */}
            <div className="flex items-center gap-1.5 text-slate-300 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#D4A72C] shrink-0" />
              <span className="truncate font-medium">
                {contactSettings.address || "Sanjay Nagar Cantt, Kanpur, Uttar Pradesh"}
              </span>
            </div>

            {/* Right: Phone, WhatsApp, Email, Socials */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {contactSettings.email && (
                <a
                  href={`mailto:${contactSettings.email}`}
                  className="hidden md:inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span className="truncate max-w-[180px]">{contactSettings.email}</span>
                </a>
              )}

              {contactSettings.phone && (
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors font-semibold"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{contactSettings.phone}</span>
                </a>
              )}

              {cleanWhatsapp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 transition-colors font-bold"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              )}

              {socialLinks.length > 0 && (
                <div className="hidden lg:flex items-center gap-2 border-l border-white/15 pl-3">
                  {socialLinks.slice(0, 3).map((soc) => (
                    <a
                      key={soc.id}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-[#D4A72C] transition-colors p-0.5"
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
        {/* 2. MAIN COMPACT NAVBAR (h-14 sm:h-[70px])                    */}
        {/* ============================================================ */}
        <div
          className={`transition-all duration-300 ${
            isScrolled
              ? "bg-white/98 backdrop-blur-md border-b border-slate-200/90 h-[56px] sm:h-[66px]"
              : "bg-white border-b border-slate-200/70 h-[58px] sm:h-[72px]"
          }`}
        >
          <div className="container mx-auto px-3.5 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-3">
            
            {/* Institute Compact Logo & Name (Single line on mobile, CMS driven) */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl p-0.5 shrink-0 min-w-0"
            >
              <Image
                src={siteSettings.logo_url || "/logo.png"}
                alt={siteSettings.site_name}
                width={40}
                height={40}
                className="object-contain h-8 sm:h-10 w-auto shrink-0 transition-transform group-hover:scale-105"
                priority
                unoptimized
              />
              
              {/* Mobile Single-line Institute Name */}
              <div className="sm:hidden flex items-center min-w-0">
                <span className="text-sm font-black text-[#07152F] tracking-tight truncate max-w-[210px]">
                  {siteSettings.short_name || siteSettings.site_name}
                </span>
              </div>

              {/* Desktop Full Branding */}
              <div className="hidden sm:flex flex-col justify-center min-w-0">
                <span className="text-sm sm:text-base font-black text-[#07152F] tracking-tight leading-tight group-hover:text-blue-600 transition-colors truncate max-w-[260px] lg:max-w-[320px]">
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

            {/* Desktop Navigation Links — CANONICAL CMS SOURCE */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
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
                        className={`flex items-center gap-1 text-sm font-semibold tracking-tight transition-colors hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg px-2.5 py-1.5 cursor-pointer ${
                          isActive ? "text-blue-600 font-bold bg-blue-50/80" : "text-slate-700"
                        }`}
                      >
                        {item.label}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${coursesOpen ? "rotate-180 text-blue-600" : "text-slate-400"}`} />
                      </button>

                      {coursesOpen && (
                        <div
                          role="menu"
                          aria-label="Courses menu"
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2.5 px-2 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                        >
                          <div className="px-3 py-2 border-b border-slate-100 mb-1.5 flex items-center justify-between">
                            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Programs Offered</p>
                            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                              {courses.length} Programs
                            </span>
                          </div>

                          <div className="max-h-[320px] overflow-y-auto space-y-1 pr-0.5">
                            {courses.map((course) => {
                              const slug = course.slug || toSlug(course.course_name);
                              const courseActive = pathname === `/courses/${slug}`;
                              return (
                                <Link
                                  key={course.id}
                                  href={`/courses/${slug}`}
                                  role="menuitem"
                                  onClick={() => setCoursesOpen(false)}
                                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group/item focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                                    courseActive
                                      ? "bg-blue-50 text-blue-600 font-bold"
                                      : "hover:bg-blue-50/70 text-slate-700 hover:text-blue-600"
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div
                                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150 ${
                                        courseActive
                                          ? "bg-blue-600 text-white"
                                          : "bg-slate-100 text-slate-500 group-hover/item:bg-blue-600 group-hover/item:text-white"
                                      }`}
                                    >
                                      <BookOpen className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-semibold leading-snug line-clamp-2">
                                      {course.course_name}
                                    </span>
                                  </div>

                                  <ChevronRight
                                    className={`w-3.5 h-3.5 text-blue-600 transition-all duration-150 shrink-0 ${
                                      courseActive
                                        ? "opacity-100 translate-x-0"
                                        : "opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0"
                                    }`}
                                  />
                                </Link>
                              );
                            })}
                          </div>

                          <div className="border-t border-slate-100 mt-2 pt-2 px-1">
                            <Link
                              href="/courses"
                              role="menuitem"
                              onClick={() => setCoursesOpen(false)}
                              className="flex items-center justify-center gap-2 w-full py-2 bg-slate-50 hover:bg-blue-50 text-blue-600 text-xs font-extrabold rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                            >
                              View All Courses →
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
                    className={`text-sm font-semibold tracking-tight transition-colors hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg px-2.5 py-1.5 ${
                      isActive ? "text-blue-600 font-bold bg-blue-50/80" : "text-slate-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Action Buttons: Student Login, Admin Login, Apply Now */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <Link
                href="/student/login"
                className="flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs hover:border-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>Student Login</span>
              </Link>

              <Link
                href="/admin/login"
                className="flex items-center gap-1.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 hover:text-blue-600 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                title="Admin Management Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Admin Login</span>
              </Link>

              <Link
                href="/admission"
                className="flex items-center gap-1.5 bg-[#155EEF] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-blue-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-98"
              >
                <span>Apply Now</span>
              </Link>
            </div>

            {/* Mobile Compact Hamburger Toggle Button (min-h-[44px]) */}
            <div className="lg:hidden flex items-center shrink-0">
              <button
                type="button"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. ANNOUNCEMENT BAR (Rendered below navbar, if active)        */}
        {/* ============================================================ */}
        <AnnouncementBar notices={topStripNotices} settings={announcement} />
        {tickerNotices.length > 0 && <NoticeRenderer notices={tickerNotices} forcedFormat="ticker" />}

        {/* Mobile Slide-down Drawer — Single Consolidated Navigation Source */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute left-0 right-0 top-full bg-white/98 backdrop-blur-xl border-b border-slate-200 shadow-2xl py-4 px-4 sm:px-6 flex flex-col gap-2 max-h-[calc(100vh-120px)] overflow-y-auto animate-in slide-in-from-top-3 duration-200 z-50">
            {canonicalNavItems.map((item) => {
              const isCourses = item.url === "/courses" || item.label.toLowerCase() === "courses";
              const isActive = pathname === item.url || (isCourses && pathname.startsWith("/courses"));

              if (isCourses) {
                return (
                  <div key={item.id || item.url} className="border border-slate-100 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      aria-expanded={mobileCourseOpen}
                      onClick={() => setMobileCourseOpen(!mobileCourseOpen)}
                      className="flex items-center justify-between w-full p-3 bg-slate-50 text-slate-800 text-sm font-bold min-h-[44px]"
                    >
                      <span className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        {item.label} Offered
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileCourseOpen ? "rotate-180" : ""}`} />
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
                              className={`flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-semibold transition-colors min-h-[44px] ${
                                active ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full shrink-0 ${active ? "bg-blue-600" : "bg-slate-300"}`} />
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
                          className="text-center py-2 text-blue-600 text-xs font-extrabold uppercase tracking-wider bg-blue-50 rounded-lg mt-1 min-h-[44px] flex items-center justify-center"
                        >
                          View All Courses →
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
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold min-h-[44px] ${
                    isActive ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.url === "/" && <Home className="w-4 h-4 text-blue-600" />}
                  {item.url === "/about" && <User className="w-4 h-4 text-blue-600" />}
                  {item.url === "/admission" && <GraduationCap className="w-4 h-4 text-blue-600" />}
                  {item.url.startsWith("/verify") && <Award className="w-4 h-4 text-blue-600" />}
                  {item.url === "/contact" && <PhoneCall className="w-4 h-4 text-blue-600" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Auth and Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 mt-1">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/student/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 border border-slate-200 text-slate-800 bg-white py-2.5 rounded-xl font-bold text-xs shadow-2xs min-h-[44px]"
                >
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Student Login
                </Link>

                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 border border-slate-200 text-slate-800 bg-slate-50 py-2.5 rounded-xl font-bold text-xs shadow-2xs min-h-[44px]"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Admin Login
                </Link>
              </div>

              <Link
                href="/admission"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#155EEF] text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 min-h-[44px]"
              >
                Apply for Admission
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
