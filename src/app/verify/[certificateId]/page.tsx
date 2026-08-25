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
      <main className="min-h-screen bg-[#f8fafc] pt-28 sm:pt-32 pb-24 relative overflow-hidden">
        {/* Subtle Decorative RCI-Style Background Elements */}
        <div className="absolute top-20 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none stroke-slate-900" viewBox="0 0 1000 1000" fill="none">
          <path d="M-100 200 C 300 100, 700 300, 1100 150" strokeWidth="2" strokeDasharray="8 8" />
          <path d="M-100 700 C 400 800, 600 500, 1100 850" strokeWidth="2" strokeDasharray="12 12" />
        </svg>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
          <CertificateCard cert={cert} searchId={cleanId} />
        </div>
      </main>
      <Footer />
    </>
  );
}
