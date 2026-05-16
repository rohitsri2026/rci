import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

export default async function StudentsPage() {
  const supabase = await createClient();
  const { data: students } = await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Students</h1>
          <p className="text-slate-500 mt-1">Manage all registered students.</p>
        </div>
        <Link
          href="/admin/students/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Add Student
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400">
            {students?.length ?? 0} students found
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-medium text-left">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Enrolled On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students && students.length > 0 ? (
                students.map((student: any) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{student.name}</td>
                    <td className="px-6 py-4 text-slate-600">{student.email}</td>
                    <td className="px-6 py-4 text-slate-600">{student.phone}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(student.created_at).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-400">
                    No students found. Add your first student to get started.
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
