import { createClient } from "@/lib/supabase/client";
import { NotificationLogRecord, NotificationLogStatus } from "./types";
import { normalizePhone } from "@/lib/utils";

/**
 * Logs a manual notification attempt (WhatsApp or SMS) into the Supabase database.
 */
export async function logManualNotification(
  log: Omit<NotificationLogRecord, "id" | "created_at">
): Promise<{ success: boolean; logId?: string; error?: string }> {
  try {
    const supabase = createClient();
    const normalizedNumber = normalizePhone(log.phone_number);

    // Get current logged in user details if available
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const sentBy = log.sent_by || user?.email || "Admin";

    const payload = {
      student_id: log.student_id || null,
      notification_type: log.notification_type,
      channel: log.channel.toLowerCase(),
      message: log.message,
      phone_number: normalizedNumber || log.phone_number,
      status: log.status,
      sent_by: sentBy,
      created_at: new Date().toISOString(),
    };

    // Try inserting into notification_logs first
    const { data: inserted, error: primaryErr } = await supabase
      .from("notification_logs")
      .insert([payload])
      .select("id")
      .single();

    if (!primaryErr && inserted) {
      return { success: true, logId: inserted.id };
    }

    // Fallback insertion into existing notifications table if notification_logs doesn't exist yet
    const { data: fallbackInserted, error: fallbackErr } = await supabase
      .from("notifications")
      .insert([
        {
          user_id: log.student_id || null,
          title: `Manual ${log.channel.toUpperCase()} (${log.notification_type})`,
          message: log.message,
          type: log.channel.toLowerCase() === "whatsapp" ? "WhatsApp" : "SMS",
          status: log.status === "sent" ? "Sent" : "Previewed",
          metadata: {
            notification_type: log.notification_type,
            phone_number: normalizedNumber,
            sent_by: sentBy,
            channel: log.channel,
          },
        },
      ])
      .select("id")
      .single();

    if (!fallbackErr && fallbackInserted) {
      return { success: true, logId: fallbackInserted.id };
    }

    console.warn("[ManualNotificationLogger] Could not insert log:", primaryErr?.message || fallbackErr?.message);
    return { success: false, error: primaryErr?.message || fallbackErr?.message };
  } catch (err: any) {
    console.error("[ManualNotificationLogger] Exception:", err);
    return { success: false, error: err.message || "Failed to persist log." };
  }
}

/**
 * Updates the status of a logged notification (e.g. from "opened" to "sent").
 */
export async function updateNotificationLogStatus(
  logId: string,
  status: NotificationLogStatus
): Promise<boolean> {
  try {
    const supabase = createClient();

    const { error: err1 } = await supabase
      .from("notification_logs")
      .update({ status })
      .eq("id", logId);

    if (!err1) return true;

    // Fallback to notifications table
    const { error: err2 } = await supabase
      .from("notifications")
      .update({ status: status === "sent" ? "Sent" : "Failed" })
      .eq("id", logId);

    return !err2;
  } catch (err) {
    console.error("[ManualNotificationLogger] Update status failed:", err);
    return false;
  }
}
