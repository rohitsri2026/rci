"use client";

import React, { useState } from "react";
import CertificatePreview from "@/components/certificates/CertificatePreview";
import { Award, Check, Eye } from "lucide-react";

export default function TemplatesPageClient() {
  const [selectedTheme, setSelectedTheme] = useState<"gold" | "indigo" | "charcoal">("gold");

  const templateThemes = [
    {
      id: "gold" as const,
      name: "Royal Gold Crest (Active)",
      description: "University-grade navy blue header with gold foil accents, formal styling, and gold ornaments. (Default)",
      primaryColor: "bg-[#1e3a8a]",
      accentColor: "bg-[#c5a880]",
    },
    {
      id: "indigo" as const,
      name: "Classic Academic Indigo",
      description: "Vibrant deep indigo header with platinum/indigo accents. Perfect for modern certification programs.",
      primaryColor: "bg-[#312e81]",
      accentColor: "bg-[#6366f1]",
    },
    {
      id: "charcoal" as const,
      name: "Modern Executive Charcoal",
      description: "Sleek charcoal grey header with warm bronze/amber accents. Professional, luxury executive design.",
      primaryColor: "bg-[#0f172a]",
      accentColor: "bg-[#b45309]",
    },
  ];

  return (
    <div className="grid xl:grid-cols-5 gap-8 items-start animate-in fade-in duration-300">
      {/* Themes Select List */}
      <div className="xl:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Select Theme</h3>
            <p className="text-slate-500 text-xs mt-1">
              Select an institutional template layout for active certification generation.
            </p>
          </div>

          <div className="space-y-4">
            {templateThemes.map((theme) => {
              const isSelected = selectedTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/10 shadow-sm"
                      : "border-slate-200 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex gap-1.5 shrink-0 mt-1">
                    <span className={`w-3.5 h-7 rounded-sm ${theme.primaryColor}`} />
                    <span className={`w-3.5 h-7 rounded-sm ${theme.accentColor}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-800 text-xs">{theme.name}</p>
                      {isSelected && (
                        <span className="bg-blue-100 text-blue-800 p-0.5 rounded-full">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                      {theme.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-3 text-xs text-slate-500 leading-normal">
            <Eye className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <p>
              Themes are applied dynamically to all generated credentials. You can preview the selected layout with mock variables on the right.
            </p>
          </div>
        </div>
      </div>

      {/* Template Preview Panel */}
      <div className="xl:col-span-3 space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Theme Live Preview</span>
          </h3>
          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded uppercase">
            {selectedTheme} theme
          </span>
        </div>

        <CertificatePreview
          certificateNumber="RCI-2026-000456"
          studentName="Aman Kumar Gupta"
          courseName="Master of Computer Application (MCA)"
          duration="2 Years"
          grade="Ex"
          completionDate="2026-07-19"
          issueDate="2026-07-19"
          fatherName="Mr. Ramesh Chandra Gupta"
          theme={selectedTheme}
        />
      </div>
    </div>
  );
}
