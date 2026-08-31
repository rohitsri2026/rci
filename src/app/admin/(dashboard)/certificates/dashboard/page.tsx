import { createAdminServerClient } from "@/lib/supabase/server-admin";
import { Award, Calendar, Clock, CheckCircle2, ShieldAlert, ArrowRight, Activity, Eye, FileText } from "lucide-react";
import Link from "next/link";
import React from "react";

export const dynamic = "force-dynamic";

async function getCertificateStats() {
  const supabase = await createAdminServerClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalCount,
    monthCount,
    todayCount,
    pendingAdmissions,
    verifiedLogs,
    recentCertificates,
    recentLogs
  ] = await Promise.all([
    // Total certificates
    supabase.from("certificates").select("id", { count: "exact", head: true }),
    
    // This Month's
    supabase.from("certificates")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString()),

    // Today's
    supabase.from("certificates")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startOfToday.toISOString()),

    // Pending admissions awaiting registration
    supabase.from("admissions")
      .select("id", { count: "exact", head: true })
      .eq("status", "Pending"),

    // Verified certificate audit events
    supabase.from("audit_logs")
      .select("id", { count: "exact", head: true })
      .eq("action", "Verified"),

    // Recent certificates
    supabase.from("certificates")
      .select(`
        id,
        certificate_number,
        student_name,
        course_name,
        issue_date,
        status,
        created_at
      `)
      .order("created_at", { ascending: false })
      .limit(5),

    // Recent activity logs
    supabase.from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6)
  ]);

  return {
    total: totalCount.count ?? 0,
    month: monthCount.count ?? 0,
    today: todayCount.count ?? 0,
    pending: pendingAdmissions.count ?? 0,
    verified: verifiedLogs.count ?? 0,
    recentCertificates: recentCertificates.data ?? [],
    recentLogs: recentLogs.data ?? []
  };
}

export default async function CertificateDashboardPage() {
  const stats = await getCertificateStats();

  const metrics = [
    { label: "Total Registry", value: stats.total, icon: Award, color: "blue", desc: "Overall certificates issued" },
    { label: "Issued This Month", value: stats.month, icon: Calendar, color: "green", desc: "Generated in current month" },
    { label: "Issued Today", value: stats.today, icon: Clock, color: "amber", desc: "New certificates today" },
    { label: "Pending Approvals", value: stats.pending, icon: ShieldAlert, color: "rose", desc: "Awaiting student registration" },
    { label: "QR Verifications", value: stats.verified, icon: CheckCircle2, color: "purple", desc: "Verified QR scan instances" },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  const statusColor: Record<string, string> = {
    Valid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Revoked: "bg-rose-50 text-rose-700 border-rose-200",
    Expired: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-display">
            Certificates Analytics & Overview
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Overview of issued certifications, recent verification activity, and audit logs.
          </p>
        </div>

        <Link
          href="/admin/certificates/generate"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 shrink-0 self-start sm:self-auto"
        >
          <Award className="w-4 h-4" />
          <span>Issue Certificate</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colorMap[m.color]}`}>
              <m.icon className="w-4.5 h-4.5" />
            </div>
            <p className="text-2xl font-extrabold text-slate-950 tracking-tight font-display mt-2">{m.value}</p>
            <p className="text-xs font-extrabold text-slate-800">{m.label}</p>
            <p className="text-[11px] text-slate-400 font-medium">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Quick Action Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-slate-800">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg tracking-tight">Need to issue student credentials?</h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Generate dynamic digital credentials for students individually or run bulk certificate batches.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/certificates/generate" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-colors shadow-md shadow-blue-500/20">
            Issue Credentials
          </Link>
          <Link href="/admin/certificates" className="border border-slate-700 text-slate-200 hover:bg-slate-800 px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-colors">
            Registry Workspace
          </Link>
        </div>
      </div>

      {/* Main Grid: Recent Issued & Audit Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recently Generated Certificates */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-950 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Recently Issued Credentials</span>
            </h3>
            <Link href="/admin/certificates" className="text-xs font-extrabold text-blue-600 hover:underline flex items-center gap-1">
              <span>View Registry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Certificate ID</th>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {stats.recentCertificates.length > 0 ? (
                  stats.recentCertificates.map((cert: any) => (
                    <tr key={cert.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-extrabold text-slate-900 text-xs whitespace-nowrap">
                        {cert.certificate_number}
                      </td>
                      <td className="px-5 py-3.5 font-extrabold text-slate-900 whitespace-nowrap">
                        {cert.student_name}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">
                        {cert.course_name}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase border ${statusColor[cert.status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                          {cert.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                      No certificates issued yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Audit Activity Logs */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-950 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <span>Audit Log Trail</span>
            </h3>
          </div>
          <div className="p-4 flex-1 space-y-3.5">
            {stats.recentLogs.length > 0 ? (
              stats.recentLogs.map((log: any) => (
                <div key={log.id} className="flex gap-3 text-xs leading-relaxed border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                  <div className="space-y-1">
                    <p className="text-slate-800 font-semibold">{log.details}</p>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[10.5px]">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md uppercase font-extrabold">
                        {log.action}
                      </span>
                      <span>•</span>
                      <span className="truncate max-w-[110px]">{log.user_email}</span>
                      <span>•</span>
                      <span>{new Date(log.created_at).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-slate-400 text-xs font-semibold">No audit log activity recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
