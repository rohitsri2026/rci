import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import { BookOpen, CheckCircle, Clock, BookMarked, ShieldCheck } from "lucide-react";

export default async function StudentCoursesPage() {
  const { student } = await getStudentSession();
  if (!student) redirect("/student/login");

  const course = student.courses as any;
  const curriculum = (course?.curriculum as any[]) ?? [];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-extrabold text-[#07152F] font-display">My Course</h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">Your officially enrolled computer course program and syllabus curriculum.</p>
      </div>

      {!course ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-12 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-2xs">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg font-display">No Active Course Assigned</h3>
          <p className="text-xs text-slate-500 max-w-sm font-medium">
            Please contact RCI institute administration desk to assign your course program.
          </p>
        </div>
      ) : (
        <>
          {/* Hero */}
          <div className="bg-gradient-to-r from-[#07152F] via-[#0B224D] to-[#155EEF] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold mb-3 text-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                <span>Currently Enrolled</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display">{course.course_name}</h2>
              <div className="flex gap-6 mt-3 text-xs sm:text-sm text-blue-100/90 font-medium">
                {course.duration && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-300" /> Duration: <strong>{course.duration}</strong>
                  </span>
                )}
                {course.fees && (
                  <span className="flex items-center gap-1.5">
                    <BookMarked className="w-4 h-4 text-blue-300" /> Course Fee: <strong>₹{course.fees}</strong>
                  </span>
                )}
              </div>
            </div>

            <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Course Overview */}
          {course.description && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-2">
              <h3 className="font-extrabold text-slate-950 text-base font-display">Course Overview</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">{course.description}</p>
            </div>
          )}

          {/* Curriculum */}
          {curriculum.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <h3 className="font-extrabold text-slate-950 text-base font-display">Syllabus Curriculum</h3>
                <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  {curriculum.length} Modules
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {curriculum.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-4 px-6 py-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-700 font-extrabold text-xs mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-slate-950 text-sm">
                        {typeof item === "string" ? item : item.topic ?? item.title ?? JSON.stringify(item)}
                      </p>
                      {typeof item === "object" && item.duration && (
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{item.duration}</p>
                      )}
                    </div>
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
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
