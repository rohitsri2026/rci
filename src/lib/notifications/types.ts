export type NotificationChannel = "Email" | "WhatsApp" | "SMS" | "InApp";

export interface NotificationPayload {
  to: string;                // Target address: email, phone number, or User UUID
  title: string;             // Subject or title
  message: string;           // Message content
  userId?: string;           // Optional destination database ID for InApp tracking
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>; // Optional debug payload parameters
}

export interface NotificationResult {
  success: boolean;
  error?: string;
  messageId?: string;
}

export interface INotificationProvider {
  channel: NotificationChannel;
  send(payload: NotificationPayload): Promise<NotificationResult>;
}
