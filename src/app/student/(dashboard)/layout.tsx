import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import StudentHeader from "@/components/student/StudentHeader";
import StudentMobileBottomNav from "@/components/student/StudentMobileBottomNav";
import { StudentNotificationProvider } from "@/context/StudentNotificationContext";
import NotificationToast from "@/components/student/NotificationToast";
import RealtimeDebugPanel from "@/components/student/RealtimeDebugPanel";
import { AlertTriangle, LogOut } from "lucide-react";

export default async function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const { student, user, supabase } = await getStudentSession();

  if (!user) {
    redirect("/student/login");
  }

  // Look up unread notifications count for header
  let unreadNotifCount = 0;
  try {
    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .or(`user_id.eq.${user.id},user_id.is.null`)
      .eq("is_read", false);
    unreadNotifCount = count ?? 0;
  } catch (err) {
    console.error("Failed to fetch notification count:", err);
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-slate-900">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950 font-display">Student Record Not Found</h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
            Your login account (<strong>{user.email || user.phone}</strong>) is not linked to an active student profile yet.
            Please contact RCI institute desk or administrator to link your account.
          </p>
          <form action="/api/logout" method="POST" className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#07152F] hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-extrabold text-xs transition-colors shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <StudentNotificationProvider
      userId={user.id}
      studentId={student.id}
      initialUnreadCount={unreadNotifCount}
    >
      <NotificationToast />
      <RealtimeDebugPanel />
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
        <StudentHeader
          studentName={student.full_name}
          studentEmail={student.email ?? user.email ?? ""}
          studentId={student.id ? `RCI-STU-${student.id.slice(0, 6).toUpperCase()}` : undefined}
          photoUrl={student.photo_url}
          unreadCount={unreadNotifCount}
        />
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 pb-[calc(84px+env(safe-area-inset-bottom))] md:pb-8">
          {children}
        </main>
        <StudentMobileBottomNav studentEmail={student.email ?? user.email ?? ""} />
      </div>
    </StudentNotificationProvider>
  );
}
