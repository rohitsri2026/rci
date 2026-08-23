import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VerifyForm from "@/components/VerifyForm";
import { RCIConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `Verify Certificate | ${RCIConfig.instituteName}`,
  description: `Verify ${RCIConfig.instituteName} certificates online using the unique certificate number or QR code.`,
  alternates: {
    canonical: `${RCIConfig.siteUrl}/verify`,
  },
  openGraph: {
    title: `Verify Certificate | ${RCIConfig.instituteName}`,
    description: `Official online certificate verification portal for ${RCIConfig.instituteName}.`,
    url: `${RCIConfig.siteUrl}/verify`,
    siteName: RCIConfig.instituteName,
    type: "website",
  },
};

export default function VerifyPage() {
  return (
    <>
      <Header />
      <VerifyForm />
      <Footer />
    </>
  );
}
