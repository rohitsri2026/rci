import { normalizePhone } from "@/lib/utils";

/**
 * Builds the official wa.me WhatsApp URL for Indian mobile numbers.
 * Example output: https://wa.me/917376622082?text=Hello...
 */
export function getWhatsAppUrl(phone: string, message: string): string {
  const digits = normalizePhone(phone);
  if (!digits || digits.length !== 10) {
    throw new Error("Invalid mobile number for WhatsApp transmission.");
  }

  // Prepend country code 91 for India
  const formattedPhone = `91${digits}`;
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedText}`;
}

/**
 * Opens the WhatsApp Web / App composer in a new browser tab.
 */
export function openWhatsAppWeb(phone: string, message: string): boolean {
  try {
    const url = getWhatsAppUrl(phone, message);
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
      return true;
    }
    return false;
  } catch (err) {
    console.error("[WhatsAppComposer] Failed to open WhatsApp:", err);
    return false;
  }
}
