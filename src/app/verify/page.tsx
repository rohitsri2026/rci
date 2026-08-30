import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VerifyForm from "@/components/VerifyForm";
import { getSeoSettings, getSiteSettings } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const site = await getSiteSettings();

  const title = `Verify Certificate | ${site.site_name}`;
  const description = `Verify ${site.site_name} certificates online using the unique certificate number or QR code.`;
  const siteUrl = seo.canonical_url || "https://rciknp.vercel.app";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/verify`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/verify`,
      siteName: site.site_name,
      type: "website",
    },
  };
}

export default function VerifyPage() {
  return (
    <>
      <Header />
      <VerifyForm />
      <Footer />
    </>
  );
}
