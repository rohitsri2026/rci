"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Award } from "lucide-react";

export default function VerifyForm() {
  const router = useRouter();
  const [certId, setCertId] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    router.push(`/verify/${certId.trim().toUpperCase()}`);
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4" /> Certificate Verification System
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-4">
            Verify Your Certificate
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-600 text-lg">
            Enter the unique Certificate ID printed on your certificate to verify its authenticity.
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative">
              <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="Enter Certificate ID (e.g. RCI-2026-001)"
                className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                required
              />
            </div>
            <button
              type="submit"
              disabled={!certId.trim()}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 text-lg shadow-md shadow-blue-500/20"
            >
              <Search className="w-5 h-5" /> Verify Certificate
            </button>
          </form>
          <p className="text-center text-slate-400 text-sm mt-6">You can also scan the QR code on a certificate for instant verification.</p>
        </motion.div>
      </div>
    </main>
  );
}
