"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { RCIConfig } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";

export default function VerifyForm() {
  const router = useRouter();
  const [certId, setCertId] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = certId.trim().toUpperCase();
    if (!cleanId || loading) return;

    setLoading(true);
    router.push(`/verify/${cleanId}`);
  };

  const fillSample = (sample: string) => {
    setCertId(sample);
  };

  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent("Hello RCI, I am having trouble verifying my certificate online. Please assist me.")}`;

  return (
    <main className="min-h-screen bg-slate-50/70 pt-6 sm:pt-20 pb-20 relative overflow-hidden">
      {/* Clean Technical Blueprint Geometry (Zero Blur, Crisp Architectural Lines) */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[680px] h-[680px] pointer-events-none opacity-[0.05] select-none text-slate-800">
        <svg viewBox="0 0 680 680" className="w-full h-full animate-[spin_90s_linear_infinite]">
          <circle cx="340" cy="340" r="310" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
          <circle cx="340" cy="340" r="230" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="340" cy="340" r="150" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="340" y1="0" x2="340" y2="680" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="0" y1="340" x2="680" y2="340" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
        </svg>
      </div>

      {/* Subtle Micro-Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.25] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">

        {/* 1. Header Hero with Badges & Typography */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-blue-200/80 shadow-xs text-xs font-black uppercase tracking-wider text-[#155EEF] mb-3.5 animate__animated animate__fadeInDown">
            <span className="w-5 h-5 rounded-md bg-blue-50 text-[#155EEF] flex items-center justify-center">
              <i className="bi bi-shield-check text-xs text-[#D4A72C] animate__animated animate__pulse animate__infinite" />
            </span>
            <span>Central Certificate Verification System</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black font-display tracking-tight text-[#07152F] mb-3 leading-[1.15] animate__animated animate__fadeInUp">
            Verify Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#155EEF] via-sky-500 to-[#D4A72C]">
              RCI Certificate
            </span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-normal animate__animated animate__fadeInUp animate__delay-1s">
            Enter the certificate number printed on your official RCI credentials to verify its authenticity, course completion details, and central registry record.
          </p>
        </div>

        {/* 2. Premium Security Verification Card */}
        <div className="max-w-2xl mx-auto mb-12 animate__animated animate__fadeInUp">
          <div className="relative group">
            {/* Dynamic Floating Badges (Clean, Crisp Accents without blurry color stains) */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-blue-200/90 shadow-md text-xs font-black text-[#155EEF] absolute -top-3.5 -right-2 z-20 animate-gentle-float pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Database Verification</span>
            </div>

            {/* Main Card Surface with Crisp High Contrast */}
            <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:border-blue-300 p-6 sm:p-10 overflow-hidden transition-all duration-300">
              
              {/* Dynamic Gradient Top Border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#155EEF] via-sky-400 to-[#D4A72C]" />

              {/* Card Header with Live Registry Status */}
              <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/90 border border-blue-100 text-[#155EEF] text-xs font-bold uppercase tracking-wider">
                  <i className="bi bi-patch-check-fill text-[#D4A72C] text-xs" />
                  <span>Official RCI Verification Portal</span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Central Registry Active</span>
                </div>
              </div>

              {/* Verification Form */}
              <form onSubmit={handleVerify} className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="certId" className="block text-xs sm:text-sm font-extrabold text-[#07152F]">
                      Certificate Number <span className="text-rose-500">*</span>
                    </label>

                    {/* Quick Demo Fill Helper */}
                    <button
                      type="button"
                      onClick={() => fillSample("RCI-2026-000001")}
                      className="text-[11px] font-bold text-[#155EEF] hover:text-blue-800 transition-colors cursor-pointer hover:underline"
                    >
                      Use Sample: RCI-2026-000001
                    </button>
                  </div>

                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-[#155EEF] transition-colors">
                      <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#155EEF] flex items-center justify-center text-xs shadow-2xs">
                        <i className="fa-solid fa-file-contract" />
                      </span>
                    </div>

                    <input
                      id="certId"
                      type="text"
                      value={certId}
                      onChange={(e) => setCertId(e.target.value.toUpperCase())}
                      placeholder="e.g. RCI-2026-000001 or RCI2026000001"
                      aria-required="true"
                      autoComplete="off"
                      spellCheck={false}
                      className="w-full h-14 pl-13 pr-10 border-2 border-slate-200/90 rounded-2xl text-[#07152F] placeholder-slate-400 font-mono font-bold text-sm sm:text-base bg-slate-50/50 focus:bg-white focus:border-[#155EEF] focus:ring-4 focus:ring-blue-500/15 transition-all shadow-inner uppercase tracking-wider"
                      required
                    />

                    {certId && (
                      <button
                        type="button"
                        onClick={() => setCertId("")}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        title="Clear input"
                      >
                        <i className="bi bi-x-circle-fill text-sm" />
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                    <i className="bi bi-info-circle text-blue-600" />
                    <span>Case-insensitive. Certificate ID is printed at the top-right of your diploma.</span>
                  </p>
                </div>

                {/* Submit Button with Shimmer Sweep */}
                <button
                  type="submit"
                  disabled={!certId.trim() || loading}
                  className="relative overflow-hidden w-full h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-[#155EEF] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:from-blue-700 active:to-indigo-800 text-white rounded-2xl font-black text-base transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed group/btn cursor-pointer"
                >
                  {/* Reflection sweep */}
                  <span className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-12 -translate-x-full group-hover/btn:translate-x-[350%] transition-transform duration-700 pointer-events-none" />

                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Verifying Central Record...</span>
                    </div>
                  ) : (
                    <>
                      <i className="fa-solid fa-magnifying-glass-chart text-base" />
                      <span>Verify Certificate Record</span>
                      <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover/btn:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* QR Scanner Direct Scan Section */}
              <div className="relative my-7 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200/80" />
                </div>
                <span className="relative bg-white px-3.5 text-xs font-black uppercase tracking-widest text-slate-400">
                  OR USE DIRECT QR SCAN
                </span>
              </div>

              <div className="bg-gradient-to-r from-slate-50 via-purple-50/40 to-slate-50 border border-purple-200/80 hover:border-purple-300 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-all duration-300 group/qr shadow-2xs hover:shadow-xs">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200 shadow-2xs group-hover/qr:scale-105 transition-transform">
                    <i className="fa-solid fa-qrcode text-lg" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#07152F] flex items-center gap-1.5">
                      <span>QR Code Direct Verification</span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                        Instant
                      </span>
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-snug mt-0.5 line-clamp-2">
                      Scan the tamper-proof QR code printed on your physical RCI diploma with any mobile camera.
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex shrink-0">
                  <span className="text-xs font-bold text-purple-700 bg-purple-100/80 px-3 py-1.5 rounded-xl border border-purple-200/60 flex items-center gap-1.5">
                    <i className="bi bi-camera-fill text-xs" />
                    <span>Camera Ready</span>
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 3. Security Highlights Strip with Vibrant Badges */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-sm">
            <div className="grid sm:grid-cols-3 gap-5 text-left">

              <div className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#155EEF] flex items-center justify-center shrink-0 shadow-2xs border border-blue-100 group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                  <i className="fa-solid fa-database text-xs" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#07152F] group-hover:text-[#155EEF] transition-colors">
                    Official Central Record
                  </h4>
                  <p className="text-[11.5px] text-slate-500 mt-0.5 leading-snug font-normal">
                    Verified directly against RCI's official student database.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <i className="fa-solid fa-qrcode text-xs" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#07152F] group-hover:text-amber-600 transition-colors">
                    Encrypted QR Signature
                  </h4>
                  <p className="text-[11.5px] text-slate-500 mt-0.5 leading-snug font-normal">
                    Certificates feature scannable QR verification with unique cryptographic hash.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <i className="bi bi-shield-check text-sm" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#07152F] group-hover:text-emerald-700 transition-colors">
                    Employer Authentication
                  </h4>
                  <p className="text-[11.5px] text-slate-500 mt-0.5 leading-snug font-normal">
                    Employers and government recruiters can check validity 24/7 online.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 4. How Certificate Verification Works (3 Steps) with Micro-Animations */}
        <div className="border-t border-slate-200/90 pt-12 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#155EEF] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
              <i className="bi bi-stars text-amber-500" />
              <span>Simple 3-Step Process</span>
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-[#07152F] mt-2.5 tracking-tight">
              How Certificate Verification Works
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-normal">
              Validate student credentials in seconds with our transparent verification workflow.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {[
              {
                number: "01",
                title: "Enter Certificate ID",
                desc: "Type the unique certificate number printed on the certificate diploma.",
                icon: "fa-solid fa-keyboard",
                color: "text-blue-600 bg-blue-50 border-blue-200",
              },
              {
                number: "02",
                title: "Cryptographic Match",
                desc: "RCI checks the credential record against our central encrypted database.",
                icon: "fa-solid fa-microchip",
                color: "text-indigo-600 bg-indigo-50 border-indigo-200",
              },
              {
                number: "03",
                title: "View Official Record",
                desc: "Inspect student grade, course duration, issue date, and authentic status.",
                icon: "bi bi-award-fill",
                color: "text-amber-600 bg-amber-50 border-amber-200",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase text-[#155EEF] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                      Step {step.number}
                    </span>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${step.color} shadow-2xs group-hover:scale-110 transition-transform`}>
                      <i className={`${step.icon} text-xs`} />
                    </div>
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-[#07152F] mb-1.5 group-hover:text-[#155EEF] transition-colors leading-snug">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span>Standard Procedure</span>
                  <i className="fa-solid fa-arrow-right text-[9px] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Support Section */}
        <div className="bg-gradient-to-br from-[#07152F] via-slate-900 to-[#0A2558] text-white rounded-3xl p-6 sm:p-9 shadow-xl border border-blue-900/40 relative overflow-hidden max-w-3xl mx-auto">
          {/* Ambient Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                <i className="bi bi-question-circle-fill text-xs" />
                <span>Verification Support</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white leading-snug">
                Having trouble verifying your certificate?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                Make sure you have entered the certificate number exactly as printed on your diploma, or chat directly with our helpdesk team.
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3.5 min-h-[48px] rounded-xl font-black text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/25 hover:scale-[1.03] active:scale-98 w-full md:w-auto cursor-pointer"
              >
                <i className="fa-brands fa-whatsapp text-lg text-slate-950" />
                <span>WhatsApp RCI Support</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
