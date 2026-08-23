import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { RCIConfig } from "@/lib/config";

export default function AboutHero() {
  return (
    <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-white border-b border-slate-200/80">
      {/* Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[130px]" />
        <div className="absolute top-[20%] right-[15%] w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[130px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-100 shadow-2xs mb-6">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-xs sm:text-sm font-semibold text-slate-700">
            Government & MSME Registered Institute
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-slate-900 leading-[1.15]">
          Empowering Careers Through <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Practical Computer Education
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {RCIConfig.instituteName} is a premier computer institute dedicated to delivering hands-on technical training, 
          accounting software skills, computer applications, and QR-verifiable certifications that bridge the gap between learning and real-world employment.
        </p>

        {/* Action Highlights */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98"
          >
            Explore Career Courses
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/admission"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-2xs active:scale-98"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Apply for Admission
          </Link>
        </div>
      </div>
    </section>
  );
}
