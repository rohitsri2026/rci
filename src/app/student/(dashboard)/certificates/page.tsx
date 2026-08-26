import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import { Award, CheckCircle, QrCode, ExternalLink, Download, ShieldCheck } from "lucide-react";

export default async function StudentCertificatesPage() {
  const { student, supabase } = await getStudentSession();
  if (!student) redirect("/student/login");

  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .eq("student_id", student.id)
    .order("issue_date", { ascending: false });

  const statusColors: Record<string, string> = {
    Valid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Revoked: "bg-rose-50 text-rose-700 border-rose-200",
    Expired: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-extrabold text-[#07152F] font-display">My Certificates</h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">All official institute credentials issued to you by Rohit Computer Institute.</p>
      </div>

      {(!certificates || certificates.length === 0) ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-12 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shadow-2xs">
            <Award className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg font-display">No Certificates Issued Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm font-medium">
            Your certificate will appear here after successful completion of your enrolled course.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {certificates.map((cert: any) => (
            <div key={cert.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 shadow-2xs">
                  <Award className="w-7 h-7 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-slate-950 text-base font-display">{cert.course_name}</h3>
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${statusColors[cert.status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      {cert.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 flex-wrap text-xs text-slate-500 font-medium">
                    <span>Cert No: <strong className="text-blue-700 font-mono font-extrabold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{cert.certificate_number}</strong></span>
                    {cert.grade && <span>Grade: <strong className="text-slate-900 font-bold">{cert.grade}</strong></span>}
                    {cert.issue_date && <span>Issued: <strong className="text-slate-800">{new Date(cert.issue_date).toLocaleDateString("en-IN")}</strong></span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {cert.status === "Valid" && (
                  <a
                    href={`/verify/${cert.certificate_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] flex items-center gap-1.5 bg-[#155EEF] text-white hover:bg-blue-700 font-extrabold px-3.5 py-2 rounded-xl text-xs transition-colors shadow-md shadow-blue-500/15"
                  >
                    <QrCode className="w-4 h-4" /> Verify Online
                  </a>
                )}
                {cert.status === "Valid" && (
                  <a
                    href={`/verify/${cert.certificate_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] flex items-center gap-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 font-extrabold px-3 py-2 rounded-xl text-xs transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" /> View Certificate
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Valid count banner */}
      {certificates && certificates.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-xs sm:text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-emerald-800 font-bold">
            You have <strong>{certificates.filter((c: any) => c.status === "Valid").length}</strong> valid certificate(s). Anyone can scan your certificate QR code or visit <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono text-emerald-900">/verify/[certificateId]</code> to authenticate your credentials.
          </p>
        </div>
      )}
    </div>
  );
}
