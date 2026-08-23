import { createClient } from "@/lib/supabase/server";
import { INotificationProvider, NotificationChannel, NotificationPayload, NotificationResult } from "./types";

export class InAppProvider implements INotificationProvider {
  channel: NotificationChannel = "InApp";

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    try {
      const supabase = await createClient();
      
      const { data, error } = await supabase
        .from("notifications")
        .insert([
          {
            user_id: payload.userId || null,
            title: payload.title,
            message: payload.message,
            type: "InApp",
            status: "Pending", // Mapped to Pending (unread) status
            metadata: payload.metadata || {},
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        messageId: data.id,
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("[InAppProvider] Failed to persist in-app notification log:", err.message);
      
      return {
        success: false,
        error: err.message,
      };
    }
  }
}
