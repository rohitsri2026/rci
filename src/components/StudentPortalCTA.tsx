"use client";

import Link from "next/link";

export default function StudentPortalCTA() {
  return (
    <section aria-labelledby="student-portal-title" className="py-10 sm:py-16 bg-[#07152F] text-white relative overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#07152F] via-[#0A1F44] to-[#155EEF]/70 opacity-90 pointer-events-none" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-3.5 sm:px-6 lg:px-8 max-w-4xl relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10.5px] sm:text-xs font-bold text-blue-200 mb-3">
          <i className="bi bi-shield-check text-[#D4A72C] text-sm" />
          <span>Student Digital Ecosystem</span>
        </div>

        <h2 id="student-portal-title" className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black font-display text-white tracking-tight mb-2.5">
          Your Digital Student Portal
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-blue-100 max-w-lg mx-auto mb-5 leading-relaxed font-normal">
          Log in anytime to check real-time attendance records, access downloadable course notes, review fee receipts, and view official exam results.
        </p>

        {/* Feature List Pills with Bootstrap Icons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs text-blue-200 mb-6">
          {[
            { label: "Attendance Tracker", icon: "bi bi-calendar2-check" },
            { label: "Course Study Notes", icon: "fa-solid fa-book" },
            { label: "Online Exam Results", icon: "bi bi-award" },
            { label: "Fee Receipts", icon: "fa-solid fa-receipt" },
            { label: "Institute Notices", icon: "bi bi-bell" },
          ].map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-[11px] sm:text-xs font-semibold backdrop-blur-xs">
              <i className={`${item.icon} text-emerald-400 text-xs`} />
              <span>{item.label}</span>
            </span>
          ))}
        </div>

        {/* Student Login Button */}
        <div className="flex justify-center">
          <Link
            href="/student/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-[#07152F] hover:bg-slate-100 px-8 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-xl hover:scale-[1.02] active:scale-98 min-h-[44px]"
          >
            <i className="fa-solid fa-graduation-cap text-[#155EEF] text-sm" />
            <span>Open Student Login</span>
            <i className="fa-solid fa-arrow-right text-xs text-[#155EEF]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
