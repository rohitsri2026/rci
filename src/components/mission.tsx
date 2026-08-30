"use client";

import { useState, useEffect } from "react";
import { Eye, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_ABOUT_SECTIONS } from "@/lib/cms-defaults";
import { AboutSection } from "@/types/cms";

export default function Mission() {
  const [missionSec, setMissionSec] = useState<AboutSection>(
    DEFAULT_ABOUT_SECTIONS.find((s) => s.section_key === "mission") || DEFAULT_ABOUT_SECTIONS[1]
  );
  const [visionSec, setVisionSec] = useState<AboutSection>(
    DEFAULT_ABOUT_SECTIONS.find((s) => s.section_key === "vision") || DEFAULT_ABOUT_SECTIONS[2]
  );

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("about_sections")
      .select("*")
      .in("section_key", ["mission", "vision"])
      .then(({ data }) => {
        if (data && data.length > 0) {
          const m = data.find((item) => item.section_key === "mission");
          const v = data.find((item) => item.section_key === "vision");
          if (m) setMissionSec(m);
          if (v) setVisionSec(v);
        }
      });
  }, []);

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            Core Philosophy
          </span>
          <h2 className="text-3xl font-black font-display text-slate-900 mt-3">
            Our Vision &amp; Mission
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Vision Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black font-display text-slate-900 mb-3">
                {visionSec.heading}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {visionSec.content}
              </p>
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black font-display text-slate-900 mb-3">
                {missionSec.heading}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {missionSec.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
