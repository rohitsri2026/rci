import { normalizePhone } from "@/lib/utils";

/**
 * Builds the standard sms: URI for mobile device composers.
 * Example output: sms:+917376622082?body=Hello...
 */
export function getSMSUrl(phone: string, message: string): string {
  const digits = normalizePhone(phone);
  if (!digits || digits.length !== 10) {
    throw new Error("Invalid mobile number for SMS transmission.");
  }

  const formattedPhone = `+91${digits}`;
  const encodedBody = encodeURIComponent(message);
  return `sms:${formattedPhone}?body=${encodedBody}`;
}

/**
 * Triggers the device native SMS application composer.
 */
export function openSMSComposer(phone: string, message: string): boolean {
  try {
    const url = getSMSUrl(phone, message);
    if (typeof window !== "undefined") {
      window.location.href = url;
      return true;
    }
    return false;
  } catch (err) {
    console.error("[SMSComposer] Failed to launch SMS composer:", err);
    return false;
  }
}

/**
 * Copies the raw notification text message to the system clipboard.
 */
export async function copyMessageToClipboard(message: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(message);
      return true;
    }
    // Fallback for legacy web browsers
    const textarea = document.createElement("textarea");
    textarea.value = message;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  } catch (err) {
    console.error("[Clipboard] Copy text failed:", err);
    return false;
  }
}
