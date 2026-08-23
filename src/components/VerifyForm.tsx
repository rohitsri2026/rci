"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, Award, ShieldCheck, QrCode, ArrowRight, Sparkles, 
  HelpCircle, MessageCircle, Phone, CheckCircle2, Loader2, FileText
} from "lucide-react";
import Link from "next/link";
import { RCIConfig } from "@/lib/config";

export default function VerifyForm() {
  const router = useRouter();
  const [certId, setCertId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = certId.trim().toUpperCase();
    if (!cleanId || loading) return;

    setLoading(true);
    router.push(`/verify/${cleanId}`);
  };

  const whatsappUrl = RCIConfig.getWhatsAppUrl(
    "Hello RCI, I am having trouble verifying my certificate online. Please assist me."
  );

  return (
    <main className="min-h-screen bg-slate-50 pt-28 sm:pt-32 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* 1. Verification Hero */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3.5">
            <Award className="w-4 h-4 text-blue-600" />
            Certificate Verification System
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-slate-900 mb-3.5 leading-tight tracking-tight">
            Verify Your RCI Certificate
          </h1>
          
          <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Enter the certificate number printed on your RCI certificate to verify its validity and view the official record.
          </p>
        </div>

        {/* 2. Premium Verification Card Container */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative group">
            {/* Ambient Card Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-blue-500/15 rounded-[2rem] blur-xl opacity-75 transition-all duration-500 group-hover:opacity-100 pointer-events-none" />

            {/* Premium Card Surface */}
            <div className="relative bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-950/5 p-6 sm:p-9 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

              {/* Card Header */}
              <div className="border-b border-slate-100 pb-5 mb-6 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Official RCI Verification Portal
                </div>
                <h2 className="text-2xl font-black font-display text-slate-900 tracking-tight">
                  Certificate Verification
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  Enter the certificate number printed on your certificate.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleVerify} className="space-y-5">
                <div>
                  <label htmlFor="certId" className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
                    Certificate Number <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <input
                      id="certId"
                      type="text"
                      value={certId}
                      onChange={(e) => setCertId(e.target.value)}
                      placeholder="Enter Certificate ID (e.g. RCI-2026-000001)"
                      aria-required="true"
                      className="w-full h-12 pl-11 pr-4 border border-slate-200/90 rounded-xl text-slate-900 placeholder-slate-400 font-mono font-semibold text-sm sm:text-base bg-slate-50/40 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={!certId.trim() || loading}
                  className="w-full h-13 flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-base transition-all shadow-md shadow-blue-500/25 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying Certificate...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Verify Certificate
                    </>
                  )}
                </button>
              </form>

              {/* QR Verification Sub-section */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <span className="relative bg-white px-3 text-xs font-black uppercase tracking-widest text-slate-400">
                  OR
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200/60">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">QR Code Direct Scan</h4>
                  <p className="text-[11.5px] text-slate-500 leading-snug">
                    Scan the QR code printed on your RCI certificate for direct instant verification.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 3. Compact Trust Strip */}
        <div className="max-w-4xl mx-auto mb-14">
          <div className="bg-white/90 border border-slate-200/90 rounded-2xl p-4 sm:px-6 shadow-2xs">
            <div className="grid sm:grid-cols-3 gap-4 text-left">
              
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Official Record</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Checked against the official RCI certificate database.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">QR Enabled</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Certificates include scannable QR code verification.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Online Verification</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Check status anytime through the RCI portal.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 4. How Certificate Verification Works (3 Steps) */}
        <div className="border-t border-slate-200 pt-12 mb-14">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Simple Process
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-display text-slate-900 mt-2">
              How Certificate Verification Works
            </h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { number: "01", title: "Enter Certificate ID", desc: "Enter the certificate number printed on your certificate." },
              { number: "02", title: "Verify Record", desc: "RCI checks the certificate against its official record." },
              { number: "03", title: "View Result", desc: "View the certificate information and current verification status." },
            ].map((step, i) => (
              <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold uppercase text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">Step {step.number}</span>
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 mb-1">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Help / Contact Section */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-2xs text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-extrabold text-blue-600">
              <HelpCircle className="w-4 h-4" />
              <span>Need Assistance?</span>
            </div>
            <h4 className="text-lg font-extrabold text-slate-900">Having trouble verifying your certificate?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Make sure you have entered the certificate number exactly as printed on your certificate.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-2xs active:scale-98"
            >
              Contact RCI
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-xs active:scale-98"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp RCI
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
