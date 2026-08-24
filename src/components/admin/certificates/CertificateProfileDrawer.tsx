"use client";

import React, { useEffect, useState } from "react";
import { 
  X, Award, User, BookOpen, Calendar, ShieldCheck, 
  Download, Printer, ExternalLink, Copy, Check, AlertTriangle, ShieldAlert, CheckCircle2, Clock
} from "lucide-react";
import { Certificate } from "@/types/certificate";

interface CertificateProfileDrawerProps {
  certificate: Certificate | null;
  onClose: () => void;
  onDownload: (cert: Certificate) => void;
  onPrint: (cert: Certificate) => void;
  onVerify: (cert: Certificate) => void;
  onRevoke?: (cert: Certificate) => void;
  userRole?: string;
}

export default function CertificateProfileDrawer({
  certificate,
  onClose,
  onDownload,
  onPrint,
  onVerify,
  onRevoke,
  userRole = "Viewer",
}: CertificateProfileDrawerProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (certificate) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [certificate, onClose]);

  if (!certificate) return null;

  const studentName = certificate.student_name || certificate.students?.full_name || "Unassigned Student";
  const courseName = certificate.course_name || certificate.courses?.course_name || "Unassigned Course";
  const duration = certificate.courses?.duration || "Standard Program";
  const status = certificate.status || "Valid";

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "Valid":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            VALID
          </span>
        );
      case "Expired":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            EXPIRED
          </span>
        );
      case "Revoked":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            REVOKED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-slate-100 text-slate-700 border border-slate-200">
            {st}
          </span>
        );
    }
  };

  const verificationUrl = typeof window !== "undefined"
    ? `${window.location.origin}/verify/${certificate.certificate_number}`
    : `https://rciknp.vercel.app/verify/${certificate.certificate_number}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
      aria-label="Certificate drawer overlay"
    >
      <div 
        className="w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Certificate details drawer"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 border border-blue-200/60 flex items-center justify-center font-extrabold shrink-0 shadow-2xs">
              <Award className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {getStatusBadge(status)}
                <span className="text-[11px] font-extrabold uppercase text-slate-400 font-mono tracking-wider">
                  REGISTRY RECORD
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-950 truncate mt-1 tracking-tight font-mono">
                {certificate.certificate_number}
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs sm:text-sm">
          {/* Primary Info Cards */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3.5">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Student Name
              </span>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-950 text-base">
                  {studentName}
                </span>
                {certificate.students?.email && (
                  <span className="text-[11px] text-slate-500 font-medium">
                    {certificate.students.email}
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200/60 pt-3">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Course Program
              </span>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-700 text-sm">
                  {courseName}
                </span>
                <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md">
                  {duration}
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Specifications */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Grade
              </span>
              <span className="text-base font-extrabold text-slate-950">
                {certificate.grade || "A+"}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Issue Date
              </span>
              <span className="text-sm font-extrabold text-slate-800">
                {certificate.issue_date || certificate.created_at?.split("T")[0]}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Completion Date
              </span>
              <span className="text-sm font-extrabold text-slate-800">
                {certificate.completion_date || "—"}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Issued By
              </span>
              <span className="text-xs font-bold text-slate-700 truncate block">
                {certificate.issued_by || "RCI Admin"}
              </span>
            </div>
          </div>

          {/* Verification Link Card */}
          <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Public QR Verification Link
              </span>
              <button
                type="button"
                onClick={() => handleCopy(verificationUrl, "link")}
                className="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-600 hover:text-blue-800 transition-colors"
              >
                {copiedField === "link" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedField === "link" ? "Copied" : "Copy Link"}
              </button>
            </div>
            <p className="text-xs font-mono text-slate-700 bg-white border border-blue-100 rounded-xl p-2.5 break-all select-all">
              {verificationUrl}
            </p>
          </div>

          {/* Token Details */}
          {certificate.verification_token && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1 text-xs text-slate-500">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400">Security Token:</span>
                <button
                  type="button"
                  onClick={() => handleCopy(certificate.verification_token, "token")}
                  className="text-slate-500 hover:text-slate-900 font-extrabold text-[11px] flex items-center gap-1"
                >
                  {copiedField === "token" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copiedField === "token" ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="font-mono text-[11px] text-slate-800 break-all">
                {certificate.verification_token}
              </p>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-200 bg-white space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onDownload(certificate)}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl transition-all shadow-md shadow-blue-500/15"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={() => onPrint(certificate)}
              className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs py-2.5 px-3 rounded-xl transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onVerify(certificate)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2 px-3 rounded-xl transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>Verify Online</span>
            </button>

            {status === "Valid" && onRevoke && userRole !== "Viewer" && (
              <button
                onClick={() => onRevoke(certificate)}
                className="inline-flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs py-2 px-3 rounded-xl transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>Revoke</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
