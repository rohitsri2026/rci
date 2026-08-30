import { createClient } from "@/lib/supabase/client";
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
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_CONTACT_SETTINGS,
  DEFAULT_SEO_SETTINGS,
  DEFAULT_ABOUT_SECTIONS,
  DEFAULT_FEATURES,
  DEFAULT_STATS,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_NAV_LINKS,
} from "./cms-defaults";

/**
 * Client-safe fetcher for all CMS data using Supabase Client SDK
 */
export async function getAllCmsDataClient(): Promise<CmsFullData> {
  const supabase = createClient();

  try {
    const [
      siteRes,
      directorRes,
      heroRes,
      bannersRes,
      announcementRes,
      announcementsRes,
      aboutRes,
      featuresRes,
      statsRes,
      contactRes,
      socialRes,
      navRes,
      seoRes,
    ] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", "default").maybeSingle(),
      supabase.from("director_profile").select("*").eq("id", "default").maybeSingle(),
      supabase.from("homepage_settings").select("*").eq("id", "default").maybeSingle(),
      supabase.from("homepage_banners").select("*").order("display_order", { ascending: true }),
      supabase.from("announcement_settings").select("*").eq("id", "default").maybeSingle(),
      supabase.from("website_announcements").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: false }),
      supabase.from("about_sections").select("*").eq("is_active", true),
      supabase.from("homepage_features").select("*").eq("is_active", true).order("display_order", { ascending: true }),
      supabase.from("homepage_stats").select("*").eq("is_active", true).order("display_order", { ascending: true }),
      supabase.from("contact_settings").select("*").eq("id", "default").maybeSingle(),
      supabase.from("social_links").select("*").eq("is_active", true).order("display_order", { ascending: true }),
      supabase.from("navigation_links").select("*").eq("is_active", true).order("display_order", { ascending: true }),
      supabase.from("seo_settings").select("*").eq("id", "default").maybeSingle(),
    ]);

    return {
      siteSettings: siteRes.data ? { ...DEFAULT_SITE_SETTINGS, ...siteRes.data } : DEFAULT_SITE_SETTINGS,
      directorProfile: directorRes.data ? { ...DEFAULT_DIRECTOR_PROFILE, ...directorRes.data } : DEFAULT_DIRECTOR_PROFILE,
      homepageSettings: heroRes.data ? { ...DEFAULT_HOMEPAGE_SETTINGS, ...heroRes.data } : DEFAULT_HOMEPAGE_SETTINGS,
      banners: bannersRes.data && bannersRes.data.length > 0 ? bannersRes.data : [],
      announcement: announcementRes.data ? { ...DEFAULT_ANNOUNCEMENT_SETTINGS, ...announcementRes.data } : DEFAULT_ANNOUNCEMENT_SETTINGS,
      announcements: announcementsRes.data && announcementsRes.data.length > 0 ? announcementsRes.data : DEFAULT_ANNOUNCEMENTS as any[],
      aboutSections: aboutRes.data && aboutRes.data.length > 0 ? aboutRes.data : DEFAULT_ABOUT_SECTIONS,
      features: featuresRes.data && featuresRes.data.length > 0 ? featuresRes.data : DEFAULT_FEATURES,
      stats: statsRes.data && statsRes.data.length > 0 ? statsRes.data : DEFAULT_STATS,
      contactSettings: contactRes.data ? { ...DEFAULT_CONTACT_SETTINGS, ...contactRes.data } : DEFAULT_CONTACT_SETTINGS,
      socialLinks: socialRes.data && socialRes.data.length > 0 ? socialRes.data : DEFAULT_SOCIAL_LINKS,
      navLinks: navRes.data && navRes.data.length > 0 ? navRes.data : DEFAULT_NAV_LINKS,
      seoSettings: seoRes.data ? { ...DEFAULT_SEO_SETTINGS, ...seoRes.data } : DEFAULT_SEO_SETTINGS,
    };
  } catch (err) {
    console.error("Failed to fetch CMS client data:", err);
    return {
      siteSettings: DEFAULT_SITE_SETTINGS,
      directorProfile: DEFAULT_DIRECTOR_PROFILE,
      homepageSettings: DEFAULT_HOMEPAGE_SETTINGS,
      banners: [],
      announcement: DEFAULT_ANNOUNCEMENT_SETTINGS,
      announcements: DEFAULT_ANNOUNCEMENTS as any[],
      aboutSections: DEFAULT_ABOUT_SECTIONS,
      features: DEFAULT_FEATURES,
      stats: DEFAULT_STATS,
      contactSettings: DEFAULT_CONTACT_SETTINGS,
      socialLinks: DEFAULT_SOCIAL_LINKS,
      navLinks: DEFAULT_NAV_LINKS,
      seoSettings: DEFAULT_SEO_SETTINGS,
    };
  }
}
