import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import { CalendarCheck, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default async function StudentAttendancePage() {
  const { student, supabase } = await getStudentSession();
  if (!student) redirect("/student/login");

  const { data: attendance } = await supabase
    .from("attendance")
    .select("*")
    .eq("student_id", student.id)
    .order("date", { ascending: false });

  const records = attendance ?? [];
  const total = records.length;
  const present = records.filter((r: any) => r.status === "Present").length;
  const absent = records.filter((r: any) => r.status === "Absent").length;
  const leave = records.filter((r: any) => r.status === "Leave").length;
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

  const statusConfig: Record<string, { color: string; dotColor: string }> = {
    Present: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", dotColor: "bg-emerald-500" },
    Absent: { color: "bg-red-50 text-red-700 border-red-200", dotColor: "bg-red-500" },
    Leave: { color: "bg-amber-50 text-amber-700 border-amber-200", dotColor: "bg-amber-500" },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display">Attendance Record</h1>
        <p className="text-slate-500 mt-1 text-sm">Your complete attendance history.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Overall %", value: `${pct}%`, icon: CalendarCheck, color: pct >= 75 ? "text-emerald-700 bg-emerald-50 border-emerald-100" : "text-red-700 bg-red-50 border-red-100" },
          { label: "Present", value: present, icon: TrendingUp, color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
          { label: "Absent", value: absent, icon: TrendingDown, color: "text-red-700 bg-red-50 border-red-100" },
          { label: "Leave", value: leave, icon: Minus, color: "text-amber-700 bg-amber-50 border-amber-100" },
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

      {/* Attendance Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-900">Attendance Rate</h3>
          <span className={`font-bold text-sm ${pct >= 75 ? "text-emerald-600" : "text-red-600"}`}>{pct}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3.5">
          <div
            className={`h-3.5 rounded-full transition-all ${pct >= 75 ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-gradient-to-r from-red-400 to-red-600"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct < 75 && (
          <p className="text-red-600 text-xs font-semibold mt-2.5">⚠ Your attendance is below the required 75%. Please attend classes regularly.</p>
        )}
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Daily Record</h3>
        </div>
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2 text-sm">
            <CalendarCheck className="w-8 h-8" />
            No attendance records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wide">
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r: any) => {
                  const cfg = statusConfig[r.status] ?? { color: "bg-slate-50 text-slate-700 border-slate-200", dotColor: "bg-slate-400" };
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3 font-medium text-slate-900">
                        {new Date(r.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor}`} />
                          {r.status}
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
