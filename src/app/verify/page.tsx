import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VerifyForm from "@/components/VerifyForm";
import { getSeoSettings, getSiteSettings } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const site = await getSiteSettings();

  const title = "Verify Certificate";
  const fullTitle = `Verify Certificate | ${site.site_name}`;
  const description =
    "Verify Rohit Computer Institute student certificates and diplomas online using the unique Certificate ID or QR code for authentic verification.";
  const siteUrl = seo.canonical_url || "https://rciknp.vercel.app";
  const bannerImage = seo.og_image_url || site.logo_url || `${siteUrl}/banner.png`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/verify`,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: `${siteUrl}/verify`,
      siteName: site.site_name,
      images: [
        {
          url: bannerImage,
          width: 1200,
          height: 630,
          alt: `Verify ${site.site_name} Certificate Online`,
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
      images: [bannerImage],
    },
  };
}

export default function VerifyPage() {
  const siteUrl = "https://rciknp.vercel.app";
  const breadcrumbsJsonLd = {
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
        name: "Verify Certificate",
        item: `${siteUrl}/verify`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbsJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <VerifyForm />
      <Footer />
    </>
  );
}
