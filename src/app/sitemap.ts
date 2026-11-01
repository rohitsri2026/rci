import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { RCIConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Fallback courses for offline builds or DB unavailability
const FALLBACK_COURSES = [
  { slug: "dca-course", course_name: "Diploma in Computer Application (DCA)" },
  { slug: "web-development", course_name: "Web Development" },
  { slug: "tally-prime", course_name: "Tally Prime & GST Accounting" },
  { slug: "python-programming", course_name: "Python Programming" },
  { slug: "typing-course", course_name: "Typing Course (Hindi & English)" },
  { slug: "graphic-designing", course_name: "Graphic Designing" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || RCIConfig.siteUrl;

  // Base static pages with tailored priority and changeFrequency
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/admission`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/notices`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/verify`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const supabase = await createClient();
    const { data: dbCourses, error } = await supabase
      .from("courses")
      .select("slug, course_name, updated_at, created_at, status")
      .or("status.eq.Active,status.is.null")
      .order("course_name");

    const coursesToMap = (!error && dbCourses && dbCourses.length > 0)
      ? dbCourses
      : FALLBACK_COURSES;

    const courseRoutes: MetadataRoute.Sitemap = coursesToMap.map((course: { slug?: string; course_name: string; updated_at?: string; created_at?: string }) => {
      const slug = course.slug || toSlug(course.course_name);
      const lastModDate = course.updated_at
        ? new Date(course.updated_at)
        : course.created_at
        ? new Date(course.created_at)
        : new Date();

      return {
        url: `${baseUrl}/courses/${slug}`,
        lastModified: lastModDate,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      };
    });

    return [...staticRoutes, ...courseRoutes];
  } catch (e) {
    console.error("Failed to generate dynamic sitemap routes:", e);
    const fallbackRoutes: MetadataRoute.Sitemap = FALLBACK_COURSES.map((course) => ({
      url: `${baseUrl}/courses/${course.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    return [...staticRoutes, ...fallbackRoutes];
  }
}
