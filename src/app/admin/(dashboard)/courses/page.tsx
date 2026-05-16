import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase.from("courses").select("*").order("course_name");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Courses</h1>
          <p className="text-slate-500 mt-1">Manage all courses offered by RCI.</p>
        </div>
        <Link href="/admin/courses/new" className="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Course
        </Link>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses && courses.length > 0 ? (
          courses.map((course: any) => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 text-lg mb-2">{course.course_name}</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{course.description || "No description provided."}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Duration: <span className="text-slate-700 font-medium">{course.duration || "—"}</span></span>
                <span className="font-bold text-slate-900">₹{course.fees?.toLocaleString("en-IN") ?? "—"}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 bg-white rounded-2xl border border-slate-200 py-16 text-center text-slate-400">
            No courses found. Add your first course.
          </div>
        )}
      </div>
    </div>
  );
}
