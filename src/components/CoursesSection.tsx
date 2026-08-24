"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, BadgeIndianRupee, Award, ArrowRight, MessageCircle, BookOpen, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { RCIConfig } from "@/lib/config";
import PublicCourseCard from "@/components/courses/PublicCourseCard";

export type CourseItem = {
  id: string;
  course_name: string;
  slug: string;
  duration?: string;
  fees?: number;
  description?: string;
  category?: string;
  image?: string;
};

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

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CoursesSection() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("courses")
          .select("*")
          .or("status.eq.Active,status.is.null")
          .order("course_name");

        if (data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formatted: CourseItem[] = data.map((c: any) => ({
            id: c.id,
            course_name: c.course_name,
            slug: c.slug?.trim() || toSlug(c.course_name),
            duration: c.duration || "Flexible",
            fees: c.fees || 0,
            description: c.description || "Comprehensive practical training course at Rohit Computer Institute.",
            category: getCategoryForCourse(c.course_name),
            image: c.thumbnail_url || getImageForCourse(c.course_name),
          }));
          setCourses(formatted);
        }
      } catch (err) {
        console.error("Failed to load courses from DB:", err);
      } finally {
        setLoading(false);
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
        {courses.length > 0 && (
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
        )}

        {/* Loading State */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading course offerings...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          /* Courses Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <PublicCourseCard
                    course={{
                      id: course.id,
                      course_name: course.course_name,
                      slug: course.slug,
                      duration: course.duration,
                      fees: course.fees,
                      description: course.description,
                      category: course.category,
                      thumbnail_url: course.image,
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Clean Empty State */
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-extrabold text-slate-900">No courses are currently available.</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Please check back soon or contact RCI admissions desk for upcoming course schedules.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
