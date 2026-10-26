"use client";

import Link from "next/link";

export default function CertificateCTA() {
  return (
    <section aria-labelledby="cert-cta-title" className="py-8 sm:py-14 bg-slate-50 border-b border-slate-200/80">
      <div className="container mx-auto px-3.5 sm:px-6 lg:px-8 max-w-3xl">
        <div className="bg-white border border-blue-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-9 shadow-sm hover:shadow-md transition-shadow text-center">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10.5px] sm:text-xs font-black uppercase tracking-wider text-[#155EEF] mb-3">
            <i className="fa-solid fa-shield-halved text-[#155EEF] text-xs" />
            <span>Instant Authenticity Check</span>
          </div>

          <h2 id="cert-cta-title" className="text-xl sm:text-2xl md:text-3xl font-black font-display text-[#07152F] tracking-tight mb-2">
            Have an RCI Certificate?
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6 font-normal leading-relaxed">
            Verify your diploma or course credential instantly using our central QR-coded government-grade verification portal.
          </p>

          <Link
            href="/verify"
            className="inline-flex items-center justify-center gap-2.5 bg-[#155EEF] hover:bg-blue-700 active:bg-blue-800 text-white px-7 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 hover:scale-[1.02] active:scale-98 min-h-[44px]"
          >
            <i className="bi bi-patch-check-fill text-[#D4A72C] text-sm" />
            <span>Verify Certificate</span>
            <i className="fa-solid fa-arrow-right text-xs" />
          </Link>

        </div>
      </div>
    </section>
  );
}
