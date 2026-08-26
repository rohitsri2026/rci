"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, QrCode, Award, ExternalLink, ChevronRight, CheckCircle2 } from "lucide-react";

interface CertificateSummaryCardProps {
  certificates?: Array<{
    id: string;
    certificate_number: string;
    course_name?: string | null;
    grade?: string | null;
    issue_date?: string | null;
    status?: string | null;
  }>;
}

export default function CertificateSummaryCard({ certificates = [] }: CertificateSummaryCardProps) {
  const hasCertificates = certificates.length > 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-950 tracking-tight font-display">
              My Certificates
            </h2>
            <p className="text-xs text-slate-500 font-medium">Official institute credentials and QR verification</p>
          </div>
        </div>

        <Link
          href="/student/certificates"
          className="text-xs font-extrabold text-amber-600 hover:text-amber-800 flex items-center gap-1 min-h-[44px] px-2"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* CASE A: Certificates Exist */}
      {hasCertificates ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {certificates.map((cert) => {
            const formattedIssueDate = cert.issue_date
              ? new Date(cert.issue_date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "—";

            const isCertValid = cert.status?.toLowerCase() === "valid" || !cert.status;

            return (
              <div
                key={cert.id}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 inline-block">
                      {cert.certificate_number}
                    </span>
                    <h4 className="font-extrabold text-slate-950 text-sm mt-2 font-display">
                      {cert.course_name || "Computer Application Certificate"}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Issued: {formattedIssueDate}
                    </p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border shrink-0 ${
                      isCertValid
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {isCertValid ? "✓ VALID" : cert.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Grade: <strong className="text-slate-900 font-bold">{cert.grade || "A+"}</strong>
                  </span>

                  <a
                    href={`/verify/${cert.certificate_number}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-extrabold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200/60 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Verify Online</span>
                    <ExternalLink className="w-3 h-3 text-purple-500" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* CASE B: Empty State */
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mx-auto shadow-2xs">
            <Award className="w-6 h-6 text-amber-600" />
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-950 font-display">
              No certificate issued yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed mt-1">
              Complete your course successfully and fulfill your academic criteria to receive your official, QR-verifiable RCI certificate.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Course Status: ACTIVE
            </span>

            <Link
              href="/student/courses"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-extrabold transition-colors min-h-[44px]"
            >
              <span>View Course Syllabus</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
