export type NotificationChannel = "Email" | "WhatsApp" | "SMS" | "InApp" | "whatsapp" | "sms";

export type NotificationType =
  | "application_submitted"
  | "application_approved"
  | "application_rejected"
  | "payment_successful"
  | "payment_failed"
  | "certificate_generated"
  | "certificate_updated"
  | "general";

export type NotificationLogStatus = "previewed" | "opened" | "sent" | "failed" | "cancelled";

export interface NotificationVariables {
  student_name?: string;
  application_id?: string;
  certificate_number?: string;
  payment_amount?: string | number;
  transaction_id?: string;
  login_url?: string;
  certificate_url?: string;
  rejection_reason?: string;
  date?: string;
  custom_message?: string;
  [key: string]: string | number | undefined;
}

export interface NotificationLogRecord {
  id?: string;
  student_id?: string | null;
  notification_type: NotificationType | string;
  channel: "whatsapp" | "sms" | string;
  message: string;
  phone_number: string;
  status: NotificationLogStatus;
  sent_by?: string | null;
  created_at?: string;
  student_name?: string;
}

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
