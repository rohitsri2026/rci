"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2, X, ShieldAlert } from "lucide-react";
import { Certificate } from "@/types/certificate";

interface CertificateRevokeDialogProps {
  certificate: Certificate | null;
  onClose: () => void;
  onConfirm: (certificateId: string) => Promise<void>;
}

export default function CertificateRevokeDialog({
  certificate,
  onClose,
  onConfirm,
}: CertificateRevokeDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!certificate) return null;

  const studentName = certificate.student_name || certificate.students?.full_name || "Student";
  const courseName = certificate.course_name || certificate.courses?.course_name || "Course";

  const handleRevoke = async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      await onConfirm(certificate.id);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to revoke certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Revoke certificate confirmation modal"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-extrabold text-slate-950 tracking-tight">
              Revoke Certificate?
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Revoking this certificate will cause future public verification attempts to mark it as <strong className="text-rose-600">Revoked</strong>. This action is recorded in audit logs.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Brief Details */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Certificate Number:</span>
            <span className="font-mono font-extrabold text-slate-900">{certificate.certificate_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Student:</span>
            <span className="font-extrabold text-slate-900">{studentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Course:</span>
            <span className="font-extrabold text-blue-600">{courseName}</span>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-extrabold text-xs hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleRevoke}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-colors shadow-md shadow-rose-600/20 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{loading ? "Revoking..." : "Revoke Certificate"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
