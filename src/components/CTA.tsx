"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RCIConfig } from "@/lib/config";

export default function CTA() {
  const whatsappUrl = RCIConfig.getWhatsAppUrl("Hello RCI, I am interested in joining a computer course. Please share admission details.");

  return (
    <section className="py-18 relative overflow-hidden bg-slate-900 text-white">
      {/* Gradient Background Highlights */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 opacity-90" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-8 bg-white p-3 rounded-full shadow-2xl"
          >
            <Image src="/badge.png" alt="RCI MSME ISO Badge" width={120} height={120} className="w-24 h-24 object-contain" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white mb-6 leading-tight"
          >
            Ready to Build Your Digital Skills?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Join hundreds of successful students empowering their careers with practical computer applications, accounting software, and software development skills.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none"
          >
            <Link
              href="/admission"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-slate-100 px-8 py-4 rounded-2xl font-extrabold text-base transition-all shadow-lg active:scale-98"
            >
              Apply for Admission
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-lg shadow-emerald-600/25 active:scale-98"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp RCI
            </a>

            <a
              href={`tel:${RCIConfig.phoneRaw}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-7 py-4 rounded-2xl font-bold text-base transition-all backdrop-blur-xs active:scale-98"
            >
              <PhoneCall className="w-5 h-5 text-blue-300" />
              Call Admissions
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
