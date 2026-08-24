"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, BadgeIndianRupee, Award, ArrowRight, MessageCircle, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { RCIConfig } from "@/lib/config";

export type CourseItem = {
  id: string;
  course_name: string;
  slug?: string;
  duration?: string;
  fees?: number;
  description?: string;
  category?: string;
  image?: string;
};

// Fallback courses dataset mapped to distinct generated images
const DEFAULT_COURSES: CourseItem[] = [
  {
    id: "dca",
    course_name: "Diploma in Computer Application (DCA)",
    slug: "diploma-in-computer-application-dca",
    duration: "12 Months",
    fees: 6999,
    category: "Computer",
    image: "/courses/dca.jpg",
    description: "Master MS Office, Windows Operating System, Internet Applications, DTP, and core computing fundamentals.",
  },
  {
    id: "tally",
    course_name: "Tally Prime & GST Accounting",
    slug: "tally-prime-gst-accounting",
    duration: "3 Months",
    fees: 2999,
    category: "Accounting",
    image: "/courses/tally.jpg",
    description: "Comprehensive financial accounting, GST invoicing, inventory management, and computerized voucher entries.",
  },
  {
    id: "webdev",
    course_name: "Advanced Web Development",
    slug: "advanced-web-development",
    duration: "6 Months",
    fees: 5999,
    category: "Programming",
    image: "/courses/web-dev.jpg",
    description: "Build modern responsive websites using HTML5, CSS3, JavaScript, React.js, Next.js, and web databases.",
  },
  {
    id: "python",
    course_name: "Python Programming & Logic",
    slug: "python-programming-logic",
    duration: "5 Months",
    fees: 4999,
    category: "Programming",
    image: "/courses/python.jpg",
    description: "Learn Python language syntax, data structures, object-oriented programming, and file handling.",
  },
  {
    id: "typing",
    course_name: "Hindi & English Typing Mastery",
    slug: "hindi-english-typing-mastery",
    duration: "2 Months",
    fees: 1499,
    category: "Typing",
    image: "/courses/typing.jpg",
    description: "Achieve high typing speed and accuracy in Devnagari Hindi KrutiDev/Mangal layout and English keyboarding.",
  },
  {
    id: "graphic",
    course_name: "Graphic Designing & DTP",
    slug: "graphic-designing-dtp",
    duration: "4 Months",
    fees: 3999,
    category: "Computer",
    image: "/courses/graphic.jpg",
    description: "Create stunning banners, logos, social media posters, and print publications using Photoshop & CorelDraw.",
  },
];

const CATEGORIES = ["All", "Computer", "Accounting", "Programming", "Typing"];

function getImageForCourse(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("dca") || lower.includes("diploma")) return "/courses/dca.jpg";
  if (lower.includes("tally") || lower.includes("gst") || lower.includes("account")) return "/courses/tally.jpg";
  if (lower.includes("web") || lower.includes("react") || lower.includes("frontend")) return "/courses/web-dev.jpg";
  if (lower.includes("python") || lower.includes("code") || lower.includes("java")) return "/courses/python.jpg";
  if (lower.includes("typing") || lower.includes("hindi") || lower.includes("english")) return "/courses/typing.jpg";
  if (lower.includes("graphic") || lower.includes("dtp") || lower.includes("design")) return "/courses/graphic.jpg";
  return "/courses/dca.jpg";
}

function getCategoryForCourse(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("tally") || lower.includes("account") || lower.includes("gst")) return "Accounting";
  if (lower.includes("web") || lower.includes("python") || lower.includes("programming") || lower.includes("code")) return "Programming";
  if (lower.includes("typing")) return "Typing";
  return "Computer";
}

export default function CoursesSection() {
  const [courses, setCourses] = useState<CourseItem[]>(DEFAULT_COURSES);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("courses")
          .select("*")
          .or("status.eq.Active,status.is.null")
          .order("course_name");

        if (data && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formatted: CourseItem[] = data.map((c: any) => ({
            id: c.id,
            course_name: c.course_name,
            slug: c.slug || c.course_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
            duration: c.duration || "Flexible",
            fees: c.fees || 0,
            description: c.description || "Comprehensive practical training course at Rohit Computer Institute.",
            category: getCategoryForCourse(c.course_name),
            image: c.thumbnail_url || getImageForCourse(c.course_name),
          }));
          setCourses(formatted);
        }
      } catch (err) {
        console.error("Failed to load courses from DB, using fallback", err);
      }
    }
    fetchCourses();
  }, []);

  const filteredCourses = activeCategory === "All" 
    ? courses 
    : courses.filter(c => c.category === activeCategory);

  return (
    <section id="courses" className="py-18 bg-white relative border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full">
            Featured Programs
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-slate-900 mt-4 mb-4 leading-tight">
            Industry-Aligned Computer Courses
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Explore our practical career programs designed to equip you with real-world technical skills and recognized certificates.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => {
              const whatsappUrl = RCIConfig.getWhatsAppUrl(`Hello RCI, I want information about the ${course.course_name} course.`);

              return (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Course Visual */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                      <Image
                        src={course.image || getImageForCourse(course.course_name)}
                        alt={course.course_name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                      
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/95 backdrop-blur-md text-blue-700 text-xs font-black px-3 py-1 rounded-full shadow-2xs">
                          {course.category}
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-4 flex items-center gap-1 text-white text-xs font-bold bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                        <Award className="w-3.5 h-3.5 text-yellow-400" />
                        <span>ISO Certified</span>
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-extrabold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {course.course_name}
                      </h3>
                      <p className="text-slate-600 text-sm mb-5 leading-relaxed line-clamp-2">
                        {course.description}
                      </p>

                      {/* Clearer Fee / Duration Hierarchy */}
                      <div className="flex items-center justify-between py-3 border-y border-slate-100 text-xs font-bold mb-5">
                        <span className="flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200/60">
                          <Clock className="w-4 h-4 text-blue-600" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1 text-slate-900 text-lg font-black bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200/60">
                          <BadgeIndianRupee className="w-4.5 h-4.5 text-emerald-600" />
                          {course.fees ? course.fees.toLocaleString("en-IN") : "Inquire"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Hierarchy */}
                  <div className="px-6 pb-6 pt-0 space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        View Details
                      </Link>

                      <Link
                        href={`/admission?course=${encodeURIComponent(course.course_name)}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-colors shadow-sm"
                      >
                        Apply Now
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-extrabold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      WhatsApp Inquiry
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
