"use client";

import React from "react";
import { Calendar, GraduationCap, Sparkles } from "lucide-react";

interface DashboardWelcomeProps {
  studentName: string;
  courseName?: string;
  studentId: string;
}

export default function DashboardWelcome({
  studentName,
  courseName = "Computer Application Program",
  studentId,
}: DashboardWelcomeProps) {
  // Format date in Indian format: e.g. "27 August 2026"
  const formattedDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedStudentId = studentId.startsWith("RCI-STU-")
    ? studentId
    : `RCI-STU-${studentId.slice(0, 6).toUpperCase()}`;

  return (
    <div className="bg-gradient-to-br from-[#07152F] via-[#0B224D] to-[#155EEF] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          {/* Date & Status Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-blue-200">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-extrabold text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Student</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
            Welcome back, {studentName}! 👋
          </h1>

          <p className="text-blue-100/90 text-xs sm:text-sm font-medium max-w-xl leading-relaxed">
            {courseName} · Student Control Center
          </p>
        </div>

        {/* Student ID Card Badge */}
        <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-left md:text-right min-w-[200px]">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200 block">
            Student Identification
          </span>
          <span className="text-base sm:text-lg font-mono font-extrabold text-white mt-1 block tracking-wider">
            {formattedStudentId}
          </span>
        </div>
      </div>
    </div>
  );
}
