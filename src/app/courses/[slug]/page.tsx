import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CheckCircle, Clock, BadgeIndianRupee, Star, ChevronDown, ArrowRight,
  BookOpen, Users, Award, PlayCircle
} from "lucide-react";
import type { Metadata } from "next";
import WhatsAppCounsellingBanner from "@/components/whatsapp-counselling-banner";

// Generate slug from course name
function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Map course thumbnail URL with safe local default fallback
function getSafeCourseImage(thumbnailUrl?: string | null): string {
  if (thumbnailUrl && thumbnailUrl.trim().length > 0) {
    return thumbnailUrl.trim();
  }
  return "/courses/dca.jpg";
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  let { data: course } = await supabase
    .from("courses")
    .select("course_name, description, slug, seo_metadata, status")
    .or("status.eq.Active,status.is.null")
    .eq("slug", slug)
    .maybeSingle();

  // Slug normalization fallback
  if (!course) {
    const { data: allCourses } = await supabase
      .from("courses")
      .select("course_name, description, slug, seo_metadata, status")
      .or("status.eq.Active,status.is.null");
    course = allCourses?.find((c: any) => toSlug(c.slug || c.course_name) === slug) || null;
  }

  if (!course) return { title: "Course Not Found | RCI" };
  
  const seo = (course.seo_metadata || {}) as any;
  return {
    title: seo?.title || `${course.course_name} | Rohit Computer Institute`,
    description: seo?.description || course.description || `Learn ${course.course_name} at Rohit Computer Institute. Expert faculty, hands-on training, and placement assistance.`,
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  let { data: course } = await supabase
    .from("courses")
    .select("*")
    .or("status.eq.Active,status.is.null")
    .eq("slug", slug)
    .maybeSingle();

  // Slug normalization fallback
  if (!course) {
    const { data: allCourses } = await supabase
      .from("courses")
      .select("*")
      .or("status.eq.Active,status.is.null");
    course = allCourses?.find((c: any) => toSlug(c.slug || c.course_name) === slug) || null;
  }

  if (!course || course.status === "Inactive") return notFound();

  // 100% Database Driven Arrays
  const curriculum: any[] = Array.isArray(course.curriculum) ? course.curriculum : [];
  const faqs: any[] = Array.isArray(course.faqs) ? course.faqs : [];

  const seoData = (course.seo_metadata || {}) as any;
  const reviews: any[] = Array.isArray(seoData.reviews) ? seoData.reviews : [];

  const displayRating = seoData.rating || 4.9;
  const displayReviewCount = seoData.review_count || (reviews.length > 0 ? reviews.length * 12 : 36);
  const categoryName = seoData.category || "Computer";

  // Fee & Discount calculations
  const rawFee = Number(course.fees) || 0;
  const discountAmount = Number(course.discount) || 0;
  const hasDiscount = discountAmount > 0 && discountAmount < rawFee;
  const finalFee = hasDiscount ? rawFee - discountAmount : rawFee;
  const originalFee = rawFee;

  const totalLessons = curriculum.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const courseImage = getSafeCourseImage(course.thumbnail_url);

  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen">

        {/* Hero - Split Layout */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-28 pb-0 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)" }} />
          <div className="container mx-auto px-6 relative z-10">
            <Link href="/courses" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm mb-8 transition-colors">
              ← Back to All Courses
            </Link>
            <div className="grid lg:grid-cols-2 gap-10 items-end">
              {/* Left: Course Info */}
              <div className="pb-12">
                <span className="inline-block bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/30 mb-5">
                  {categoryName}
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
                  {course.course_name}
                </h1>
                <p className="text-blue-100/80 text-base mb-7 leading-relaxed">
                  {course.description || `Master the skills of ${course.course_name} with our industry-focused curriculum, expert faculty, and real-world projects designed to make you job-ready.`}
                </p>
                <div className="flex flex-wrap gap-5 mb-7">
                  {[
                    { icon: Clock, label: course.duration || "Flexible", text: "Duration" },
                    { icon: BookOpen, label: `${curriculum.length} Modules`, text: "Curriculum" },
                    { icon: PlayCircle, label: `${totalLessons} Lessons`, text: "Content" },
                    { icon: Users, label: "500+", text: "Enrolled" },
                  ].map(({ icon: Icon, label, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-300" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{label}</p>
                        <p className="text-blue-300/70 text-xs">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                  <span className="text-white font-semibold ml-1">{displayRating}</span>
                  <span className="text-blue-300/60 text-sm">({displayReviewCount}+ reviews)</span>
                </div>
              </div>

              {/* Right: Fully Visible Course Image */}
              <div className="relative h-[360px] lg:h-[440px] rounded-t-3xl overflow-hidden shadow-2xl shadow-black/50">
                <Image
                  src={courseImage}
                  alt={course.course_name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {hasDiscount && (
                    <span className="bg-slate-900/80 text-white/70 line-through text-xs font-bold px-3 py-1 rounded-xl backdrop-blur-xs">
                      ₹{originalFee.toLocaleString("en-IN")}
                    </span>
                  )}
                  <span className="bg-white text-slate-900 text-lg font-black px-4 py-2 rounded-2xl shadow-lg">
                    ₹{finalFee.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enroll Bar */}
        <div className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-40">
          <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                {hasDiscount && (
                  <span className="text-slate-400 text-sm line-through font-bold">
                    ₹{originalFee.toLocaleString("en-IN")}
                  </span>
                )}
                <p className="font-black text-slate-900 text-xl">₹{finalFee.toLocaleString("en-IN")}</p>
              </div>
              <p className="text-slate-400 text-xs">One-time · No hidden fees</p>
            </div>
            <div className="flex gap-3">
              <Link href={`/admission?course=${encodeURIComponent(course.course_name)}`} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-500/20">
                Enroll Now <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:+917376893097" className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl font-semibold text-sm transition-colors">
                Call Us
              </a>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16 max-w-5xl">

          {/* Curriculum */}
          <section className="mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Curriculum</h2>
            <p className="text-slate-500 mb-8">{curriculum.length} modules · {totalLessons} lessons</p>
            {curriculum.length > 0 ? (
              <div className="space-y-4">
                {curriculum.map((mod, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                          <span className="text-white font-bold text-sm">{String(i + 1).padStart(2, "0")}</span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium">{mod.module}</p>
                          <h3 className="font-bold text-slate-900">{mod.title}</h3>
                        </div>
                      </div>
                      <span className="text-slate-400 text-sm shrink-0">{mod.lessons?.length || 0} lessons</span>
                    </div>
                    {mod.lessons && mod.lessons.length > 0 && (
                      <div className="border-t border-slate-100 px-6 py-4 grid sm:grid-cols-2 gap-2">
                        {mod.lessons.map((l: string, j: number) => (
                          <div key={j} className="flex items-center gap-2 text-slate-600 text-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                            {l}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
                Curriculum details for this course will be updated soon.
              </div>
            )}
          </section>

          {/* Duration & Fees */}
          <section className="mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Duration & Fees</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">Total Duration</p>
                  <p className="text-3xl font-black text-slate-900">{course.duration || "Flexible"}</p>
                  <p className="text-slate-400 text-xs mt-1">Morning & Evening batches</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
                  <BadgeIndianRupee className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">Course Fees</p>
                  <div className="flex items-center gap-2">
                    {hasDiscount && (
                      <span className="text-slate-400 text-lg line-through font-extrabold">
                        ₹{originalFee.toLocaleString("en-IN")}
                      </span>
                    )}
                    <p className="text-3xl font-black text-slate-900">₹{finalFee.toLocaleString("en-IN")}</p>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">EMI options available</p>
                </div>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-1">Student Reviews</h2>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  <span className="text-slate-600 text-sm font-semibold">{displayRating} out of 5</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-100 px-4 py-2 rounded-xl text-sm font-semibold">
                <Award className="w-4 h-4" /> Top Rated
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((r: any, i: number) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {r.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{r.name}</p>
                      <p className="text-slate-400 text-xs">{r.course}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {Array(r.rating).fill(0).map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="group bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <summary className="flex items-center justify-between cursor-pointer px-6 py-5 font-semibold text-slate-900 list-none select-none">
                    {faq.q}
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 sm:p-10 text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">Ready to Get Started?</h2>
            <p className="text-blue-100 mb-8 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">Join hundreds of students who have already transformed their careers with this course.</p>
            <Link href={`/admission?course=${encodeURIComponent(course.course_name)}`} className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-lg">
              Apply for Admission <ArrowRight className="w-5 h-5" />
            </Link>
          </section>

          {/* Reusable WhatsApp Counselling Banner */}
          <WhatsAppCounsellingBanner
            badge="COURSE COUNSELLING"
            title={`Have questions about ${course.course_name}?`}
            description="Talk directly with an RCI admissions counsellor about batch timings, fees, and syllabus details."
            buttonText="Chat with RCI on WhatsApp"
            customMessage={`Hello RCI, I have questions about the ${course.course_name} course.`}
            variant="horizontal"
          />

        </div>
      </main>
      <Footer />
    </>
  );
}
