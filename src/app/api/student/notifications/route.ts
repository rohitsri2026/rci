import { getStudentSession } from "@/lib/student-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const { student, user, supabase } = await getStudentSession();

  if (!student || !user) {
    return NextResponse.json(
      { error: "Unauthorized student session." },
      { status: 401 }
    );
  }

  try {
    // Fetch notifications where user_id equals authenticated user ID OR user_id is null (broadcast)
    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .or(`user_id.eq.${user.id},user_id.is.null`)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Student notifications query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch notifications." },
        { status: 500 }
      );
    }

    const unreadCount = notifications ? notifications.filter((n: any) => !n.is_read).length : 0;

    return NextResponse.json({
      success: true,
      notifications: notifications || [],
      unreadCount,
    });
  } catch (err: any) {
    console.error("Student notifications endpoint exception:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { student, user, supabase } = await getStudentSession();

  if (!student || !user) {
    return NextResponse.json(
      { error: "Unauthorized student session." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { notificationId, markAll } = body;

    if (markAll) {
      // Mark all unread notifications for this user (or broadcast notifications) as read
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .eq("is_read", false);

      if (error) {
        console.error("Mark all read DB error:", error);
        return NextResponse.json({ error: "Failed to mark all as read." }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "All notifications marked as read." });
    }

    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID is required." }, { status: 400 });
    }

    // Mark single notification as read
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) {
      console.error("Mark notification read DB error:", error);
      return NextResponse.json({ error: "Failed to mark notification as read." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Notification marked as read." });
  } catch (err: any) {
    console.error("Student mark notification read exception:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
