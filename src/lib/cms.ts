import { createClient } from "@/lib/supabase/server";
import {
  SiteSettings,
  DirectorProfile,
  HomepageSettings,
  HomepageBanner,
  AnnouncementSettings,
  AboutSection,
  HomepageFeature,
  HomepageStat,
  ContactSettings,
  SocialLink,
  NavigationLink,
  SeoSettings,
  AnnouncementItem,
  CmsFullData,
} from "@/types/cms";
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_DIRECTOR_PROFILE,
  DEFAULT_HOMEPAGE_SETTINGS,
  DEFAULT_ANNOUNCEMENT_SETTINGS,
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_CONTACT_SETTINGS,
  DEFAULT_SEO_SETTINGS,
  DEFAULT_ABOUT_SECTIONS,
  DEFAULT_FEATURES,
  DEFAULT_STATS,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_NAV_LINKS,
} from "./cms-defaults";

export {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_DIRECTOR_PROFILE,
  DEFAULT_HOMEPAGE_SETTINGS,
  DEFAULT_ANNOUNCEMENT_SETTINGS,
  DEFAULT_CONTACT_SETTINGS,
  DEFAULT_SEO_SETTINGS,
  DEFAULT_ABOUT_SECTIONS,
  DEFAULT_FEATURES,
  DEFAULT_STATS,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_NAV_LINKS,
};

/**
 * Fetch Site Settings with Safe Fallback
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("*").eq("id", "default").single();
    if (data) return { ...DEFAULT_SITE_SETTINGS, ...data };
  } catch (e) {
    console.warn("CMS: Failed to fetch site_settings, using defaults", e);
  }
  return DEFAULT_SITE_SETTINGS;
}

/**
 * Fetch Director Profile with Safe Fallback
 */
export async function getDirectorProfile(): Promise<DirectorProfile> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("director_profile").select("*").eq("id", "default").single();
    if (data) return { ...DEFAULT_DIRECTOR_PROFILE, ...data };
  } catch (e) {
    console.warn("CMS: Failed to fetch director_profile, using defaults", e);
  }
  return DEFAULT_DIRECTOR_PROFILE;
}

/**
 * Fetch Homepage Settings with Safe Fallback
 */
export async function getHomepageSettings(): Promise<HomepageSettings> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("homepage_settings").select("*").eq("id", "default").single();
    if (data) return { ...DEFAULT_HOMEPAGE_SETTINGS, ...data };
  } catch (e) {
    console.warn("CMS: Failed to fetch homepage_settings, using defaults", e);
  }
  return DEFAULT_HOMEPAGE_SETTINGS;
}

/**
 * Fetch Homepage Banners
 */
export async function getHomepageBanners(): Promise<HomepageBanner[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("homepage_banners")
      .select("*")
      .order("display_order", { ascending: true });
    if (data && data.length > 0) return data;
  } catch (e) {
    console.warn("CMS: Failed to fetch homepage_banners", e);
  }
  return [];
}

/**
 * Fetch Announcement Settings
 */
export async function getAnnouncementSettings(): Promise<AnnouncementSettings> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("announcement_settings").select("*").eq("id", "default").single();
    if (data) return { ...DEFAULT_ANNOUNCEMENT_SETTINGS, ...data };
  } catch (e) {
    console.warn("CMS: Failed to fetch announcement_settings, using defaults", e);
  }
  return DEFAULT_ANNOUNCEMENT_SETTINGS;
}

/**
 * Fetch About Sections
 */
export async function getAboutSections(): Promise<AboutSection[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("about_sections").select("*").eq("is_active", true);
    if (data && data.length > 0) return data;
  } catch (e) {
    console.warn("CMS: Failed to fetch about_sections, using defaults", e);
  }
  return DEFAULT_ABOUT_SECTIONS;
}

/**
 * Fetch Homepage Features ("Why Choose RCI")
 */
