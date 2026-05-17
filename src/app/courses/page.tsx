import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { BookOpen, Clock, BadgeIndianRupee } from "lucide-react";

export const metadata = { title: "Courses | Rohit Computer Institute", description: "Browse all courses offered by Rohit Computer Institute — CCC, DCA, Tally, MS Office, Web Development and more." };

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase.from("courses").select("*").order("course_name");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-4">Our Courses</h1>
            <p className="text-slate-600 text-lg">Industry-aligned programs designed to build real-world skills and launch your career.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses && courses.length > 0 ? courses.map((course: any) => {
              const slug = course.course_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              return (
              <Link key={course.id} href={`/courses/${slug}`} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 hover:shadow-md hover:border-blue-200 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <BookOpen className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{course.course_name}</h2>
                <p className="text-slate-500 text-sm mb-6 line-clamp-3">{course.description || "Comprehensive training program with hands-on practice."}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 text-slate-500 text-sm"><Clock className="w-4 h-4" />{course.duration || "Flexible"}</span>
                  <span className="flex items-center gap-1 font-bold text-slate-900"><BadgeIndianRupee className="w-4 h-4" />{course.fees?.toLocaleString("en-IN") ?? "Contact us"}</span>
                </div>
              </Link>
              );
            }) : (
              <div className="col-span-3 text-center py-20 text-slate-400">Courses will be listed here shortly. Please check back!</div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
