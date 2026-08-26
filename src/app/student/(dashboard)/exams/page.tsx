import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import { FlaskConical, Calendar, Clock, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";

export default async function StudentExamsPage() {
  const { student, supabase } = await getStudentSession();
  if (!student) redirect("/student/login");

  // Fetch student's exam results and course exam schedules in parallel
  const [resultsRes, examsRes] = await Promise.all([
    supabase
      .from("exam_results")
      .select("*, exams(*)")
      .eq("student_id", student.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("exams")
      .select("*")
      .eq("course_id", student.course_id)
      .order("exam_date", { ascending: true }),
  ]);

  const results = resultsRes.data || [];
  const exams = examsRes.data || [];

  const today = new Date();
  const upcoming = exams.filter((e: any) => new Date(e.exam_date) >= today);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-extrabold text-[#07152F] font-display">Exams & Results</h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">Track your upcoming exam schedules and published academic results.</p>
      </div>

      {/* Published Exam Results */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-[#07152F] flex items-center gap-2 font-display">
          <TrendingUp className="w-5 h-5 text-purple-600" /> Academic Exam Results
          {results.length > 0 && (
            <span className="bg-purple-100 text-purple-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-purple-200">
              {results.length}
            </span>
          )}
        </h2>

        {results.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-10 flex flex-col items-center justify-center gap-2 text-center text-slate-400">
            <FlaskConical className="w-8 h-8 text-slate-300" />
            <p className="font-extrabold text-slate-700 text-sm">No exam results available yet.</p>
            <p className="text-xs text-slate-400">Marks and certificates will be published here after evaluation.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {results.map((res: any) => {
              const maxMarks = res.max_marks || res.exams?.max_marks || 100;
              const obtained = Number(res.marks_obtained || 0);
              const percentage = Math.round((obtained / maxMarks) * 100);
              const isPass = percentage >= 40;

              return (
                <div key={res.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-base shrink-0 border ${
                      isPass ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}>
                      {percentage}%
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-950 text-base font-display">
                        {res.exams?.title || res.exams?.exam_name || "Course Exam"}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Subject: <strong className="text-slate-800">{res.exams?.subject || "Computer Application"}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 text-xs border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Score</span>
                      <span className="font-extrabold text-slate-900 text-sm">{obtained} / {maxMarks}</span>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                      isPass ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}>
                      {isPass ? "PASSED" : "FAILED"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Exam Schedules */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-[#07152F] flex items-center gap-2 font-display">
          <Clock className="w-5 h-5 text-blue-600" /> Upcoming Exam Schedule
          {upcoming.length > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-blue-200">
              {upcoming.length}
            </span>
          )}
        </h2>

        {upcoming.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-8 flex flex-col items-center justify-center gap-2 text-center text-slate-400 text-xs font-medium">
            <Calendar className="w-6 h-6 text-slate-300" />
            <span>No upcoming exams scheduled for your course.</span>
          </div>
        ) : (
          <div className="grid gap-3">
            {upcoming.map((exam: any) => {
              const daysLeft = Math.ceil((new Date(exam.exam_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={exam.id} className="bg-white rounded-2xl border border-blue-100 shadow-2xs p-5 flex items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center shrink-0 text-blue-700">
                      <span className="text-[10px] font-extrabold uppercase">{new Date(exam.exam_date).toLocaleDateString("en-IN", { month: "short" })}</span>
                      <span className="text-xl font-extrabold font-display leading-none">{new Date(exam.exam_date).getDate()}</span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-950 text-sm">{exam.exam_name || exam.title}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Max Marks: {exam.max_marks || 100}</p>
                    </div>
                  </div>

                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                    daysLeft <= 3 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}>
                    {daysLeft === 0 ? "Today!" : daysLeft === 1 ? "Tomorrow" : `${daysLeft} days left`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Alert if exam is within 3 days */}
      {upcoming.some((e: any) => Math.ceil((new Date(e.exam_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) <= 3) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-amber-800 font-bold">You have an exam scheduled in the next 3 days. Please review your course syllabus and arrive on time at the institute exam hall.</p>
        </div>
      )}
    </div>
  );
}
