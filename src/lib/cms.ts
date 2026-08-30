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
  CmsFullData,
} from "@/types/cms";
import {
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
 * Fetch All CMS Data at once
 */
export async function getAllCmsData(): Promise<CmsFullData> {
  const [
    siteSettings,
    directorProfile,
    homepageSettings,
    banners,
    announcement,
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
    aboutSections,
    features,
    stats,
    contactSettings,
    socialLinks,
    navLinks,
    seoSettings,
  };
}
