"use client";

import React, { useState } from "react";
import { Search, Award, ShieldAlert, CheckCircle2, User, BookOpen, Calendar, HelpCircle, Loader2 } from "lucide-react";
import VerificationBadge from "@/components/certificates/VerificationBadge";
import CertificateSeal from "@/components/certificates/CertificateSeal";

export default function CertificateVerificationPage() {
  const [certId, setCertId] = useState("");
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    setLoading(true);
    setCertificate(null);
    setSearched(false);

    try {
      const res = await fetch("/api/verify-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificate_id: certId.toUpperCase() }),
      });
      const data = await res.json();
      
      if (res.ok && data.valid) {
        // Log the verification event
        await fetch("/api/certificates/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "Verified",
            certificate_number: data.certificate.certificate_number || data.certificate.certificate_id,
            details: `Certificate verified in Admin Panel: ${certId}`,
          }),
        });

        setCertificate(data.certificate);
      } else {
        setCertificate(null);
      }
    } catch (err) {
      console.error(err);
      setCertificate(null);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const statusColors: Record<string, string> = {
    Valid: "bg-emerald-50 text-emerald-800 border-emerald-200/50",
    Revoked: "bg-rose-50 text-rose-850 border-rose-200/50",
    Expired: "bg-slate-100 text-slate-800 border-slate-200/50",
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display">Credential Verification</h1>
        <p className="text-slate-500 mt-1">Verify certificate status and authenticity from our secure database registry.</p>
      </div>

      {/* Verification search card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <form onSubmit={handleVerify} className="space-y-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Enter Certificate ID / Number
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. RCI-2026-000001"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-250 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold font-mono text-blue-700 uppercase tracking-wide text-sm placeholder:font-sans placeholder:normal-case placeholder:tracking-normal"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-2 text-sm shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Status</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {searched && (
        <div className="animate-in slide-in-from-bottom duration-300">
          {certificate ? (
            /* Certificate details card */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
              {/* Header Status Banner */}
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Verification Report</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Certificate Number:{" "}
                    <span className="font-bold font-mono text-blue-600">{certificate.certificate_number || certificate.certificate_id}</span>
                  </p>
                </div>
                <VerificationBadge status={certificate.status} />
              </div>

              {/* Certificate Details */}
              <div className="p-6 grid md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  {[
                    { icon: User, label: "Student Name", value: certificate.student_name },
                    { icon: BookOpen, label: "Program Completed", value: certificate.course_name },
                    { icon: Calendar, label: "Date of Issue", value: new Date(certificate.issue_date).toLocaleDateString("en-IN") },
                    { icon: Award, label: "Secured Grade", value: certificate.grade || "Ex" },
                  ].map((field, idx) => (
                    <div key={idx} className="flex gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <field.icon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{field.label}</p>
                        <p className="font-semibold text-slate-800 text-sm">{field.value || "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Seal & Metadata display */}
                <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 flex flex-col items-center justify-center gap-3">
                  <CertificateSeal />
                  <div className="text-center">
                    <p className="font-bold text-xs text-slate-700">Rohit Computer Institute</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">ISO 9001:2015 Training Center</p>
                  </div>
                  <div className={`mt-2 px-3 py-1 border rounded-full text-[10px] font-bold ${statusColors[certificate.status] || "bg-slate-100"}`}>
                    Status: {certificate.status}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Not Found Alert */
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-600">
              <ShieldAlert className="w-12 h-12 mx-auto mb-2 text-rose-500" />
              <h3 className="font-bold text-lg">Certificate Not Found</h3>
              <p className="text-sm mt-1 text-rose-500/80 font-medium">
                The credential ID you entered does not exist in our secure registry. Please check the spelling or contact system administrator.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
