"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, HelpCircle } from "lucide-react";
import { RCIConfig } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";

export interface WhatsAppCounsellingBannerProps {
  badge?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  customMessage?: string;
  className?: string;
  maxWidthClass?: string;
  variant?: "auto" | "horizontal" | "compact";
}

export default function WhatsAppCounsellingBanner({
  badge = "Admission Counseling",
  title = "Need help choosing a course?",
  description = "Talk directly with an RCI admissions counselor about courses, fees and batch timings.",
  buttonText = "Chat with RCI on WhatsApp",
  customMessage = "Hello RCI, I would like to get guidance regarding course selection, fees, and batch timings.",
  className = "",
  maxWidthClass = "max-w-4xl",
  variant = "auto",
}: WhatsAppCounsellingBannerProps) {
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

  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(customMessage)}`;
  const isCompact = variant === "compact";

  return (
    <div
      className={`bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden ${maxWidthClass} mx-auto ${className}`}
    >
      {/* Ambient Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div
        className={`relative z-10 flex ${
          isCompact
            ? "flex-col items-start gap-5 text-left"
            : "flex-col md:flex-row items-center justify-between gap-6 text-center sm:text-left"
        }`}
      >
        {/* Content Box */}
        <div className={`space-y-2 ${isCompact ? "w-full" : "max-w-xl min-w-0"}`}>
          {badge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
              <HelpCircle className="w-3.5 h-3.5" />
              {badge}
            </span>
          )}
          <h3
            className={`${
              isCompact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
            } font-black font-display tracking-tight text-white leading-snug`}
          >
            {title}
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* CTA Button Box */}
        <div className={isCompact ? "w-full" : "shrink-0 w-full md:w-auto"}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 min-h-[48px] rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/25 active:scale-98 ${
              isCompact ? "w-full" : "w-full md:w-auto"
            }`}
          >
            <MessageCircle className="w-4.5 h-4.5 fill-slate-950 stroke-none shrink-0" />
            <span className="truncate">{buttonText}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
