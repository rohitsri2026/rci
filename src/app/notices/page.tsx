import React from "react";
import Metadata from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NoticesPublicClient from "@/components/NoticesPublicClient";
import { getActiveAnnouncements, getSiteSettings } from "@/lib/cms";

export async function generateMetadata() {
  const site = await getSiteSettings();
  return {
    title: `Notices & Updates | ${site.site_name}`,
    description: `Official notices, exam schedules, fee alerts, and admission announcements for Rohit Computer Institute (RCI).`,
  };
}

export default async function PublicNoticesPage() {
  const notices = await getActiveAnnouncements();

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <NoticesPublicClient initialNotices={notices} />
        </div>
      </main>
      <Footer />
    </>
  );
}
