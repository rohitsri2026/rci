"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  User, BookOpen, Calendar, Award, ShieldAlert, CheckCircle2, FileText, 
  ArrowLeft, RefreshCw, AlertTriangle, Clock, HelpCircle, MessageCircle, Mail,
  ShieldCheck, Lock, Zap, QrCode
} from "lucide-react";
import CertificateTemplate from "./certificates/CertificateTemplate";
import DownloadButton from "./certificates/DownloadButton";
import PrintButton from "./certificates/PrintButton";
import { RCIConfig } from "@/lib/config";
import StudentAvatar from "./student/StudentAvatar";

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
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-700 hover:text-blue-600 transition-colors bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Verify Another Certificate</span>
          </Link>
        </div>

        {/* Not Found Status Card */}
        <div className="bg-white border border-rose-200/90 rounded-3xl p-5 sm:p-10 text-center shadow-xl shadow-rose-950/5">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-2xs">
            <ShieldAlert className="w-8 h-8 text-rose-600" />
          </div>

          <span className="inline-block text-[11px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full mb-2">
            RECORD NOT FOUND
          </span>

          <h1 className="font-black text-2xl sm:text-3xl text-slate-900 font-display">
            Certificate Not Found
          </h1>

          {/* Compact Searched ID Metadata Block */}
          <div className="my-4 p-3 bg-slate-50 border border-slate-200/80 rounded-xl max-w-xs mx-auto text-center">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Searched Certificate ID</p>
            <p className="font-mono text-base font-bold text-rose-600 mt-0.5 break-all">{searchId || "—"}</p>
          </div>

          <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            The certificate number could not be verified against the official RCI records. Please verify that the number matches exactly as printed on your certificate.
          </p>

          {/* Quick Check Tips Box */}
          <div className="mt-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left max-w-md mx-auto text-xs space-y-2 text-slate-600">
            <p className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Quick Check Tips:</span>
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <RefreshCw className="w-4 h-4 shrink-0" />
              <span>Try Again</span>
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#07152F] hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span>Contact RCI</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00A86B] hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>WhatsApp Help</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Safely normalize student relation data (handles object, array, or null)
  const studentData = Array.isArray(cert?.students)
    ? cert.students[0]
    : cert?.students;

  const certificateNumber = cert.certificate_number || cert.certificate_id || searchId || "—";
  const studentName = cert.student_name || studentData?.full_name || "—";
  const courseName = cert.course_name || cert.courses?.course_name || "—";
  const duration = cert.courses?.duration || "6 Months";
  const grade = cert.grade || "A+";
  const completionDate = cert.completion_date || cert.issue_date;
  const issueDate = cert.issue_date;
  const fatherName = studentData?.address || undefined;
  const expiryDate = cert.expiration_date || cert.expiry_date;
  const photoUrl = studentData?.photo_url || null;

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
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-700 hover:text-blue-600 transition-colors bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Verify Another Certificate</span>
          </Link>
        </div>

        {/* Revoked Status Card */}
        <div className="bg-white border border-amber-200/90 rounded-3xl p-5 sm:p-10 text-center shadow-xl shadow-amber-950/5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-2xs">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>

          <span className="inline-block text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full mb-2">
            STATUS: REVOKED
          </span>

          <h1 className="font-black text-2xl sm:text-3xl text-slate-900 font-display">
            Certificate Revoked
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm mt-3 max-w-md mx-auto leading-relaxed">
            This certificate is currently not valid. It has been officially marked as <span className="font-extrabold text-amber-800">Revoked</span> in the institute registry.
          </p>

          <div className="mt-6 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-left max-w-md mx-auto text-xs space-y-2">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5 gap-2">
              <span className="text-slate-400 font-medium shrink-0">Certificate No:</span>
              <span className="font-mono font-bold text-slate-900 break-all text-right min-w-0">{certificateNumber}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5 gap-2">
              <span className="text-slate-400 font-medium shrink-0">Student Name:</span>
              <span className="font-bold text-slate-900 text-right min-w-0 break-words">{studentName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5 gap-2">
              <span className="text-slate-400 font-medium shrink-0">Course Program:</span>
              <span className="font-bold text-slate-900 text-right min-w-0 break-words">{courseName}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-400 font-medium shrink-0">Current Status:</span>
              <span className="font-extrabold text-amber-700 uppercase text-right shrink-0">{cert.status}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              href="/verify"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <RefreshCw className="w-4 h-4 shrink-0" />
              <span>Verify Another Certificate</span>
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#07152F] hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span>Contact RCI</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00A86B] hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
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
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-700 hover:text-blue-600 transition-colors bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Verify Another Certificate</span>
          </Link>
        </div>

        {/* Expired Status Card */}
        <div className="bg-white border border-amber-200/90 rounded-3xl p-5 sm:p-10 text-center shadow-xl shadow-amber-950/5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-2xs">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>

          <span className="inline-block text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full mb-2">
            STATUS: EXPIRED
          </span>

          <h1 className="font-black text-2xl sm:text-3xl text-slate-900 font-display">
            Certificate Expired
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm mt-3 max-w-md mx-auto leading-relaxed">
            This certificate has expired based on official records and is currently no longer valid.
          </p>

          <div className="mt-6 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-left max-w-md mx-auto text-xs space-y-2">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5 gap-2">
              <span className="text-slate-400 font-medium shrink-0">Certificate No:</span>
              <span className="font-mono font-bold text-slate-900 break-all text-right min-w-0">{certificateNumber}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5 gap-2">
              <span className="text-slate-400 font-medium shrink-0">Student Name:</span>
              <span className="font-bold text-slate-900 text-right min-w-0 break-words">{studentName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5 gap-2">
              <span className="text-slate-400 font-medium shrink-0">Course Program:</span>
              <span className="font-bold text-slate-900 text-right min-w-0 break-words">{courseName}</span>
            </div>
            {expiryDate && (
              <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5 gap-2">
                <span className="text-slate-400 font-medium shrink-0">Expiration Date:</span>
                <span className="font-bold text-amber-700 text-right shrink-0">{new Date(expiryDate).toLocaleDateString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-400 font-medium shrink-0">Current Status:</span>
              <span className="font-extrabold text-amber-700 uppercase text-right shrink-0">{cert.status}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              href="/verify"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <RefreshCw className="w-4 h-4 shrink-0" />
              <span>Verify Another Certificate</span>
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#07152F] hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span>Contact RCI</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00A86B] hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
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
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-300">
      {/* Off-screen hidden print area template container to preserve PDF & Print functionality */}
      <div className="sr-only fixed -left-[9999px] -top-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
        <CertificateTemplate
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

      {/* 0. Top Navigation Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/verify"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-700 hover:text-blue-600 transition-colors bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Verify Another Certificate</span>
        </Link>
      </div>

      {/* 1. Main Verification Split Card */}
      <div className="max-w-[1080px] mx-auto bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Side — Verified Panel (Desktop 42-45% -> lg:col-span-5) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#07152F] via-[#0b1d3d] to-[#040d1e] p-5 sm:p-7 lg:p-9 text-white relative overflow-hidden flex flex-col justify-between items-center lg:items-start text-center lg:text-left">
            {/* Subtle Gold Decorative Curves & Radial Glow Overlay */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none stroke-blue-300/30" viewBox="0 0 400 400" fill="none">
              <path d="M-50 100 Q 200 50 450 200 T 950 300" strokeWidth="1.5" strokeDasharray="6 6" />
              <circle cx="200" cy="150" r="120" strokeWidth="0.75" />
            </svg>

            <div className="relative z-10 space-y-3.5 sm:space-y-5 w-full flex flex-col items-center lg:items-start">
              {/* Top Green Verified Badge */}
              <div className="inline-flex items-center gap-2 bg-[#00A86B]/20 text-[#2ee49e] border border-[#00A86B]/30 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-[#00A86B] shrink-0" />
                <span>✓ VERIFIED</span>
              </div>

              {/* Main Heading */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black font-display leading-tight text-white">
                  Certificate Successfully <span className="text-[#D4A72C]">Verified</span>
                </h1>
                <p className="text-blue-100/80 text-[13px] sm:text-sm mt-2 max-w-sm leading-relaxed">
                  This certificate is authentic and issued by Rohit Computer Institute (RCI).
                </p>
              </div>
            </div>

            {/* Institutional Seal / Emblem Area */}
            <div className="relative z-10 my-5 lg:my-7 w-full max-w-sm bg-white/5 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              <div className="w-[115px] h-[55px] relative shrink-0 bg-white rounded-xl p-2 shadow-md flex items-center justify-center border border-amber-300/40">
                <Image
                  src="/logo.png"
                  alt="Rohit Computer Institute Official Seal"
                  width={115}
                  height={55}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] sm:text-xs font-black text-white uppercase tracking-wider font-display truncate">ROHIT COMPUTER INSTITUTE</p>
                <p className="text-[9.5px] sm:text-[10px] font-bold text-amber-300/90 tracking-widest uppercase mt-0.5">OFFICIAL SEAL OF AUTHENTICITY</p>
                <p className="text-[10px] sm:text-[10.5px] text-blue-200/70 mt-0.5 font-mono truncate">{certificateNumber}</p>
              </div>
            </div>

            <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-2 text-[11px] text-blue-200/70 border-t border-white/10 pt-3.5 mt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00A86B] shrink-0" />
                <span>Real-time Database Record</span>
              </span>
              <span className="font-mono">{new Date().getFullYear()} © RCI</span>
            </div>
          </div>

          {/* Right Side — Certificate Information (Desktop 55-58% -> lg:col-span-7) */}
          <div className="lg:col-span-7 p-5 sm:p-7 lg:p-9 flex flex-col justify-between space-y-6 bg-white">
            <div>
              <div className="border-b border-slate-100 pb-4 mb-5 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-[11px] font-extrabold text-[#155EEF] uppercase tracking-widest">OFFICIAL RECORD</p>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-display mt-0.5">
                    Certificate Details
                  </h2>
                </div>
                <span className="text-xs font-extrabold text-[#00A86B] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shrink-0">
                  Active &amp; Valid
                </span>
              </div>

              {/* Student Identity Card Section */}
              <div className="flex items-center gap-4 bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 mb-5 shadow-2xs">
                <StudentAvatar
                  photoUrl={photoUrl}
                  studentName={studentName}
                  size="2xl"
                  border={true}
                  className="ring-4 ring-white shadow-md shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] font-extrabold uppercase tracking-widest text-[#155EEF]">
                    VERIFIED STUDENT IDENTITY
                  </p>
                  <h3 className="text-lg sm:text-xl font-black text-slate-950 font-display mt-0.5 truncate">
                    {studentName}
                  </h3>
                  <p className="text-xs font-bold text-slate-600 mt-0.5 truncate">
                    {courseName}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="font-mono text-[11px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">
                      {certificateNumber}
                    </span>
                    <span className="text-[10.5px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                      Status: {cert.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Certificate Info List (Mobile: Single Column List; Desktop: 2-Column Grid) */}
              <div className="space-y-2.5 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 lg:gap-5">
                
                {/* Student Name */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-200/70">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#155EEF] border border-blue-100 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">STUDENT NAME</p>
                    <p className="text-sm font-extrabold text-slate-950 mt-0.5 leading-snug">{studentName}</p>
                  </div>
                </div>

                {/* Course Program */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-200/70">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#155EEF] border border-blue-100 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <BookOpen className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">COURSE PROGRAM</p>
                    <p className="text-sm font-extrabold text-slate-950 mt-0.5 leading-snug">{courseName}</p>
                  </div>
                </div>

                {/* Course Duration */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-200/70">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#155EEF] border border-blue-100 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">COURSE DURATION</p>
                    <p className="text-sm font-extrabold text-slate-950 mt-0.5 leading-snug">{duration}</p>
                  </div>
                </div>

                {/* Final Grade */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-200/70">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#155EEF] border border-blue-100 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">FINAL GRADE</p>
                    <div className="text-sm font-extrabold text-slate-950 mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>{grade}</span>
                      <span className="text-[10px] text-[#00A86B] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-extrabold uppercase">Passed</span>
                    </div>
                  </div>
                </div>

                {/* Completion Date */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-200/70">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#155EEF] border border-blue-100 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">COMPLETION DATE</p>
                    <p className="text-sm font-extrabold text-slate-950 mt-0.5 leading-snug">
                      {completionDate ? new Date(completionDate).toLocaleDateString("en-IN") : "—"}
                    </p>
                  </div>
                </div>

                {/* Certificate Number */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl sm:rounded-2xl bg-blue-50/60 border border-blue-200/70">
                  <div className="w-9 h-9 rounded-xl bg-[#155EEF] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#155EEF]">CERTIFICATE NUMBER</p>
                    <p className="text-sm font-mono font-black text-blue-950 mt-0.5 tracking-tight break-all sm:break-normal">{certificateNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons (Desktop: side-by-side, Mobile: stacked vertically) */}
            {cert.status === "Valid" && (
              <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                <DownloadButton
                  certificateNumber={certificateNumber}
                  studentName={studentName}
                  className="w-full sm:flex-1 min-h-[48px] text-sm font-extrabold bg-[#155EEF] hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                />
                <PrintButton
                  certificateNumber={certificateNumber}
                  studentName={studentName}
                  className="w-full sm:flex-1 min-h-[48px] text-sm font-extrabold bg-[#07152F] hover:bg-slate-800 text-white rounded-xl shadow-md shadow-slate-900/10 active:scale-98 transition-all flex items-center justify-center gap-2"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Institutional Trust Indicators Section */}
      <div className="pt-6 sm:pt-8">
        <div className="text-center max-w-xl mx-auto mb-5 sm:mb-8">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#155EEF] bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#155EEF]" />
            INSTITUTIONAL GUARANTEE
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 font-display tracking-tight">
            Trust &amp; Authenticity Indicators
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
            We ensure every certificate issued is genuine, verified and secure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4.5">
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
            <div 
              key={idx} 
              className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-row sm:flex-col items-center sm:items-start gap-3.5 sm:gap-3"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                trust.color === "emerald" ? "bg-emerald-50 text-[#00A86B] border border-emerald-100" :
                trust.color === "blue" ? "bg-blue-50 text-[#155EEF] border border-blue-100" :
                trust.color === "indigo" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                "bg-purple-50 text-purple-600 border border-purple-100"
              }`}>
                <trust.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-extrabold text-slate-950 text-sm leading-snug">{trust.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{trust.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
