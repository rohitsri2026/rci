import { INotificationProvider, NotificationChannel, NotificationPayload, NotificationResult } from "./types";

export class SMSProvider implements INotificationProvider {
  channel: NotificationChannel = "SMS";

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_SMS_FROM;

    if (!sid || !token || !fromNumber) {
      console.log(`[SMSProvider-SIMULATION] Sending SMS:
        To: ${payload.to}
        Message: ${payload.message}
      `);
      
      return {
        success: true,
        messageId: `sim-sms-${Date.now()}`,
      };
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const twilio = require("twilio");
      const client = twilio(sid, token);
      
      const response = await client.messages.create({
        body: payload.message,
        to: payload.to,
        from: fromNumber,
      });

      return {
        success: true,
        messageId: response.sid,
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("[SMSProvider] Failed to send SMS via Twilio:", err.message);
      
      return {
        success: false,
        error: err.message,
      };
    }
  }
}
