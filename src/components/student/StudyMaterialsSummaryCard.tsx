"use client";

import React from "react";
import Link from "next/link";
import { BookMarked, FileText, Download, ChevronRight, Clock } from "lucide-react";

interface StudyMaterialsSummaryCardProps {
  materials?: Array<{
    id: string;
    title: string;
    type?: string;
    file_size?: string;
    created_at?: string;
  }>;
}

export default function StudyMaterialsSummaryCard({ materials = [] }: StudyMaterialsSummaryCardProps) {
  const hasMaterials = materials.length > 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
            <BookMarked className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-950 tracking-tight font-display">
              Study Materials
            </h2>
            <p className="text-xs text-slate-500 font-medium">Course notes, practice files, and reference PDFs</p>
          </div>
        </div>

        <Link
          href="/student/materials"
          className="text-xs font-extrabold text-purple-600 hover:text-purple-800 flex items-center gap-1 min-h-[44px] px-2"
        >
          <span>Browse All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* CASE A: Study Materials Exist */}
      {hasMaterials ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-slate-950 truncate font-display">{mat.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                    {mat.type || "PDF Document"} {mat.file_size ? `· ${mat.file_size}` : ""}
                  </p>
                </div>
              </div>

              <Link
                href="/student/materials"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-purple-600 hover:border-purple-200 flex items-center justify-center shrink-0 transition-colors"
                aria-label={`View ${mat.title}`}
              >
                <Download className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        /* CASE B: Empty State */
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mx-auto shadow-2xs">
            <BookMarked className="w-6 h-6 text-purple-600" />
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-950 font-display">
              Study materials will appear here soon
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed mt-1">
              Class notes, reference guides, practice PDFs, and module assignments assigned to your course will appear here when published.
            </p>
          </div>

          <div className="pt-1">
            <Link
              href="/student/materials"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-extrabold transition-colors min-h-[44px]"
            >
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>View Materials Library</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
