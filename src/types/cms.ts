export interface SiteSettings {
  id: string;
  site_name: string;
  short_name: string;
  tagline: string;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  browser_title: string;
  updated_at?: string;
}

export interface DirectorProfile {
  id: string;
  name: string;
  photo_url: string | null;
  designation: string;
  message: string;
  signature_url: string | null;
  established_year: string;
  updated_at?: string;
}

export interface HomepageSettings {
  id: string;
  hero_badge: string;
  hero_title: string;
  hero_highlight: string;
  hero_description: string;
  hero_image_url: string | null;
  hero_bg_url: string | null;
  primary_cta_text: string;
  primary_cta_url: string;
  secondary_cta_text: string;
  secondary_cta_url: string;
  updated_at?: string;
}

export interface HomepageBanner {
  id: string;
  title: string;
  description: string | null;
  desktop_image_url: string;
  mobile_image_url: string | null;
  cta_text: string | null;
  cta_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AnnouncementSettings {
  id: string;
  is_enabled: boolean;
  message: string;
  link_text: string;
  link_url: string;
  start_at: string | null;
  end_at: string | null;
  updated_at?: string;
}

export interface AboutSection {
  id: string;
  section_key: string;
  heading: string;
  short_description: string | null;
  content: string;
  image_url: string | null;
  is_active: boolean;
  updated_at?: string;
}

export interface HomepageFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  updated_at?: string;
}

export interface HomepageStat {
  id: string;
  label: string;
  value: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  updated_at?: string;
}

export interface ContactSettings {
  id: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  maps_url: string;
  office_hours: string;
  updated_at?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  is_active: boolean;
  display_order: number;
  updated_at?: string;
}

export interface NavigationLink {
  id: string;
  location: "header" | "footer_quick" | "footer_useful";
  label: string;
  url: string;
  open_new_tab: boolean;
  display_order: number;
  is_active: boolean;
  is_system?: boolean;
  updated_at?: string;
}

export interface SeoSettings {
  id: string;
  site_title: string;
  meta_description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  og_image_url: string | null;
  twitter_title: string;
  twitter_description: string;
  twitter_image_url: string | null;
  canonical_url: string;
  updated_at?: string;
}

export interface CmsMediaItem {
  id: string;
  filename: string;
  file_path: string;
  public_url: string;
  mime_type: string;
  size_bytes: number;
  category: string;
  created_at: string;
}

export type AnnouncementType =
  | "notice"
  | "important"
  | "admission"
  | "exam"
  | "fee"
  | "event"
  | "update"
  | "certificate"
  | "material";

export type AnnouncementPriority = "normal" | "important" | "urgent";

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  announcement_type: AnnouncementType;
  priority: AnnouncementPriority;
  is_enabled: boolean;
  start_at: string;
  end_at: string | null;
  button_text: string | null;
  button_url: string | null;
  display_order: number;
  is_dismissible: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
}

export interface CmsFullData {
  siteSettings: SiteSettings;
  directorProfile: DirectorProfile;
  homepageSettings: HomepageSettings;
  banners: HomepageBanner[];
  announcement: AnnouncementSettings;
  announcements?: AnnouncementItem[];
  aboutSections: AboutSection[];
  features: HomepageFeature[];
  stats: HomepageStat[];
  contactSettings: ContactSettings;
  socialLinks: SocialLink[];
  navLinks: NavigationLink[];
  seoSettings: SeoSettings;
}
