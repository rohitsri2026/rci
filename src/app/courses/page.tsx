import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { 
  BookOpen, Clock, BadgeIndianRupee, ArrowRight, ArrowUpRight,
  GraduationCap, Code2, Calculator, Keyboard, CheckCircle2,
  Layers
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RCIConfig } from "@/lib/config";
import WhatsAppCounsellingBanner from "@/components/whatsapp-counselling-banner";
import CoursesCatalogClient from "@/components/courses/CoursesCatalogClient";

export const metadata: Metadata = {
  title: `Courses & Programs | ${RCIConfig.instituteName}`,
  description: `Explore computer courses & programs offered by ${RCIConfig.instituteName}, Kanpur including CCC, DCA, Tally Prime, Python, and Typing with practical lab training.`,
  alternates: {
    canonical: `${RCIConfig.siteUrl}/courses`,
  },
  openGraph: {
    title: `Courses & Programs | ${RCIConfig.instituteName}`,
    description: `Explore computer courses and skill development programs at ${RCIConfig.instituteName}, Kanpur.`,
    url: `${RCIConfig.siteUrl}/courses`,
    siteName: RCIConfig.instituteName,
    type: "website",
  },
};

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getCourseIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("tally") || n.includes("account")) return Calculator;
  if (n.includes("python") || n.includes("web") || n.includes("program")) return Code2;
  if (n.includes("typing")) return Keyboard;
  if (n.includes("dca") || n.includes("diploma")) return GraduationCap;
  return BookOpen;
}

function cleanDescription(desc?: string, fallbackDesc?: string): string {
  if (!desc || desc.trim() === "") return fallbackDesc || "Practical computer training with hands-on lab exercises and expert guidance.";
  let cleaned = desc.trim().replace(/\.\.\.$/, "").trim();
  if (!cleaned.endsWith(".")) cleaned += ".";
  return cleaned;
}

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: dbCourses } = await supabase
    .from("courses")
    .select("*")
    .or("status.eq.Active,status.is.null")
    .order("course_name");

  const coursesList = dbCourses || [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-28 sm:pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          {/* 1. HERO SECTION */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3.5 shadow-2xs">
              <BookOpen className="w-4 h-4 text-blue-600" />
              COURSES &amp; PROGRAMS
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.035em] leading-[1.08] text-slate-950 mb-3.5">
              Choose the Right Course for Your Career
            </h1>
            
            <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Explore RCI programs designed to build practical computer skills and support your learning goals.
            </p>

            {/* Dynamic Info Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mt-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-2xs">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                {coursesList.length} Programs
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                Flexible Course Durations
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                Practical Learning
              </span>
            </div>
          </div>

          {/* 2. SECTION HEADER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-8 pb-4 border-b border-slate-200/80">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-[-0.02em] text-slate-900">
                Explore Our Programs
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Choose a course that matches your current learning and career goals.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 shrink-0">
              {coursesList.length} Programs Available
            </span>
          </div>

          {/* 3. COURSE CATALOG CLIENT GRID */}
          <CoursesCatalogClient initialCourses={coursesList} />

          {/* 4. REUSABLE WHATSAPP COUNSELLING BANNER */}
          <div className="mt-8 sm:mt-10 mb-16">
            <WhatsAppCounsellingBanner
              badge="COURSE COUNSELLING"
              title="Not sure which course to choose?"
              description="Talk directly with an RCI counsellor and get help choosing the right course for your learning goals."
              buttonText="Chat with RCI on WhatsApp"
              customMessage="Hello RCI, I am trying to choose a computer course and would like course counselling."
              variant="horizontal"
            />
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
