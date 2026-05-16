import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CertificateCard from "@/components/CertificateCard";
import type { Metadata } from "next";

type Props = { params: Promise<{ certificateId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { certificateId } = await params;
  return {
    title: `Verify Certificate ${certificateId} | RCI`,
    description: `Verify the authenticity of Rohit Computer Institute certificate ${certificateId}`,
  };
}

export default async function VerifyCertificateIdPage({ params }: Props) {
  const { certificateId } = await params;
  const supabase = await createClient();

  const { data: cert } = await supabase
    .from("certificates")
    .select("*")
    .eq("certificate_id", certificateId.toUpperCase())
    .single();

  if (!cert) notFound();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-2xl">
          <CertificateCard cert={cert} />
        </div>
      </main>
      <Footer />
    </>
  );
}
