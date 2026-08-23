import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import { BookOpen, CheckCircle, Clock, BookMarked } from "lucide-react";

export default async function StudentCoursesPage() {
  const { student } = await getStudentSession();
  if (!student) redirect("/student/login");

  const course = student.courses as any;
  const curriculum = course?.curriculum as any[] ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display">My Course</h1>
        <p className="text-slate-500 mt-1 text-sm">Your enrolled course and curriculum details.</p>
      </div>

      {!course ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
          <BookOpen className="w-10 h-10" />
          <p className="font-semibold">No course assigned yet</p>
          <p className="text-sm text-slate-300">Please contact the administration.</p>
        </div>
      ) : (
        <>
          {/* Hero */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Currently Enrolled</p>
                <h2 className="text-2xl font-bold font-display">{course.course_name}</h2>
                <div className="flex gap-4 mt-4 text-sm text-white/70">
                  {course.duration && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{course.duration}</span>}
                  {course.fees && <span className="flex items-center gap-1.5"><BookMarked className="w-4 h-4" />₹{course.fees}</span>}
                </div>
              </div>
              <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Description */}
          {course.description && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-3">About This Course</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{course.description}</p>
            </div>
          )}

          {/* Curriculum */}
          {curriculum.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Curriculum</h3>
                <p className="text-slate-500 text-xs mt-0.5">{curriculum.length} modules</p>
              </div>
              <div className="divide-y divide-slate-100">
                {curriculum.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-4 px-6 py-4">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 font-bold text-xs mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{typeof item === "string" ? item : item.topic ?? item.title ?? JSON.stringify(item)}</p>
                      {typeof item === "object" && item.duration && (
                        <p className="text-xs text-slate-400 mt-0.5">{item.duration}</p>
                      )}
                    </div>
                    <CheckCircle className="w-4 h-4 text-slate-200 ml-auto shrink-0 mt-0.5" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
