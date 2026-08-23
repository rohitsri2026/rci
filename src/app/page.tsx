import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import WhyRCI from "@/components/WhyRCI";
import CoursesSection from "@/components/CoursesSection";
import AboutMDSection from "@/components/AboutMDSection";
import AdmissionWorkflow from "@/components/AdmissionWorkflow";
import VerifyCertificate from "@/components/VerifyCertificate";
import Testimonials from "@/components/Testimonials";
import StudentPortalCTA from "@/components/StudentPortalCTA";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import MobileStickyCTA from "@/components/MobileStickyCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pb-16 lg:pb-0">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Trust / Statistics */}
        <StatsSection />

        {/* 3. Why Choose RCI */}
        <WhyRCI />

        {/* 4. Featured & All Courses */}
        <CoursesSection />

        {/* 5. About RCI + MD Message */}
        <AboutMDSection />

        {/* 6. How Admission Works */}
        <AdmissionWorkflow />

        {/* 7. Certificate Verification */}
        <VerifyCertificate />

        {/* 8. Student Success Stories */}
        <Testimonials />

        {/* 9. Student Portal CTA */}
        <StudentPortalCTA />

        {/* 10. FAQ */}
        <FAQ />

        {/* 11. Final CTA */}
        <CTA />
      </main>
      
      <Footer />

      {/* Persistent Quick Action Floaters */}
      <FloatingWhatsApp />
      <MobileStickyCTA />
    </>
  );
}
