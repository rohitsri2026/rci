"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, BookOpen, GraduationCap, Award, Home, User, PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("courses").select("id, course_name, slug").order("course_name").then(({ data }) => {
      if (data && data.length > 0) {
        setCourses(data);
      } else {
        // Fallback default courses if database table is empty or loading
        setCourses([
          { id: "1", course_name: "Diploma in Computer Application (DCA)" },
          { id: "2", course_name: "Tally Prime & GST Accounting" },
          { id: "3", course_name: "Web Development" },
          { id: "4", course_name: "Python Programming" },
          { id: "5", course_name: "English & Hindi Typing" },
          { id: "6", course_name: "Graphic Designing" },
        ]);
      }
    });
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setCoursesOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setCoursesOpen(false), 150);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-3 shadow-xs"
          : "bg-white/90 backdrop-blur-sm border-b border-slate-100 py-4.5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-xl p-1">
          <Image
            src="/logo.png"
            alt="Rohit Computer Institute Logo"
            width={160}
            height={60}
            className="object-contain h-10 sm:h-12 w-auto transition-transform group-hover:scale-105"
            priority
          />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
              Rohit Computer Institute
            </span>
            <span className="text-[10.5px] font-bold text-blue-600 tracking-widest uppercase mt-0.5">
              Empowering Digital Careers
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
            <Link
              href="/courses"
              className={`flex items-center gap-1 text-sm font-semibold tracking-tight transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg px-2.5 py-1.5 ${
                pathname.startsWith("/courses") ? "text-blue-600 font-bold bg-blue-50/80" : "text-slate-700"
              }`}
            >
              Courses
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${coursesOpen ? "rotate-180 text-blue-600" : "text-slate-400"}`} />
            </Link>

            {coursesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-150 py-3 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Programs Offered</p>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">ISO Certified</span>
                </div>

                <div className="max-h-72 overflow-y-auto px-2 space-y-1">
                  {courses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug || toSlug(course.course_name)}`}
                      onClick={() => setCoursesOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover/item:bg-blue-600 transition-colors">
                        <BookOpen className="w-4 h-4 text-blue-600 group-hover/item:text-white transition-colors" />
                      </div>
                      <span className="text-slate-700 text-xs sm:text-sm font-semibold group-hover/item:text-blue-600 transition-colors line-clamp-1">
                        {course.course_name}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="border-t border-slate-100 mt-2 pt-2 px-3">
                  <Link
                    href="/courses"
                    onClick={() => setCoursesOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-slate-50 hover:bg-blue-50 text-blue-600 text-xs font-bold rounded-xl transition-colors"
                  >
                    Browse All Courses →
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
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/student/login"
            className="flex items-center gap-2 border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <GraduationCap className="w-4 h-4 text-blue-600" />
            Student Login
          </Link>

          <Link
            href="/admission"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-600 active:scale-98"
          >
            Apply Now
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <Link
            href="/admission"
            className="bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-lg"
          >
            Apply Now
          </Link>
          <button
            aria-label="Toggle navigation menu"
            className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug || toSlug(course.course_name)}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 text-sm font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {course.course_name}
                  </Link>
                ))}
                <Link
                  href="/courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 text-blue-600 text-xs font-bold uppercase tracking-wider bg-blue-50 rounded-lg mt-2"
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

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3 mt-2">
            <Link
              href="/student/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 border border-slate-300 text-slate-800 bg-white py-3 rounded-xl font-bold text-sm shadow-2xs"
            >
              <GraduationCap className="w-4 h-4 text-blue-600" />
              Student Portal Login
            </Link>

            <Link
              href="/admission"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-blue-500/20"
            >
              Apply for Admission
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
