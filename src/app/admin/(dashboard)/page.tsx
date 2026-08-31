import { createAdminServerClient } from "@/lib/supabase/server-admin";
import { 
  Users, Award, FileText, BookOpen, Plus, ArrowRight, 
  CheckCircle2, Clock, ShieldCheck, AlertCircle, Sparkles, UserPlus, FilePlus
} from "lucide-react";
import Link from "next/link";

// Server-side data fetcher for Admin Dashboard stats & recent activity
async function getDashboardData() {
  const supabase = await createAdminServerClient();

  const [
    studentsCount, 
    certificatesCount, 
    admissionsCount, 
    coursesCount,
    recentAdmissions,
    recentStudents,
    recentCertificates
  ] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }),
    supabase.from("certificates").select("id", { count: "exact", head: true }),
    supabase.from("admissions").select("id", { count: "exact", head: true }).eq("status", "Pending"),
    supabase.from("courses").select("id", { count: "exact", head: true }).or("status.eq.Active,status.is.null"),
    supabase.from("admissions").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("students").select("*, courses(course_name)").order("created_at", { ascending: false }).limit(5),
    supabase.from("certificates").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  return {
    stats: {
      students: studentsCount.count ?? 0,
      certificates: certificatesCount.count ?? 0,
      admissions: admissionsCount.count ?? 0,
      courses: coursesCount.count ?? 0,
    },
    recentAdmissions: recentAdmissions.data ?? [],
    recentStudents: recentStudents.data ?? [],
    recentCertificates: recentCertificates.data ?? [],
  };
}

export default async function AdminDashboardPage() {
  const { stats, recentAdmissions, recentStudents, recentCertificates } = await getDashboardData();

  // Status color pill map
  const statusColorMap: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200/80",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    Rejected: "bg-red-50 text-red-700 border-red-200/80",
    Valid: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    Revoked: "bg-red-50 text-red-700 border-red-200/80",
    Expired: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const kpiCards = [
    {
      label: "Total Students",
      value: stats.students,
      helper: "Active enrolled students",
      icon: Users,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      label: "Certificates Issued",
      value: stats.certificates,
      helper: "Verifiable credentials",
      icon: Award,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      label: "Pending Admissions",
      value: stats.admissions,
      helper: "Awaiting review",
      icon: Clock,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      label: "Active Courses",
      value: stats.courses,
      helper: "Institute programs",
      icon: BookOpen,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
  ];

  const quickActions = [
    {
      label: "Add Student",
      description: "Create new student record",
      href: "/admin/students/new",
      icon: UserPlus,
      color: "bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300",
      badge: "Primary",
    },
    {
      label: "Issue Certificate",
      description: "Generate verifiable certificate",
      href: "/admin/certificates/generate",
      icon: FilePlus,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-300",
    },
    {
      label: "View Admissions",
      description: "Review pending applications",
      href: "/admin/admissions",
      icon: FileText,
      color: "bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-300",
    },
    {
      label: "Manage Courses",
      description: "Update course programs",
      href: "/admin/courses",
      icon: BookOpen,
      color: "bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-300",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-display">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Welcome to the RCI Control Center. Here is a real-time summary of your institute operations.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <section aria-label="Key Performance Indicators" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.label} 
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${card.color} transition-transform group-hover:scale-105`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">RCI Metric</span>
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-display mb-0.5">
                {card.value}
              </p>
              <p className="text-xs font-extrabold text-slate-800">{card.label}</p>
              <p className="text-[11.5px] font-medium text-slate-500 mt-0.5">{card.helper}</p>
            </div>
          );
        })}
      </section>

      {/* Quick Action Tiles */}
      <section aria-label="Quick Administrative Actions">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-950 tracking-tight">Quick Actions</h2>
              <p className="text-xs text-slate-500 mt-0.5">Frequent operational tasks and shortcuts</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 hidden sm:inline-block">
              Shortcuts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-start gap-3.5 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${action.color}`}>
                    <ActionIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {action.label}
                      </p>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5 truncate">
                      {action.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Operational Sections Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Recent Admissions (lg:col-span-7) */}
        <section className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-extrabold text-slate-950 tracking-tight">Recent Admissions</h2>
                <p className="text-xs text-slate-500 mt-0.5">Latest student admission applications</p>
              </div>
              <Link 
                href="/admin/admissions" 
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3.5">Applicant</th>
                    <th className="px-4 py-3.5">Course</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentAdmissions.length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    recentAdmissions.map((adm: any) => (
                      <tr key={adm.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-extrabold text-slate-900">{adm.student_name || "Applicant"}</p>
                          <p className="text-[10.5px] text-slate-500 font-mono mt-0.5">{adm.phone || adm.email || "—"}</p>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-slate-700">{adm.selected_course || "—"}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold border ${statusColorMap[adm.status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                            {adm.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 font-medium text-[11px]">
                          {new Date(adm.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Clock className="w-8 h-8 text-slate-300 mb-2" />
                          <p className="text-xs font-extrabold text-slate-700">No recent admissions</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">You are all caught up on admission requests.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Recent Registered Students (lg:col-span-5) */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-950 tracking-tight">Recent Students</h2>
                <p className="text-xs text-slate-500 mt-0.5">Newly enrolled student profiles</p>
              </div>
              <Link 
                href="/admin/students" 
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Student List */}
            <div className="space-y-3">
              {recentStudents.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                recentStudents.map((student: any) => {
                  const initial = student.full_name ? student.full_name.charAt(0).toUpperCase() : "S";
                  return (
                    <div key={student.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-200/60 text-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                        {initial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-extrabold text-slate-900 truncate">{student.full_name}</p>
                        <p className="text-[11px] text-slate-500 font-medium truncate">
                          {student.courses?.course_name || student.email || "Enrolled student"}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 shrink-0">
                        {new Date(student.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-400">
                  <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-extrabold text-slate-700">No registered students</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Add your first student to get started.</p>
                </div>
              )}
            </div>
          </div>
        </section>

      </div>

      {/* BOTTOM SECTION: Recent Certificates Activity */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-950 tracking-tight">Recent Certificates Issued</h2>
            <p className="text-xs text-slate-500 mt-0.5">Official RCI verifiable credentials</p>
          </div>
          <Link 
            href="/admin/certificates" 
            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View All Certificates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Certificate No.</th>
                <th className="px-4 py-3.5">Student Name</th>
                <th className="px-4 py-3.5">Course</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Issue Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentCertificates.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                recentCertificates.map((cert: any) => (
                  <tr key={cert.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 text-[11px]">
                        {cert.certificate_number || cert.id.substring(0, 8)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-slate-900">{cert.student_name || "—"}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-700">{cert.course_name || "—"}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold border ${statusColorMap[cert.status] || "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {cert.status || "Valid"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 font-medium text-[11px]">
                      {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString("en-IN") : new Date(cert.created_at).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Award className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-xs font-extrabold text-slate-700">No certificates issued yet</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Generate your first verifiable certificate.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
