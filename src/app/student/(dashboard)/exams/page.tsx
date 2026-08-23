import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import { FlaskConical, Calendar, Clock, AlertCircle } from "lucide-react";

export default async function StudentExamsPage() {
  const { student, supabase } = await getStudentSession();
  if (!student) redirect("/student/login");

  const course = student.courses as any;

  const { data: exams } = await supabase
    .from("exams")
    .select("*")
    .eq("course_id", student.course_id)
    .order("exam_date", { ascending: true });

  const today = new Date();
  const upcoming = (exams ?? []).filter((e: any) => new Date(e.exam_date) >= today);
  const past = (exams ?? []).filter((e: any) => new Date(e.exam_date) < today);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display">Examinations</h1>
        <p className="text-slate-500 mt-1 text-sm">Your upcoming and past exam schedule.</p>
      </div>

      {/* Upcoming */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" /> Upcoming Exams
          {upcoming.length > 0 && (
            <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">{upcoming.length}</span>
          )}
        </h2>
        {upcoming.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center h-36 gap-2 text-slate-400 text-sm">
            <FlaskConical className="w-7 h-7" />
            No upcoming exams scheduled.
          </div>
        ) : (
          <div className="grid gap-3">
            {upcoming.map((exam: any) => {
              const daysLeft = Math.ceil((new Date(exam.exam_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={exam.id} className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-5 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center shrink-0 text-indigo-700">
                    <span className="text-xs font-bold">{new Date(exam.exam_date).toLocaleDateString("en-IN", { month: "short" })}</span>
                    <span className="text-xl font-bold font-display leading-none">{new Date(exam.exam_date).getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{exam.exam_name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Max Marks: {exam.max_marks}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${daysLeft <= 3 ? "bg-red-50 text-red-700 border border-red-200" : "bg-indigo-50 text-indigo-700 border border-indigo-200"}`}>
                      {daysLeft === 0 ? "Today!" : daysLeft === 1 ? "Tomorrow" : `${daysLeft} days left`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Alert if exam soon */}
      {upcoming.some((e: any) => Math.ceil((new Date(e.exam_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) <= 3) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-amber-700 font-medium">You have an exam in the next 3 days. Please prepare accordingly and check your admit card.</p>
        </div>
      )}

      {/* Past */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-400" /> Past Exams
        </h2>
        {past.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center h-36 gap-2 text-slate-400 text-sm">
            <Calendar className="w-7 h-7" />
            No past exams yet.
          </div>
        ) : (
          <div className="grid gap-3">
            {past.reverse().map((exam: any) => (
              <div key={exam.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-5 opacity-70">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center shrink-0 text-slate-500">
                  <span className="text-xs font-bold">{new Date(exam.exam_date).toLocaleDateString("en-IN", { month: "short" })}</span>
                  <span className="text-xl font-bold font-display leading-none">{new Date(exam.exam_date).getDate()}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-700">{exam.exam_name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Max Marks: {exam.max_marks}</p>
                </div>
                <span className="text-xs font-bold text-slate-400 shrink-0">Completed</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
