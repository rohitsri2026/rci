"use client";

import React from "react";
import { 
  User, BookOpen, Calendar, Award, ShieldAlert, CheckCircle2, FileText, 
  ArrowLeft, RefreshCw, AlertTriangle, Clock, HelpCircle, MessageCircle, Mail
} from "lucide-react";
import Link from "next/link";
import CertificatePreview from "./certificates/CertificatePreview";
import DownloadButton from "./certificates/DownloadButton";
import PrintButton from "./certificates/PrintButton";
import CertificateSeal from "./certificates/CertificateSeal";
import { RCIConfig } from "@/lib/config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CertificateCard({ cert, searchId }: { cert?: any; searchId?: string }) {
  const whatsappUrl = RCIConfig.getWhatsAppUrl(
    `Hello RCI, I need assistance verifying certificate ${searchId || cert?.certificate_number || ""}`
  );

  // ----------------------------------------------------
  // 1. NOT FOUND STATE
  // ----------------------------------------------------
  if (!cert) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/verify"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-600 hover:text-blue-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Verify Another Certificate
          </Link>
        </div>

        {/* Not Found Status Card */}
        <div className="bg-white border border-rose-200/90 rounded-3xl p-6 sm:p-10 text-center shadow-xl shadow-rose-950/5 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-2xs">
            <ShieldAlert className="w-8 h-8 text-rose-600" />
          </div>

          <span className="inline-block text-[11px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full mb-2">
            RECORD NOT FOUND
          </span>

          <h3 className="font-black text-2xl sm:text-3xl text-slate-900 font-display">
            Certificate Not Found
          </h3>

          {/* Compact Searched ID Metadata Block */}
          <div className="my-4 p-3 bg-slate-50 border border-slate-200/80 rounded-xl max-w-xs mx-auto text-center">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Searched Certificate ID</p>
            <p className="font-mono text-base font-bold text-rose-600 mt-0.5">{searchId || "—"}</p>
          </div>

          <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            The certificate number could not be verified against the official RCI records. Please verify that the number matches exactly as printed on your certificate.
          </p>

          {/* Quick Check Tips Box */}
          <div className="mt-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left max-w-md mx-auto text-xs space-y-2 text-slate-600">
            <p className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              Quick Check Tips:
            </p>
            <ul className="space-y-1 list-disc pl-4 text-[11.5px] leading-snug">
              <li>Check spelling and hyphen format (e.g. <span className="font-mono font-bold">RCI-2026-000001</span>)</li>
              <li>Scan the QR code printed on the physical certificate directly</li>
              <li>Ensure the certificate was issued by Rohit Computer Institute</li>
            </ul>
          </div>

          {/* Action CTAs (Primary Blue CTA + Secondary CTAs) */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              href="/verify"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98"
            >
              <Mail className="w-4 h-4" />
              Contact RCI
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Help
            </a>
          </div>
        </div>
      </div>
    );
  }

  const certificateNumber = cert.certificate_number || cert.certificate_id || searchId || "—";
  const studentName = cert.student_name || cert.students?.full_name || "—";
  const courseName = cert.course_name || cert.courses?.course_name || "—";
  const duration = cert.courses?.duration || "6 Months";
  const grade = cert.grade || "A+";
  const completionDate = cert.completion_date || cert.issue_date;
  const issueDate = cert.issue_date;
  const fatherName = cert.students?.address || undefined;
  const expiryDate = cert.expiration_date || cert.expiry_date;

  // ----------------------------------------------------
  // 2. REVOKED STATE
  // ----------------------------------------------------
  if (cert.status === "Revoked") {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/verify"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-600 hover:text-blue-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Verify Another Certificate
          </Link>
        </div>

        {/* Revoked Status Card */}
        <div className="bg-white border border-amber-200/90 rounded-3xl p-6 sm:p-10 text-center shadow-xl shadow-amber-950/5 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-2xs">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>

          <span className="inline-block text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full mb-2">
            STATUS: REVOKED
          </span>

          <h3 className="font-black text-2xl sm:text-3xl text-slate-900 font-display">
            Certificate Revoked
          </h3>

          <p className="text-slate-600 text-xs sm:text-sm mt-3 max-w-md mx-auto leading-relaxed">
            This certificate is currently not valid. It has been officially marked as <span className="font-extrabold text-amber-800">Revoked</span> in the institute registry.
          </p>

          <div className="mt-6 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-left max-w-md mx-auto text-xs space-y-2">
            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-400 font-medium">Certificate No:</span>
              <span className="font-mono font-bold text-slate-900">{certificateNumber}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-400 font-medium">Student Name:</span>
              <span className="font-bold text-slate-900">{studentName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-400 font-medium">Course Program:</span>
              <span className="font-bold text-slate-900">{courseName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Current Status:</span>
              <span className="font-extrabold text-amber-700 uppercase">{cert.status}</span>
            </div>
          </div>

          {/* Action CTAs: Primary Blue "Verify Another Certificate" + Secondary CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              href="/verify"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98"
            >
              <RefreshCw className="w-4 h-4" />
              Verify Another Certificate
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98"
            >
              <Mail className="w-4 h-4" />
              Contact RCI
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Help
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 3. EXPIRED STATE
  // ----------------------------------------------------
  if (cert.status === "Expired") {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/verify"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-600 hover:text-blue-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Verify Another Certificate
          </Link>
        </div>

        {/* Expired Status Card */}
        <div className="bg-white border border-amber-200/90 rounded-3xl p-6 sm:p-10 text-center shadow-xl shadow-amber-950/5 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-2xs">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>

          <span className="inline-block text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full mb-2">
            STATUS: EXPIRED
          </span>

          <h3 className="font-black text-2xl sm:text-3xl text-slate-900 font-display">
            Certificate Expired
          </h3>

          <p className="text-slate-600 text-xs sm:text-sm mt-3 max-w-md mx-auto leading-relaxed">
            This certificate has expired based on official records and is currently no longer valid.
          </p>

          <div className="mt-6 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-left max-w-md mx-auto text-xs space-y-2">
            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-400 font-medium">Certificate No:</span>
              <span className="font-mono font-bold text-slate-900">{certificateNumber}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-400 font-medium">Student Name:</span>
              <span className="font-bold text-slate-900">{studentName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-400 font-medium">Course Program:</span>
              <span className="font-bold text-slate-900">{courseName}</span>
            </div>
            {expiryDate && (
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-400 font-medium">Expiration Date:</span>
                <span className="font-bold text-amber-700">{new Date(expiryDate).toLocaleDateString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Current Status:</span>
              <span className="font-extrabold text-amber-700 uppercase">{cert.status}</span>
            </div>
          </div>

          {/* Action CTAs: Primary Blue "Verify Another Certificate" + Secondary CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              href="/verify"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98"
            >
              <RefreshCw className="w-4 h-4" />
              Verify Another Certificate
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98"
            >
              <Mail className="w-4 h-4" />
              Contact RCI
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Help
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 4. VALID STATE
  // ----------------------------------------------------
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Back Link */}
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
        <div className="p-5 sm:p-6 bg-emerald-50/80 border-b border-emerald-100 flex items-center justify-between">
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

        {/* Action Button Bar: Primary Download PDF, Secondary Print Certificate */}
        {cert.status === "Valid" && (
          <div className="p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3 justify-center md:justify-end">
            <DownloadButton certificateNumber={certificateNumber} studentName={studentName} />
            <PrintButton certificateNumber={certificateNumber} studentName={studentName} />
          </div>
        )}
      </div>

      {/* 2. Full Live A4 Landscape Certificate Display */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Official Certificate Preview</span>
          </h3>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
            A4 LANDSCAPE
          </span>
        </div>
        
        <div className="rounded-3xl border border-slate-200/90 bg-white p-2 shadow-lg shadow-slate-900/5">
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
    </div>
  );
}
