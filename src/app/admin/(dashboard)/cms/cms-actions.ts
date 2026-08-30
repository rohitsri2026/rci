"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";
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
  CmsMediaItem,
} from "@/types/cms";

// Helper function to log CMS activity into existing audit_logs table
async function logCmsActivity(action: string, details: string, userEmail: string) {
  try {
    const supabase = await createClient();
    await supabase.from("audit_logs").insert({
      action: action,
      certificate_number: "CMS-UPDATE",
      user_email: userEmail,
      ip_address: "127.0.0.1",
      details: details,
    });
  } catch (err) {
    console.error("Audit log error for CMS:", err);
  }
}

// Central helper to revalidate all website pages after CMS updates
async function revalidateAllWebsitePages() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/courses");
    revalidatePath("/contact");
    revalidatePath("/verify");
    revalidatePath("/admission");
    revalidatePath("/admin/cms");
  } catch (err) {
    console.error("Failed to revalidate paths:", err);
  }
}

// 1. UPDATE BRANDING & SITE SETTINGS
export async function updateSiteSettingsAction(data: Partial<SiteSettings>) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { error } = await supabase
    .from("site_settings")
    .upsert({
      id: "default",
      ...data,
      updated_at: new Date().toISOString(),
    });

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_UPDATE_BRANDING", "Updated site branding & colors", authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Branding settings saved successfully!" };
}

// 2. UPDATE DIRECTOR & INSTITUTE PROFILE
export async function updateDirectorProfileAction(data: Partial<DirectorProfile>) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { error } = await supabase
    .from("director_profile")
    .upsert({
      id: "default",
      ...data,
      updated_at: new Date().toISOString(),
    });

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_UPDATE_DIRECTOR", "Updated director & institute profile", authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Director profile saved successfully!" };
}

// 3. UPDATE HOMEPAGE HERO SETTINGS
export async function updateHomepageSettingsAction(data: Partial<HomepageSettings>) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { error } = await supabase
    .from("homepage_settings")
    .upsert({
      id: "default",
      ...data,
      updated_at: new Date().toISOString(),
    });

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_UPDATE_HERO", "Updated homepage hero content", authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Homepage hero content saved successfully!" };
}

// 4. SAVE HOMEPAGE BANNER (INSERT / UPDATE)
export async function saveBannerAction(banner: Partial<HomepageBanner>) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  if (!banner.desktop_image_url || !banner.title) {
    return { success: false, error: "Title and Desktop image are required." };
  }

  const payload: Partial<HomepageBanner> = {
    title: banner.title,
    description: banner.description || null,
    desktop_image_url: banner.desktop_image_url,
    mobile_image_url: banner.mobile_image_url || null,
    cta_text: banner.cta_text || null,
    cta_url: banner.cta_url || null,
    display_order: banner.display_order ?? 0,
    is_active: banner.is_active ?? true,
    updated_at: new Date().toISOString(),
  };

  if (banner.id) {
    payload.id = banner.id;
  }

  const { error } = await supabase.from("homepage_banners").upsert(payload);

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_SAVE_BANNER", `Saved homepage banner: ${banner.title}`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Homepage banner saved successfully!" };
}

// DELETE BANNER
export async function deleteBannerAction(id: string) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { error } = await supabase.from("homepage_banners").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_DELETE_BANNER", `Deleted homepage banner id: ${id}`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Banner deleted successfully!" };
}

// 5. UPDATE ANNOUNCEMENT SETTINGS
export async function updateAnnouncementSettingsAction(data: Partial<AnnouncementSettings>) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { error } = await supabase
    .from("announcement_settings")
    .upsert({
      id: "default",
      ...data,
      updated_at: new Date().toISOString(),
    });

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_UPDATE_ANNOUNCEMENT", "Updated announcement bar settings", authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Announcement bar saved successfully!" };
}

// 6. UPDATE ABOUT SECTION
export async function updateAboutSectionAction(data: Partial<AboutSection>) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { error } = await supabase
    .from("about_sections")
    .upsert({
      ...data,
      updated_at: new Date().toISOString(),
    });

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_UPDATE_ABOUT", `Updated about section: ${data.section_key}`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "About section saved successfully!" };
}

// 7. SAVE FEATURE ("Why Choose RCI")
export async function saveFeatureAction(feature: Partial<HomepageFeature>) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  if (!feature.title || !feature.description) {
    return { success: false, error: "Title and Description are required." };
  }

  const payload: Partial<HomepageFeature> = {
    title: feature.title,
    description: feature.description,
    icon: feature.icon || "GraduationCap",
    display_order: feature.display_order ?? 0,
    is_active: feature.is_active ?? true,
    updated_at: new Date().toISOString(),
  };

  if (feature.id) payload.id = feature.id;

  const { error } = await supabase.from("homepage_features").upsert(payload);
  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_SAVE_FEATURE", `Saved feature card: ${feature.title}`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Feature card saved successfully!" };
}

