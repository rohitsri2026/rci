import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import { BarChart3, Medal, TrendingUp } from "lucide-react";

export default async function StudentResultsPage() {
  const { student, supabase } = await getStudentSession();
  if (!student) redirect("/student/login");

  const { data: results } = await supabase
    .from("exam_results")
    .select(`
      *,
      exams:exam_id (
        exam_name,
        max_marks,
        exam_date,
        courses:course_id (course_name)
      )
    `)
    .eq("student_id", student.id)
    .order("created_at", { ascending: false });

  const records = results ?? [];
  const avgPct = records.length > 0
    ? Math.round(records.reduce((sum: number, r: any) => {
        const max = Number(r.exams?.max_marks ?? 100);
        return sum + (Number(r.marks_obtained) / max) * 100;
      }, 0) / records.length)
    : null;

  const gradeColor: Record<string, string> = {
    "A+": "text-emerald-700 bg-emerald-50 border-emerald-200",
    A: "text-emerald-700 bg-emerald-50 border-emerald-200",
    B: "text-blue-700 bg-blue-50 border-blue-200",
    C: "text-amber-700 bg-amber-50 border-amber-200",
    D: "text-orange-700 bg-orange-50 border-orange-200",
    F: "text-red-700 bg-red-50 border-red-200",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display">Exam Results</h1>
        <p className="text-slate-500 mt-1 text-sm">Your academic performance across all exams.</p>
      </div>

      {/* Summary */}
      {avgPct !== null && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Average Score", value: `${avgPct}%`, icon: TrendingUp, color: "text-indigo-700 bg-indigo-50 border-indigo-100" },
            { label: "Total Exams", value: records.length, icon: BarChart3, color: "text-blue-700 bg-blue-50 border-blue-100" },
            { label: "Best Grade", value: records.length > 0 ? records.sort((a: any, b: any) => Number(b.marks_obtained) - Number(a.marks_obtained))[0].grade : "—", icon: Medal, color: "text-amber-700 bg-amber-50 border-amber-100" },
          ].map((card) => (
            <div key={card.label} className={`rounded-2xl border p-5 flex items-center gap-4 ${card.color}`}>
              <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shrink-0">
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-60">{card.label}</p>
                <p className="text-2xl font-bold font-display">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Result Sheet</h3>
        </div>
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2 text-sm">
            <BarChart3 className="w-8 h-8" />
            No results published yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wide">
                  <th className="px-6 py-3 text-left">Exam</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Marks</th>
                  <th className="px-6 py-3 text-left">Percentage</th>
                  <th className="px-6 py-3 text-left">Grade</th>
                  <th className="px-6 py-3 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r: any) => {
                  const max = Number(r.exams?.max_marks ?? 100);
                  const pct = Math.round((Number(r.marks_obtained) / max) * 100);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3">
                        <p className="font-bold text-slate-900">{r.exams?.exam_name ?? "—"}</p>
                        <p className="text-xs text-slate-400">{r.exams?.courses?.course_name ?? ""}</p>
                      </td>
                      <td className="px-6 py-3 text-slate-600 text-xs">
                        {r.exams?.exam_date ? new Date(r.exams.exam_date).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td className="px-6 py-3 font-mono font-bold text-slate-900">{r.marks_obtained} / {max}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5">
                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${gradeColor[r.grade] ?? "text-slate-700 bg-slate-50 border-slate-200"}`}>
                          {r.grade}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-500 text-xs">{r.remarks ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
