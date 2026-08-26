"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Certificate, CourseInfo } from "@/types/certificate";
import { 
  Search, ArrowUpDown, Filter, Plus, Eye, Download, Printer, 
  ExternalLink, Copy, Check, ShieldAlert, AlertTriangle, CheckCircle2, 
  Clock, MoreVertical, X, Award, FileText, Loader2, ChevronLeft, ChevronRight
} from "lucide-react";
import CertificateTemplate from "./CertificateTemplate";
import CertificateProfileDrawer from "../admin/certificates/CertificateProfileDrawer";
import CertificateRevokeDialog from "../admin/certificates/CertificateRevokeDialog";
import ActionDropdown from "@/components/ui/ActionDropdown";

interface HistoryTableProps {
  initialCourses: CourseInfo[];
  userRole: string;
}

export default function HistoryTable({ initialCourses, userRole }: HistoryTableProps) {
  // Query parameters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "name">("newest");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Data & loading states
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Interaction, Drawer & Modal states
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewingCert, setViewingCert] = useState<Certificate | null>(null);
  const [revokingCert, setRevokingCert] = useState<Certificate | null>(null);
  const [activePrintCert, setActivePrintCert] = useState<Certificate | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Close dropdown menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenuId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch certificates from API route
  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
      if (courseFilter && courseFilter !== "all") params.set("course_id", courseFilter);
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      params.set("sortBy", sortOrder === "name" ? "student_name" : "created_at");
      params.set("sortOrder", sortOrder === "oldest" || sortOrder === "name" ? "asc" : "desc");

      const res = await fetch(`/api/certificates?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCertificates(data.certificates || []);
        setPagination({
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 1,
        });
      }
    } catch (err) {
      console.error("Failed to load certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, courseFilter, page, sortOrder]);

  // Compute KPI counts from current fetched data / totals
  const validCount = useMemo(() => certificates.filter((c) => c.status === "Valid").length, [certificates]);
  const revokedCount = useMemo(() => certificates.filter((c) => c.status === "Revoked").length, [certificates]);
  const expiredCount = useMemo(() => certificates.filter((c) => c.status === "Expired").length, [certificates]);

  // Single PDF download generator using html2canvas & jsPDF in an isolated iframe
  const handleDownloadSingle = async (cert: Certificate) => {
    setDownloadingId(cert.id);
    setActivePrintCert(cert);
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const originalElement = document.getElementById("rci-certificate-print-area");
      if (!originalElement) return;

      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.left = "-9999px";
      iframe.style.top = "-9999px";
      iframe.style.width = "1123px";
      iframe.style.height = "794px";
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error("Could not access iframe document");

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Certificate Capture</title>
          <style>body { margin: 0; padding: 0; background-color: transparent; }</style>
        </head>
        <body>
          ${originalElement.outerHTML}
        </body>
        </html>
      `;

      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      await new Promise((resolve) => setTimeout(resolve, 400));
      const targetElement = iframeDoc.getElementById("rci-certificate-print-area");
      if (!targetElement) throw new Error("Target element inside iframe not found");

      const canvas = await html2canvas(targetElement, {
        scale: 3.125,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#fdfdfd",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      document.body.removeChild(iframe);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      pdf.addImage(imgData, "PNG", 0, 0, 297, 210, undefined, "FAST");
      const sName = cert.student_name || cert.students?.full_name || "Student";
      pdf.save(`${sName.replace(/\s+/g, "_")}_${cert.certificate_number}.pdf`);

      await fetch("/api/certificates/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "Downloaded",
          certificate_number: cert.certificate_number,
          details: `Certificate downloaded for ${sName}`,
        }),
      });
    } catch (err) {
      console.error("PDF Download error:", err);
    } finally {
      setActivePrintCert(null);
      setDownloadingId(null);
    }
  };

  const handlePrintSingle = async (cert: Certificate) => {
    setActivePrintCert(cert);
    await new Promise((resolve) => setTimeout(resolve, 300));
    try {
      window.print();
      await fetch("/api/certificates/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "Printed",
          certificate_number: cert.certificate_number,
          details: `Certificate print initiated for ${cert.student_name || cert.students?.full_name}`,
        }),
      });
    } catch (err) {
      console.error("Print error:", err);
    } finally {
      setActivePrintCert(null);
    }
  };

  const handleCopyId = (certNumber: string) => {
    navigator.clipboard.writeText(certNumber);
    setCopiedId(certNumber);
    setTimeout(() => setCopiedId(null), 2000);
    setActiveMenuId(null);
  };

  const handleRevokeConfirm = async (certificateId: string) => {
    const res = await fetch(`/api/certificates/${certificateId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Revoked" }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to revoke certificate");
    }

    setViewingCert(null);
    fetchCertificates();
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "Valid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase border bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            VALID
          </span>
        );
      case "Expired":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase border bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            EXPIRED
          </span>
        );
      case "Revoked":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase border bg-rose-50 text-rose-700 border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            REVOKED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase border bg-slate-100 text-slate-700 border-slate-200">
            {st}
          </span>
        );
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "ST";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Offscreen Template Mount for html2canvas PDF download & print */}
      {activePrintCert && (
        <div className="fixed left-[-9999px] top-[-9999px] z-[-100]">
          <div id="rci-certificate-print-area">
            <CertificateTemplate
              certificateNumber={activePrintCert.certificate_number}
              studentName={activePrintCert.student_name || activePrintCert.students?.full_name || "Student Name"}
              courseName={activePrintCert.course_name || activePrintCert.courses?.course_name || "Course Program"}
              duration={activePrintCert.courses?.duration || "6 Months"}
              grade={activePrintCert.grade || "A+"}
              completionDate={activePrintCert.completion_date || activePrintCert.issue_date}
              issueDate={activePrintCert.issue_date}
            />
          </div>
        </div>
      )}

      {/* Real Database KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Total Registry
            </span>
            <span className="text-2xl font-extrabold text-slate-950 mt-0.5 block tracking-tight font-display">
              {pagination.total}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider block">
              Valid Status
            </span>
            <span className="text-2xl font-extrabold text-emerald-700 mt-0.5 block tracking-tight font-display">
              {validCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider block">
              Revoked
            </span>
            <span className="text-2xl font-extrabold text-rose-700 mt-0.5 block tracking-tight font-display">
              {revokedCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wider block">
              Expired
            </span>
            <span className="text-2xl font-extrabold text-amber-700 mt-0.5 block tracking-tight font-display">
              {expiredCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Status Filter, Course Filter, Sort */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search certificate ID, student name, course..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer"
            >
              <option value="all">Status: All</option>
              <option value="Valid">Valid</option>
              <option value="Revoked">Revoked</option>
              <option value="Expired">Expired</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Course Filter */}
          <div className="relative">
            <select
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                setPage(1);
              }}
              className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer max-w-[160px] truncate"
            >
              <option value="all">All Courses</option>
              {initialCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.course_name}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="name">Sort: Name A-Z</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Counter Badge */}
          <div className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-extrabold text-slate-600 shrink-0">
            {pagination.total} {pagination.total === 1 ? "certificate" : "certificates"}
          </div>
        </div>
      </div>

      {/* Main List Container */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-16 text-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading certificate registry records...</p>
        </div>
      ) : certificates.length > 0 ? (
        <>
          {/* Desktop Table View (Hidden on mobile < 1024px) */}
          <div className="hidden lg:block bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">CERTIFICATE ID</th>
                  <th className="py-3.5 px-5">STUDENT</th>
                  <th className="py-3.5 px-5">COURSE</th>
                  <th className="py-3.5 px-5">ISSUE DATE</th>
                  <th className="py-3.5 px-5">STATUS</th>
                  <th className="py-3.5 px-5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {certificates.map((cert) => {
                  const sName = cert.student_name || cert.students?.full_name || "Unassigned Student";
                  const cName = cert.course_name || cert.courses?.course_name || "Unassigned Course";
                  const isMenuOpen = activeMenuId === cert.id;

                  return (
                    <tr 
                      key={cert.id} 
                      className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                      onClick={() => setViewingCert(cert)}
                    >
                      {/* Monospace Certificate ID */}
                      <td className="py-4 px-5 font-mono font-extrabold text-slate-900 text-xs whitespace-nowrap">
                        {cert.certificate_number}
                      </td>

                      {/* Student Info */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-200/60 flex items-center justify-center font-extrabold text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            {getInitials(sName)}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-950 block leading-tight text-xs sm:text-sm">
                              {sName}
                            </span>
                            {cert.students?.email && (
                              <span className="text-[11px] text-slate-400 font-medium block">
                                {cert.students.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Course Info */}
                      <td className="py-4 px-5 max-w-xs truncate">
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                          {cName}
                        </span>
                        {cert.grade && (
                          <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                            Grade: <strong className="text-slate-700">{cert.grade}</strong>
                          </span>
                        )}
                      </td>

                      {/* Issue Date */}
                      <td className="py-4 px-5 whitespace-nowrap font-medium text-slate-700 text-xs">
                        {cert.issue_date || cert.created_at?.split("T")[0]}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        {getStatusBadge(cert.status)}
                      </td>

                      {/* Contextual Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <ActionDropdown ariaLabel="Certificate actions" menuClassName="w-48 bg-white rounded-2xl border border-slate-200 shadow-xl p-1.5 text-left space-y-0.5">
                            {({ close }) => (
                              <>
                                <button
                                  onClick={() => {
                                    close();
                                    setViewingCert(cert);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                                  <span>View Details</span>
                                </button>

                                <button
                                  onClick={() => {
                                    close();
                                    handleDownloadSingle(cert);
                                  }}
                                  disabled={downloadingId === cert.id}
                                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
                                >
                                  {downloadingId === cert.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5 text-emerald-600" />}
                                  <span>Download PDF</span>
                                </button>

                                <button
                                  onClick={() => {
                                    close();
                                    handlePrintSingle(cert);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 transition-colors"
                                >
                                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Print Certificate</span>
                                </button>

                                <a
                                  href={`/verify/${cert.certificate_number}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={close}
                                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
                                  <span>Verify Online</span>
                                </a>

                                <button
                                  onClick={() => handleCopyId(cert.certificate_number)}
                                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 transition-colors"
                                >
                                  {copiedId === cert.certificate_number ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                                  <span>{copiedId === cert.certificate_number ? "Copied ID" : "Copy Certificate ID"}</span>
                                </button>

                                {cert.status === "Valid" && userRole !== "Viewer" && (
                                  <>
                                    <div className="my-1 border-t border-slate-100" />
                                    <button
                                      onClick={() => {
                                        close();
                                        setRevokingCert(cert);
                                      }}
                                      className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors"
                                    >
                                      <ShieldAlert className="w-3.5 h-3.5" />
                                      <span>Revoke Certificate</span>
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </ActionDropdown>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Certificate Cards (<1024px) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
            {certificates.map((cert) => {
              const sName = cert.student_name || cert.students?.full_name || "Student";
              const cName = cert.course_name || cert.courses?.course_name || "Course";

              return (
                <div 
                  key={cert.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all cursor-pointer"
                  onClick={() => setViewingCert(cert)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                        {cert.certificate_number}
                      </span>
                      <h3 className="font-extrabold text-slate-950 text-base mt-2 leading-tight">
                        {sName}
                      </h3>
                      <p className="text-xs font-extrabold text-slate-700 mt-0.5">
                        {cName}
                      </p>
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      {getStatusBadge(cert.status)}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Issue Date</span>
                      <span className="font-bold text-slate-800">{cert.issue_date || "—"}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Grade</span>
                      <span className="font-bold text-slate-900">{cert.grade || "A+"}</span>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDownloadSingle(cert)}
                        className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-emerald-600 flex items-center justify-center font-bold text-xs"
                        aria-label="Download certificate PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setViewingCert(cert)}
                        className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl border border-slate-200 bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center font-bold text-xs"
                        aria-label="View certificate profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-slate-500">
                Page {page} of {pagination.totalPages}
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs py-16 px-4 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto">
            <Award className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              {search || statusFilter !== "all" || courseFilter !== "all" 
                ? "No matching certificates found" 
                : "No certificates issued yet"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search || statusFilter !== "all" || courseFilter !== "all"
                ? "Try clearing search keywords or resetting your status filters."
                : "Issue your first student certificate to register it in the official institute database."}
            </p>
          </div>

          <div>
            {search || statusFilter !== "all" || courseFilter !== "all" ? (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setCourseFilter("all");
                  setPage(1);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors"
              >
                Clear Filters
              </button>
            ) : userRole !== "Viewer" ? (
              <Link
                href="/admin/certificates/generate"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" /> Issue First Certificate
              </Link>
            ) : null}
          </div>
        </div>
      )}

      {/* Certificate Details Drawer Component */}
      <CertificateProfileDrawer
        certificate={viewingCert}
        onClose={() => setViewingCert(null)}
        onDownload={handleDownloadSingle}
        onPrint={handlePrintSingle}
        onVerify={(cert) => window.open(`/verify/${cert.certificate_number}`, "_blank")}
        onRevoke={(cert) => {
          setViewingCert(null);
          setRevokingCert(cert);
        }}
        userRole={userRole}
      />

      {/* Revoke Confirmation Dialog */}
      <CertificateRevokeDialog
        certificate={revokingCert}
        onClose={() => setRevokingCert(null)}
        onConfirm={handleRevokeConfirm}
      />
    </div>
  );
}
