"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Mail, Phone, BookOpen, Calendar, MapPin, Edit3, User } from "lucide-react";

interface Student {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  course_id: string | null;
  courses?: {
    course_name: string;
  } | null;
}

interface StudentProfileDrawerProps {
  student: Student | null;
  onClose: () => void;
}

export default function StudentProfileDrawer({ student, onClose }: StudentProfileDrawerProps) {
  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!student) return null;

  const initials = student.full_name
    ? student.full_name
        .trim()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ST";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Drawer Container */}
      <div 
        className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200/90 flex flex-col justify-between z-10 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-drawer-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <h2 id="student-drawer-title" className="text-base font-extrabold text-slate-950 tracking-tight">
              Student Profile
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close profile drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Identity Header */}
          <div className="flex items-center gap-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-sm">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-extrabold text-slate-950 tracking-tight leading-snug truncate">
                {student.full_name}
              </h3>
              <p className="text-xs font-bold text-blue-600 mt-0.5 truncate">
                {student.courses?.course_name || "Enrolled Student"}
              </p>
            </div>
          </div>

          {/* Section 1: CONTACT */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
              Contact Information
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase text-slate-400">Email Address</span>
                  <span className="font-semibold text-slate-900 truncate block">{student.email || "Not provided"}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase text-slate-400">Phone Number</span>
                  <span className="font-mono font-semibold text-slate-900 block">{student.phone || "Not provided"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: ENROLLMENT */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
              Enrollment Details
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                <BookOpen className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase text-slate-400">Enrolled Course</span>
                  <span className="font-bold text-slate-900 block leading-snug">{student.courses?.course_name || "Unassigned"}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase text-slate-400">Enrolled On</span>
                  <span className="font-semibold text-slate-900 block">
                    {new Date(student.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: STUDENT AUTHENTICATION */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100 flex items-center justify-between">
              <span>Student Authentication</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                student.phone
                  ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                  : "text-amber-700 bg-amber-50 border-amber-200"
              }`}>
                {student.phone ? "Student Login Ready" : "Phone Number Required"}
              </span>
            </h4>

            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Login Credentials:</span>
                <span className="font-mono font-extrabold text-blue-700">
                  {student.phone ? "10-Digit Registered Phone" : "Not Set"}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Initial Login ID and Password is the student&apos;s registered phone number. Passwords are securely hashed via Supabase Auth.
              </p>

              {student.phone && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm(`Reset password for ${student.full_name} to registered phone number (${student.phone})?`)) {
                      return;
                    }
                    try {
                      const res = await fetch("/api/student/reset-password", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ studentId: student.id }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error || "Failed to reset password");
                      alert(data.message || "Student password reset successfully!");
                    } catch (err: any) {
                      alert(err.message || "Failed to reset password.");
                    }
                  }}
                  className="w-full mt-1.5 py-2 px-3 bg-white hover:bg-slate-50 border border-blue-200 text-blue-700 font-extrabold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Reset Student Password</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 4: ADDRESS (Rendered ONLY if address exists) */}
          {student.address && (
            <div className="space-y-3">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                Address / Location
              </h4>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100 text-xs">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase text-slate-400">Address</span>
                  <span className="font-semibold text-slate-900 block leading-relaxed">{student.address}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-5 border-t border-slate-100 bg-white sticky bottom-0 z-10">
          <Link
            href={`/admin/students/${student.id}/edit`}
            className="w-full h-11 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98"
            onClick={onClose}
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Student Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
