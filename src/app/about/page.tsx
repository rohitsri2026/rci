import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about-hero";
import MDMessage from "@/components/md-message";
import Mission from "@/components/mission";
import LearningApproach from "@/components/learning-approach";
import WhyRCI from "@/components/why-rci";
import AboutStudentPortal from "@/components/about-student-portal";
import AboutCertTrust from "@/components/about-cert-trust";
import Stats from "@/components/stats";
import { RCIConfig } from "@/lib/config";
import WhatsAppCounsellingBanner from "@/components/whatsapp-counselling-banner";

export const metadata: Metadata = {
  title: `About Us | ${RCIConfig.instituteName}`,
  description: `Learn about Rohit Computer Institute (RCI), our leadership, mission, vision, practical computer training methodology, and student digital ecosystem.`,
  alternates: {
    canonical: `${RCIConfig.siteUrl}/about`,
  },
  openGraph: {
    title: `About Us | ${RCIConfig.instituteName}`,
    description: `Empowering careers through practical computer education, recognized certifications, and digital student portal support.`,
    url: `${RCIConfig.siteUrl}/about`,
    siteName: RCIConfig.instituteName,
    images: [
      {
        url: `${RCIConfig.siteUrl}/banner.png`,
        width: 1200,
        height: 630,
        alt: `${RCIConfig.instituteName} Campus & Training Banner`,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

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
