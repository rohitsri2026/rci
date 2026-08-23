import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CertificateCard from "@/components/CertificateCard";
import type { Metadata } from "next";
import React from "react";
import { RCIConfig } from "@/lib/config";

type Props = { params: Promise<{ certificateId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { certificateId } = await params;
  const cleanId = certificateId.toUpperCase();
  return {
    title: `Verify Certificate ${cleanId} | ${RCIConfig.instituteName}`,
    description: `Verify the authenticity of Rohit Computer Institute certificate ${cleanId}`,
    alternates: {
      canonical: `${RCIConfig.siteUrl}/verify/${cleanId}`,
    },
    openGraph: {
      title: `Verify Certificate ${cleanId} | ${RCIConfig.instituteName}`,
      description: `Official online certificate verification record for ${cleanId}.`,
      url: `${RCIConfig.siteUrl}/verify/${cleanId}`,
      siteName: RCIConfig.instituteName,
      type: "website",
    },
  };
}

export default async function VerifyCertificateIdPage({ params }: Props) {
  const { certificateId } = await params;
  const cleanId = certificateId.toUpperCase();
  const supabase = await createClient();

  // Query by certificate_number, joining students and courses.
  const { data: cert } = await supabase
    .from("certificates")
    .select(`
      *,
      students:student_id (
        id,
        full_name,
        email,
        phone,
        address
      ),
      courses:course_id (
        id,
        course_name,
        duration,
        fees
      )
    `)
    .eq("certificate_number", cleanId)
    .maybeSingle();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-28 sm:pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <CertificateCard cert={cert} searchId={cleanId} />
        </div>
      </main>
      <Footer />
    </>
  );
}
