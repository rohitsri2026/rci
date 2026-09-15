"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Quote, Award, ArrowRight } from "lucide-react";
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
    <section aria-labelledby="director-message-title" className="py-8 sm:py-12 bg-slate-50 border-b border-slate-200/80 overflow-hidden">
      <div className="container mx-auto px-3.5 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xs">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Compact Director Portrait */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-slate-200 shrink-0 bg-slate-100 shadow-2xs">
              <Image
                src={director.photo_url || "/md-photo.png"}
                alt={`${director.name} - ${director.designation}`}
                fill
                sizes="100px"
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Compact Message & Quote */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#155EEF] bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md mb-1.5">
                Meet Our Director
              </span>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 mb-1.5">
                <div>
                  <h3 id="director-message-title" className="text-base sm:text-lg font-black text-[#07152F] leading-tight">
                    {director.name}
                  </h3>
                  <p className="text-xs font-bold text-[#155EEF]">
                    {director.designation}
                  </p>
                </div>

                {director.established_year && (
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md self-center sm:self-auto">
                    Est. {director.established_year}
                  </span>
                )}
              </div>

              {/* Shortened Message Quote on Homepage */}
              <div className="relative bg-slate-50/80 border border-slate-200/70 rounded-xl p-3 sm:p-4 my-2">
                <Quote className="w-4 h-4 text-blue-300 absolute top-2 right-2.5 pointer-events-none" />
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic font-medium line-clamp-3 pr-3">
                  &ldquo;{director.message}&rdquo;
                </p>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:text-blue-700 transition-colors pt-1 min-h-[36px]"
              >
                <span>Read Full Message on About Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
