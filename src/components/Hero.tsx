"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award, BookOpen, ShieldCheck, Sparkles, GraduationCap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-28 sm:pt-32 pb-14 overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/20 to-white">
      {/* Background Gradients & Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[12%] left-[8%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[8%] w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-xs mb-6 sm:mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              Admissions Open for 2026 Batch — MSME Registered Institute
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-display text-slate-900 mb-6 leading-[1.15] tracking-tight"
          >
            Build Skills. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600">
              Build Your Digital Career.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-9 sm:mb-10 leading-relaxed"
          >
            Rohit Computer Institute (RCI) delivers practical computer education, industry-aligned training, 
            and QR-enabled verifiable certification to transform beginners into job-ready tech professionals.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-12 sm:mb-14"
          >
            <a
              href="#courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-extrabold text-base transition-all shadow-lg shadow-blue-500/25 active:scale-98"
            >
              <BookOpen className="w-5 h-5" />
              Explore Courses
              <ArrowRight className="w-5 h-5 ml-1" />
            </a>

            <Link
              href="/admission"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-extrabold text-base transition-all shadow-md active:scale-98"
            >
              <GraduationCap className="w-5 h-5 text-blue-400" />
              Apply for Admission
            </Link>

            <Link
              href="/verify"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 px-7 py-4 rounded-2xl font-extrabold text-base transition-all shadow-2xs active:scale-98"
            >
              <Award className="w-5 h-5 text-blue-600" />
              Verify Certificate
            </Link>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left mb-12 sm:mb-14"
          >
            {[
              { title: "Practical Training", desc: "100% lab-based practice" },
              { title: "Experienced Faculty", desc: "Expert IT instructors" },
              { title: "Verified Certificates", desc: "QR-coded online verification" },
              { title: "Career Guidance", desc: "Resume & interview prep" },
            ].map((trust, idx) => (
              <div key={idx} className="bg-white/90 backdrop-blur-xs border border-slate-200/80 p-4 rounded-2xl shadow-2xs flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{trust.title}</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500">{trust.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Hero Banner Image - Enlarged to max-w-5xl */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-slate-200/90 bg-white p-2.5 max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[16/8.2]">
              <Image
                src="/banner.png"
                alt="Rohit Computer Institute Campus & Training Banner"
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