export async function getHomepageFeatures(): Promise<HomepageFeature[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("homepage_features")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    if (data && data.length > 0) return data;
  } catch (e) {
    console.warn("CMS: Failed to fetch homepage_features, using defaults", e);
  }
  return DEFAULT_FEATURES;
}

/**
 * Fetch Homepage Stats
 */
export async function getHomepageStats(): Promise<HomepageStat[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("homepage_stats")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    if (data && data.length > 0) return data;
  } catch (e) {
    console.warn("CMS: Failed to fetch homepage_stats, using defaults", e);
  }
  return DEFAULT_STATS;
}

/**
 * Fetch Contact Settings
 */
export async function getContactSettings(): Promise<ContactSettings> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("contact_settings").select("*").eq("id", "default").single();
    if (data) return { ...DEFAULT_CONTACT_SETTINGS, ...data };
  } catch (e) {
    console.warn("CMS: Failed to fetch contact_settings, using defaults", e);
  }
  return DEFAULT_CONTACT_SETTINGS;
}

/**
 * Fetch Social Links
 */
export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("social_links")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    if (data && data.length > 0) return data;
  } catch (e) {
    console.warn("CMS: Failed to fetch social_links, using defaults", e);
  }
  return DEFAULT_SOCIAL_LINKS;
}

/**
 * Fetch Navigation Links
 */
export async function getNavigationLinks(): Promise<NavigationLink[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("navigation_links")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    if (data && data.length > 0) return data;
  } catch (e) {
    console.warn("CMS: Failed to fetch navigation_links, using defaults", e);
  }
  return DEFAULT_NAV_LINKS;
}

/**
 * Fetch SEO Settings
 */
export async function getSeoSettings(): Promise<SeoSettings> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("seo_settings").select("*").eq("id", "default").single();
    if (data) return { ...DEFAULT_SEO_SETTINGS, ...data };
  } catch (e) {
    console.warn("CMS: Failed to fetch seo_settings, using defaults", e);
  }
  return DEFAULT_SEO_SETTINGS;
}

/**
 * Fetch All Announcements (for CMS Manager)
 */
export async function getAnnouncements(): Promise<AnnouncementItem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("website_announcements")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (data && data.length > 0) return data;
  } catch (e) {
    console.warn("CMS: Failed to fetch website_announcements", e);
  }
  return DEFAULT_ANNOUNCEMENTS as any[];
}

/**
 * Fetch Active Announcements (for Website Header)
 */
export async function getActiveAnnouncements(): Promise<AnnouncementItem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("website_announcements")
      .select("*")
      .eq("is_enabled", true)
      .order("display_order", { ascending: true });
    
    if (data && data.length > 0) {
      const now = new Date();
      return data.filter((item) => {
        if (item.start_at && new Date(item.start_at) > now) return false;
        if (item.end_at && new Date(item.end_at) < now) return false;
        return true;
      });
    }
  } catch (e) {
    console.warn("CMS: Failed to fetch active website_announcements", e);
  }
  return DEFAULT_ANNOUNCEMENTS as any[];
}

/**
 * Fetch All CMS Data at once
 */
export async function getAllCmsData(): Promise<CmsFullData> {
  const [
    siteSettings,
    directorProfile,
    homepageSettings,
    banners,
    announcement,
    announcements,
    aboutSections,
    features,
    stats,
    contactSettings,
    socialLinks,
    navLinks,
    seoSettings,
  ] = await Promise.all([
    getSiteSettings(),
    getDirectorProfile(),
    getHomepageSettings(),
    getHomepageBanners(),
    getAnnouncementSettings(),
    getAnnouncements(),
    getAboutSections(),
    getHomepageFeatures(),
    getHomepageStats(),
    getContactSettings(),
    getSocialLinks(),
    getNavigationLinks(),
    getSeoSettings(),
  ]);

  return {
    siteSettings,
    directorProfile,
    homepageSettings,
    banners,
    announcement,
    announcements,
    aboutSections,
    features,
    stats,
    contactSettings,
    socialLinks,
    navLinks,
    seoSettings,
  };
}
