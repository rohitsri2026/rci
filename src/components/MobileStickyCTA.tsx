"use client";

import Link from "next/link";
import { MessageCircle, GraduationCap } from "lucide-react";
import { RCIConfig } from "@/lib/config";

export default function MobileStickyCTA() {
  const whatsappUrl = RCIConfig.getWhatsAppUrl("Hello RCI, I want to apply for admission.");

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 shadow-2xl">
      <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
        <Link
          href="/admission"
          className="flex items-center justify-center gap-1.5 bg-blue-600 active:bg-blue-700 text-white py-3 rounded-xl text-xs font-extrabold shadow-sm"
        >
          <GraduationCap className="w-4 h-4" />
          Apply Now
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 bg-emerald-600 active:bg-emerald-700 text-white py-3 rounded-xl text-xs font-extrabold shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp RCI
        </a>
      </div>
    </div>
  );
}
