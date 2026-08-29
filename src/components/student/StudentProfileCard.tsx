"use client";

import React from "react";
import Link from "next/link";
import { User, Phone, Mail, BookOpen, Calendar, CheckCircle2 } from "lucide-react";
import StudentAvatar from "@/components/student/StudentAvatar";

interface StudentProfileCardProps {
  student: {
    id: string;
    full_name: string;
    phone?: string | null;
    email?: string | null;
    photo_url?: string | null;
    created_at?: string | null;
    courses?: {
      course_name?: string;
    } | null;
  };
  userEmail?: string;
}

export default function StudentProfileCard({ student, userEmail }: StudentProfileCardProps) {
  const formattedStudentId = student.id.startsWith("RCI-STU-")
    ? student.id
    : `RCI-STU-${student.id.slice(0, 6).toUpperCase()}`;

  // Format Date in Indian style e.g. "26 Aug 2026"
  const formattedEnrollDate = student.created_at
    ? new Date(student.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  const courseName = student.courses?.course_name || "General Computer Program";
  const displayEmail = student.email || userEmail || "Not provided";

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0">
          <StudentAvatar
            photoUrl={student.photo_url}
            studentName={student.full_name}
            size="lg"
          />
          <div className="min-w-0">
            <h3 className="font-extrabold text-slate-950 text-base sm:text-lg leading-tight font-display truncate">
              {student.full_name}
            </h3>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 mt-1 inline-block">
              {formattedStudentId}
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          ACTIVE
        </span>
      </div>

      {/* Details Grid */}
      <div className="space-y-3 text-xs sm:text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-extrabold uppercase text-[10.5px] tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Course
          </span>
          <span className="font-extrabold text-slate-900 truncate max-w-[180px]">
            {courseName}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-extrabold uppercase text-[10.5px] tracking-wider flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone
          </span>
          <span className="font-mono font-bold text-slate-800">
            {student.phone || "Not provided"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-extrabold uppercase text-[10.5px] tracking-wider flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" /> Email
          </span>
          <span className="font-bold text-slate-800 truncate max-w-[180px]" title={displayEmail}>
            {displayEmail}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-slate-400 font-extrabold uppercase text-[10.5px] tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Enrollment Date
          </span>
          <span className="font-bold text-slate-700">
            {formattedEnrollDate}
          </span>
        </div>
      </div>

      {/* View Profile Action (min 44px height) */}
      <div className="pt-2">
        <Link
          href="/student/profile"
          className="w-full min-h-[44px] bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/90 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
        >
          <User className="w-4 h-4 text-blue-600" />
          <span>View Full Profile</span>
        </Link>
      </div>
    </div>
  );
}