export async function deleteFeatureAction(id: string) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { error } = await supabase.from("homepage_features").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_DELETE_FEATURE", `Deleted feature card id: ${id}`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Feature card deleted successfully!" };
}

// 8. SAVE STATISTIC
export async function saveStatAction(stat: Partial<HomepageStat>) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  if (!stat.label || !stat.value) {
    return { success: false, error: "Label and Value are required." };
  }

  const payload: Partial<HomepageStat> = {
    label: stat.label,
    value: stat.value,
    icon: stat.icon || "Users",
    display_order: stat.display_order ?? 0,
    is_active: stat.is_active ?? true,
    updated_at: new Date().toISOString(),
  };

  if (stat.id) payload.id = stat.id;

  const { error } = await supabase.from("homepage_stats").upsert(payload);
  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_SAVE_STAT", `Saved stat: ${stat.label}`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Statistic item saved successfully!" };
}

export async function deleteStatAction(id: string) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { error } = await supabase.from("homepage_stats").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_DELETE_STAT", `Deleted stat id: ${id}`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Statistic deleted successfully!" };
}

// 9. UPDATE CONTACT SETTINGS
export async function updateContactSettingsAction(data: Partial<ContactSettings>) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { error } = await supabase
    .from("contact_settings")
    .upsert({
      id: "default",
      ...data,
      updated_at: new Date().toISOString(),
    });

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_UPDATE_CONTACT", "Updated contact settings", authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Contact information saved successfully!" };
}

// 10. SAVE SOCIAL LINK
export async function saveSocialLinkAction(social: Partial<SocialLink>) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  if (!social.platform || !social.url) {
    return { success: false, error: "Platform and URL are required." };
  }

  const payload: Partial<SocialLink> = {
    platform: social.platform,
    url: social.url,
    is_active: social.is_active ?? true,
    display_order: social.display_order ?? 0,
    updated_at: new Date().toISOString(),
  };

  if (social.id) payload.id = social.id;

  const { error } = await supabase.from("social_links").upsert(payload);
  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_SAVE_SOCIAL", `Saved social link: ${social.platform}`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Social media link saved!" };
}

export async function deleteSocialLinkAction(id: string) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_DELETE_SOCIAL", `Deleted social link id: ${id}`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Social link deleted!" };
}

// 11. SAVE NAVIGATION LINK
export async function saveNavigationLinkAction(nav: Partial<NavigationLink>) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  if (!nav.label || !nav.url || !nav.location) {
    return { success: false, error: "Label, URL and Location are required." };
  }

  const payload: Partial<NavigationLink> = {
    location: nav.location,
    label: nav.label,
    url: nav.url,
    open_new_tab: nav.open_new_tab ?? false,
    display_order: nav.display_order ?? 0,
    is_active: nav.is_active ?? true,
    is_system: nav.is_system ?? false,
    updated_at: new Date().toISOString(),
  };

  if (nav.id) payload.id = nav.id;

  const { error } = await supabase.from("navigation_links").upsert(payload);
  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_SAVE_NAV", `Saved nav link: ${nav.label} (${nav.location})`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Navigation link saved successfully!" };
}

export async function deleteNavigationLinkAction(id: string) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  // Check if system route
  const { data: existing } = await supabase.from("navigation_links").select("is_system, label").eq("id", id).single();
  if (existing?.is_system) {
    return { success: false, error: `Critical system link "${existing.label}" cannot be deleted.` };
  }

  const { error } = await supabase.from("navigation_links").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_DELETE_NAV", `Deleted nav link id: ${id}`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Navigation link deleted!" };
}

// 12. UPDATE SEO SETTINGS
export async function updateSeoSettingsAction(data: Partial<SeoSettings>) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { error } = await supabase
    .from("seo_settings")
    .upsert({
      id: "default",
      ...data,
      updated_at: new Date().toISOString(),
    });

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_UPDATE_SEO", "Updated SEO & Meta tags", authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "SEO settings saved successfully!" };
}

// 13. CMS MEDIA MANAGEMENT
export async function fetchCmsMediaAction(): Promise<CmsMediaItem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("cms_media").select("*").order("created_at", { ascending: false });
    return data || [];
  } catch (err) {
    console.error("Error fetching CMS media:", err);
    return [];
  }
}

export async function recordMediaUploadAction(media: Omit<CmsMediaItem, "id" | "created_at">) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { error } = await supabase.from("cms_media").insert(media);
  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_UPLOAD_MEDIA", `Uploaded media asset: ${media.filename}`, authResult.user.email ?? "");
  revalidatePath("/admin/cms");
  return { success: true, message: "Media recorded successfully!" };
}

export async function deleteCmsAssetAction(id: string, filePath: string) {
  const supabase = await createClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  // Delete from storage
  if (filePath) {
    await supabase.storage.from("website-assets").remove([filePath]);
  }

  // Delete record
  const { error } = await supabase.from("cms_media").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_DELETE_MEDIA", `Deleted media asset id: ${id}`, authResult.user.email ?? "");
  revalidatePath("/admin/cms");
  return { success: true, message: "Asset deleted successfully!" };
}
