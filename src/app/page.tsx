import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import BenefitsStrip from "@/components/BenefitsStrip";
import PopularCourses from "@/components/PopularCourses";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import WhyRCI from "@/components/WhyRCI";
import DirectorMessage from "@/components/DirectorMessage";
import LatestNoticesSection from "@/components/LatestNoticesSection";
import CertificateCTA from "@/components/CertificateCTA";
import StudentPortalCTA from "@/components/StudentPortalCTA";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import MobileStickyCTA from "@/components/MobileStickyCTA";

export default function Home() {
  return (
    <>
      {/* 1. Top Contact Bar, 2. Mobile/Desktop Header, 3. Announcement */}
      <Header />

      <main className="pb-16 sm:pb-0 overflow-x-hidden">
        {/* Large Hero Slider */}
        <HeroSlider />

        {/* 6. Trust Highlights */}
        <BenefitsStrip />

        {/* 7. Popular Courses (3 courses with mobile swipe carousel & View All) */}
        <PopularCourses />

        {/* 8. Stats (Compact 2x2 grid on mobile) */}
        <StatsSection />

        {/* 9. About RCI (Compact with image-first mobile layout & Learn More) */}
        <AboutSection />

        {/* 10. Why Choose RCI (Compact 2-column on mobile) */}
        <WhyRCI />

        {/* 11. Director Profile (Compact with link to full message on About page) */}
        <DirectorMessage />

        {/* 12. Latest Notices (Max 3 notices with priority badges) */}
        <LatestNoticesSection />

        {/* 13. Certificate CTA (Compact, high-conversion verification) */}
        <CertificateCTA />

        {/* 14. Student Portal CTA (Dedicated clearly visible portal CTA) */}
        <StudentPortalCTA />

        {/* 15. Final Admission CTA (Strengthened Apply Now) */}
        <CTA />
      </main>

      {/* 16. Footer (Simplified mobile footer with clean accordions) */}
      <Footer />

      {/* Persistent WhatsApp & Mobile Action Floaters */}
      <FloatingWhatsApp />
      <MobileStickyCTA />
    </>
  );
}
