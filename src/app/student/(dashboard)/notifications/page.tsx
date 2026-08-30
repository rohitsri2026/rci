import type { Metadata } from "next";
import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import StudentNotificationsList from "@/components/student/StudentNotificationsList";

export const metadata: Metadata = {
  title: "Notifications",
  description: "View important notices, fee alerts, exam marks, and study material notifications.",
};

export default async function StudentNotificationsPage() {
  const { student, user, supabase } = await getStudentSession();

  if (!student || !user) {
    redirect("/student/login");
  }

  let initialNotifications: any[] = [];
  let initialUnreadCount = 0;

  try {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .or(`user_id.eq.${user.id},user_id.is.null`)
      .order("created_at", { ascending: false })
      .limit(200);

    initialNotifications = data || [];
    initialUnreadCount = initialNotifications.filter((n: any) => !n.is_read).length;
  } catch (err) {
    console.error("Server fetch student notifications error:", err);
  }

  return (
    <div className="py-2">
      <StudentNotificationsList
        initialNotifications={initialNotifications}
        initialUnreadCount={initialUnreadCount}
      />
    </div>
  );
}
