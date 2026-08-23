"use client";

import React from "react";
import { User, BookOpen, Calendar, Award, ShieldAlert, CheckCircle2, FileText, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import CertificatePreview from "./certificates/CertificatePreview";
import VerificationBadge from "./certificates/VerificationBadge";
import DownloadButton from "./certificates/DownloadButton";
import PrintButton from "./certificates/PrintButton";
import CertificateSeal from "./certificates/CertificateSeal";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CertificateCard({ cert }: { cert: any }) {
  if (!cert) {
    return (
      <div className="bg-white border border-rose-200 rounded-3xl p-8 sm:p-12 text-center shadow-lg shadow-rose-950/5 max-w-2xl mx-auto animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-rose-100/80 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
          <ShieldAlert className="w-9 h-9 text-rose-600" />
        </div>
        <h3 className="font-extrabold text-2xl text-slate-900 font-display">Certificate Not Found</h3>
        <p className="text-slate-600 text-sm mt-2.5 max-w-md mx-auto leading-relaxed">
          The certificate number could not be verified against the RCI records. Please make sure you entered the number exactly as printed on your certificate.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-extrabold text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  const certificateNumber = cert.certificate_number || cert.certificate_id;
  const studentName = cert.student_name || cert.students?.full_name || "—";
  const courseName = cert.course_name || cert.courses?.course_name || "—";
  const duration = cert.courses?.duration || "6 Months";
  const grade = cert.grade || "A+";
  const completionDate = cert.completion_date || cert.issue_date;
  const issueDate = cert.issue_date;
  const fatherName = cert.students?.address || undefined;

  const isRevokedOrExpired = cert.status === "Revoked" || cert.status === "Expired";

  if (isRevokedOrExpired) {
    return (
      <div className="bg-white border border-amber-200 rounded-3xl p-8 sm:p-12 text-center shadow-lg shadow-amber-950/5 max-w-2xl mx-auto animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-amber-100/80 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <ShieldAlert className="w-9 h-9 text-amber-600" />
        </div>
        <h3 className="font-extrabold text-2xl text-slate-900 font-display">
          Certificate {cert.status}
        </h3>
        <p className="text-slate-600 text-sm mt-2.5 max-w-md mx-auto leading-relaxed">
          This certificate is currently not valid. It has been marked as <span className="font-bold text-amber-700">{cert.status}</span> in the official institute registry.
        </p>

        <div className="mt-6 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-left max-w-md mx-auto text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Certificate No:</span>
            <span className="font-mono font-bold text-slate-800">{certificateNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Student Name:</span>
            <span className="font-bold text-slate-800">{studentName}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-extrabold text-sm transition-all shadow-xs active:scale-98"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Verification
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Back button link */}
      <div className="flex items-center justify-between">
        <Link
          href="/verify"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-600 hover:text-blue-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Verify Another Certificate
        </Link>
      </div>

      {/* 1. Official Verification Report Card */}
      <div className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-950/5 overflow-hidden">
        {/* Success Header Banner */}
        <div className="p-6 bg-emerald-50/80 border-b border-emerald-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md mb-0.5">
                ✓ VERIFIED
              </div>
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">Certificate Successfully Verified</h2>
            </div>
          </div>
          <VerificationBadge status={cert.status} size="md" />
        </div>

        {/* Report Content Grid */}
        <div className="p-6 sm:p-8 grid md:grid-cols-5 gap-8 items-center">
          {/* Student Profile Card (Left Column) */}
          <div className="md:col-span-2 flex flex-col items-center justify-center p-5 border border-slate-200/80 bg-slate-50/60 rounded-2xl relative">
            <div className="w-20 h-20 rounded-full border-4 border-amber-300 p-1 shadow-inner relative flex items-center justify-center bg-white overflow-hidden mb-2">
              <User className="w-10 h-10 text-slate-400" />
            </div>
            <div className="absolute top-3 right-3">
              <CertificateSeal />
            </div>
            <p className="text-slate-900 font-extrabold text-sm text-center leading-tight mt-1">{studentName}</p>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-0.5">Certified Student</p>
          </div>

          {/* Details Fields (Right Columns) */}
          <div className="md:col-span-3 space-y-3.5">
            {[
              { icon: User, label: "Student Name", value: studentName },
              { icon: BookOpen, label: "Course Program", value: courseName },
              { icon: Calendar, label: "Course Duration", value: duration },
              { icon: Award, label: "Final Grade", value: grade },
              { icon: Calendar, label: "Completion Date", value: new Date(completionDate).toLocaleDateString("en-IN") },
              { icon: FileText, label: "Certificate Number", value: certificateNumber, mono: true },
            ].map((field, idx) => (
              <div key={idx} className="flex gap-3 border-b border-slate-100 pb-2.5 last:border-0 last:pb-0 text-xs">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <field.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{field.label}</p>
                  <p className={`font-semibold text-slate-800 text-sm mt-0.5 ${field.mono ? "font-mono text-blue-700 font-bold" : ""}`}>
                    {field.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button Bar */}
        {cert.status === "Valid" && (
          <div className="p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3 justify-center md:justify-end">
            <DownloadButton certificateNumber={certificateNumber} studentName={studentName} />
            <PrintButton certificateNumber={certificateNumber} studentName={studentName} />
          </div>
        )}
      </div>

      {/* 2. Full Live A4 Landscape Certificate Display */}
      <div className="space-y-4 pt-2">
        <h3 className="font-extrabold text-slate-900 text-sm px-1 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Certificate Preview (A4 Landscape)</span>
        </h3>
        
        <CertificatePreview
          certificateNumber={certificateNumber}
          studentName={studentName}
          courseName={courseName}
          duration={duration}
          grade={grade}
          completionDate={completionDate}
          issueDate={issueDate}
          fatherName={fatherName}
        />
      </div>
    </div>
  );
}
