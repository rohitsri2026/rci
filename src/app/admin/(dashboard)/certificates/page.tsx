import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import CertificateActions from "@/components/admin/CertificateActions";

export default async function CertificatesPage() {
  const supabase = await createClient();
  const { data: certs } = await supabase
    .from("certificates")
    .select("*")
    .order("created_at", { ascending: false });

  const statusColor: Record<string, string> = {
    Valid: "bg-green-100 text-green-700",
    Revoked: "bg-red-100 text-red-700",
    Expired: "bg-slate-100 text-slate-600",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Certificates</h1>
          <p className="text-slate-500 mt-1">Issue and manage student certificates.</p>
        </div>
        <Link href="/admin/certificates/new" className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Issue Certificate
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-medium text-left">
                <th className="px-6 py-4">Certificate ID</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Issue Date</th>
                <th className="px-6 py-4">Issued By</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {certs && certs.length > 0 ? (
                certs.map((cert: any) => (
                  <tr key={cert.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-blue-600 font-bold">{cert.certificate_id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{cert.student_name}</td>
                    <td className="px-6 py-4 text-slate-600">{cert.course_name}</td>
                    <td className="px-6 py-4 text-slate-500">{cert.issue_date}</td>
                    <td className="px-6 py-4 text-slate-500">{cert.issued_by}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[cert.status] ?? "bg-slate-100 text-slate-600"}`}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <CertificateActions certId={cert.id} currentStatus={cert.status} certificateCode={cert.certificate_id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-400">No certificates issued yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
