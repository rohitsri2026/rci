"use client";

import { useState, useEffect } from "react";
import { ArrowRight, BookOpen, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_CONTACT_SETTINGS } from "@/lib/cms-defaults";

export default function CTA() {
  const [contactSettings, setContactSettings] = useState(DEFAULT_CONTACT_SETTINGS);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("contact_settings")
      .select("*")
      .eq("id", "default")
      .single()
      .then(({ data }) => {
        if (data) setContactSettings((prev) => ({ ...prev, ...data }));
      });
  }, []);

  const cleanWhatsapp = contactSettings.whatsapp ? contactSettings.whatsapp.replace(/\D/g, "") : "";
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    "Hello RCI, I am interested in joining a computer course. Please share admission details."
  )}`;

  return (
    <section aria-label="Call to Action" className="py-16 sm:py-20 relative overflow-hidden bg-[#07152F] text-white">
      {/* Gradient Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#07152F] via-[#0e2a5e] to-[#155EEF] opacity-90" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#D4A72C]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          
          {/* MSME & ISO Quality Badge */}
          <div className="mb-6 bg-white p-2.5 rounded-full shadow-2xl">
            <Image
              src="/badge.png"
              alt="RCI MSME & ISO Certified Badge"
              width={100}
              height={100}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-display text-white mb-4 leading-tight tracking-tight">
            Ready to Build Your Digital Future?
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg text-blue-100 mb-9 max-w-2xl mx-auto leading-relaxed font-normal">
            Start learning practical computer skills with Rohit Computer Institute. Join hundreds of students launching digital careers with verified certificates.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md sm:max-w-none">
            <Link
              href="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#07152F] hover:bg-slate-100 px-8 py-4 rounded-xl font-extrabold text-sm sm:text-base transition-all shadow-lg active:scale-98"
            >
              <BookOpen className="w-4 h-4 text-[#155EEF]" />
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/admission"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#155EEF] hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-extrabold text-sm sm:text-base transition-all shadow-lg shadow-blue-600/30 active:scale-98"
            >
              <span>Apply for Admission</span>
            </Link>

            {cleanWhatsapp && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-4 rounded-xl font-bold text-sm sm:text-base transition-all shadow-md active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Inquiry</span>
              </a>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
