"use server";

import { createAdminServerClient } from "@/lib/supabase/server-admin";
import { revalidatePath } from "next/cache";
import { verifyRole } from "@/lib/auth";
import {
  SiteSettings,
  DirectorProfile,
  HomepageSettings,
  HomepageBanner,
  AnnouncementSettings,
  AnnouncementItem,
  AboutSection,
  HomepageFeature,
  HomepageStat,
  ContactSettings,
  SocialLink,
  NavigationLink,
  SeoSettings,
  CmsMediaItem,
} from "@/types/cms";

/**
 * Log CMS Activity into system_audit_logs
 */
async function logCmsActivity(action: string, details: string, email: string) {
  try {
    const supabase = await createAdminServerClient();
    await supabase.from("system_audit_logs").insert({
      action: action,
      performed_by: email || "admin",
      user_role: "Admin",
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
    revalidatePath("/admin", "layout");
    revalidatePath("/student", "layout");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/courses");
    revalidatePath("/contact");
    revalidatePath("/verify");
    revalidatePath("/admission");
    revalidatePath("/notices");
    revalidatePath("/admin/cms");
  } catch (err) {
    console.error("Failed to revalidate paths:", err);
  }
}

// 1. UPDATE BRANDING & SITE SETTINGS
export async function updateSiteSettingsAction(data: Partial<SiteSettings>) {
  const supabase = await createAdminServerClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { data: updatedData, error } = await supabase
    .from("site_settings")
    .upsert({
      id: "default",
      ...data,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_UPDATE_BRANDING", "Updated site branding & colors", authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Branding settings saved successfully!", data: updatedData };
}

// 2. UPDATE DIRECTOR & INSTITUTE PROFILE
export async function updateDirectorProfileAction(data: Partial<DirectorProfile>) {
  const supabase = await createAdminServerClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { data: updatedData, error } = await supabase
    .from("director_profile")
    .upsert({
      id: "default",
      ...data,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_UPDATE_DIRECTOR", "Updated director & institute profile", authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Director profile saved successfully!", data: updatedData };
}

// 3. UPDATE HOMEPAGE HERO SETTINGS
export async function updateHomepageSettingsAction(data: Partial<HomepageSettings>) {
  const supabase = await createAdminServerClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { data: updatedData, error } = await supabase
    .from("homepage_settings")
    .upsert({
      id: "default",
      ...data,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_UPDATE_HERO", "Updated homepage hero content", authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Homepage hero content saved successfully!", data: updatedData };
}

// 4. SAVE HOMEPAGE BANNER (INSERT / UPDATE)
export async function saveBannerAction(banner: Partial<HomepageBanner>) {
  const supabase = await createAdminServerClient();
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

  const { data: updatedData, error } = await supabase
    .from("homepage_banners")
    .upsert(payload)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_SAVE_BANNER", `Saved homepage banner: ${banner.title}`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Homepage banner saved successfully!", data: updatedData };
}

// DELETE BANNER
export async function deleteBannerAction(id: string) {
  const supabase = await createAdminServerClient();
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

// 5. UPDATE ANNOUNCEMENT SETTINGS (Legacy)
export async function updateAnnouncementSettingsAction(data: Partial<AnnouncementSettings>) {
  const supabase = await createAdminServerClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { data: updatedData, error } = await supabase
    .from("announcement_settings")
    .upsert({
      id: "default",
      ...data,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_UPDATE_ANNOUNCEMENT", "Updated announcement bar settings", authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Announcement bar saved successfully!", data: updatedData };
}

// 5B. SAVE WEBSITE ANNOUNCEMENT NOTICE ITEM (Professional Notice System)
export async function saveAnnouncementItemAction(item: Partial<AnnouncementItem>) {
  const supabase = await createAdminServerClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  if (!item.title || !item.message) {
    return { success: false, error: "Notice Title and Message are required." };
  }

  // Validate CTA button URL scheme for security
  if (item.button_url) {
    const lowerUrl = item.button_url.trim().toLowerCase();
    if (
      lowerUrl.startsWith("javascript:") ||
      lowerUrl.startsWith("data:") ||
      lowerUrl.startsWith("vbscript:")
    ) {
      return { success: false, error: "Invalid CTA Button URL scheme. Use relative or http/https URLs." };
    }
  }

  const payload: any = {
    title: item.title,
    message: item.message,
    announcement_type: item.announcement_type || "notice",
    priority: item.priority || "normal",
    display_on: item.display_on || "global",
    display_format: item.display_format || "top_strip",
    is_enabled: item.is_enabled ?? true,
    no_expiry: item.no_expiry ?? true,
    start_at: item.start_at || new Date().toISOString(),
    end_at: item.no_expiry ? null : (item.end_at || null),
    button_text: item.button_text || null,
    button_url: item.button_url || null,
    display_order: item.display_order ?? 0,
    is_dismissible: item.is_dismissible ?? true,
    updated_at: new Date().toISOString(),
    created_by: authResult.user.id,
  };

  if (item.id) payload.id = item.id;

  const { data: updatedData, error } = await supabase
    .from("website_announcements")
    .upsert(payload)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_SAVE_ANNOUNCEMENT_ITEM", `Saved notice: ${item.title}`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Announcement notice saved successfully!", data: updatedData };
}

// DELETE WEBSITE ANNOUNCEMENT ITEM
export async function deleteAnnouncementItemAction(id: string) {
  const supabase = await createAdminServerClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { error } = await supabase.from("website_announcements").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_DELETE_ANNOUNCEMENT_ITEM", `Deleted notice id: ${id}`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Announcement notice deleted successfully!" };
}

// 6. UPDATE ABOUT SECTION
export async function updateAboutSectionAction(data: Partial<AboutSection>) {
  const supabase = await createAdminServerClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { data: updatedData, error } = await supabase
    .from("about_sections")
    .upsert({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_UPDATE_ABOUT", `Updated about section: ${data.section_key}`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "About section saved successfully!", data: updatedData };
}

// 7. SAVE FEATURE ("Why Choose RCI")
export async function saveFeatureAction(feature: Partial<HomepageFeature>) {
  const supabase = await createAdminServerClient();
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

  const { data: updatedData, error } = await supabase
    .from("homepage_features")
    .upsert(payload)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_SAVE_FEATURE", `Saved feature card: ${feature.title}`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Feature card saved successfully!", data: updatedData };
}

export async function deleteFeatureAction(id: string) {
  const supabase = await createAdminServerClient();
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
  const supabase = await createAdminServerClient();
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

  const { data: updatedData, error } = await supabase
    .from("homepage_stats")
    .upsert(payload)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_SAVE_STAT", `Saved stat: ${stat.label}`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Statistic item saved successfully!", data: updatedData };
}

export async function deleteStatAction(id: string) {
  const supabase = await createAdminServerClient();
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
  const supabase = await createAdminServerClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { data: updatedData, error } = await supabase
    .from("contact_settings")
    .upsert({
      id: "default",
      ...data,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_UPDATE_CONTACT", "Updated contact settings", authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Contact information saved successfully!", data: updatedData };
}

// 10. SAVE SOCIAL LINK
export async function saveSocialLinkAction(social: Partial<SocialLink>) {
  const supabase = await createAdminServerClient();
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

  const { data: updatedData, error } = await supabase
    .from("social_links")
    .upsert(payload)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_SAVE_SOCIAL", `Saved social link: ${social.platform}`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Social media link saved!", data: updatedData };
}

export async function deleteSocialLinkAction(id: string) {
  const supabase = await createAdminServerClient();
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
  const supabase = await createAdminServerClient();
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

  const { data: updatedData, error } = await supabase
    .from("navigation_links")
    .upsert(payload)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_SAVE_NAV", `Saved nav link: ${nav.label} (${nav.location})`, authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "Navigation link saved successfully!", data: updatedData };
}

export async function deleteNavigationLinkAction(id: string) {
  const supabase = await createAdminServerClient();
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
  const supabase = await createAdminServerClient();
  const authResult = await verifyRole(supabase, ["Admin"]);
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const { data: updatedData, error } = await supabase
    .from("seo_settings")
    .upsert({
      id: "default",
      ...data,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  await logCmsActivity("CMS_UPDATE_SEO", "Updated SEO & Meta tags", authResult.user.email ?? "");
  await revalidateAllWebsitePages();
  return { success: true, message: "SEO settings saved successfully!", data: updatedData };
}

// 13. CMS MEDIA MANAGEMENT
export async function fetchCmsMediaAction(): Promise<CmsMediaItem[]> {
  try {
    const supabase = await createAdminServerClient();
    const { data } = await supabase.from("cms_media").select("*").order("created_at", { ascending: false });
    return data || [];
  } catch (err) {
    console.error("Error fetching CMS media:", err);
    return [];
  }
}

export async function recordMediaUploadAction(media: Omit<CmsMediaItem, "id" | "created_at">) {
  const supabase = await createAdminServerClient();
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
  const supabase = await createAdminServerClient();
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
