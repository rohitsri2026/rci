"use client";

import Link from "next/link";
import { GraduationCap, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function StudentPortalCTA() {
  return (
    <section aria-labelledby="student-portal-title" className="py-8 sm:py-12 bg-[#07152F] text-white relative overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#07152F] via-[#0A1F44] to-[#155EEF]/70 opacity-90 pointer-events-none" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-3.5 sm:px-6 lg:px-8 max-w-4xl relative z-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10.5px] sm:text-xs font-bold text-blue-200 mb-2.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4A72C]" />
          <span>Student Digital Ecosystem</span>
        </div>

        <h2 id="student-portal-title" className="text-xl sm:text-2xl md:text-3xl font-black font-display text-white tracking-tight mb-2">
          Your Digital Student Portal
        </h2>

        <p className="text-xs sm:text-sm text-blue-100 max-w-lg mx-auto mb-4 leading-relaxed font-normal">
          Log in anytime to check attendance records, access course notes, review fee status, and view official exam results.
        </p>

        {/* Feature List Pills: Attendance | Notes | Exams | Results | Notifications */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-xs text-blue-200 mb-5">
          {["Attendance", "Notes", "Exams", "Results", "Notifications"].map((feature) => (
            <span key={feature} className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 text-[11px] sm:text-xs font-semibold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{feature}</span>
            </span>
          ))}
        </div>

        {/* Student Login Button */}
        <div className="flex justify-center">
          <Link
            href="/student/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#07152F] hover:bg-slate-100 px-7 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-lg active:scale-98 min-h-[44px]"
          >
            <GraduationCap className="w-4 h-4 text-[#155EEF]" />
            <span>Student Login</span>
            <ArrowRight className="w-4 h-4 text-[#155EEF]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
