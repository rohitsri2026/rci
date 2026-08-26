"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, Award, ChevronRight, FileText } from "lucide-react";

interface ExamSummaryCardProps {
  examResults?: Array<{
    id: string;
    marks_obtained?: number | null;
    max_marks?: number | null;
    created_at?: string | null;
    exams?: {
      title?: string | null;
      subject?: string | null;
    } | null;
  }>;
}

export default function ExamSummaryCard({ examResults = [] }: ExamSummaryCardProps) {
  const hasResults = examResults.length > 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-950 tracking-tight font-display">
                Exam Summary
              </h3>
              <p className="text-xs text-slate-500 font-medium">Academic performance and marks</p>
            </div>
          </div>

          {hasResults && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
              {examResults.length} {examResults.length === 1 ? "Record" : "Records"}
            </span>
          )}
        </div>

        {/* CASE A: Exam Results Exist */}
        {hasResults ? (
          <div className="mt-4 space-y-2.5">
            {examResults.slice(0, 3).map((res) => {
              const obtained = Number(res.marks_obtained ?? 0);
              const max = Number(res.max_marks ?? 100);
              const pct = max > 0 ? Math.round((obtained / max) * 100) : 0;
              const isPassed = pct >= 33;

              return (
                <div
                  key={res.id}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-extrabold text-slate-950 block truncate font-display">
                      {res.exams?.title || "Course Exam"}
                    </span>
                    <span className="text-slate-500 font-medium block truncate mt-0.5 text-[11px]">
                      {res.exams?.subject || "Computer Assessment"}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-purple-700 text-sm block font-mono">
                      {obtained} / {max}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase inline-block px-1.5 py-0.2 rounded ${
                      isPassed ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}>
                      {pct}% · {isPassed ? "PASSED" : "FAILED"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* CASE B: Empty State */
          <div className="mt-4 bg-slate-50 rounded-2xl p-6 text-center space-y-2">
            <Award className="w-7 h-7 text-slate-400 mx-auto" />
            <h4 className="text-xs font-extrabold text-slate-800 font-display">No exam results yet</h4>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
              Your published exam results and subject scores will appear here once evaluation is complete.
            </p>
          </div>
        )}
      </div>

      <div className="pt-2">
        <Link
          href="/student/exams"
          className="w-full min-h-[44px] bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/90 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
        >
          <FileText className="w-4 h-4 text-purple-600" />
          <span>{hasResults ? "View All Exam Results" : "View Exams Schedule"}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>
    </div>
  );
}
