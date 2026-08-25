"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  User, BookOpen, Calendar, Award, ShieldAlert, CheckCircle2, FileText, 
  ArrowLeft, RefreshCw, AlertTriangle, Clock, HelpCircle, MessageCircle, Mail,
  ShieldCheck, Lock, Zap, QrCode
} from "lucide-react";
import CertificatePreview from "./certificates/CertificatePreview";
import DownloadButton from "./certificates/DownloadButton";
import PrintButton from "./certificates/PrintButton";
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
      <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl mx-auto">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-700 hover:text-blue-600 transition-colors bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>Verify Another Certificate</span>
          </Link>
        </div>

        {/* Not Found Status Card */}
        <div className="bg-white border border-rose-200/90 rounded-3xl p-6 sm:p-10 text-center shadow-xl shadow-rose-950/5">
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

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              href="/verify"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98 min-h-[44px]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98 min-h-[44px]"
            >
              <Mail className="w-4 h-4" />
              <span>Contact RCI</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98 min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Help</span>
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
      <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl mx-auto">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-700 hover:text-blue-600 transition-colors bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>Verify Another Certificate</span>
          </Link>
        </div>

        {/* Revoked Status Card */}
        <div className="bg-white border border-amber-200/90 rounded-3xl p-6 sm:p-10 text-center shadow-xl shadow-amber-950/5">
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

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              href="/verify"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98 min-h-[44px]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Verify Another Certificate</span>
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98 min-h-[44px]"
            >
              <Mail className="w-4 h-4" />
              <span>Contact RCI</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98 min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Help</span>
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
      <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl mx-auto">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-700 hover:text-blue-600 transition-colors bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>Verify Another Certificate</span>
          </Link>
        </div>

        {/* Expired Status Card */}
        <div className="bg-white border border-amber-200/90 rounded-3xl p-6 sm:p-10 text-center shadow-xl shadow-amber-950/5">
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

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              href="/verify"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98 min-h-[44px]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Verify Another Certificate</span>
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98 min-h-[44px]"
            >
              <Mail className="w-4 h-4" />
              <span>Contact RCI</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98 min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Help</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 4. VALID VERIFIED STATE
  // ----------------------------------------------------
  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* 0. Top Navigation Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/verify"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-700 hover:text-blue-600 transition-colors bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Verify Another Certificate</span>
        </Link>
      </div>

      {/* 1. Main Verification Split Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-950/5 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Side — Verified Panel (45% -> lg:col-span-5) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-7 sm:p-9 text-white relative overflow-hidden flex flex-col justify-between">
            {/* Subtle Gold Curve & Radial Glow Overlay */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none stroke-blue-300/30" viewBox="0 0 400 400" fill="none">
              <path d="M-50 100 Q 200 50 450 200 T 950 300" strokeWidth="1.5" strokeDasharray="6 6" />
              <circle cx="200" cy="150" r="120" strokeWidth="0.75" />
            </svg>

            <div className="relative z-10 space-y-6">
              {/* Top Verified Badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>✓ VERIFIED</span>
              </div>

              {/* Main Heading */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-black font-display leading-tight text-white">
                  Certificate Successfully <span className="text-amber-400">Verified</span>
                </h2>
                <p className="text-blue-100/80 text-xs sm:text-sm mt-3 leading-relaxed">
                  This certificate is authentic and issued by Rohit Computer Institute (RCI).
                </p>
              </div>
            </div>

            {/* Institutional Emblem / Seal Area */}
            <div className="relative z-10 my-8 flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="w-14 h-14 relative shrink-0 bg-white rounded-xl p-1.5 shadow-md flex items-center justify-center border border-amber-300/40">
                <Image
                  src="/logo.png"
                  alt="Rohit Computer Institute Official Seal"
                  width={56}
                  height={56}
                  className="object-contain w-full h-full"
                />
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-wider font-display">ROHIT COMPUTER INSTITUTE</p>
                <p className="text-[10.5px] font-bold text-amber-300/90 tracking-widest uppercase mt-0.5">OFFICIAL SEAL OF AUTHENTICITY</p>
                <p className="text-[10px] text-blue-200/70 mt-0.5 font-mono">{certificateNumber}</p>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-[11px] text-blue-200/70 border-t border-white/10 pt-4">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Real-time Database Record
              </span>
              <span className="font-mono">{new Date().getFullYear()} © RCI</span>
            </div>
          </div>

          {/* Right Side — Certificate Information (55% -> lg:col-span-7) */}
          <div className="lg:col-span-7 p-7 sm:p-9 flex flex-col justify-between space-y-6">
            <div>
              <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest">OFFICIAL RECORD</p>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-display mt-0.5">
                    Certificate Details
                  </h3>
                </div>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Active &amp; Valid
                </span>
              </div>

              {/* 2-Column Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Student Name */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">STUDENT NAME</p>
                    <p className="text-sm font-extrabold text-slate-950 mt-0.5">{studentName}</p>
                  </div>
                </div>

                {/* Course Program */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">COURSE PROGRAM</p>
                    <p className="text-sm font-extrabold text-slate-950 mt-0.5">{courseName}</p>
                  </div>
                </div>

                {/* Course Duration */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">COURSE DURATION</p>
                    <p className="text-sm font-extrabold text-slate-950 mt-0.5">{duration}</p>
                  </div>
                </div>

                {/* Final Grade */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">FINAL GRADE</p>
                    <p className="text-sm font-extrabold text-slate-950 mt-0.5 flex items-center gap-1.5">
                      <span>{grade}</span>
                      <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-black">Passed</span>
                    </p>
                  </div>
                </div>

                {/* Completion Date */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">COMPLETION DATE</p>
                    <p className="text-sm font-extrabold text-slate-950 mt-0.5">
                      {completionDate ? new Date(completionDate).toLocaleDateString("en-IN") : "—"}
                    </p>
                  </div>
                </div>

                {/* Certificate Number */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/70">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-blue-700">CERTIFICATE NUMBER</p>
                    <p className="text-sm font-mono font-black text-blue-900 mt-0.5 tracking-tight">{certificateNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Area Bar */}
            {cert.status === "Valid" && (
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                <DownloadButton
                  certificateNumber={certificateNumber}
                  studentName={studentName}
                  className="w-full sm:flex-1 min-h-[48px] text-sm"
                />
                <PrintButton
                  certificateNumber={certificateNumber}
                  studentName={studentName}
                  className="w-full sm:flex-1 min-h-[48px] text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Official Certificate Preview */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-black text-slate-950 text-xl sm:text-2xl font-display flex items-center gap-2.5">
              <Award className="w-6 h-6 text-amber-500" />
              <span>Official Certificate Preview</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Official digital replica of the issued certificate document.
            </p>
          </div>
          <span className="text-xs font-black text-slate-700 uppercase tracking-widest bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs">
            A4 LANDSCAPE
          </span>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white p-3 sm:p-5 shadow-xl shadow-slate-900/5 overflow-x-auto">
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

      {/* 3. Institutional Trust Indicators Section */}
      <div className="border-t border-slate-200/80 pt-10">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            INSTITUTIONAL GUARANTEE
          </span>
          <h4 className="text-xl sm:text-2xl font-black text-slate-950 font-display">
            Trust &amp; Authenticity Indicators
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: ShieldCheck,
              color: "emerald",
              title: "Authenticity Verified",
              desc: "Certificate details match the official RCI verification record.",
            },
            {
              icon: Lock,
              color: "blue",
              title: "Secure Verification",
              desc: "Certificate authenticity is checked against the official RCI record.",
            },
            {
              icon: Zap,
              color: "indigo",
              title: "Instant Verification",
              desc: "Certificate details are verified using the certificate ID.",
            },
            {
              icon: QrCode,
              color: "purple",
              title: "QR Verification",
              desc: "Scan the QR code to verify this certificate online.",
            },
          ].map((trust, idx) => (
            <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                trust.color === "emerald" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                trust.color === "blue" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                trust.color === "indigo" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                "bg-purple-50 text-purple-600 border border-purple-100"
              }`}>
                <trust.icon className="w-5 h-5" />
              </div>
              <h5 className="font-extrabold text-slate-950 text-sm">{trust.title}</h5>
              <p className="text-xs text-slate-500 leading-relaxed">{trust.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
