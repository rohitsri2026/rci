import { INotificationProvider, NotificationChannel, NotificationPayload, NotificationResult } from "./types";

export class WhatsAppProvider implements INotificationProvider {
  channel: NotificationChannel = "WhatsApp";

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

    if (!sid || !token || !fromNumber) {
      console.log(`[WhatsAppProvider-SIMULATION] Sending WhatsApp:
        To: whatsapp:${payload.to}
        Message: ${payload.message}
      `);
      
      return {
        success: true,
        messageId: `sim-wa-${Date.now()}`,
      };
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const twilio = require("twilio");
      const client = twilio(sid, token);
      
      const response = await client.messages.create({
        body: payload.message,
        to: `whatsapp:${payload.to.replace("whatsapp:", "")}`,
        from: `whatsapp:${fromNumber.replace("whatsapp:", "")}`,
      });

      return {
        success: true,
        messageId: response.sid,
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("[WhatsAppProvider] Failed to send WhatsApp via Twilio:", err.message);
      
      return {
        success: false,
        error: err.message,
      };
    }
  }
}
