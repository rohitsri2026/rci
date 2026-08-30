import { Metadata } from "next";
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

  const title = `About Us | ${site.site_name}`;
  const description = `Learn about ${site.site_name}, our leadership, mission, vision, practical computer training methodology, and student digital ecosystem.`;
  const siteUrl = seo.canonical_url || "https://rciknp.vercel.app";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/about`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/about`,
      siteName: site.site_name,
      images: [
        {
          url: seo.og_image_url || site.logo_url || `${siteUrl}/banner.png`,
          width: 1200,
          height: 630,
          alt: `${site.site_name} Banner`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
  };
}

export default function AboutPage() {
  return (
    <>
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
