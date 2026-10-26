"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { createClient } from "@/lib/supabase/client";
import { getImageForCourse, getCategoryForCourse, toSlug, PublicCourseData } from "@/components/courses/PublicCourseCard";

const FALLBACK_COURSES: PublicCourseData[] = [
  { 
    id: "1", 
    course_name: "Diploma in Computer Application (DCA)", 
    duration: "12 Months", 
    fees: 4999, 
    discount: 500,
    category: "Diploma",
    description: "Complete professional computer diploma covering MS Office, Operating Systems, internet technologies & project work." 
  },
  { 
    id: "2", 
    course_name: "Tally Prime with GST Accounting", 
    duration: "3 Months", 
    fees: 2999, 
    discount: 300,
    category: "Accounting",
    description: "Comprehensive computerized financial accounting, GST invoicing, balance sheets, and inventory management." 
  },
  { 
    id: "3", 
    course_name: "Advanced Web Development", 
    duration: "6 Months", 
    fees: 7999, 
    discount: 1000,
    category: "Programming",
    description: "Full-stack web fundamentals including HTML5, CSS3, JavaScript, React, Tailwind, and database systems." 
  },
  { 
    id: "4", 
    course_name: "ADCA (Advance Diploma in Computer Application)", 
    duration: "12 Months", 
    fees: 6499, 
    discount: 700,
    category: "Advanced Diploma",
    description: "Comprehensive IT diploma covering graphic design (Photoshop/CorelDraw), programming basics, and office management." 
  },
  { 
    id: "5", 
    course_name: "Python Programming & Data Basics", 
    duration: "4 Months", 
    fees: 4499, 
    discount: 500,
    category: "Programming",
    description: "Learn Python syntax, logic building, data structures, automation scripting, and practical application development." 
  },
  { 
    id: "6", 
    course_name: "CCC (Course on Computer Concepts)", 
    duration: "3 Months", 
    fees: 1999, 
    discount: 200,
    category: "Certificate",
    description: "Essential computer certification for government exam eligibility, digital financial services, and cyber awareness." 
  },
];

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

  const displayCourses = courses.length > 0 ? courses : FALLBACK_COURSES;

  return (
    <section aria-labelledby="popular-courses-title" className="py-10 sm:py-16 bg-slate-50 border-b border-slate-200/80 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-10">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-xs font-black uppercase tracking-widest text-[#155EEF] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-2.5 animate__animated animate__fadeIn">
              <i className="bi bi-stars text-[#D4A72C] text-xs" />
              <span>Career-Oriented Curricula</span>
            </span>
            <h2 id="popular-courses-title" className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-[#07152F] tracking-tight leading-tight">
              Popular Computer Courses
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-normal leading-relaxed">
              Job-ready diplomas and accounting certifications designed for real-world workplace proficiency.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Custom Nav Arrows with Font Awesome */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous courses"
                className="courses-swiper-prev w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-[#155EEF] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <i className="fa-solid fa-chevron-left text-xs" />
              </button>
              <button
                type="button"
                aria-label="Next courses"
                className="courses-swiper-next w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-[#155EEF] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <i className="fa-solid fa-chevron-right text-xs" />
              </button>
            </div>

            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm transition-all shadow-2xs hover:shadow-sm hover:border-blue-300 shrink-0"
            >
              <span>View All Programs</span>
              <i className="fa-solid fa-arrow-right text-xs text-[#155EEF]" />
            </Link>
          </div>
        </div>

        {/* Swiper Slider for Courses */}
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            nextEl: ".courses-swiper-next",
            prevEl: ".courses-swiper-prev",
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          className="pb-12 swiper-pagination-dark"
        >
          {displayCourses.map((course, idx) => {
            const slug = course.slug?.trim() || toSlug(course.course_name);
            const category = getCategoryForCourse(course.course_name, course.category);
            const imageUrl = getImageForCourse(course.course_name, course.thumbnail_url);
            const duration = course.duration?.trim() || "Flexible";
            const rawFee = Number(course.fees) || 0;
            const discount = Number(course.discount) || 0;
            const finalFee = discount > 0 && discount < rawFee ? rawFee - discount : rawFee;

            return (
              <SwiperSlide key={course.id || idx} className="h-auto">
                <div className="h-full bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group">
                  <div>
                    {/* Course Thumbnail */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      <Image
                        src={imageUrl}
                        alt={course.course_name}
                        fill
                        sizes="(max-width: 640px) 310px, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span className="bg-white/95 backdrop-blur-xs text-[#07152F] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-2xs flex items-center gap-1">
                          <i className="bi bi-tag-fill text-[#155EEF] text-[9px]" />
                          <span>{category}</span>
                        </span>
                      </div>

                      {/* ISO Certificate Badge with Bootstrap Icon */}
                      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 text-white text-[10px] font-bold bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-md z-10 border border-white/15">
                        <i className="bi bi-patch-check-fill text-[#D4A72C] text-xs" />
                        <span>ISO Recognized</span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-4 sm:p-5">
                      <h3 className="text-sm sm:text-base font-extrabold text-[#07152F] mb-1.5 line-clamp-1 group-hover:text-[#155EEF] transition-colors">
                        {course.course_name}
                      </h3>
                      <p className="text-xs text-slate-500 mb-3.5 leading-relaxed line-clamp-2 min-h-[2rem]">
                        {course.description || "Comprehensive practical training course at Rohit Computer Institute."}
                      </p>

                      {/* Duration & Fee with Font Awesome & Bootstrap Icons */}
                      <div className="flex items-center justify-between py-2.5 border-y border-slate-100 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <i className="fa-solid fa-clock text-blue-600 text-xs" />
                          <span>{duration}</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          {discount > 0 && (
                            <span className="text-[10px] text-slate-400 line-through">
                              ₹{rawFee.toLocaleString("en-IN")}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-slate-900 font-black text-xs sm:text-sm bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100">
                            <i className="fa-solid fa-indian-rupee-sign text-[10px] text-emerald-600" />
                            <span>{finalFee > 0 ? finalFee.toLocaleString("en-IN") : "Inquire"}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/courses/${slug}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors min-h-[40px]"
                      >
                        <i className="fa-solid fa-book-open text-xs text-slate-500" />
                        <span>Details</span>
                      </Link>

                      <Link
                        href={`/admission?course=${encodeURIComponent(slug)}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 bg-[#155EEF] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-blue-500/20 hover:scale-[1.02] min-h-[40px]"
                      >
                        <span>Apply</span>
                        <i className="fa-solid fa-arrow-right text-[10px]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

      </div>
    </section>
  );
}
