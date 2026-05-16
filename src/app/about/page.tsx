import AboutHero from "@/components/about-hero";
import MDMessage from "@/components/md-message";
import Mission from "@/components/mission";
import Stats from "@/components/stats";
import WhyRCI from "@/components/why-rci";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50 pt-24 overflow-hidden">
        <AboutHero />
        <MDMessage />
        <Mission />
        <Stats />
        <WhyRCI />
      </main>
      <Footer />
    </>
  );
}
