import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about-hero";
import MDMessage from "@/components/md-message";
import Mission from "@/components/mission";
import LearningApproach from "@/components/learning-approach";
import WhyRCI from "@/components/WhyRCI";
import AboutStudentPortal from "@/components/about-student-portal";
import AboutCertTrust from "@/components/about-cert-trust";
import Stats from "@/components/StatsSection";
import { getSeoSettings, getSiteSettings } from "@/lib/cms";
import WhatsAppCounsellingBanner from "@/components/whatsapp-counselling-banner";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const site = await getSiteSettings();

  const title = "About Us";
  const fullTitle = `About Us | ${site.site_name}`;
  const description =
    seo.meta_description ||
    "Learn about Rohit Computer Institute (RCI) Kanpur, our leadership, mission, vision, practical computer training methodology, and student digital ecosystem.";
  const siteUrl = seo.canonical_url || "https://rciknp.vercel.app";
  const bannerImage = seo.og_image_url || site.logo_url || `${siteUrl}/banner.png`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/about`,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: `${siteUrl}/about`,
      siteName: site.site_name,
      images: [
        {
          url: bannerImage,
          width: 1200,
          height: 630,
          alt: `${site.site_name} - About Us Kanpur`,
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

export default function AboutPage() {
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
        name: "About Us",
        item: `${siteUrl}/about`,
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
      <main className="bg-slate-50 pt-24 sm:pt-28 pb-16 overflow-hidden">
        <AboutHero />
        <MDMessage />
        <Mission />
        <LearningApproach />
        <WhyRCI />
        <AboutStudentPortal />
        <AboutCertTrust />
        <Stats />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl mt-12 sm:mt-16">
          <WhatsAppCounsellingBanner
            badge="INSTITUTE COUNSELLING"
            title="Have questions about RCI or our programs?"
            description="Talk directly with an RCI admissions counsellor and learn how our practical courses can support your career."
            buttonText="Chat with RCI on WhatsApp"
            customMessage="Hello RCI, I would like to get more information about the institute and computer courses."
            variant="horizontal"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
