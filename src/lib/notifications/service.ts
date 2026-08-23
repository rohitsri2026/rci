import { createClient } from "@/lib/supabase/server";
import { EmailProvider } from "./email.provider";
import { SMSProvider } from "./sms.provider";
import { WhatsAppProvider } from "./whatsapp.provider";
import { InAppProvider } from "./inapp.provider";
import { INotificationProvider, NotificationChannel, NotificationPayload, NotificationResult } from "./types";

export class NotificationService {
  private static providers: Map<NotificationChannel, INotificationProvider> = new Map();

  static {
    // Register default providers
    NotificationService.registerProvider(new EmailProvider());
    NotificationService.registerProvider(new SMSProvider());
    NotificationService.registerProvider(new WhatsAppProvider());
    NotificationService.registerProvider(new InAppProvider());
  }

  static registerProvider(provider: INotificationProvider) {
    NotificationService.providers.set(provider.channel, provider);
  }

  static async send(
    channel: NotificationChannel,
    payload: NotificationPayload
  ): Promise<NotificationResult> {
    const provider = NotificationService.providers.get(channel);
    if (!provider) {
      return {
        success: false,
        error: `No notification provider registered for channel: ${channel}`,
      };
    }

    const supabase = await createClient();

    // Check administrator notification preferences
    try {
      const { data: settings } = await supabase
        .from("certificate_settings")
        .select("notification_preferences")
        .eq("id", "default")
        .maybeSingle();

      const preferences = settings?.notification_preferences as Record<string, boolean> || {
        Email: true,
        SMS: true,
        WhatsApp: true,
        InApp: true,
      };

      if (preferences[channel] === false) {
        console.log(`[NotificationService] Skipping channel ${channel} - disabled by administrator preferences.`);
        return {
          success: false,
          error: `Channel ${channel} is disabled by settings preferences`,
        };
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (prefErr: any) {
      console.warn("[NotificationService] Failed to load preferences, defaulting to enabled:", prefErr.message);
    }

    // Trigger transmission with retry support (max 3 attempts with exponential backoff)
    let attempts = 0;
    const maxRetries = 3;
    let result: NotificationResult = { success: false, error: "Not started" };

    while (attempts < maxRetries) {
      attempts++;
      result = await provider.send(payload);
      if (result.success) {
        break;
      }
      
      if (attempts < maxRetries) {
        const delay = Math.pow(2, attempts) * 1000; // 2s, 4s...
        console.warn(`[NotificationService] Channel ${channel} delivery failed (attempt ${attempts}/${maxRetries}): ${result.error}. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // Persist logs in database for non-InApp channels (InApp provider persists itself)
    if (channel !== "InApp") {
      try {
        await supabase.from("notifications").insert([
          {
            user_id: payload.userId || null,
            title: payload.title,
            message: payload.message,
            type: channel,
            status: result.success ? "Sent" : "Failed",
            metadata: {
              ...payload.metadata,
              messageId: result.messageId,
              attempts,
              error: result.error,
            },
          },
        ]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (dbErr: any) {
        console.error("[NotificationService] Transaction log insertion failed:", dbErr.message);
      }
    }

    return result;
  }
}
