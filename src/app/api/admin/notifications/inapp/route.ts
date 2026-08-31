import { createAdminServerClient } from "@/lib/supabase/server-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyRole } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createAdminServerClient();
  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const adminClient = createAdminClient();

    // Fetch all in-app notifications from notifications table
    const { data: notifications, error } = await adminClient
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Admin fetch notifications error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch student list & courses list for form dropdowns
    const [studentsRes, coursesRes] = await Promise.all([
      adminClient.from("students").select("id, full_name, phone, email, user_id").order("full_name"),
      adminClient.from("courses").select("id, course_name").order("course_name"),
    ]);

    // Build quick lookup map for student names
    const studentMap = new Map<string, string>();
    (studentsRes.data || []).forEach((s: any) => {
      if (s.id) studentMap.set(s.id, s.full_name);
      if (s.user_id) studentMap.set(s.user_id, s.full_name);
    });

    const formattedList = (notifications || []).map((n: any) => {
      const studentName = n.user_id
        ? studentMap.get(n.user_id) || "Specific Student"
        : "All Students";

      return {
        id: n.id,
        user_id: n.user_id,
        title: n.title,
        message: n.message,
        type: n.metadata?.category || n.type || "NOTICE",
        is_read: n.is_read || false,
        status: n.status || (n.is_read ? "Read" : "Sent"),
        created_at: n.created_at,
        recipient_scope: n.metadata?.recipient_scope || (n.user_id ? "student" : "all"),
        student_name: studentName,
        action_url: n.metadata?.action_url || "",
        sent_by: n.metadata?.sent_by || "Admin",
      };
    });

    return NextResponse.json({
      success: true,
      notifications: formattedList,
      students: studentsRes.data || [],
      courses: coursesRes.data || [],
    });
  } catch (err: any) {
    console.error("Admin notifications GET exception:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch notifications." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createAdminServerClient();
  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const body = await request.json();
    const { title, message, category, recipientScope, studentId, courseId, actionUrl } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message content are required." },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    const sentBy = authCheck.user?.email || "Admin";
    const notifCategory = category || "NOTICE";

    if (recipientScope === "student") {
      if (!studentId) {
        return NextResponse.json({ error: "Please select a recipient student." }, { status: 400 });
      }

      // Look up student user_id
      const { data: studentRecord } = await adminClient
        .from("students")
        .select("id, user_id, email, phone")
        .eq("id", studentId)
        .maybeSingle();

      const targetUserId = studentRecord?.user_id || studentId;

      const { data: inserted, error } = await adminClient
        .from("notifications")
        .insert([
          {
            user_id: targetUserId,
            title,
            message,
            type: "InApp",
            is_read: false,
            status: "Sent",
            metadata: {
              category: notifCategory,
              action_url: actionUrl || "",
              recipient_scope: "student",
              sent_by: sentBy,
            },
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return NextResponse.json({ success: true, notification: inserted }, { status: 201 });
    } else if (recipientScope === "course") {
      if (!courseId) {
        return NextResponse.json({ error: "Please select a target course." }, { status: 400 });
      }

      // Fetch all students in this course
      const { data: enrolledStudents } = await adminClient
        .from("students")
        .select("id, user_id")
        .eq("course_id", courseId);

      if (!enrolledStudents || enrolledStudents.length === 0) {
        return NextResponse.json(
          { error: "No active students found in the selected course." },
          { status: 400 }
        );
      }

      const rowsToInsert = enrolledStudents.map((s: any) => ({
        user_id: s.user_id || s.id,
        title,
        message,
        type: "InApp",
        is_read: false,
        status: "Sent",
        metadata: {
          category: notifCategory,
          action_url: actionUrl || "",
          recipient_scope: "course",
          course_id: courseId,
          sent_by: sentBy,
        },
      }));

      const { error } = await adminClient.from("notifications").insert(rowsToInsert);

      if (error) {
        throw new Error(error.message);
      }

      return NextResponse.json({
        success: true,
        message: `Notification published to ${enrolledStudents.length} course students.`,
      }, { status: 201 });
    } else {
      // Broadcast to All Students (user_id = null)
      const { data: inserted, error } = await adminClient
        .from("notifications")
        .insert([
          {
            user_id: null,
            title,
            message,
            type: "InApp",
            is_read: false,
            status: "Sent",
            metadata: {
              category: notifCategory,
              action_url: actionUrl || "",
              recipient_scope: "all",
              sent_by: sentBy,
            },
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return NextResponse.json({ success: true, notification: inserted }, { status: 201 });
    }
  } catch (err: any) {
    console.error("Admin POST notification error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to publish notification." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const supabase = await createAdminServerClient();
  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Notification ID is required." }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("notifications").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, message: "Notification deleted successfully." });
  } catch (err: any) {
    console.error("Admin DELETE notification error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete notification." },
      { status: 500 }
    );
  }
}
