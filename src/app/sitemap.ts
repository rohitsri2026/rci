import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rciknp.vercel.app";

  // Base static pages
  const routes = ["", "/about", "/courses", "/admission", "/contact", "/verify"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    const supabase = await createClient();
    const { data: courses } = await supabase.from("courses").select("slug, course_name");

    const courseRoutes = (courses || []).map((course) => {
      const slug = course.slug || course.course_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return {
        url: `${baseUrl}/courses/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    });

    return [...routes, ...courseRoutes];
  } catch (e) {
    console.error("Failed to generate dynamic sitemap routes:", e);
    return routes;
  }
}
