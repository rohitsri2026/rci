"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Building2, Quote } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_DIRECTOR_PROFILE, DEFAULT_ABOUT_SECTIONS } from "@/lib/cms-defaults";

export default function AboutMDSection() {
  const [director, setDirector] = useState(DEFAULT_DIRECTOR_PROFILE);
  const [aboutRci, setAboutRci] = useState(DEFAULT_ABOUT_SECTIONS[0]);

  useEffect(() => {
    const supabase = createClient();

    // Fetch director profile
    supabase
      .from("director_profile")
      .select("*")
      .eq("id", "default")
      .single()
      .then(({ data }) => {
        if (data) setDirector((prev) => ({ ...prev, ...data }));
      });

    // Fetch main about section
    supabase
      .from("about_sections")
      .select("*")
      .eq("section_key", "about_rci")
      .single()
      .then(({ data }) => {
        if (data) setAboutRci((prev) => ({ ...prev, ...data }));
      });
  }, []);

  return (
    <section id="about-rci" className="py-18 bg-slate-50 relative overflow-hidden border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Director Photo & Premium Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-5 max-w-md mx-auto w-full relative"
          >
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative bg-white p-3 rounded-3xl border border-slate-200/90 shadow-xl">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100">
                <Image
                  src={director.photo_url || "/md-photo.png"}
                  alt={`${director.name} - ${director.designation}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Float Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{director.name}</h4>
                  <p className="text-xs text-blue-600 font-bold">{director.designation}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content & MD Message */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full inline-flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Director&apos;s Message &amp; Overview
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-slate-900 mt-4 mb-5 leading-tight">
              {aboutRci.heading}
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
              {aboutRci.content}
            </p>

            <div className="bg-white border-l-4 border-blue-600 p-6 rounded-r-2xl border-y border-r border-slate-200/80 shadow-xs mb-7 relative">
              <Quote className="w-8 h-8 text-blue-100 absolute top-3 right-4 pointer-events-none" />
              <p className="text-slate-800 italic text-sm sm:text-base leading-relaxed font-medium relative z-10">
                &ldquo;{director.message}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="font-extrabold text-slate-900">— {director.name}</span>
                <span className="text-slate-300">|</span>
                <span className="text-blue-600 font-bold">{director.designation}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5 mb-7">
              {[
                "Government & MSME Registered Institute",
                "ISO Quality Standards & Verifiable Diplomas",
                "100% Practical Computer Lab Sessions",
                "Dedicated Student Digital Portal Access",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span className="text-sm font-bold text-slate-800">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-extrabold text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98"
            >
              Learn More About RCI
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
