import { createClient } from "@/lib/supabase/server";
import AdmissionActions from "@/components/admin/AdmissionActions";

export default async function AdmissionsPage() {
  const supabase = await createClient();
  const { data: admissions } = await supabase
    .from("admissions")
    .select("*")
    .eq("status", "Pending")
    .order("created_at", { ascending: false });

  const statusColor: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 font-display">Admissions</h1>
        <p className="text-slate-500 mt-1">Review and manage incoming admission requests.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-medium text-left">
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Applied On</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admissions && admissions.length > 0 ? (
                admissions.map((adm: any) => (
                  <tr key={adm.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{adm.student_name}</td>
                    <td className="px-6 py-4 text-slate-600">{adm.email || "—"}</td>
                    <td className="px-6 py-4 text-slate-600">{adm.phone || "—"}</td>
                    <td className="px-6 py-4 text-slate-600">{adm.selected_course || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[adm.status] ?? "bg-slate-100 text-slate-600"}`}>
                        {adm.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(adm.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      {adm.status === "Pending" && <AdmissionActions admissionId={adm.id} />}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-400">No admission requests yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
