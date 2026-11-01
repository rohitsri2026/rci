import type { MetadataRoute } from "next";
import { RCIConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || RCIConfig.siteUrl;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/student/"],
      },
      {
        userAgent: ["OAI-SearchBot", "Claude-SearchBot", "PerplexityBot"],
        allow: "/",
        disallow: ["/admin/", "/api/", "/student/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
