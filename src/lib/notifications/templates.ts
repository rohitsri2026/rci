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
    title: "📋 आवेदन जमा हुआ (Application Submitted)",
    description: "विद्यार्थी द्वारा प्रवेश आवेदन सफलतापूर्वक जमा किए जाने पर भेजा जाता है।",
    supportedVariables: ["student_name", "application_id"],
    templateText: `📋 RCI आवेदन सफलतापूर्वक जमा हो गया है

प्रिय {{student_name}},

आपका RCI आवेदन सफलतापूर्वक जमा हो गया है।

Application ID: {{application_id}}

कृपया भविष्य में आवेदन की स्थिति देखने के लिए इस Application ID को सुरक्षित रखें।

धन्यवाद।

Rohit Computer Institute (RCI)`,
  },

  application_approved: {
    type: "application_approved",
    title: "🎉 आवेदन स्वीकृत (Application Approved)",
    description: "एडमिन द्वारा विद्यार्थी का प्रवेश आवेदन स्वीकृत किए जाने पर भेजा जाता है।",
    supportedVariables: ["student_name", "application_id", "login_url"],
    templateText: `🎉 RCI आवेदन स्वीकृत हो गया है

प्रिय {{student_name}},

हमें आपको सूचित करते हुए खुशी हो रही है कि आपका RCI आवेदन सफलतापूर्वक स्वीकृत कर दिया गया है।

Application ID: {{application_id}}

आगे की जानकारी के लिए अपने RCI Student Portal में लॉगिन करें:

{{login_url}}

धन्यवाद।

Rohit Computer Institute (RCI)`,
  },

  application_rejected: {
    type: "application_rejected",
    title: "❌ आवेदन अस्वीकृत (Application Rejected)",
    description: "आवेदन में त्रुटि या अस्वीकृति होने पर विद्यार्थी को सूचित करने हेतु भेजा जाता है।",
    supportedVariables: ["student_name", "application_id", "rejection_reason"],
    templateText: `❌ RCI आवेदन संबंधी सूचना

प्रिय {{student_name}},

आपके RCI आवेदन की समीक्षा की गई है।

Application ID: {{application_id}}
{{rejection_reason_section}}
कृपया अपने RCI Student Portal में लॉगिन करके आवेदन की स्थिति और आगे की आवश्यक जानकारी देखें।

धन्यवाद।

Rohit Computer Institute (RCI)`,
  },

  payment_successful: {
    type: "payment_successful",
    title: "💳 भुगतान सफल (Payment Successful)",
    description: "शुल्क भुगतान सफलतापूर्वक प्राप्त होने पर रसीद हेतु भेजा जाता है।",
    supportedVariables: ["student_name", "payment_amount", "transaction_id"],
    templateText: `💳 RCI भुगतान सफल रहा

प्रिय {{student_name}},

आपका भुगतान सफलतापूर्वक प्राप्त हो गया है।

भुगतान राशि: ₹{{payment_amount}}

Transaction ID: {{transaction_id}}

आपके सहयोग के लिए धन्यवाद।

Rohit Computer Institute (RCI)`,
  },

  payment_failed: {
    type: "payment_failed",
    title: "⚠️ भुगतान असफल (Payment Failed)",
    description: "भुगतान असफल या लंबित होने पर भेजा जाता है।",
    supportedVariables: ["student_name"],
    templateText: `⚠️ RCI भुगतान संबंधी सूचना

प्रिय {{student_name}},

आपका हाल ही का भुगतान सफल नहीं हो सका।

कृपया अपने RCI Student Portal में लॉगिन करके दोबारा प्रयास करें।

यदि राशि आपके खाते से कट गई है, तो कृपया कुछ समय प्रतीक्षा करें और आवश्यकता होने पर RCI से संपर्क करें।

धन्यवाद।

Rohit Computer Institute (RCI)`,
  },

  certificate_generated: {
    type: "certificate_generated",
    title: "🎓 प्रमाण-पत्र तैयार (Certificate Generated)",
    description: "विद्यार्थी का कंप्यूटर प्रमाण-पत्र जारी होने पर भेजा जाता है।",
    supportedVariables: ["student_name", "certificate_number", "certificate_url"],
    templateText: `🎓 RCI प्रमाण-पत्र तैयार हो गया है

प्रिय {{student_name}},

आपका RCI प्रमाण-पत्र सफलतापूर्वक तैयार हो गया है।

Certificate No: {{certificate_number}}

आप अपना प्रमाण-पत्र डाउनलोड और ऑनलाइन सत्यापित करने के लिए नीचे दिए गए लिंक का उपयोग कर सकते हैं:

{{certificate_url}}

धन्यवाद।

Rohit Computer Institute (RCI)`,
  },

  certificate_updated: {
    type: "certificate_updated",
    title: "📜 प्रमाण-पत्र अपडेट (Certificate Updated)",
    description: "प्रमाण-पत्र विवरण अपडेट होने पर भेजा जाता है।",
    supportedVariables: ["student_name", "certificate_number", "certificate_url"],
    templateText: `📜 RCI प्रमाण-पत्र अपडेट किया गया है

प्रिय {{student_name}},

आपका RCI प्रमाण-पत्र सफलतापूर्वक अपडेट कर दिया गया है।

Certificate No: {{certificate_number}}

कृपया अपने RCI Student Portal में लॉगिन करके नवीनतम प्रमाण-पत्र डाउनलोड करें।

प्रमाण-पत्र सत्यापन/डाउनलोड लिंक:

{{certificate_url}}

धन्यवाद।

Rohit Computer Institute (RCI)`,
  },

  general: {
    type: "general",
    title: "📢 सामान्य सूचना (General Notice)",
    description: "कस्टम संदेशों और सामान्य घोषणाओं हेतु हिंदी टेम्पलेट।",
    supportedVariables: ["student_name", "custom_message"],
    templateText: `📢 RCI विद्यार्थी सूचना

प्रिय {{student_name}},

{{custom_message}}

धन्यवाद।

Rohit Computer Institute (RCI)`,
  },
};

/**
 * Resolves template variables into a final rendered text message in Hindi.
 */
export function renderNotificationTemplate(
  type: NotificationType,
  variables: NotificationVariables
): string {
  const def = NOTIFICATION_TEMPLATES[type] || NOTIFICATION_TEMPLATES.general;
  let text = def.templateText;

  // Handle special dynamic conditional rejection reason section
  if (variables.rejection_reason && variables.rejection_reason.trim()) {
    text = text.replace("{{rejection_reason_section}}", `\nअस्वीकृति का कारण:\n${variables.rejection_reason.trim()}\n`);
  } else {
    text = text.replace("{{rejection_reason_section}}\n", "").replace("{{rejection_reason_section}}", "");
  }

  // Supply default site URLs if missing
  const defaultLoginUrl = variables.login_url || "https://rciknp.vercel.app/student/login";
  const vars: Record<string, string> = {
    student_name: variables.student_name || "विद्यार्थी",
    application_id: variables.application_id || "N/A",
    certificate_number: variables.certificate_number || "N/A",
    payment_amount: String(variables.payment_amount || "0"),
    transaction_id: variables.transaction_id || "N/A",
    login_url: defaultLoginUrl,
    certificate_url: variables.certificate_url || defaultLoginUrl,
    rejection_reason: variables.rejection_reason || "",
    date: variables.date || new Date().toLocaleDateString("hi-IN"),
    custom_message: variables.custom_message || "आपकी क्लास से संबंधित महत्वपूर्ण सूचना।",
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
