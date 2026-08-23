import { createClient } from "@/lib/supabase/server";
import { Award, Calendar, Clock, CheckCircle2, ShieldAlert, ArrowRight, Activity, TrendingUp } from "lucide-react";
import Link from "next/link";
import React from "react";

export const dynamic = "force-dynamic";

async function getCertificateStats() {
  const supabase = await createClient();

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

    // Pending admissions (or certificates pending issue)
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
      .limit(5)
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
    { label: "Total Certificates", value: stats.total, icon: Award, color: "blue", desc: "Overall certificates issued" },
    { label: "Issued This Month", value: stats.month, icon: Calendar, color: "green", desc: "Generated in current month" },
    { label: "Generated Today", value: stats.today, icon: Clock, color: "orange", desc: "New certificates today" },
    { label: "Pending Admissions", value: stats.pending, icon: ShieldAlert, color: "red", desc: "Awaiting approval for student registration" },
    { label: "Verification Scans", value: stats.verified, icon: CheckCircle2, color: "purple", desc: "Scanned & verified QR instances" },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    orange: "bg-amber-50 text-amber-600 border-amber-100",
    red: "bg-rose-50 text-rose-600 border-rose-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  const statusColor: Record<string, string> = {
    Valid: "bg-green-100 text-green-800",
    Revoked: "bg-red-100 text-red-800",
    Expired: "bg-slate-100 text-slate-800",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display">Certificate Analytics</h1>
        <p className="text-slate-500 mt-1">Overview of issued certifications, recent activities, and verification logs.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${colorMap[m.color]}`}>
              <m.icon className="w-5 h-5" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 leading-tight">{m.value}</p>
            <p className="text-sm font-semibold text-slate-700 mt-1">{m.label}</p>
            <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg">Need to issue credentials?</h3>
          <p className="text-blue-100 text-sm mt-1">Generate dynamic credentials for students individually or issue certificates in bulk.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/certificates/generate" className="bg-white text-blue-800 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors shadow-md">
            Issue Certificates
          </Link>
          <Link href="/admin/certificates" className="border border-white/20 text-white hover:bg-white/10 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
            View Credentials list
          </Link>
        </div>
      </div>

      {/* Tables Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recently Generated Certificates */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Recently Generated</span>
            </h3>
            <Link href="/admin/certificates" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <th className="px-5 py-3">Certificate ID</th>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentCertificates.length > 0 ? (
                  stats.recentCertificates.map((cert: any) => (
                    <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-blue-600 font-bold text-xs">
                        {cert.certificate_number}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900">
                        {cert.student_name}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {cert.course_name}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusColor[cert.status] || "bg-slate-100"}`}>
                          {cert.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                      No certificates generated yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Audits */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <span>Recent Activity Logs</span>
            </h3>
          </div>
          <div className="p-5 flex-1 space-y-4">
            {stats.recentLogs.length > 0 ? (
              stats.recentLogs.map((log: any) => (
                <div key={log.id} className="flex gap-3 text-xs leading-relaxed border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                  <div className="space-y-1">
                    <p className="text-slate-800 font-medium">{log.details}</p>
                    <div className="flex items-center gap-2 text-slate-400 font-semibold">
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px] font-bold">
                        {log.action}
                      </span>
                      <span>•</span>
                      <span>{log.user_email}</span>
                      <span>•</span>
                      <span>{new Date(log.created_at).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-slate-400 text-sm">No activity recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
