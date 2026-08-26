"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, ChevronRight, CheckCircle2 } from "lucide-react";

interface CurrentCourseCardProps {
  course?: {
    id?: string;
    course_name?: string;
    duration?: string;
    fees?: number | string;
    description?: string;
  } | null;
  enrollmentDate?: string | null;
}

export default function CurrentCourseCard({ course, enrollmentDate }: CurrentCourseCardProps) {
  const courseName = course?.course_name || "Registered Program";
  const duration = course?.duration || "Standard Program";
  const feeDisplay = course?.fees ? `₹${course.fees}` : "As per Fee Ledger";

  const formattedDate = enrollmentDate
    ? new Date(enrollmentDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Active";

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-950 tracking-tight font-display">
                My Current Course
              </h2>
              <p className="text-xs text-slate-500 font-medium">Assigned curriculum & enrollment status</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ACTIVE
          </span>
        </div>

        {course ? (
          <div className="mt-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Course Title
              </span>
              <span className="font-extrabold text-slate-950 text-sm block">
                {courseName}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Duration
              </span>
              <span className="font-bold text-slate-800 block">
                {duration}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Course Fee
              </span>
              <span className="font-bold text-slate-800 block">
                {feeDisplay}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Enrolled On
              </span>
              <span className="font-bold text-slate-800 block">
                {formattedDate}
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-4 bg-slate-50 rounded-2xl p-6 text-center text-slate-500 text-xs font-semibold">
            No specific course record assigned. Please contact institute administration.
          </div>
        )}
      </div>

      <div className="pt-2">
        <Link
          href="/student/courses"
          className="w-full min-h-[44px] bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/90 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors active:scale-[0.99]"
        >
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>View Course Syllabus & Modules</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>
    </div>
  );
}
