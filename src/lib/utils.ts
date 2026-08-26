import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes any phone number input to a standard 10-digit string.
 * Handles +91, country codes, spaces, dashes, and leading zeroes cleanly.
 * Example: "+91 73766 22082" -> "7376622082"
 */
export function normalizePhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length > 10) {
    return digits.slice(-10);
  }
  return digits;
}
