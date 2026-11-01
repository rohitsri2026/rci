import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdmissionFormClient from "./AdmissionFormClient";
import { getContactSettings, getSiteSettings, getSeoSettings } from "@/lib/cms";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const site = await getSiteSettings();
  const siteUrl = seo.canonical_url || "https://rciknp.vercel.app";
  const siteName = site.site_name || "Rohit Computer Institute";

  const title = "Online Admission 2026-27";
  const fullTitle = `${title} | ${siteName}`;
  const description =
    "Apply online for computer diploma & certificate courses at Rohit Computer Institute Kanpur. Fast admission for DCA, CCC, Tally Prime & Web Development.";
  const ogImage = seo.og_image_url || site.logo_url || `${siteUrl}/banner.png`;

  return {
    title,
    description,
    alternates: {
      canonical: "./admission",
    },
    openGraph: {
      title: fullTitle,
      description,
      url: `${siteUrl}/admission`,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteName} Online Admission`,
          type: "image/png",
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      creator: "@rciknp",
      site: "@rciknp",
      images: [
        {
          url: seo.twitter_image_url || ogImage,
          width: 1200,
          height: 630,
          alt: `${siteName} Online Admission`,
        },
      ],
    },
  };
}

export default async function AdmissionPage() {
  const [site, contact, supabase] = await Promise.all([
    getSiteSettings(),
    getContactSettings(),
    createClient(),
  ]);

  let initialCourses: { id: string; course_name: string; slug?: string }[] = [];
  try {
    const { data } = await supabase
      .from("courses")
      .select("id, course_name, slug")
      .or("status.eq.Active,status.is.null")
      .order("course_name", { ascending: true });
    if (data && data.length > 0) {
      initialCourses = data;
    }
  } catch (err) {
    console.warn("AdmissionPage: Failed to load courses on server", err);
  }

  const siteUrl = "https://rciknp.vercel.app";
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Admission",
        item: `${siteUrl}/admission`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <AdmissionFormClient
        initialCourses={initialCourses}
        contactSettings={{
          whatsapp: contact.whatsapp ? contact.whatsapp.replace(/\D/g, "") : "917376893097",
          phone: contact.phone || "+91 73768 93097",
          phoneRaw: contact.phone ? contact.phone.replace(/\s+/g, "") : "+917376893097",
          email: contact.email || "info@rciknp.com",
        }}
        siteSettings={{
          short_name: site.short_name || "RCI",
          site_name: site.site_name || "Rohit Computer Institute",
        }}
      />
      <Footer />
    </>
  );
}
