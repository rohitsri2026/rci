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
    <section aria-label="Admission Call to Action" className="py-10 sm:py-14 bg-white border-b border-slate-200/80 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        
        {/* Institutional Quality Seal Badge */}
        <div className="mb-3 inline-flex items-center justify-center bg-slate-50 p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
          <Image
            src="/badge.png"
            alt="RCI MSME & ISO Certified Badge"
            width={64}
            height={64}
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
          />
        </div>

        <div className="max-w-xl mx-auto mb-5">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-xs font-black uppercase tracking-widest text-[#155EEF] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3 h-3 text-[#D4A72C]" />
            New Batches Now Enrolling
          </span>

          <h2 className="text-2xl sm:text-3xl font-black font-display text-[#07152F] tracking-tight leading-tight mb-2">
            Ready to Build Your Digital Career?
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Join RCI and start learning practical IT skills with certified instructors and government-recognized diplomas.
          </p>
        </div>

        {/* Focused Dual Actions: Apply Now & WhatsApp Us */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-sm mx-auto">
          <Link
            href="/admission"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#155EEF] hover:bg-blue-700 active:bg-blue-800 text-white px-7 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/25 active:scale-98 min-h-[44px] flex-1"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {cleanWhatsapp && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-2xs active:scale-98 min-h-[44px] flex-1"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          )}
        </div>

      </div>
    </section>
  );
}
