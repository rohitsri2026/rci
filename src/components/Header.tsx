"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Menu, X, ChevronDown, ChevronRight, BookOpen, GraduationCap, 
  Award, Home, User, PhoneCall, ShieldCheck 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AnnouncementBar from "@/components/AnnouncementBar";

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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

  const [siteSettings, setSiteSettings] = useState({
    site_name: "Rohit Computer Institute",
    short_name: "RCI",
    tagline: "Empowering Digital Careers",
    logo_url: "/logo.png",
  });
  const [announcement, setAnnouncement] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [headerNavLinks, setHeaderNavLinks] = useState<{ id?: string; label: string; url: string; open_new_tab?: boolean }[]>([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // Fetch site settings
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

    // Fetch active website announcements
    supabase
      .from("website_announcements")
      .select("*")
      .eq("is_enabled", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setAnnouncements(data);
      });

    // Fetch announcement settings fallback
    supabase
      .from("announcement_settings")
      .select("*")
      .eq("id", "default")
      .single()
      .then(({ data }) => {
        if (data) setAnnouncement(data);
      });

    // Fetch navigation links
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

    // Fetch courses
    supabase
      .from("courses")
      .select("id, course_name, slug")
      .or("status.eq.Active,status.is.null")
      .order("course_name")
      .then(({ data }) => {
        setCourses(data || []);
      });
  }, []);

  // Handle outside click & Escape key for Courses dropdown accessibility
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

  return (
    <>
      <AnnouncementBar notices={announcements} settings={announcement} />
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-3 shadow-xs"
            : "bg-white/90 backdrop-blur-sm border-b border-slate-100 py-4.5"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-xl p-1 max-w-[72%] sm:max-w-none">
            <Image
              src={siteSettings.logo_url || "/logo.png"}
              alt={siteSettings.site_name}
              width={160}
              height={60}
              className="object-contain h-8 sm:h-12 w-auto shrink-0 transition-transform group-hover:scale-105"
              priority
              unoptimized
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-tight truncate sm:whitespace-normal group-hover:text-blue-600 transition-colors">
                {siteSettings.site_name}
              </span>
              <span className="text-[9px] sm:text-[10.5px] font-bold text-blue-600 tracking-widest uppercase mt-0.5 truncate hidden sm:block">
                {siteSettings.tagline}
              </span>
            </div>
          </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-semibold tracking-tight transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg px-2.5 py-1.5 ${
              pathname === "/" ? "text-blue-600 font-bold bg-blue-50/80" : "text-slate-700"
            }`}
          >
            Home
          </Link>
          
          <Link
            href="/about"
            className={`text-sm font-semibold tracking-tight transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg px-2.5 py-1.5 ${
              pathname === "/about" ? "text-blue-600 font-bold bg-blue-50/80" : "text-slate-700"
            }`}
          >
            About
          </Link>

          {/* Courses Dropdown */}
          <div
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
              className={`flex items-center gap-1 text-sm font-semibold tracking-tight transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg px-2.5 py-1.5 cursor-pointer ${
                pathname.startsWith("/courses") ? "text-blue-600 font-bold bg-blue-50/80" : "text-slate-700"
              }`}
            >
              Courses
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${coursesOpen ? "rotate-180 text-blue-600" : "text-slate-400"}`} />
            </button>

            {coursesOpen && (
              <div
                role="menu"
                aria-label="Courses menu"
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2.5 px-2 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {/* Dropdown Header */}
                <div className="px-3 py-2 border-b border-slate-100 mb-1.5 flex items-center justify-between">
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Programs Offered</p>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                    {courses.length} Programs
                  </span>
                </div>

                {/* Course Links List */}
                <div className="max-h-[320px] overflow-y-auto space-y-1 pr-0.5">
                  {courses.map((course) => {
                    const slug = course.slug || toSlug(course.course_name);
                    const active = pathname === `/courses/${slug}`;
                    return (
                      <Link
                        key={course.id}
                        href={`/courses/${slug}`}
                        role="menuitem"
                        onClick={() => setCoursesOpen(false)}
                        className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group/item focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                          active
                            ? "bg-blue-50 text-blue-600 font-bold"
                            : "hover:bg-blue-50/70 text-slate-700 hover:text-blue-600"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-150 ${
                              active
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-500 group-hover/item:bg-blue-600 group-hover/item:text-white"
                            }`}
                          >
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-semibold leading-snug line-clamp-2">
                            {course.course_name}
                          </span>
                        </div>

                        <ChevronRight
                          className={`w-3.5 h-3.5 text-blue-600 transition-all duration-150 shrink-0 ${
                            active
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0"
                          }`}
                        />
                      </Link>
                    );
                  })}
                </div>

                {/* Dropdown Bottom CTA */}
                <div className="border-t border-slate-100 mt-2 pt-2 px-1">
                  <Link
                    href="/courses"
                    role="menuitem"
                    onClick={() => setCoursesOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 hover:bg-blue-50 text-blue-600 text-xs font-extrabold rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    View All Courses →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/admission"
            className={`text-sm font-semibold tracking-tight transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg px-2.5 py-1.5 ${
              pathname === "/admission" ? "text-blue-600 font-bold bg-blue-50/80" : "text-slate-700"
            }`}
          >
            Admissions
          </Link>

          <Link
            href="/verify"
            className={`text-sm font-semibold tracking-tight transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg px-2.5 py-1.5 ${
              pathname.startsWith("/verify") ? "text-blue-600 font-bold bg-blue-50/80" : "text-slate-700"
            }`}
          >
            Verify Certificate
          </Link>

          <Link
            href="/contact"
            className={`text-sm font-semibold tracking-tight transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg px-2.5 py-1.5 ${
              pathname === "/contact" ? "text-blue-600 font-bold bg-blue-50/80" : "text-slate-700"
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-2.5">
          <Link
            href="/student/login"
            className="flex items-center gap-1.5 border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Student Login</span>
          </Link>

          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 border border-slate-200/90 bg-slate-50 hover:bg-slate-100 text-slate-800 hover:text-blue-600 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-600"
            title="Admin Login Portal"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Admin Login</span>
          </Link>

          <Link
            href="/admission"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-600 active:scale-98"
          >
            Apply Now
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden flex items-center gap-2 shrink-0">
          <Link
            href="/admission"
            className="hidden xs:inline-flex bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Now
          </Link>
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[62px] bg-white/98 backdrop-blur-xl border-b border-slate-200 shadow-2xl py-5 px-6 flex flex-col gap-3 max-h-[calc(100vh-65px)] overflow-y-auto animate-in slide-in-from-top-4 duration-300">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-xl text-base font-semibold ${
              pathname === "/" ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Home className="w-5 h-5 text-blue-600" />
            Home
          </Link>

          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-xl text-base font-semibold ${
              pathname === "/about" ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <User className="w-5 h-5 text-blue-600" />
            About RCI
          </Link>

          {/* Mobile Courses Accordion */}
          <div className="border border-slate-100 rounded-2xl overflow-hidden">
            <button
              type="button"
              aria-expanded={mobileCourseOpen}
              onClick={() => setMobileCourseOpen(!mobileCourseOpen)}
              className="flex items-center justify-between w-full p-3.5 bg-slate-50 text-slate-800 text-base font-semibold"
            >
              <span className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Courses Offered
              </span>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${mobileCourseOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileCourseOpen && (
              <div className="p-3 bg-white space-y-1 border-t border-slate-100">
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
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        active ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${active ? "bg-blue-600" : "bg-slate-300"}`} />
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
                  className="block text-center py-2.5 text-blue-600 text-xs font-extrabold uppercase tracking-wider bg-blue-50 rounded-xl mt-2"
                >
                  View All Courses →
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/admission"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-xl text-base font-semibold ${
              pathname === "/admission" ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Admissions
          </Link>

          <Link
            href="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-xl text-base font-semibold ${
              pathname.startsWith("/verify") ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Award className="w-5 h-5 text-blue-600" />
            Verify Certificate
          </Link>

          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-xl text-base font-semibold ${
              pathname === "/contact" ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <PhoneCall className="w-5 h-5 text-blue-600" />
            Contact Us
          </Link>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5 mt-2">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/student/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 border border-slate-200 text-slate-800 bg-white py-3 rounded-xl font-bold text-xs shadow-2xs min-h-[44px]"
              >
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Student Login
              </Link>

              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 border border-slate-200 text-slate-800 bg-slate-50 py-3 rounded-xl font-bold text-xs shadow-2xs min-h-[44px]"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Admin Login
              </Link>
            </div>

            <Link
              href="/admission"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 min-h-[44px]"
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
