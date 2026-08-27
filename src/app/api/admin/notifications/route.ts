import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyRole } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get("channel") || "all";
    const status = searchParams.get("status") || "all";
    const type = searchParams.get("type") || "all";
    const search = searchParams.get("search")?.trim().toLowerCase() || "";

    const adminClient = createAdminClient();

    // 1. Try querying primary notification_logs table
    let logs: any[] = [];
    let primaryErr: any = null;

    let query = adminClient
      .from("notification_logs")
      .select("*, students:student_id (full_name, phone)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (channel !== "all") {
      query = query.eq("channel", channel.toLowerCase());
    }
    if (status !== "all") {
      query = query.eq("status", status.toLowerCase());
    }
    if (type !== "all") {
      query = query.eq("notification_type", type);
    }

    const { data: primaryLogs, error } = await query;
    primaryErr = error;

    if (!primaryErr && primaryLogs) {
      logs = primaryLogs.map((item: any) => ({
        id: item.id,
        student_id: item.student_id,
        student_name: item.students?.full_name || "N/A",
        notification_type: item.notification_type || "general",
        channel: item.channel,
        message: item.message,
        phone_number: item.phone_number,
        status: item.status,
        sent_by: item.sent_by || "Admin",
        created_at: item.created_at,
      }));
    } else {
      // Fallback query to existing notifications table
      let fallbackQuery = adminClient
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      const { data: fallbackLogs } = await fallbackQuery;
      if (fallbackLogs) {
        logs = fallbackLogs.map((item: any) => ({
          id: item.id,
          student_id: item.user_id,
          student_name: item.students?.full_name || "N/A",
          notification_type: item.metadata?.notification_type || item.type || "general",
          channel: (item.type || "whatsapp").toLowerCase(),
          message: item.message,
          phone_number: item.metadata?.phone_number || item.students?.phone || "N/A",
          status: (item.status || "sent").toLowerCase(),
          sent_by: item.metadata?.sent_by || "Admin",
          created_at: item.created_at,
        }));
      }
    }

    // Apply text search filtering if specified
    if (search) {
      logs = logs.filter((l) =>
        (l.student_name && l.student_name.toLowerCase().includes(search)) ||
        (l.phone_number && l.phone_number.includes(search)) ||
        (l.message && l.message.toLowerCase().includes(search)) ||
        (l.notification_type && l.notification_type.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({ success: true, logs });
  } catch (err: any) {
    console.error("Admin notification logs fetch error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch notification logs." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const body = await request.json();
    const { studentId, notificationType, channel, message, phoneNumber, status } = body;

    if (!message || !phoneNumber) {
      return NextResponse.json(
        { error: "Message content and phone number are required." },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    const sentBy = authCheck.user?.email || "Admin";

    const payload = {
      student_id: studentId || null,
      notification_type: notificationType || "general",
      channel: (channel || "whatsapp").toLowerCase(),
      message,
      phone_number: phoneNumber,
      status: status || "previewed",
      sent_by: sentBy,
      created_at: new Date().toISOString(),
    };

    // Try inserting into notification_logs
    const { data: inserted, error: primaryErr } = await adminClient
      .from("notification_logs")
      .insert([payload])
      .select("id")
      .single();

    if (!primaryErr && inserted) {
      return NextResponse.json({ success: true, id: inserted.id }, { status: 201 });
    }

    // Fallback to notifications table
    const { data: fallbackInserted } = await adminClient
      .from("notifications")
      .insert([
        {
          user_id: studentId || null,
          title: `Manual ${channel?.toUpperCase()} (${notificationType})`,
          message,
          type: (channel || "whatsapp").toLowerCase() === "whatsapp" ? "WhatsApp" : "SMS",
          status: status === "sent" ? "Sent" : "Previewed",
          metadata: {
            notification_type: notificationType,
            phone_number: phoneNumber,
            sent_by: sentBy,
          },
        },
      ])
      .select("id")
      .single();

    return NextResponse.json({ success: true, id: fallbackInserted?.id || "logged" }, { status: 201 });
  } catch (err: any) {
    console.error("Admin notification log creation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to log notification." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const { logId, status } = await request.json();
    if (!logId || !status) {
      return NextResponse.json({ error: "Log ID and status are required." }, { status: 400 });
    }

    const adminClient = createAdminClient();

    const { error: err1 } = await adminClient
      .from("notification_logs")
      .update({ status })
      .eq("id", logId);

    if (err1) {
      await adminClient
        .from("notifications")
        .update({ status: status === "sent" ? "Sent" : "Failed" })
        .eq("id", logId);
    }

    return NextResponse.json({ success: true, message: `Notification status updated to '${status}'.` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update status." }, { status: 500 });
  }
}
