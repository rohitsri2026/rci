"use client";

import React from "react";
import { MessageCircle, HelpCircle } from "lucide-react";
import { RCIConfig } from "@/lib/config";

export interface WhatsAppCounsellingBannerProps {
  badge?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  customMessage?: string;
  className?: string;
  maxWidthClass?: string;
}

export default function WhatsAppCounsellingBanner({
  badge = "Admission Counseling",
  title = "Need help choosing a course?",
  description = "Talk directly with an RCI admissions counselor about courses, fees and batch timings.",
  buttonText = "Chat with RCI on WhatsApp",
  customMessage = "Hello RCI, I would like to get guidance regarding course selection, fees, and batch timings.",
  className = "",
  maxWidthClass = "max-w-4xl",
}: WhatsAppCounsellingBannerProps) {
  const whatsappUrl = RCIConfig.getWhatsAppUrl(customMessage);

  return (
    <div
      className={`bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-7 sm:p-9 shadow-xl border border-emerald-800/40 relative overflow-hidden ${maxWidthClass} mx-auto ${className}`}
    >
      {/* Ambient Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-2 max-w-xl">
          {badge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
              <HelpCircle className="w-3.5 h-3.5" />
              {badge}
            </span>
          )}
          <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
            {title}
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {description}
          </p>
        </div>

        <div className="shrink-0 w-full sm:w-auto">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/25 active:scale-98"
          >
            <MessageCircle className="w-4.5 h-4.5 fill-slate-950 stroke-none" />
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  );
}
