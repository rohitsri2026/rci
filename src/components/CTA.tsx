"use client";

import { useState, useEffect } from "react";
import { ArrowRight, BookOpen, MessageCircle, PhoneCall, Sparkles } from "lucide-react";
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
  const cleanPhone = contactSettings.phone ? contactSettings.phone.replace(/\s+/g, "") : "";
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    "Hello RCI, I am interested in joining a computer course. Please share admission details."
  )}`;

  return (
    <section aria-label="Admission Call to Action" className="py-12 sm:py-18 bg-white border-b border-slate-200/80 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
        
        {/* Institutional Quality Seal Badge */}
        <div className="mb-4 inline-flex items-center justify-center bg-slate-50 p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
          <Image
            src="/badge.png"
            alt="RCI MSME & ISO Certified Badge"
            width={72}
            height={72}
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
          />
        </div>

        <div className="max-w-2xl mx-auto mb-6">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-xs font-black uppercase tracking-widest text-[#155EEF] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3 h-3 text-[#D4A72C]" />
            New Batches Now Enrolling
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-[#07152F] tracking-tight leading-tight mb-2.5">
            Ready to Launch Your IT Career?
          </h2>
          
          <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
            Join Rohit Computer Institute today. Gain hands-on computer competence, personal instructor mentorship, and government-recognized diplomas.
          </p>
        </div>

        {/* High-Conversion Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-lg mx-auto">
          <Link
            href="/admission"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#155EEF] hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/25 active:scale-98 min-h-[44px]"
          >
            <span>Apply for Admission</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/courses"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#07152F] px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-98 min-h-[44px]"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span>Explore Courses</span>
          </Link>

          {cleanWhatsapp && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-2xs active:scale-98 min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>

      </div>
    </section>
  );
}
