import { NotificationType, NotificationVariables } from "./types";

export interface NotificationTemplateDef {
  type: NotificationType;
  title: string;
  templateText: string;
  description: string;
  supportedVariables: string[];
}

export const NOTIFICATION_TEMPLATES: Record<NotificationType, NotificationTemplateDef> = {
  application_submitted: {
    type: "application_submitted",
    title: "Application Submitted",
    description: "Sent when student completes and submits their admission application.",
    supportedVariables: ["student_name", "application_id"],
    templateText: `✅ RCI Application Submitted

Dear {{student_name}},

Your RCI application has been successfully submitted.

Application ID: {{application_id}}

Please keep your Application ID for future reference.

Regards,
Rohit Computer Institute (RCI)`,
  },

  application_approved: {
    type: "application_approved",
    title: "Application Approved",
    description: "Sent when an administrator approves a student's admission application.",
    supportedVariables: ["student_name", "application_id", "login_url"],
    templateText: `🎉 RCI Application Approved

Dear {{student_name}},

Your RCI application has been approved successfully.

Application ID: {{application_id}}

Please login to your RCI Student Portal for further details:
{{login_url}}

Regards,
Rohit Computer Institute (RCI)`,
  },

  application_rejected: {
    type: "application_rejected",
    title: "Application Rejected / Action Required",
    description: "Sent when an application requires student revision or has been rejected.",
    supportedVariables: ["student_name", "application_id", "rejection_reason"],
    templateText: `❌ RCI Application Update

Dear {{student_name}},

Your RCI application requires attention.

Application ID: {{application_id}}
{{rejection_reason_section}}

Please login to your RCI Student Portal to view your application status and details.

Regards,
Rohit Computer Institute (RCI)`,
  },

  payment_successful: {
    type: "payment_successful",
    title: "Payment Successful",
    description: "Sent when a fee payment transaction is successfully recorded.",
    supportedVariables: ["student_name", "payment_amount", "transaction_id"],
    templateText: `💳 RCI Payment Successful

Dear {{student_name}},

Your payment has been received successfully.

Amount: ₹{{payment_amount}}
Transaction ID: {{transaction_id}}

Thank you for choosing RCI.

Regards,
Rohit Computer Institute (RCI)`,
  },

  payment_failed: {
    type: "payment_failed",
    title: "Payment Failed / Pending",
    description: "Sent when a payment transaction could not be completed.",
    supportedVariables: ["student_name"],
    templateText: `⚠️ RCI Payment Update

Dear {{student_name}},

Your recent payment could not be completed.

Please login to your RCI Student Portal and try again.

Regards,
Rohit Computer Institute (RCI)`,
  },

  certificate_generated: {
    type: "certificate_generated",
    title: "Certificate Generated",
    description: "Sent when a course certificate is issued for a student.",
    supportedVariables: ["student_name", "certificate_number", "certificate_url"],
    templateText: `🎓 RCI Certificate Generated

Dear {{student_name}},

Your RCI certificate has been successfully generated.

Certificate No: {{certificate_number}}

You can download and verify your certificate online:
{{certificate_url}}

Regards,
Rohit Computer Institute (RCI)`,
  },

  certificate_updated: {
    type: "certificate_updated",
    title: "Certificate Updated",
    description: "Sent when a student's course certificate details are updated.",
    supportedVariables: ["student_name", "certificate_number", "certificate_url"],
    templateText: `📜 RCI Certificate Updated

Dear {{student_name}},

Your RCI certificate has been updated successfully.

Certificate No: {{certificate_number}}

Please login to your RCI Student Portal to download the latest certificate:
{{certificate_url}}

Regards,
Rohit Computer Institute (RCI)`,
  },

  general: {
    type: "general",
    title: "General Notification / Reminder",
    description: "Editable custom template for announcements and general student reminders.",
    supportedVariables: ["student_name", "custom_message"],
    templateText: `📢 RCI Student Notification

Dear {{student_name}},

{{custom_message}}

Regards,
Rohit Computer Institute (RCI)`,
  },
};

/**
 * Resolves template variables into a final rendered text message.
 */
export function renderNotificationTemplate(
  type: NotificationType,
  variables: NotificationVariables
): string {
  const def = NOTIFICATION_TEMPLATES[type] || NOTIFICATION_TEMPLATES.general;
  let text = def.templateText;

  // Handle special dynamic conditional sections
  if (variables.rejection_reason && variables.rejection_reason.trim()) {
    text = text.replace("{{rejection_reason_section}}", `Reason: ${variables.rejection_reason.trim()}\n`);
  } else {
    text = text.replace("{{rejection_reason_section}}\n", "").replace("{{rejection_reason_section}}", "");
  }

  // Supply default site URLs if missing
  const defaultLoginUrl = variables.login_url || "https://rciknp.vercel.app/student/login";
  const vars: Record<string, string> = {
    student_name: variables.student_name || "Student",
    application_id: variables.application_id || "N/A",
    certificate_number: variables.certificate_number || "N/A",
    payment_amount: String(variables.payment_amount || "0"),
    transaction_id: variables.transaction_id || "N/A",
    login_url: defaultLoginUrl,
    certificate_url: variables.certificate_url || defaultLoginUrl,
    rejection_reason: variables.rejection_reason || "",
    date: variables.date || new Date().toLocaleDateString("en-IN"),
    custom_message: variables.custom_message || "This is an important reminder regarding your course at RCI.",
  };

  // Replace all {{variable}} placeholders
  Object.keys(vars).forEach((key) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    text = text.replace(regex, vars[key]);
  });

  // Clean up any unreplaced template variables if missing
  text = text.replace(/{{\s*[\w_]+\s*}}/g, "");

  return text.trim();
}
