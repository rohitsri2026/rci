import { createClient } from "@/lib/supabase/server";
import { createAdminClient, hasAdminKey } from "@/lib/supabase/admin";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CertificateCard from "@/components/CertificateCard";
import type { Metadata } from "next";
import React from "react";
import { getSeoSettings, getSiteSettings } from "@/lib/cms";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ certificateId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { certificateId } = await params;
  const cleanId = certificateId.toUpperCase();
  const site = await getSiteSettings();
  const seo = await getSeoSettings();
  const siteUrl = seo.canonical_url || "https://rciknp.vercel.app";

  return {
    title: `Verify Certificate ${cleanId} | ${site.site_name}`,
    description: `Verify the authenticity of ${site.site_name} certificate ${cleanId}`,
    alternates: {
      canonical: `${siteUrl}/verify/${cleanId}`,
    },
    openGraph: {
      title: `Verify Certificate ${cleanId} | ${site.site_name}`,
      description: `Official online certificate verification record for ${cleanId}.`,
      url: `${siteUrl}/verify/${cleanId}`,
      siteName: site.site_name,
      type: "website",
    },
  };
}

export default async function VerifyCertificateIdPage({ params }: Props) {
  const { certificateId } = await params;
  const cleanId = certificateId.toUpperCase();
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cert: any = null;

  // 1. Primary: Use secure SECURITY DEFINER RPC function (get_public_certificate_verification)
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "get_public_certificate_verification",
    { p_certificate_id: cleanId }
  );

  if (!rpcError && Array.isArray(rpcData) && rpcData.length > 0) {
    cert = rpcData[0];
  } else {
    // 2. Fallback: If RPC is not available in DB, use server client with explicit safe field selection
    const client = hasAdminKey() ? createAdminClient() : supabase;
    const { data: directCert } = await client
      .from("certificates")
      .select(`
        *,
        students:student_id (
          id,
          full_name,
          photo_url
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

    if (directCert) {
      cert = directCert;
    }
  }

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

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1100px] relative z-10">
          <CertificateCard cert={cert} searchId={cleanId} />
        </div>
      </main>
      <Footer />
    </>
  );
}

