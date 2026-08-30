"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Quote, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_DIRECTOR_PROFILE } from "@/lib/cms-defaults";
import { DirectorProfile } from "@/types/cms";

interface MDMessageProps {
  initialDirector?: DirectorProfile;
}

export default function MDMessage({ initialDirector }: MDMessageProps) {
  const [director, setDirector] = useState<DirectorProfile>(initialDirector || DEFAULT_DIRECTOR_PROFILE);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("director_profile")
      .select("*")
      .eq("id", "default")
      .single()
      .then(({ data }) => {
        if (data) setDirector((prev) => ({ ...prev, ...data }));
      });
  }, []);

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">

        {/* Left: MD Photo & Frame */}
        <div className="relative lg:col-span-5 max-w-sm mx-auto w-full">
          <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative bg-white border border-slate-200/90 rounded-3xl p-3 shadow-xl">
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

            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-md flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Building2 className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">{director.name}</h4>
                <p className="text-xs text-blue-600 font-bold">{director.designation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: MD Content */}
        <div className="lg:col-span-7">
          <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-4">
            Message from the Managing Director
          </span>

          <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 leading-tight mb-5">
            Empowering Students Through Practical IT Excellence
          </h2>

          <div className="bg-slate-50 border-l-4 border-blue-600 p-5 sm:p-6 rounded-r-2xl border-y border-r border-slate-200/80 shadow-2xs mb-6 relative">
            <Quote className="w-8 h-8 text-blue-100 absolute top-3 right-4 pointer-events-none" />
            <p className="text-slate-800 italic text-sm sm:text-base leading-relaxed font-medium relative z-10">
              &ldquo;{director.message}&rdquo;
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {director.name}
              </h3>
              <p className="text-blue-600 font-bold text-xs uppercase tracking-wider mt-0.5">
                {director.designation} (Est. {director.established_year})
              </p>
            </div>

            {director.signature_url && (
              <div className="relative h-12 w-36">
                <Image
                  src={director.signature_url}
                  alt={`${director.name} Signature`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
