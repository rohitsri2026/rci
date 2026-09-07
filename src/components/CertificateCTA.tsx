"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Award, ArrowRight, Search, Loader2 } from "lucide-react";

export default function CertificateCTA() {
  const router = useRouter();
  const [certId, setCertId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    setIsSubmitting(true);
    router.push(`/verify/${certId.trim().toUpperCase()}`);
  };

  return (
    <section aria-labelledby="cert-cta-title" className="py-10 sm:py-14 bg-slate-50 border-b border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white border border-blue-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs text-center">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10.5px] sm:text-xs font-black uppercase tracking-wider text-[#155EEF] mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Instant Authenticity Check</span>
          </div>

          <h2 id="cert-cta-title" className="text-2xl sm:text-3xl font-black font-display text-[#07152F] tracking-tight mb-2">
            Verify RCI Student Certificate
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mb-6 font-normal">
            Authenticate official diplomas and certificates issued by Rohit Computer Institute using the certificate serial number.
          </p>

          {/* Compact Inline Search Form */}
          <form onSubmit={handleVerify} className="max-w-lg mx-auto flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Award className="w-4 h-4 text-blue-500" />
              </div>
              <input
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="Certificate No. (e.g. RCI-2026-000001)"
                className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[#07152F] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm font-bold uppercase transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!certId.trim() || isSubmitting}
              className="bg-[#155EEF] hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-2xs disabled:opacity-60 flex items-center justify-center gap-1.5 shrink-0 active:scale-98 min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Verify Now</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </section>
  );
}
