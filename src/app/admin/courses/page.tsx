import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Courses</h1>
          <p className="text-slate-500 mt-1">Manage all courses offered by RCI.</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Add Course
        </Link>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses && courses.length > 0 ? (
          courses.map((course: any) => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-lg">{course.name}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${course.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                  {course.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Duration: {course.duration}</span>
                <span className="font-semibold text-slate-800">₹{course.price?.toLocaleString()}</span>
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
