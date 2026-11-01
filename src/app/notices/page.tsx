import React from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NoticesPublicClient from "@/components/NoticesPublicClient";
import { getActiveAnnouncements, getSiteSettings, getSeoSettings } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const site = await getSiteSettings();
  const siteUrl = seo.canonical_url || "https://rciknp.vercel.app";
  const siteName = site.site_name || "Rohit Computer Institute";

  const title = "Notices & Announcements";
  const fullTitle = `Notices & Announcements | ${siteName}`;
  const description =
    "Stay updated with official academic notices, exam schedules, holiday alerts, and admission announcements from Rohit Computer Institute (RCI) Kanpur.";
  const ogImage = seo.og_image_url || site.logo_url || `${siteUrl}/banner.png`;

  return {
    title,
    description,
    alternates: {
      canonical: "./notices",
    },
    openGraph: {
      title: fullTitle,
      description,
      url: `${siteUrl}/notices`,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteName} Notices & Announcements`,
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
          alt: `${siteName} Notices & Announcements`,
        },
      ],
    },
  };
}

export default async function PublicNoticesPage() {
  const notices = await getActiveAnnouncements();
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
        name: "Notices",
        item: `${siteUrl}/notices`,
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
      <main className="min-h-screen pt-28 pb-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <NoticesPublicClient initialNotices={notices} />
        </div>
      </main>
      <Footer />
    </>
  );
}
