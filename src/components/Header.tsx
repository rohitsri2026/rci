"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [mobileCourseOpen, setMobileCourseOpen] = useState(false);
  const [courses, setCourses] = useState<{ id: string; course_name: string }[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("courses").select("id, course_name").order("course_name").then(({ data }) => {
      if (data) setCourses(data);
    });
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setCoursesOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setCoursesOpen(false), 150);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Verify Certificate", href: "/verify" },
    { name: "Admission", href: "/admission" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm"
          : "bg-transparent py-6"
        }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group py-1">
          <Image src="/logo.png" alt="Rohit Computer Institute" width={160} height={60} className="object-contain h-14 w-auto" priority />
          <span className="text-3xl md:text-2xl font-black text-blue-700 tracking-tight">Rohit Computer Institute (RCI)</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.slice(0, 2).map((link) => (
            <a key={link.name} href={link.href} className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">
              {link.name}
            </a>
          ))}

          {/* Courses Dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href="/courses"
              className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium"
            >
              Courses
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${coursesOpen ? "rotate-180" : ""}`} />
            </Link>

            {coursesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 overflow-hidden">
                {/* Arrow */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-slate-100 rotate-45" />

                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">All Courses</p>
                </div>

                {courses.length > 0 ? courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${toSlug(course.course_name)}`}
                    onClick={() => setCoursesOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors group/item mx-1 rounded-xl"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 group-hover/item:bg-blue-600 transition-colors">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600 group-hover/item:text-white transition-colors" />
                    </div>
                    <span className="text-slate-700 text-sm font-medium group-hover/item:text-blue-700 transition-colors">{course.course_name}</span>
                  </Link>
                )) : (
                  <div className="px-4 py-3 text-slate-400 text-sm text-center">Loading courses...</div>
                )}

                <div className="border-t border-slate-100 mt-1 pt-1 px-3">
                  <Link
                    href="/courses"
                    onClick={() => setCoursesOpen(false)}
                    className="flex items-center justify-center gap-1.5 w-full py-2 text-blue-600 text-xs font-semibold hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    View all courses →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {navLinks.slice(2).map((link) => (
            <a key={link.name} href={link.href} className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">
              {link.name}
            </a>
          ))}

          <Link href="/admission" className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors">
            Enroll Now
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-slate-600 hover:text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 py-4 px-6 flex flex-col gap-1 shadow-xl max-h-[80vh] overflow-y-auto">
          <a href="/" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-blue-600 text-base font-medium py-2">Home</a>
          <a href="/about" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-blue-600 text-base font-medium py-2">About</a>

          {/* Mobile Courses Accordion */}
          <button
            onClick={() => setMobileCourseOpen(!mobileCourseOpen)}
            className="flex items-center justify-between text-slate-600 hover:text-blue-600 text-base font-medium py-2 w-full"
          >
            Courses
            <ChevronDown className={`w-4 h-4 transition-transform ${mobileCourseOpen ? "rotate-180" : ""}`} />
          </button>
          {mobileCourseOpen && (
            <div className="pl-4 flex flex-col gap-1 mb-1">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${toSlug(course.course_name)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm py-2"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {course.course_name}
                </Link>
              ))}
              <Link href="/courses" onClick={() => setMobileMenuOpen(false)} className="text-blue-600 text-sm font-semibold py-2">View all →</Link>
            </div>
          )}

          {navLinks.slice(2).map((link) => (
            <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-blue-600 text-base font-medium py-2">
              {link.name}
            </a>
          ))}

          <Link href="/admission" onClick={() => setMobileMenuOpen(false)} className="bg-blue-600 text-white px-5 py-3 rounded-xl text-center font-semibold mt-3">
            Enroll Now
          </Link>
        </div>
      )}
    </header>
  );
}
