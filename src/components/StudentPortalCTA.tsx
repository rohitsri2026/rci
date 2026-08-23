"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, CreditCard, CalendarCheck, Award, FileText, Bell, Download, ArrowRight, ShieldCheck } from "lucide-react";

const portalFeatures = [
  { icon: CreditCard, title: "Fee Ledger & Receipts", desc: "View fee breakdown, payment history & download receipts" },
  { icon: CalendarCheck, title: "Attendance Tracker", desc: "Monitor daily computer lab attendance records" },
  { icon: FileText, title: "Exam Results", desc: "Access official test marks, grades & performance reports" },
  { icon: Award, title: "Digital Certificates", desc: "Download verified QR-coded course completion certificates" },
  { icon: Bell, title: "Institute Alerts", desc: "Receive immediate notifications for class & exam schedules" },
  { icon: Download, title: "Study Materials", desc: "Download lab practice files, notes & syllabus guides" },
];

export default function StudentPortalCTA() {
  return (
    <section className="py-18 bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-blue-400 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-4 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Digital Student Ecosystem
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white mb-4 leading-tight">
            Everything You Need, In One Student Portal
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto">
            RCI students enjoy 24/7 access to our digital student portal for complete academic tracking and resource management.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
          {portalFeatures.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md border border-white/15 p-6 rounded-2xl hover:bg-white/15 hover:border-blue-400/40 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                <feat.icon className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5">{feat.title}</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button preserving /student/login route */}
        <div className="text-center">
          <Link
            href="/student/login"
            className="inline-flex items-center gap-2.5 bg-white text-blue-950 hover:bg-blue-50 px-9 py-4 rounded-2xl font-extrabold text-base transition-all shadow-xl shadow-black/30 active:scale-98"
          >
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Access Student Portal Login
            <ArrowRight className="w-5 h-5 text-blue-600" />
          </Link>
        </div>
      </div>
    </section>
  );
}
