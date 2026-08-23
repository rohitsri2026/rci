"use client";

import React, { useRef } from "react";
import { User, BookOpen, Calendar, Award, ShieldAlert, CheckCircle2, FileText, ChevronRight } from "lucide-react";
import CertificatePreview from "./certificates/CertificatePreview";
import VerificationBadge from "./certificates/VerificationBadge";
import DownloadButton from "./certificates/DownloadButton";
import PrintButton from "./certificates/PrintButton";
import CertificateSeal from "./certificates/CertificateSeal";

export default function CertificateCard({ cert }: { cert: any }) {
  if (!cert) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center text-rose-600 animate-in fade-in duration-300">
        <ShieldAlert className="w-16 h-16 mx-auto mb-3 text-rose-500" />
        <h3 className="font-extrabold text-xl text-slate-900">Certificate Not Found</h3>
        <p className="text-sm mt-2 text-rose-650 max-w-md mx-auto leading-relaxed">
          The unique Certificate ID you requested does not match any certificate issued by Rohit Computer Institute. Please double-check the ID or scan the QR code again.
        </p>
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
  const fatherName = cert.students?.address || undefined; // using address as placeholder or optional

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Official Verification Report Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg">Official Verification Report</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure Registry Verification. Checked on: <span className="font-semibold text-slate-600">{new Date().toLocaleDateString("en-IN")}</span>
            </p>
          </div>
          <VerificationBadge status={cert.status} size="md" />
        </div>

        {/* Report Content */}
        <div className="p-6 grid md:grid-cols-5 gap-8 items-center">
          {/* Avatar Ring (Left Column) */}
          <div className="md:col-span-2 flex flex-col items-center justify-center p-4 border border-slate-100 bg-slate-50/50 rounded-2xl relative">
            <div className="w-24 h-24 rounded-full border-4 border-[#c5a880] p-1 shadow-inner relative flex items-center justify-center bg-white overflow-hidden">
              {/* Profile icon acting as photo placeholder */}
              <User className="w-12 h-12 text-slate-350" />
            </div>
            <div className="absolute top-2 right-2">
              <CertificateSeal />
            </div>
            <p className="text-slate-800 font-extrabold text-sm mt-3 text-center leading-none">{studentName}</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-wider">Certified Student</p>
          </div>

          {/* Details fields (Right Columns) */}
          <div className="md:col-span-3 space-y-3.5">
            {[
              { icon: User, label: "Student Name", value: studentName },
              { icon: BookOpen, label: "Course Syllabus", value: courseName },
              { icon: Calendar, label: "Duration", value: duration },
              { icon: Award, label: "Final Grade", value: grade },
              { icon: Calendar, label: "Completion Date", value: new Date(completionDate).toLocaleDateString("en-IN") },
              { icon: FileText, label: "Certificate Number", value: certificateNumber, mono: true },
            ].map((field, idx) => (
              <div key={idx} className="flex gap-3 border-b border-slate-50 pb-2.5 last:border-0 last:pb-0 text-xs">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <field.icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{field.label}</p>
                  <p className={`font-semibold text-slate-800 text-sm mt-0.5 ${field.mono ? "font-mono text-blue-700 font-bold" : ""}`}>
                    {field.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action button bar */}
        {cert.status === "Valid" && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-4 justify-center md:justify-end">
            <DownloadButton certificateNumber={certificateNumber} studentName={studentName} />
            <PrintButton certificateNumber={certificateNumber} studentName={studentName} />
          </div>
        )}
      </div>

      {/* 2. Full Live A4 landscape certificate display */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm px-2 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#c5a880]" />
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
