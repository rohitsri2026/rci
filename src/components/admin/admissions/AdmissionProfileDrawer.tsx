"use client";

import { useEffect } from "react";
import Link from "next/link";
import { 
  X, Mail, Phone, BookOpen, Calendar, CheckCircle2, XCircle, 
  Clock, MessageSquare, UserCheck, Trash2, FileText 
} from "lucide-react";

interface Admission {
  id: string;
  student_name: string;
  email: string | null;
  phone: string | null;
  selected_course: string | null;
  status: "Pending" | "Approved" | "Rejected" | string;
  created_at: string;
  address?: string | null;
}

interface AdmissionProfileDrawerProps {
  admission: Admission | null;
  matchingStudentId?: string | null;
  onClose: () => void;
  onApprove: (admission: Admission) => void;
  onReject: (admission: Admission) => void;
  onDelete: (admission: Admission) => void;
}

export default function AdmissionProfileDrawer({
  admission,
  matchingStudentId,
  onClose,
  onApprove,
  onReject,
  onDelete,
}: AdmissionProfileDrawerProps) {
  // Close drawer on Escape key press with proper cleanup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!admission) return null;

  const initials = admission.student_name
    ? admission.student_name
        .trim()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AP";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/90 px-2.5 py-1 rounded-full text-[11px] font-extrabold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved</span>
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200/90 px-2.5 py-1 rounded-full text-[11px] font-extrabold">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/90 px-2.5 py-1 rounded-full text-[11px] font-extrabold">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  const rawDigits = admission.phone?.replace(/[^0-9]/g, "") || "";
  const whatsappUrl = rawDigits.length >= 7 
    ? `https://wa.me/${rawDigits}?text=Hello%20${encodeURIComponent(admission.student_name)},%20regarding%20your%20RCI%20admission%20application...` 
    : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Drawer Container */}
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200/90 flex flex-col justify-between z-10 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admission-drawer-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h2 id="admission-drawer-title" className="text-base font-extrabold text-slate-950 tracking-tight">
              Application Details
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close application details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Identity Header Card */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-sm">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-extrabold text-slate-950 tracking-tight leading-snug truncate">
                  {admission.student_name}
                </h3>
                <p className="text-xs font-bold text-slate-700 mt-0.5 truncate">
                  {admission.selected_course || "Unspecified Course"}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase text-slate-400">Current Status</span>
              {getStatusBadge(admission.status)}
            </div>
          </div>

          {/* Section 1: APPLICANT INFORMATION */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
              Applicant Information
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase text-slate-400">Email Address</span>
                  <span className="font-semibold text-slate-900 truncate block">{admission.email || "Not provided"}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase text-slate-400">Phone Number</span>
                  <span className="font-mono font-semibold text-slate-900 block">{admission.phone || "Not provided"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: APPLICATION DETAILS */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
              Application Details
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                <BookOpen className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase text-slate-400">Applied Course</span>
                  <span className="font-bold text-slate-900 block leading-snug">{admission.selected_course || "Unspecified"}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase text-slate-400">Application Date</span>
                  <span className="font-semibold text-slate-900 block">
                    {new Date(admission.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: ADDRESS (If available) */}
          {admission.address && (
            <div className="space-y-3">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                Address / Location
              </h4>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100 text-xs">
                <span className="font-semibold text-slate-900 block leading-relaxed">{admission.address}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls at Bottom */}
        <div className="p-5 border-t border-slate-100 bg-white sticky bottom-0 z-10 space-y-2">
          {admission.status === "Pending" && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onApprove(admission);
                  onClose();
                }}
                className="h-11 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve</span>
              </button>

              <button
                onClick={() => {
                  onReject(admission);
                  onClose();
                }}
                className="h-11 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs transition-all shadow-md shadow-red-500/20 active:scale-98"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>
          )}

          {admission.status === "Approved" && (
            <div className="space-y-2">
              {matchingStudentId ? (
                <Link
                  href={`/admin/students/${matchingStudentId}/edit`}
                  className="w-full h-11 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold text-xs transition-all"
                  onClick={onClose}
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>View Student Record</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    onApprove(admission);
                    onClose();
                  }}
                  className="w-full h-11 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-xs transition-all shadow-md shadow-blue-500/20"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Convert to Student</span>
                </button>
              )}

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 inline-flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/90 rounded-xl font-extrabold text-xs transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Contact via WhatsApp</span>
                </a>
              )}
            </div>
          )}

          {admission.status === "Rejected" && (
            <div className="space-y-2">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/90 rounded-xl font-extrabold text-xs transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  <span>Contact Applicant</span>
                </a>
              )}

              <button
                onClick={() => {
                  onDelete(admission);
                  onClose();
                }}
                className="w-full h-11 inline-flex items-center justify-center gap-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/90 rounded-xl font-extrabold text-xs transition-all"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Delete Application</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
