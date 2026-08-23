import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import { Award, CheckCircle, QrCode, ExternalLink } from "lucide-react";

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
    Revoked: "bg-red-50 text-red-700 border-red-200",
    Expired: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display">My Certificates</h1>
        <p className="text-slate-500 mt-1 text-sm">All certificates issued to you by Rohit Computer Institute.</p>
      </div>

      {(!certificates || certificates.length === 0) ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
          <Award className="w-10 h-10" />
          <p className="font-semibold">No certificates issued yet</p>
          <p className="text-sm text-slate-300">Complete your course to earn your certificate.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {certificates.map((cert: any) => (
            <div key={cert.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                <Award className="w-7 h-7 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-900">{cert.course_name}</h3>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusColors[cert.status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                    {cert.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1.5 flex-wrap text-xs text-slate-500">
                  <span>Cert No: <strong className="text-slate-700 font-mono">{cert.certificate_number}</strong></span>
                  {cert.grade && <span>Grade: <strong className="text-slate-700">{cert.grade}</strong></span>}
                  {cert.issue_date && <span>Issued: <strong className="text-slate-700">{new Date(cert.issue_date).toLocaleDateString("en-IN")}</strong></span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {cert.status === "Valid" && (
                  <a
                    href={`/verify/${cert.certificate_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 font-semibold px-3 py-2 rounded-xl text-xs transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5" /> Verify
                  </a>
                )}
                {cert.status === "Valid" && (
                  <a
                    href={`/verify/${cert.certificate_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold px-3 py-2 rounded-xl text-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Valid count */}
      {certificates && certificates.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-emerald-700 font-medium">
            You have <strong>{certificates.filter((c: any) => c.status === "Valid").length}</strong> valid certificate(s). Share the verification link to prove your credentials.
          </p>
        </div>
      )}
    </div>
  );
}
