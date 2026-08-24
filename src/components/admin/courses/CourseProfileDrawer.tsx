"use client";

import { useEffect, useState } from "react";
import { 
  X, BookOpen, Clock, Banknote, Users, FileText, 
  Award, Edit3, Power, CheckCircle2, XCircle, ArrowUpRight, Tag
} from "lucide-react";
import Link from "next/link";
import { Course } from "@/types/course";

interface CourseProfileDrawerProps {
  course: Course | null;
  onClose: () => void;
  onEdit: (courseId: string) => void;
  onToggleStatus: (courseId: string, currentStatus: string) => Promise<void>;
}

export default function CourseProfileDrawer({
  course,
  onClose,
  onEdit,
  onToggleStatus,
}: CourseProfileDrawerProps) {
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (course) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [course, onClose]);

  if (!course) return null;

  const isActive = (course.status || "Active") === "Active";

  const handleToggle = async () => {
    setToggling(true);
    await onToggleStatus(course.id, course.status || "Active");
    setToggling(false);
  };

  const getInitials = (name: string) => {
    if (!name) return "RC";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
      aria-label="Course profile overlay"
    >
      <div 
        className="w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Course details profile"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 border border-blue-200/60 flex items-center justify-center font-extrabold text-base shrink-0 shadow-2xs">
              {getInitials(course.course_name)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide border ${
                  isActive 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}>
                  {isActive ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-slate-400" />}
                  {course.status || "Active"}
                </span>
                {course.discount && course.discount > 0 ? (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10.5px] font-bold">
                    <Tag className="w-3 h-3" /> {course.discount}% OFF
                  </span>
                ) : null}
              </div>
              <h2 className="text-lg font-extrabold text-slate-950 truncate mt-1 tracking-tight font-display">
                {course.course_name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 shrink-0"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Duration
              </span>
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{course.duration || "Self-Paced"}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Course Fee
              </span>
              <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-base">
                <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>₹{course.fees?.toLocaleString("en-IN") ?? "0"}</span>
              </div>
            </div>
          </div>

          {/* Institutional Stats */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              Enrollment & Activity Stats
            </h3>
            
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-2.5">
                <p className="text-xs text-slate-500 font-medium">Students</p>
                <p className="text-lg font-extrabold text-blue-700 mt-0.5">
                  {course.student_count ?? 0}
                </p>
              </div>

              <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-2.5">
                <p className="text-xs text-slate-500 font-medium">Admissions</p>
                <p className="text-lg font-extrabold text-amber-700 mt-0.5">
                  {course.admission_count ?? 0}
                </p>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-2.5">
                <p className="text-xs text-slate-500 font-medium">Certificates</p>
                <p className="text-lg font-extrabold text-emerald-700 mt-0.5">
                  {course.certificate_count ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Course Description
            </h3>
            <p className="text-slate-650 leading-relaxed bg-slate-50/70 border border-slate-200/60 rounded-2xl p-4 text-xs font-medium">
              {course.description || "No description available for this program record."}
            </p>
          </div>

          {/* Eligibility & Requirements */}
          {course.eligibility || (course.requirements && course.requirements.length > 0) ? (
            <div className="space-y-3 border-t border-slate-100 pt-4">
              {course.eligibility && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Eligibility Criteria
                  </span>
                  <p className="text-slate-800 font-semibold text-xs bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80">
                    {course.eligibility}
                  </p>
                </div>
              )}

              {course.requirements && course.requirements.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Requirements & Prerequisites
                  </span>
                  <ul className="space-y-1.5">
                    {course.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}

          {/* Slug & Metadata */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2 text-xs text-slate-500">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">URL Slug:</span>
              <span className="font-mono text-slate-800 font-bold">{course.slug || "Auto-generated"}</span>
            </div>
            {course.created_at && (
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Created On:</span>
                <span className="text-slate-800 font-semibold">{new Date(course.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-200/90 bg-white flex items-center gap-3">
          <button
            onClick={() => onEdit(course.id)}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-all shadow-md shadow-blue-500/15"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Course</span>
          </button>

          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`inline-flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl border transition-all disabled:opacity-50 ${
              isActive
                ? "bg-slate-50 hover:bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-300"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200"
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{toggling ? "..." : isActive ? "Deactivate" : "Activate"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
