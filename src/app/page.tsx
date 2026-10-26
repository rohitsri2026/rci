import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import BenefitsStrip from "@/components/BenefitsStrip";
import PopularCourses from "@/components/PopularCourses";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import WhyRCI from "@/components/WhyRCI";
import Testimonials from "@/components/Testimonials";
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
        {/* Hero Slider with Swiper, Explore Courses, Student Login & Verify Certificate */}
        <HeroSlider />

        {/* Key Benefits and Trust Highlights */}
        <BenefitsStrip />

        {/* Popular Courses with Swiper touch carousel & View All */}
        <PopularCourses />

        {/* Institute Statistics */}
        <StatsSection />

        {/* About RCI */}
        <AboutSection />

        {/* Why Choose RCI */}
        <WhyRCI />

        {/* Student Testimonials with Swiper Carousel & Star Ratings */}
        <Testimonials />

        {/* Director Profile & Message */}
        <DirectorMessage />

        {/* Latest Notices */}
        <LatestNoticesSection />

        {/* Certificate Verification CTA */}
        <CertificateCTA />

        {/* Student Portal CTA */}
        <StudentPortalCTA />

        {/* Final Admission CTA */}
        <CTA />
      </main>

      {/* Footer with Font Awesome brands & Bootstrap icons */}
      <Footer />

      {/* Persistent WhatsApp & Mobile Action Floaters */}
      <FloatingWhatsApp />
      <MobileStickyCTA />
    </>
  );
}
