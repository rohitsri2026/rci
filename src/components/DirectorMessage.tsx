"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Quote, Award, Calendar, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_DIRECTOR_PROFILE } from "@/lib/cms-defaults";
import { DirectorProfile } from "@/types/cms";

export default function DirectorMessage() {
  const [director, setDirector] = useState<DirectorProfile>(DEFAULT_DIRECTOR_PROFILE);

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
    <section aria-labelledby="director-message-title" className="py-14 sm:py-20 bg-white border-b border-slate-200/80 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-slate-50/80 border border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Director Portrait */}
            <div className="md:col-span-5 flex flex-col items-center text-center">
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-200">
                <Image
                  src={director.photo_url || "/md-photo.png"}
                  alt={`${director.name} - ${director.designation}`}
                  fill
                  sizes="(max-width: 768px) 240px, 260px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="mt-4">
                <h3 className="text-lg sm:text-xl font-black text-[#07152F]">
                  {director.name}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-[#155EEF] mt-0.5">
                  {director.designation}
                </p>
                {director.established_year && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 mt-1 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                    <Calendar className="w-3 h-3 text-[#D4A72C]" />
                    <span>Serving Since {director.established_year}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Director Message & Institutional Quote */}
            <div className="md:col-span-7 space-y-4 text-left relative">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>Director&apos;s Desk</span>
              </div>

              <h2 id="director-message-title" className="text-2xl sm:text-3xl font-black font-display text-[#07152F] tracking-tight">
                Empowering Digital Careers
              </h2>

              {/* Styled Message */}
              <div className="relative bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs">
                <Quote className="w-8 h-8 text-blue-200 absolute top-3 right-4 pointer-events-none" />
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic font-medium relative z-10">
                  &ldquo;{director.message}&rdquo;
                </p>

                {/* Signature if uploaded */}
                {director.signature_url && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                    <div className="relative h-10 w-32">
                      <Image
                        src={director.signature_url}
                        alt="Director Signature"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Dedicated to Quality Computer Literacy & Technical Mastery</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
