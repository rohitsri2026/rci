"use client";

import Link from "next/link";
import { GraduationCap, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function StudentPortalCTA() {
  return (
    <section aria-labelledby="student-portal-title" className="py-12 sm:py-16 bg-[#07152F] text-white relative overflow-hidden">
      {/* Subtle Glows */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#07152F] via-[#0D295C] to-[#155EEF] opacity-90 pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10.5px] sm:text-xs font-bold text-blue-200 mb-3.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4A72C]" />
          <span>Student Digital Ecosystem</span>
        </div>

        <h2 id="student-portal-title" className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-white tracking-tight mb-3">
          Access Your RCI Student Portal
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-blue-100 max-w-xl mx-auto mb-6 leading-relaxed font-normal">
          Enrolled students can log in 24/7 to track lab attendance records, access study materials, view fee statements, and check official exam results.
        </p>

        {/* 3 Quick Benefit Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs text-blue-200 mb-7">
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Lab Attendance Tracking</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-300 shrink-0" />
            <span>Class Notes & Practice Files</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A72C] shrink-0" />
            <span>Official Exam Results</span>
          </div>
        </div>

        {/* CTA Button preserving /student/login route */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/student/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#07152F] hover:bg-slate-100 px-7 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-lg active:scale-98 min-h-[44px]"
          >
            <GraduationCap className="w-4 h-4 text-[#155EEF]" />
            <span>Access Student Portal Login</span>
            <ArrowRight className="w-4 h-4 text-[#155EEF]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
