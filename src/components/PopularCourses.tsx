"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, BadgeIndianRupee, Award, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getImageForCourse, getCategoryForCourse, toSlug, PublicCourseData } from "@/components/courses/PublicCourseCard";

export default function PopularCourses() {
  const [courses, setCourses] = useState<PublicCourseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("courses")
          .select("*")
          .or("status.eq.Active,status.is.null")
          .order("course_name")
          .limit(3);

        if (data && data.length > 0) {
          setCourses(data);
        }
      } catch (err) {
        console.error("Failed to fetch popular courses:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  // Top 3 default courses fallback
  const displayCourses = courses.length > 0 ? courses : [
    { id: "1", course_name: "Diploma in Computer Application (DCA)", duration: "12 Months", fees: 4999, description: "Complete professional computer diploma covering MS Office, Operating Systems, internet technologies & project work." },
    { id: "2", course_name: "Tally Prime with GST Accounting", duration: "3 Months", fees: 2999, description: "Comprehensive computerized financial accounting, GST invoicing, balance sheets, and inventory management." },
    { id: "3", course_name: "Advanced Web Development", duration: "6 Months", fees: 7999, description: "Full-stack web fundamentals including HTML, CSS, JavaScript, React, Tailwind, and database systems." },
  ];

  return (
    <section aria-labelledby="popular-courses-title" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-xs font-black uppercase tracking-widest text-[#155EEF] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3 h-3 text-[#D4A72C]" />
              Featured Programs
            </span>
            <h2 id="popular-courses-title" className="text-2xl sm:text-3xl font-black font-display text-[#07152F] tracking-tight leading-tight">
              Popular Career Courses
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
              Practical computer diploma and accounting courses designed for immediate employment.
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm transition-all shadow-2xs hover:shadow-sm hover:border-blue-300 self-start sm:self-auto shrink-0"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#155EEF]" />
          </Link>
        </div>

        {/* 3 Featured Courses: 3 columns desktop, Horizontal swipe carousel on mobile */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {displayCourses.slice(0, 3).map((course, idx) => {
            const slug = course.slug?.trim() || toSlug(course.course_name);
            const category = getCategoryForCourse(course.course_name, course.category);
            const imageUrl = getImageForCourse(course.course_name, course.thumbnail_url);
            const duration = course.duration?.trim() || "Flexible";
            const rawFee = Number(course.fees) || 0;
            const discount = Number(course.discount) || 0;
            const finalFee = discount > 0 && discount < rawFee ? rawFee - discount : rawFee;

            return (
              <div
                key={course.id || idx}
                className="min-w-[280px] xs:min-w-[300px] sm:min-w-0 snap-center bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group shrink-0 sm:shrink"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={imageUrl}
                      alt={course.course_name}
                      fill
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="bg-white/95 backdrop-blur-xs text-[#07152F] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
                        {category}
                      </span>
                    </div>

                    {/* ISO Badge */}
                    <div className="absolute bottom-2 right-2.5 flex items-center gap-1 text-white text-[10px] font-bold bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md z-10 border border-white/15">
                      <Award className="w-3 h-3 text-[#D4A72C] shrink-0" />
                      <span>ISO Certified</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5">
                    <h3 className="text-sm sm:text-base font-extrabold text-[#07152F] mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {course.course_name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3 sm:mb-4 leading-relaxed line-clamp-2 min-h-[2.2rem]">
                      {course.description || "Comprehensive practical training course at Rohit Computer Institute."}
                    </p>

                    {/* Duration & Fee */}
                    <div className="flex items-center justify-between py-2 border-y border-slate-100 text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{duration}</span>
                      </span>

                      <div className="flex items-center gap-1">
                        {discount > 0 && (
                          <span className="text-[10.5px] text-slate-400 line-through">
                            ₹{rawFee.toLocaleString("en-IN")}
                          </span>
                        )}
                        <span className="flex items-center text-slate-900 font-black text-xs sm:text-sm bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
                          <BadgeIndianRupee className="w-3 h-3 text-emerald-600" />
                          <span>{finalFee > 0 ? `₹${finalFee.toLocaleString("en-IN")}` : "Inquire"}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/courses/${slug}`}
                      className="flex items-center justify-center gap-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors min-h-[40px]"
                    >
                      <BookOpen className="w-3 h-3 text-slate-500" />
                      <span>Details</span>
                    </Link>

                    <Link
                      href={`/admission?course=${encodeURIComponent(slug)}`}
                      className="flex items-center justify-center gap-1 py-2 bg-[#155EEF] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-colors shadow-2xs min-h-[40px]"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
