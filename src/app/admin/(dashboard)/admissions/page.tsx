import { createClient } from "@/lib/supabase/server";
import AdmissionActions from "@/components/admin/AdmissionActions";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdmissionsPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const activeStatus = status || "Pending";

  const supabase = await createClient();
  let query = supabase.from("admissions").select("*").order("created_at", { ascending: false });

  if (activeStatus && activeStatus !== "All") {
    query = query.eq("status", activeStatus);
  }

  const { data: admissions } = await query;

  const statusColor: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    Approved: "bg-green-100 text-green-800 border border-green-200",
    Rejected: "bg-red-100 text-red-800 border border-red-200",
  };

  const tabs = [
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
    { label: "All Applications", value: "All" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Admissions Management</h1>
          <p className="text-slate-500 mt-1">Review, approve, or reject student admission applications.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/admissions?status=${tab.value}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeStatus === tab.value
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-medium text-left border-b border-slate-200">
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Applied On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admissions && admissions.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                admissions.map((adm: any) => (
                  <tr key={adm.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{adm.student_name}</td>
                    <td className="px-6 py-4 text-slate-600">{adm.email || "—"}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">{adm.phone || "—"}</td>
                    <td className="px-6 py-4 text-slate-800 font-medium">{adm.selected_course || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor[adm.status] ?? "bg-slate-100 text-slate-600"}`}>
                        {adm.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(adm.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {adm.status === "Pending" ? (
                        <AdmissionActions admissionId={adm.id} />
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-400">
                    No admission requests found for filter: <strong className="text-slate-600">{activeStatus}</strong>.
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
