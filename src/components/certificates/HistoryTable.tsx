"use client";

import React, { useState, useEffect } from "react";
import { Certificate, CourseInfo } from "@/types/certificate";
import { 
  Search, ArrowUpDown, ChevronLeft, ChevronRight, 
  Trash2, RefreshCw, AlertTriangle, ShieldAlert, X, Loader2, Download, Printer 
} from "lucide-react";
import CertificateTemplate from "./CertificateTemplate";

interface HistoryTableProps {
  initialCourses: CourseInfo[];
  userRole: string;
}

export default function HistoryTable({ initialCourses, userRole }: HistoryTableProps) {
  // State variables for query parameters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [courseId, setCourseId] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Data state
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Dialog / Modal state
  const [activePrintCert, setActivePrintCert] = useState<Certificate | null>(null);
  const [reissueCert, setReissueCert] = useState<Certificate | null>(null);
  const [reissueForm, setReissueForm] = useState({ reason: "", grade: "", completion_date: "" });
  const [errorMsg, setErrorMsg] = useState("");

  const handleDownloadSingle = async (cert: Certificate) => {
    setActivePrintCert(cert);
    // Wait for state update to mount template in DOM
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const originalElement = document.getElementById("rci-certificate-print-area");
      if (!originalElement) return;

      // Create a hidden iframe to isolate html2canvas from Tailwind v4's global oklch/lab colors
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.left = "-9999px";
      iframe.style.top = "-9999px";
      iframe.style.width = "1123px";
      iframe.style.height = "794px";
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error("Could not access iframe document");
      }

      // Populate template HTML inside the iframe's clean context
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Certificate Capture</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: transparent;
            }
          </style>
        </head>
        <body>
          ${originalElement.outerHTML}
        </body>
        </html>
      `;

      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      // Wait a short duration for fonts/assets to resolve inside the iframe's window
      await new Promise((resolve) => setTimeout(resolve, 400));

      const targetElement = iframeDoc.getElementById("rci-certificate-print-area");
      if (!targetElement) {
        throw new Error("Target element inside iframe not found");
      }
      
      const canvas = await html2canvas(targetElement, {
        scale: 3.125,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#fdfdfd",
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/png");

      // Clean up the iframe immediately after capture
      document.body.removeChild(iframe);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, 297, 210, undefined, "FAST");
      const studentName = cert.student_name || cert.students?.full_name || "Student";
      pdf.save(`${studentName.replace(/\s+/g, "_")}_${cert.certificate_number}.pdf`);
      
      // Log audit
      await fetch("/api/certificates/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "Downloaded",
          certificate_number: cert.certificate_number,
          details: `Certificate downloaded for student ${studentName}`,
        }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setActivePrintCert(null);
    }
  };

  const handlePrintSingle = async (cert: Certificate) => {
    setActivePrintCert(cert);
    // Wait for state update to mount template in DOM
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    try {
      // Log audit
      await fetch("/api/certificates/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "Printed",
          certificate_number: cert.certificate_number,
          details: `Certificate print initiated for student ${cert.student_name}`,
        }),
      });
      window.print();
    } catch (err) {
      console.error(err);
    } finally {
      setActivePrintCert(null);
    }
  };

  // Fetch certificates from client-side API
  const fetchCertificates = React.useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        status,
        course_id: courseId,
        page: page.toString(),
        limit: "10",
        sortBy,
        sortOrder,
      });
      const res = await fetch(`/api/certificates?${queryParams}`);
      const data = await res.json();
      if (res.ok) {
        setCertificates(data.certificates);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error("Error loading certificates:", err);
    } finally {
      setLoading(false);
    }
  }, [search, status, courseId, page, sortBy, sortOrder]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCertificates();
  }, [fetchCertificates]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const handleRevoke = async (certId: string, certNo: string) => {
    if (!confirm(`Revoke certificate ${certNo}? It will be shown as Revoked publicly.`)) return;
    setActionLoading(`revoke-${certId}`);
    try {
      const res = await fetch(`/api/certificates/${certId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Revoked" }),
      });
      if (res.ok) {
        fetchCertificates();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to revoke certificate");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (certId: string, certNo: string) => {
    if (!confirm(`Permanently DELETE certificate ${certNo}? This action is irreversible and writes a security audit log.`)) return;
    setActionLoading(`delete-${certId}`);
    try {
      const res = await fetch(`/api/certificates/${certId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchCertificates();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete certificate");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReissueOpen = (cert: Certificate) => {
    setReissueCert(cert);
    setReissueForm({
      reason: "",
      grade: cert.grade,
      completion_date: cert.completion_date,
    });
    setErrorMsg("");
  };

  const handleReissueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reissueCert) return;
    setActionLoading("reissue");
    setErrorMsg("");

    try {
      const res = await fetch(`/api/certificates/${reissueCert.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reissue",
          reason: reissueForm.reason,
          grade: reissueForm.grade,
          completion_date: reissueForm.completion_date,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setReissueCert(null);
        fetchCertificates();
        alert("Certificate reissued successfully! A new credential has been generated.");
      } else {
        setErrorMsg(data.error || "Failed to reissue certificate");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Status mapping colors
  const statusColors: Record<string, string> = {
    Valid: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
    Revoked: "bg-rose-50 text-rose-700 border-rose-200/50",
    Expired: "bg-slate-105 text-slate-600 border-slate-200/50",
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student, number, course..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-250 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-900"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Course filter */}
          <select
            value={courseId}
            onChange={(e) => { setCourseId(e.target.value); setPage(1); }}
            className="border border-slate-250 bg-slate-50 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Courses</option>
            {initialCourses.map((c) => (
              <option key={c.id} value={c.id}>{c.course_name}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="border border-slate-250 bg-slate-50 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Valid">Valid</option>
            <option value="Revoked">Revoked</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Database Listing Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-550 border-b border-slate-100 font-bold select-none">
                <th onClick={() => handleSort("certificate_number")} className="px-6 py-4 cursor-pointer hover:bg-slate-100/50">
                  <div className="flex items-center gap-1">
                    <span>Certificate No</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th onClick={() => handleSort("student_name")} className="px-6 py-4 cursor-pointer hover:bg-slate-100/50">
                  <div className="flex items-center gap-1">
                    <span>Student</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th onClick={() => handleSort("course_name")} className="px-6 py-4 cursor-pointer hover:bg-slate-100/50">
                  <div className="flex items-center gap-1">
                    <span>Course</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="px-6 py-4">Grade</th>
                <th onClick={() => handleSort("issue_date")} className="px-6 py-4 cursor-pointer hover:bg-slate-100/50">
                  <div className="flex items-center gap-1">
                    <span>Issue Date</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                // Skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-6"><div className="bg-slate-100 h-5 w-full rounded" /></td>
                  </tr>
                ))
              ) : certificates.length > 0 ? (
                certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600 text-xs">{cert.certificate_number}</td>
                    <td className="px-6 py-4 text-slate-900">
                      <p className="font-semibold">{cert.student_name || cert.students?.full_name || "—"}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{cert.students?.phone || "—"}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-650">
                      {cert.course_name || cert.courses?.course_name || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {cert.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(cert.issue_date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold ${statusColors[cert.status] || "bg-slate-100"}`}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      {/* Download PDF directly */}
                      <button
                        onClick={() => handleDownloadSingle(cert)}
                        className="inline-flex p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {/* Print directly */}
                      <button
                        onClick={() => handlePrintSingle(cert)}
                        className="inline-flex p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Print Certificate"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {/* Reissue (Admins Only) */}
                      {userRole === "Admin" && cert.status === "Valid" && (
                        <button
                          onClick={() => handleReissueOpen(cert)}
                          className="inline-flex p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Reissue (Updates details & marks old as Expired)"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}

                      {/* Revoke / Invalidate (Admins & Staff) */}
                      {(userRole === "Admin" || userRole === "Staff") && cert.status === "Valid" && (
                        <button
                          onClick={() => handleRevoke(cert.id, cert.certificate_number)}
                          disabled={actionLoading === `revoke-${cert.id}`}
                          className="inline-flex p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Revoke Certificate"
                        >
                          {actionLoading === `revoke-${cert.id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ShieldAlert className="w-4 h-4" />
                          )}
                        </button>
                      )}

                      {/* Delete (Admins Only) */}
                      {userRole === "Admin" && (
                        <button
                          onClick={() => handleDelete(cert.id, cert.certificate_number)}
                          disabled={actionLoading === `delete-${cert.id}`}
                          className="inline-flex p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Certificate"
                        >
                          {actionLoading === `delete-${cert.id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-400">
                    No certificate records match the search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold select-none">
            <span>
              Showing {(page - 1) * pagination.limit + 1} to{" "}
              {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} results
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 1. HIDDEN PRINT AREA FOR SINGLE ROW DOWNLOADS/PRINTS */}
      {activePrintCert && (
        <div style={{ position: "fixed", left: "0", top: "0", width: "1123px", height: "794px", overflow: "hidden", zIndex: -100, opacity: 0.01, pointerEvents: "none" }}>
          <CertificateTemplate
            certificateNumber={activePrintCert.certificate_number}
            studentName={activePrintCert.student_name || activePrintCert.students?.full_name || ""}
            courseName={activePrintCert.course_name || activePrintCert.courses?.course_name || ""}
            duration={activePrintCert.courses?.duration || "6 Months"}
            grade={activePrintCert.grade}
            completionDate={activePrintCert.completion_date}
            issueDate={activePrintCert.issue_date}
            fatherName={activePrintCert.students?.address || undefined}
          />
        </div>
      )}

      {/* Print Styles Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            overflow: visible !important;
          }
          body * {
            visibility: hidden;
          }
          #rci-certificate-print-area,
          #rci-certificate-print-area * {
            visibility: visible !important;
          }
          #rci-certificate-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            box-sizing: border-box !important;
            transform: none !important;
            zoom: 100% !important;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}} />

      {/* 2. REISSUE MODAL */}
      {reissueCert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-500" /> Reissue Certificate
              </h4>
              <button
                onClick={() => setReissueCert(null)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReissueSubmit}>
              <div className="p-5 space-y-4 text-xs">
                {errorMsg && (
                  <div className="bg-rose-50 text-rose-600 border border-rose-200 p-3 rounded-lg font-semibold">
                    {errorMsg}
                  </div>
                )}
                
                <div className="bg-amber-50 text-amber-800 border border-amber-200/50 p-4 rounded-xl leading-relaxed">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Warning
                  </p>
                  <p className="mt-1 font-medium">
                    This will mark the current certificate ({reissueCert.certificate_number}) as <span className="font-bold">Expired</span>, and issue a brand-new certificate with a new sequential number. All actions are logged.
                  </p>
                </div>

                <div>
                  <label className="block text-slate-650 font-bold mb-1.5">Reason for Reissuing</label>
                  <textarea
                    required
                    placeholder="e.g. Spelling correction in student name or upgraded grade details..."
                    value={reissueForm.reason}
                    onChange={(e) => setReissueForm({ ...reissueForm, reason: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-650 font-bold mb-1.5">New Grade</label>
                    <select
                      value={reissueForm.grade}
                      onChange={(e) => setReissueForm({ ...reissueForm, grade: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold bg-slate-50"
                    >
                      {["A+", "A", "B+", "B", "C", "D", "Ex"].map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-650 font-bold mb-1.5">Completion Date</label>
                    <input
                      type="date"
                      required
                      value={reissueForm.completion_date}
                      onChange={(e) => setReissueForm({ ...reissueForm, completion_date: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setReissueCert(null)}
                  className="px-4 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "reissue"}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-xs font-bold text-white shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  {actionLoading === "reissue" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Reissuing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Proceed Reissue</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
