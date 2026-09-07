"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, GraduationCap } from "lucide-react";
import { RCIConfig } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";

export default function MobileStickyCTA() {
  const [whatsappNum, setWhatsappNum] = useState(RCIConfig.whatsappNumber);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("contact_settings")
      .select("whatsapp")
      .eq("id", "default")
      .single()
      .then(({ data }) => {
        if (data?.whatsapp) {
          setWhatsappNum(data.whatsapp.replace(/\D/g, ""));
        }
      });
  }, []);

  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent("Hello RCI, I want to apply for admission.")}`;

  return (
    <div 
      aria-label="Mobile quick actions"
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/98 backdrop-blur-md border-t border-slate-200 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-2xl"
    >
      <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
        <Link
          href="/admission"
          className="flex items-center justify-center gap-1.5 bg-[#155EEF] active:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-2xs min-h-[44px]"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Apply Now</span>
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 bg-emerald-600 active:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-2xs min-h-[44px]"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp RCI</span>
        </a>
      </div>
    </div>
  );
}
