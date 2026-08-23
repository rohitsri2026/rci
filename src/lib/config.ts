/**
 * Rohit Computer Institute (RCI) Central Configuration
 * Source of truth for contact information, WhatsApp numbers, director details, and site metadata.
 */

export class RCIConfig {
  static readonly instituteName = "Rohit Computer Institute (RCI)";
  static readonly shortName = "RCI";
  static readonly tagline = "Empowering Digital Careers";
  static readonly domain = "rciknp.vercel.app";
  static readonly siteUrl = "https://rciknp.vercel.app";

  // Official Contact Details
  static readonly phoneFormatted = "+91 73768 93097";
  static readonly phoneRaw = "+917376893097";
  static readonly whatsappNumber = "917376893097";
  static readonly email = "info@rciknp.com";
  static readonly address = "Sanjay Nagar Cantt, Kanpur, Uttar Pradesh — 208004";
  static readonly mapsUrl = "https://maps.google.com/?q=Sanjay+Nagar+Cantt+Kanpur";

  // Leadership Details
  static readonly directorName = "Rohit Srivastava";
  static readonly directorTitle = "Managing Director, RCI";

  /**
   * Helper to construct properly encoded WhatsApp URLs
   */
  static getWhatsAppUrl(customMessage?: string): string {
    const defaultMsg = "Hello RCI, I would like to get more information about your computer courses.";
    const encoded = encodeURIComponent(customMessage || defaultMsg);
    return `https://wa.me/${this.whatsappNumber}?text=${encoded}`;
  }
}
