import { INotificationProvider, NotificationChannel, NotificationPayload, NotificationResult } from "./types";

export class EmailProvider implements INotificationProvider {
  channel: NotificationChannel = "Email";

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const isConfigured = 
      process.env.SMTP_HOST && 
      process.env.SMTP_USER && 
      process.env.SMTP_PASS;

    if (!isConfigured) {
      // In development or when SMTP is unconfigured, run in simulation mode
      console.log(`[EmailProvider-SIMULATION] Sending Email:
        To: ${payload.to}
        Subject: ${payload.title}
        Message: ${payload.message}
      `);
      
      return {
        success: true,
        messageId: `sim-email-${Date.now()}`,
      };
    }

    try {
      // If nodemailer is installed dynamically, we can load it.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Rohit Computer Institute" <${process.env.SMTP_USER}>`,
        to: payload.to,
        subject: payload.title,
        text: payload.message,
        html: `<div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #6d28d9; margin-bottom: 15px;">${payload.title}</h2>
          <p style="font-size: 15px; line-height: 1.6; white-space: pre-line;">${payload.message}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
          <p style="font-size: 12px; color: #666;">This is an automated notification from Rohit Computer Institute (RCI).</p>
        </div>`,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("[EmailProvider] Failed to send email via SMTP:", err.message);
      
      return {
        success: false,
        error: err.message,
      };
    }
  }
}
