import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { 
  BookOpen, Clock, BadgeIndianRupee, Sparkles, ArrowRight, 
  GraduationCap, Code2, Calculator, Keyboard, CheckCircle2,
  FileSpreadsheet, ShieldCheck, Layers
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RCIConfig } from "@/lib/config";
import WhatsAppCounsellingBanner from "@/components/whatsapp-counselling-banner";

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

const fallbackCourses = [
  {
    id: "dca",
    course_name: "Diploma in Computer Application (DCA)",
    slug: "diploma-in-computer-application-dca",
    duration: "6 Months",
    fees: 4500,
    description: "Comprehensive diploma covering computer fundamentals, MS Office, internet skills, typing, and digital office management.",
  },
  {
    id: "tally",
    course_name: "Tally Prime & GST Accounting",
    slug: "tally-prime-gst-accounting",
    duration: "3 Months",
    fees: 3500,
    description: "Practical accounting training with Tally Prime, GST filing, inventory management, TDS, and financial statements.",
  },
  {
    id: "ccc",
    course_name: "Course on Computer Concepts (CCC)",
    slug: "course-on-computer-concepts-ccc",
    duration: "3 Months",
    fees: 2500,
    description: "Essential computer concept course covering OS basics, word processing, spreadsheets, internet, and digital financial literacy.",
  },
  {
    id: "python",
    course_name: "Python Programming",
    slug: "python-programming",
    duration: "3 Months",
    fees: 4000,
    description: "Learn Python fundamentals, data structures, object-oriented concepts, and basic automation with hands-on practice.",
  },
  {
    id: "typing",
    course_name: "English & Hindi Typing",
    slug: "english-hindi-typing",
    duration: "2 Months",
    fees: 1500,
    description: "Speed and accuracy typing course in English & Kruti Dev / Mangal Hindi fonts for competitive exams and office jobs.",
  },
];

function cleanDescription(desc?: string, fallbackDesc?: string): string {
  if (!desc || desc.trim() === "") return fallbackDesc || "Practical computer training with hands-on lab exercises and expert guidance.";
  let cleaned = desc.trim().replace(/\.\.\.$/, "").trim();
  if (!cleaned.endsWith(".")) cleaned += ".";
  return cleaned;
}

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: dbCourses } = await supabase.from("courses").select("*").order("course_name");

  const coursesList = (dbCourses && dbCourses.length > 0) ? dbCourses : fallbackCourses;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-28 sm:pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          {/* 1. HERO SECTION */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              COURSES &amp; PROGRAMS
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-slate-900 mb-3.5 leading-tight tracking-tight">
              Choose the Right Course for Your Career
            </h1>
            
            <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Explore RCI programs designed to build practical computer skills and support your learning goals.
            </p>

            {/* Dynamic Info Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-700 bg-white border border-slate-200/90 px-3 py-1.5 rounded-xl shadow-2xs">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                {coursesList.length} Programs
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-700 bg-white border border-slate-200/90 px-3 py-1.5 rounded-xl shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                Flexible Course Durations
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-700 bg-white border border-slate-200/90 px-3 py-1.5 rounded-xl shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                Practical Learning
              </span>
            </div>
          </div>

          {/* 2. SECTION HEADER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-8 pb-4 border-b border-slate-200/80">
            <div>
              <h2 className="text-2xl font-black font-display text-slate-900 tracking-tight">
                Explore Our Programs
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Choose a course that matches your current learning and career goals.
              </p>
            </div>
            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 shrink-0">
              {coursesList.length} Programs Available
            </span>
          </div>

          {/* 3. COURSE GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
            {coursesList.map((course: any) => {
              const slug = course.slug || toSlug(course.course_name);
              const CourseIcon = getCourseIcon(course.course_name);
              const displayDesc = cleanDescription(course.description, "Practical computer training with hands-on lab exercises and expert guidance.");
              const admissionUrl = `/admission?course=${encodeURIComponent(course.course_name)}`;

              return (
                <div
                  key={course.id || slug}
                  className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-200 flex flex-col justify-between group"
                >
                  {/* Card Content Top */}
                  <div>
                    {/* Icon & Eyebrow */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                        <CourseIcon className="w-5.5 h-5.5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                        PROGRAM
                      </span>
                    </div>

                    {/* Course Title */}
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2.5 leading-snug group-hover:text-blue-600 transition-colors">
                      {course.course_name}
                    </h3>

                    {/* Course Short Description */}
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                      {displayDesc}
                    </p>
                  </div>

                  {/* Card Bottom: Metadata & Actions */}
                  <div>
                    {/* Divider */}
                    <div className="border-t border-slate-100 pt-4 mb-5">
                      <div className="grid grid-cols-2 gap-3">
                        {/* Duration */}
                        <div>
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                            Duration
                          </span>
                          <span className="text-slate-900 font-extrabold text-xs sm:text-sm inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            {course.duration || "Flexible"}
                          </span>
                        </div>

                        {/* Fee */}
                        <div className="text-right">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                            Course Fee
                          </span>
                          <span className="text-slate-900 font-black text-sm sm:text-base inline-flex items-center gap-0.5 justify-end">
                            <BadgeIndianRupee className="w-4 h-4 text-emerald-600" />
                            {course.fees ? course.fees.toLocaleString("en-IN") : "Contact us"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-2.5">
                      <Link
                        href={`/courses/${slug}`}
                        className="w-full sm:flex-1 h-11 inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-600 rounded-xl font-extrabold text-xs transition-all active:scale-98 group/btn"
                      >
                        View Course
                        <ArrowRight className="w-3.5 h-3.5 text-blue-600 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>

                      <Link
                        href={admissionUrl}
                        className="w-full sm:flex-1 h-11 inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-xs transition-all shadow-md shadow-blue-500/20 active:scale-98"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* 4. REUSABLE WHATSAPP COUNSELLING BANNER */}
          <WhatsAppCounsellingBanner
            badge="COURSE COUNSELLING"
            title="Not sure which course to choose?"
            description="Talk directly with an RCI counsellor and get help choosing the right course for your learning goals."
            buttonText="Chat with RCI on WhatsApp"
            customMessage="Hello RCI, I am trying to choose a computer course and would like course counselling."
            variant="horizontal"
          />

        </div>
      </main>
      <Footer />
    </>
  );
}
