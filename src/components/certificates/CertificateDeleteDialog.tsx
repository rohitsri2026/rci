"use client";

import React, { useState, useEffect } from "react";
import { Trash2, AlertTriangle, Loader2, X } from "lucide-react";
import { Certificate } from "@/types/certificate";

interface CertificateDeleteDialogProps {
  certificate: Certificate | null;
  onClose: () => void;
  onConfirm: (certificateId: string) => Promise<void>;
}

export default function CertificateDeleteDialog({
  certificate,
  onClose,
  onConfirm,
}: CertificateDeleteDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
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
  }, [certificate, loading, onClose]);

  if (!certificate) return null;

  const studentName =
    certificate.student_name || certificate.students?.full_name || "Aman Singh";
  const courseName =
    certificate.course_name ||
    certificate.courses?.course_name ||
    "Diploma in Computer Applications (DCA)";

  const handleDelete = async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      await onConfirm(certificate.id);
      onClose();
    } catch (err: any) {
      setError(
        err.message || "Failed to delete certificate. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={() => !loading && onClose()}
      aria-label="Delete Certificate Confirmation Modal Overlay"
    >
      <div
        className="bg-white rounded-3xl border border-rose-100 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Delete Certificate Confirmation Dialog"
      >
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/80 flex items-center justify-center shrink-0 shadow-2xs">
            <Trash2 className="w-6 h-6 text-rose-600" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-extrabold text-slate-950 tracking-tight font-display">
              Delete Certificate?
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Are you sure you want to permanently delete this certificate record? This action cannot be undone.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Specs Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
            <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
              Certificate ID
            </span>
            <span className="font-mono font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
              {certificate.certificate_number}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
            <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
              Student
            </span>
            <span className="font-extrabold text-slate-950 truncate max-w-[200px]">
              {studentName}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
              Course
            </span>
            <span className="font-bold text-blue-700 truncate max-w-[200px]">
              {courseName}
            </span>
          </div>
        </div>

        {/* Error Alert if Deletion Fails */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-xs font-semibold flex items-start gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">
              <strong className="block font-bold">Deletion Failed</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-extrabold text-xs hover:bg-slate-50 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-all shadow-md shadow-rose-600/20 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-rose-600"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Certificate</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
