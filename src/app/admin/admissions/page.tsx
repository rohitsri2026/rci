import { createClient } from "@/lib/supabase/server";

export default async function AdmissionsPage() {
  const supabase = await createClient();
  const { data: admissions } = await supabase
    .from("admissions")
    .select("*, courses(name)")
    .order("created_at", { ascending: false });

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admissions && admissions.length > 0 ? (
                admissions.map((admission: any) => (
                  <tr key={admission.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{admission.applicant_name}</td>
                    <td className="px-6 py-4 text-slate-600">{admission.email}</td>
                    <td className="px-6 py-4 text-slate-600">{admission.phone}</td>
                    <td className="px-6 py-4 text-slate-600">{admission.courses?.name ?? "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor[admission.status] ?? "bg-slate-100 text-slate-600"}`}>
                        {admission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(admission.created_at).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                    No admission requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
