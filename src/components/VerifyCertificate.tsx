"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Award, ShieldCheck, QrCode, Lock, Loader2 } from "lucide-react";

export default function VerifyCertificate() {
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
    <section id="verify" className="py-18 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-10">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-blue-400 bg-blue-950/90 border border-blue-800/80 px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-4 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Authenticity Portal
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white mb-4 leading-tight">
              Verify RCI Student Certificate
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              Employers, government bodies, and institutions can instantly authenticate official certificates issued by Rohit Computer Institute.
            </p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 sm:p-9 rounded-3xl shadow-2xl relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-3xl blur-xs opacity-50 group-hover:opacity-75 transition duration-500 pointer-events-none" />

            <form onSubmit={handleVerify} className="max-w-2xl mx-auto space-y-4 relative z-10">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Award className="w-5 h-5 text-blue-400" />
                  </div>
                  <input
                    type="text"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    placeholder="Enter Certificate No. (e.g. RCI-2026-000001)"
                    className="w-full pl-11 pr-4 py-4 bg-slate-950 border border-slate-700/90 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg font-bold transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!certId.trim() || isSubmitting}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-extrabold text-base transition-all shadow-lg shadow-blue-600/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-[170px] shrink-0 active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Verify Certificate
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 px-1">
                <span>Sample Certificate ID format: <code className="text-blue-400 bg-slate-950 px-2.5 py-1 rounded font-mono font-bold">RCI-2026-000001</code></span>
                <span className="hidden sm:inline font-semibold">Official RCI Verification</span>
              </div>
            </form>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800/80 mt-8 pt-8 text-center sm:text-left relative z-10">
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="w-10 h-10 rounded-xl bg-blue-900/50 text-blue-400 border border-blue-800/50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Instant Verification</h4>
                  <p className="text-[11px] text-slate-400">Real-time database lookup</p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="w-10 h-10 rounded-xl bg-purple-900/50 text-purple-400 border border-purple-800/50 flex items-center justify-center shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">QR Code Enabled</h4>
                  <p className="text-[11px] text-slate-400">Direct mobile QR scan support</p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="w-10 h-10 rounded-xl bg-emerald-900/50 text-emerald-400 border border-emerald-800/50 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Tamper-Proof</h4>
                  <p className="text-[11px] text-slate-400">Sha-256 token security</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
