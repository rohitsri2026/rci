"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Award,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Check,
  Copy,
  BookOpen,
  User,
} from "lucide-react";
import CertificateTemplate from "@/components/certificates/CertificateTemplate";
import CertificateQRCode from "@/components/certificates/CertificateQRCode";
import DownloadButton from "@/components/certificates/DownloadButton";
import DownloadPNGButton from "@/components/certificates/DownloadPNGButton";
import PrintButton from "@/components/certificates/PrintButton";

export interface StudentModalInfo {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  address?: string | null;
  course_id: string | null;
  courses?: {
    id?: string;
    course_name: string;
    duration?: string | null;
  } | null;
}

export interface ExistingCertInfo {
  id: string;
  certificate_number: string;
  student_id: string;
  course_id: string;
  completion_date: string;
  issue_date: string;
  grade: string;
  status: "Valid" | "Revoked" | "Expired";
  student_name?: string | null;
  course_name?: string | null;
}

interface AdminCertificateModalProps {
  student: StudentModalInfo | null;
  existingCertificate?: ExistingCertInfo | null;
  onClose: () => void;
  onCertificateGenerated?: (newCert: ExistingCertInfo) => void;
}

export default function AdminCertificateModal({
  student,
  existingCertificate = null,
  onClose,
  onCertificateGenerated,
}: AdminCertificateModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [activeCert, setActiveCert] = useState<ExistingCertInfo | null>(existingCertificate);

  // Form states for certificate creation
  const [grade, setGrade] = useState("A");
  const [completionDate, setCompletionDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Sync state when props change
  useEffect(() => {
    setActiveCert(existingCertificate);
    setError("");
    setGrade("A");
  }, [student, existingCertificate]);

  // Handle ESC key to close modal
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

  const courseName = student.courses?.course_name || "Enrolled Course";
  const duration = student.courses?.duration || "3 Months";
  const hasCourse = Boolean(student.course_id);

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleGenerateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasCourse || !student.course_id) {
      setError("This student is not assigned to any course. Please assign a course first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: student.id,
          course_id: student.course_id,
          grade,
          completion_date: completionDate,
          issue_date: issueDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate certificate.");
      }

      setActiveCert(data);
      onCertificateGenerated?.(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while generating certificate.");
    } finally {
      setLoading(false);
    }
  };

  const previewCertNumber = activeCert ? activeCert.certificate_number : "RCI-2026-DRAFT";
  const verificationUrl = `/verify/${previewCertNumber}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      {/* Offscreen element for DOM capture during PNG/PDF print actions */}
      <div style={{ position: "fixed", left: "0", top: "0", width: "1123px", height: "794px", overflow: "hidden", zIndex: -100, opacity: 0.01, pointerEvents: "none" }}>
        <CertificateTemplate
          certificateNumber={activeCert ? activeCert.certificate_number : "RCI-2026-PREVIEW"}
          studentName={student.full_name}
          courseName={courseName}
          duration={duration}
          grade={activeCert ? activeCert.grade : grade}
          completionDate={activeCert ? activeCert.completion_date : completionDate}
          issueDate={activeCert ? activeCert.issue_date : issueDate}
          fatherName={student.address || undefined}
        />
      </div>

      <div className="relative w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-950 tracking-tight font-display">
                  {activeCert ? "Certificate Details & Actions" : "Generate Course Certificate"}
                </h2>
                {activeCert && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                    Issued
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Student: <strong className="text-slate-900 font-bold">{student.full_name}</strong> • Course: <strong className="text-blue-600 font-bold">{courseName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!hasCourse ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
              <h3 className="text-base font-extrabold text-slate-900">No Course Assigned</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                This student does not currently have an assigned course. Please assign a course in the student edit section before issuing a certificate.
              </p>
            </div>
          ) : activeCert ? (
            /* ISSUED CERTIFICATE VIEW */
            <div className="space-y-6">
              {/* Info Card with QR Verification */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Certificate Summary */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Certificate Number
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-base font-black text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-xl">
                          {activeCert.certificate_number}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyNumber(activeCert.certificate_number)}
                          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
                          title="Copy Certificate Number"
                        >
                          {copiedNumber ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Secured Grade
                      </span>
                      <span className="text-base font-black text-slate-900 block mt-1">
                        {activeCert.grade}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Completion Date
                      </span>
                      <span className="font-semibold text-slate-800 block mt-0.5">
                        {new Date(activeCert.completion_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Issue Date
                      </span>
                      <span className="font-semibold text-slate-800 block mt-0.5">
                        {new Date(activeCert.issue_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Verification URL Pill */}
                  <div className="pt-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      Verification URL
                    </span>
                    <a
                      href={verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline mt-1 break-all"
                    >
                      <span>{typeof window !== "undefined" ? `${window.location.origin}${verificationUrl}` : verificationUrl}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* QR Code Verification Box */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center text-center space-y-2">
                  <CertificateQRCode certificateNumber={activeCert.certificate_number} size={130} />
                  <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider block mt-1">
                    Scannable QR Verification
                  </span>
                  <p className="text-[10.5px] text-slate-500 leading-tight">
                    Scan with any mobile camera to authenticate this certificate online.
                  </p>
                </div>
              </div>

              {/* Certificate Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <DownloadPNGButton
                    certificateNumber={activeCert.certificate_number}
                    studentName={student.full_name}
                    variant="primary"
                  />
                  <DownloadButton
                    certificateNumber={activeCert.certificate_number}
                    studentName={student.full_name}
                  />
                  <PrintButton
                    certificateNumber={activeCert.certificate_number}
                    studentName={student.full_name}
                  />
                </div>

                <a
                  href={verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-950 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-sm shrink-0"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Open Verification Page</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>

              {/* Certificate Visual Preview */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Live Certificate Preview
                </h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-lg bg-slate-900 p-2 sm:p-4 flex justify-center">
                  <div className="transform scale-[0.55] sm:scale-[0.7] md:scale-[0.8] origin-top my-[-150px] sm:my-[-90px] md:my-[-40px]">
                    <CertificateTemplate
                      certificateNumber={activeCert.certificate_number}
                      studentName={student.full_name}
                      courseName={courseName}
                      duration={duration}
                      grade={activeCert.grade}
                      completionDate={activeCert.completion_date}
                      issueDate={activeCert.issue_date}
                      fatherName={student.address || undefined}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* GENERATE CERTIFICATE FORM & PREVIEW */
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
              {/* Left Column: Input Form (2 cols) */}
              <form onSubmit={handleGenerateCertificate} className="lg:col-span-2 space-y-4 bg-slate-50 border border-slate-200/90 p-4 sm:p-5 rounded-2xl">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight pb-2 border-b border-slate-200">
                  Certificate Details
                </h3>

                {/* Grade */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Secured Grade
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-slate-900 font-extrabold text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {["A+", "A", "B+", "B", "C", "D", "Ex"].map((g) => (
                      <option key={g} value={g}>
                        Grade {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Completion Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Completion Date
                  </label>
                  <input
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-slate-900 font-bold text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Issue Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Issue Date
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-slate-900 font-bold text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Auto Data Summary */}
                <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>Auto-fetched Student Data:</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-snug">
                    Certificate No. will be assigned automatically (e.g. RCI-2026-XXXXXX) with a unique verification QR code.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !hasCourse}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition-all shadow-md shadow-blue-500/20 text-sm disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Certificate...</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-4.5 h-4.5" />
                      <span>Issue Certificate</span>
                    </>
                  )}
                </button>
              </form>

              {/* Right Column: Live Interactive Preview (3 cols) */}
              <div className="lg:col-span-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Live Certificate Preview
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500">
                    Format: A4 Landscape
                  </span>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xl bg-slate-900 p-2 flex justify-center">
                  <div className="transform scale-[0.45] sm:scale-[0.55] origin-top my-[-190px] sm:my-[-140px]">
                    <CertificateTemplate
                      certificateNumber="RCI-2026-DRAFT"
                      studentName={student.full_name}
                      courseName={courseName}
                      duration={duration}
                      grade={grade}
                      completionDate={completionDate}
                      issueDate={issueDate}
                      fatherName={student.address || undefined}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
