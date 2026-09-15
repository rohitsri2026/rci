"use client";

import Link from "next/link";
import { ShieldCheck, Award, ArrowRight } from "lucide-react";

export default function CertificateCTA() {
  return (
    <section aria-labelledby="cert-cta-title" className="py-8 sm:py-12 bg-slate-50 border-b border-slate-200/80">
      <div className="container mx-auto px-3.5 sm:px-6 lg:px-8 max-w-3xl">
        <div className="bg-white border border-blue-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xs text-center">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10.5px] sm:text-xs font-black uppercase tracking-wider text-[#155EEF] mb-2.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Instant Authenticity Check</span>
          </div>

          <h2 id="cert-cta-title" className="text-xl sm:text-2xl md:text-3xl font-black font-display text-[#07152F] tracking-tight mb-1.5">
            Have an RCI Certificate?
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-5 font-normal">
            Verify your certificate instantly using our central QR-coded credential verification portal.
          </p>

          <Link
            href="/verify"
            className="inline-flex items-center justify-center gap-2 bg-[#155EEF] hover:bg-blue-700 active:bg-blue-800 text-white px-7 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98 min-h-[44px]"
          >
            <Award className="w-4 h-4 text-[#D4A72C]" />
            <span>Verify Certificate</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

        </div>
      </div>
    </section>
  );
}
