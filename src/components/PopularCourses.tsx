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
          .limit(6);

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

  // Default fallback if database empty
  const displayCourses = courses.length > 0 ? courses : [
    { id: "1", course_name: "Diploma in Computer Application (DCA)", duration: "12 Months", fees: 4999, description: "Complete professional computer diploma covering MS Office, Operating Systems, internet technologies & project work." },
    { id: "2", course_name: "Tally Prime with GST Accounting", duration: "3 Months", fees: 2999, description: "Comprehensive computerized financial accounting, GST invoicing, balance sheets, and inventory management." },
    { id: "3", course_name: "Advanced Web Development", duration: "6 Months", fees: 7999, description: "Full-stack web fundamentals including HTML, CSS, JavaScript, React, Tailwind, and database systems." },
    { id: "4", course_name: "Python Programming & Data Basics", duration: "4 Months", fees: 4499, description: "Modern Python coding, logical problem solving, automation, and foundational data structures." },
  ];

  return (
    <section aria-labelledby="popular-courses-title" className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#155EEF] bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
              Featured Programs
            </span>
            <h2 id="popular-courses-title" className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-[#07152F] tracking-tight leading-tight">
              Popular Career-Ready Courses
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-2 font-normal">
              Gain in-demand computer skills with practical lab sessions, dedicated mentorship, and QR-verifiable certificates.
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-900 font-bold text-xs sm:text-sm transition-all shadow-2xs hover:shadow-sm hover:border-blue-300 self-start md:self-auto"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4 text-[#155EEF]" />
          </Link>
        </div>

        {/* Courses Cards Grid: 4 on Desktop, 2 on Tablet, 1 on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCourses.slice(0, 4).map((course, idx) => {
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
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Fixed Aspect Ratio Thumbnail */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={imageUrl}
                      alt={course.course_name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-white/95 backdrop-blur-xs text-[#07152F] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-2xs">
                        {category}
                      </span>
                    </div>

                    {/* ISO / Verified Tag */}
                    <div className="absolute bottom-2.5 right-3 flex items-center gap-1 text-white text-[11px] font-bold bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-lg z-10 border border-white/15">
                      <Award className="w-3.5 h-3.5 text-[#D4A72C] shrink-0" />
                      <span>ISO Certified</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="text-base font-extrabold text-[#07152F] mb-1.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {course.course_name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2 min-h-[2.4rem]">
                      {course.description || "Comprehensive practical training course at Rohit Computer Institute."}
                    </p>

                    {/* Duration & Fee */}
                    <div className="flex items-center justify-between py-2.5 border-y border-slate-100 text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{duration}</span>
                      </span>

                      <div className="flex items-center gap-1">
                        {discount > 0 && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{rawFee.toLocaleString("en-IN")}
                          </span>
                        )}
                        <span className="flex items-center text-slate-900 font-black text-sm bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
                          <BadgeIndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{finalFee > 0 ? `₹${finalFee.toLocaleString("en-IN")}` : "Inquire"}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="px-5 pb-5 pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/courses/${slug}`}
                      className="flex items-center justify-center gap-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition-colors min-h-[40px]"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      <span>Details</span>
                    </Link>

                    <Link
                      href={`/admission?course=${encodeURIComponent(slug)}`}
                      className="flex items-center justify-center gap-1 py-2 bg-[#155EEF] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-colors shadow-2xs min-h-[40px]"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
