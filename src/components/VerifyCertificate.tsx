"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Award } from "lucide-react";

export default function VerifyCertificate() {
  const router = useRouter();
  const [certId, setCertId] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    router.push(`/verify/${certId.trim().toUpperCase()}`);
  };

  return (
    <section id="verify" className="py-24 bg-white relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 mb-6">
              Verify Certificate
            </h2>
            <p className="text-slate-600 text-lg">
              Employers and institutions can instantly verify the authenticity of an RCI certificate.
            </p>
          </div>

          <div className="bg-slate-50 p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm">
            <form onSubmit={handleVerify} className="max-w-xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Award className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    placeholder="Enter Certificate ID (e.g. RCI-2026-001)"
                    className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={!certId.trim()}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Verify
                </button>
              </div>
              <p className="text-center text-slate-400 text-sm mt-4">You can also scan the QR code on a certificate for instant verification.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
