import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import { BookMarked, FileText, Download, Clock } from "lucide-react";

export default async function StudentMaterialsPage() {
  const { student, user } = await getStudentSession();
  if (!student || !user) redirect("/student/login");

  const course = student.courses as any;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-950 font-display">Study Materials</h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">
          Access learning notes, reference guides, assignments, and PDFs for {course?.course_name || "your course"}.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-10 text-center max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mx-auto shadow-2xs">
          <BookMarked className="w-8 h-8 text-purple-600" />
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-slate-950 font-display">
            Study Materials Will Appear Here Soon
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            Your instructor will upload class notes, reference PDFs, practice modules, and assignments for {course?.course_name || "your enrolled course"}.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-extrabold">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Course: {course?.course_name || "Enrolled Program"}</span>
        </div>
      </div>
    </div>
  );
}
