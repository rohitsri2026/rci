import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  CalendarCheck,
  CreditCard,
  Award,
  Bell,
  ChevronRight,
  GraduationCap,
  Zap,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default async function StudentDashboardPage() {
  const { student, user, supabase } = await getStudentSession();

  if (!student || !user) {
    redirect("/student/login");
  }

  // Parallel data fetching — all scoped to this student's ID
  const [feesRes, certsRes, notifRes, attendanceRes] = await Promise.all([
    supabase
      .from("student_fees_ledger")
      .select("status, total_paid, fee_plans(total_amount), discount_amount")
      .eq("student_id", student.id)
      .maybeSingle(),
    supabase
      .from("certificates")
      .select("id", { count: "exact", head: true })
      .eq("student_id", student.id)
      .eq("status", "Valid"),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false),
    supabase
      .from("attendance")
      .select("status")
      .eq("student_id", student.id),
  ]);

  const ledger = feesRes.data as any;
  const certCount = certsRes.count ?? 0;
  const unreadNotif = notifRes.count ?? 0;

  // Attendance %
  const attendanceRecords = attendanceRes.data ?? [];
  const presentCount = attendanceRecords.filter((a: any) => a.status === "Present").length;
  const attendancePct = attendanceRecords.length > 0
    ? Math.round((presentCount / attendanceRecords.length) * 100)
    : null;

  // Fee balance
  const planTotal = Number((ledger?.fee_plans as any)?.total_amount ?? 0);
  const discount = Number(ledger?.discount_amount ?? 0);
  const paid = Number(ledger?.total_paid ?? 0);
  const feeBalance = Math.max(0, planTotal - discount - paid);

  const course = student.courses as any;

  const quickActions = [
    { label: "View Attendance", href: "/student/attendance", icon: CalendarCheck, color: "bg-violet-50 text-violet-700 border-violet-100" },
    { label: "Check Results", href: "/student/results", icon: TrendingUp, color: "bg-blue-50 text-blue-700 border-blue-100" },
    { label: "Pay Fees", href: "/student/fees", icon: CreditCard, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    { label: "My Certificates", href: "/student/certificates", icon: Award, color: "bg-amber-50 text-amber-700 border-amber-100" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">Welcome back 👋</p>
            <h1 className="text-3xl font-bold font-display tracking-tight">{student.full_name}</h1>
            {course && (
              <div className="flex items-center gap-2 mt-3">
                <GraduationCap className="w-4 h-4 text-white/60" />
                <span className="text-white/70 text-sm">{course.course_name}</span>
              </div>
            )}
          </div>
          <div className="text-right hidden md:block">
            <p className="text-white/50 text-xs mb-1">Student ID</p>
            <p className="text-white font-mono font-bold text-sm">{student.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Attendance",
            value: attendancePct !== null ? `${attendancePct}%` : "N/A",
            sub: `${presentCount}/${attendanceRecords.length} days`,
            icon: CalendarCheck,
            color: "text-violet-600 bg-violet-50",
            href: "/student/attendance",
          },
          {
            label: "Certificates",
            value: certCount,
            sub: "Valid certificates",
            icon: Award,
            color: "text-amber-600 bg-amber-50",
            href: "/student/certificates",
          },
          {
            label: "Fee Balance",
            value: `₹${feeBalance}`,
            sub: feeBalance > 0 ? "Pending" : "All paid!",
            icon: CreditCard,
            color: feeBalance > 0 ? "text-red-600 bg-red-50" : "text-emerald-600 bg-emerald-50",
            href: "/student/fees",
          },
          {
            label: "Notifications",
            value: unreadNotif,
            sub: "Unread messages",
            icon: Bell,
            color: "text-indigo-600 bg-indigo-50",
            href: "/student/notifications",
          },
        ].map((card) => (
          <Link key={card.label} href={card.href} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color} mb-4`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-display">{card.value}</p>
            <p className="text-slate-500 text-xs mt-1">{card.label}</p>
            <p className="text-slate-400 text-[10px] mt-0.5">{card.sub}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border text-center font-semibold text-sm hover:shadow-md transition-all ${action.color}`}
            >
              <action.icon className="w-6 h-6" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Fee Alert */}
      {feeBalance > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-amber-900">Fee Payment Pending</p>
            <p className="text-amber-700 text-sm mt-0.5">You have an outstanding fee balance of <strong>₹{feeBalance}</strong>. Please contact the administration or visit the fees section.</p>
          </div>
          <Link href="/student/fees" className="flex items-center gap-1 text-amber-700 font-bold text-sm hover:text-amber-900 shrink-0">
            View <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
