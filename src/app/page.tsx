import Header from "@/components/Header";
import QuickActions from "@/components/QuickActions";
import HeroSlider from "@/components/HeroSlider";
import LatestNoticesSection from "@/components/LatestNoticesSection";
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
      {/* 1. Top Contact / Information Strip & 2. Main Navigation Bar */}
      <Header />

      <main className="pb-16 lg:pb-0 overflow-x-hidden">
        {/* 3. Quick Action Button Row (Immediately below nav, above hero) */}
        <QuickActions />

        {/* 4. Large Hero Slider */}
        <HeroSlider />

        {/* 5. Remaining Existing Homepage Sections */}
        {/* Official Latest Notices */}
        <LatestNoticesSection />

        {/* Statistics / Trust Metrics */}
        <StatsSection />

        {/* Why Choose RCI */}
        <WhyRCI />

        {/* Featured & All Courses */}
        <CoursesSection />

        {/* About RCI + MD Message */}
        <AboutMDSection />

        {/* How Admission Works */}
        <AdmissionWorkflow />

        {/* Certificate Verification Section */}
        <VerifyCertificate />

        {/* Student Success Stories */}
        <Testimonials />

        {/* Student Digital Portal CTA */}
        <StudentPortalCTA />

        {/* Frequently Asked Questions */}
        <FAQ />

        {/* Final Bottom Call to Action */}
        <CTA />
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* Persistent Quick Action Floaters */}
      <FloatingWhatsApp />
      <MobileStickyCTA />
    </>
  );
}
