import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import StudentSidebar from "@/components/student/StudentSidebar";
import { Bell } from "lucide-react";

export default async function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/student/login");
  }

  // Look up student record linked to this auth user
  const { data: student } = await supabase
    .from("students")
    .select("id, full_name, email")
    .eq("email", user.email!)
    .maybeSingle();

  if (!student) {
    // Auth user exists but no student record — show a helpful error
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Student Record Not Found</h1>
          <p className="text-slate-500 mb-6 text-sm">
            Your email <strong>{user.email}</strong> is not linked to a student profile yet. 
            Please contact your institute administrator.
          </p>
          <form action="/api/logout" method="POST">
            <button type="submit" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors">
              Sign Out
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <StudentSidebar studentName={student.full_name} studentEmail={student.email ?? user.email ?? ""} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
