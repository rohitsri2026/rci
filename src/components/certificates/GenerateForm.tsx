"use client";

import React, { useState, useEffect, useRef } from "react";
import { StudentInfo, CourseInfo } from "@/types/certificate";
import CertificatePreview from "./CertificatePreview";
import CertificateTemplate from "./CertificateTemplate";
import CertificateQRCode from "./CertificateQRCode";
import DownloadButton from "./DownloadButton";
import PrintButton from "./PrintButton";
import { Award, User, BookOpen, Calendar, HelpCircle, Check, Loader2, ArrowRight, CheckCircle2, ChevronRight, Copy, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { certificateGenerateSchema, bulkCertificateGenerateSchema } from "@/schemas/certificate";
import PostActionNotification from "@/components/admin/notifications/PostActionNotification";

interface GenerateFormProps {
  students: StudentInfo[];
  courses: CourseInfo[];
}

export default function GenerateForm({ students, courses }: GenerateFormProps) {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successCert, setSuccessCert] = useState<any>(null);
  const [copiedCertId, setCopiedCertId] = useState(false);

  const handleCopyCertNumber = (certNum: string) => {
    if (!certNum) return;
    navigator.clipboard.writeText(certNum);
    setCopiedCertId(true);
    setTimeout(() => setCopiedCertId(false), 2000);
  };

  // Single Form State
  const [singleForm, setSingleForm] = useState({
    student_id: "",
    course_id: "",
    grade: "A+",
    completion_date: new Date().toISOString().split("T")[0],
    issue_date: new Date().toISOString().split("T")[0],
  });

  // Bulk Form State
  const [bulkForm, setBulkForm] = useState({
    course_id: "",
    grade: "A+",
    completion_date: new Date().toISOString().split("T")[0],
    issue_date: new Date().toISOString().split("T")[0],
    selected_student_ids: [] as string[],
  });

  // Search filter for students
  const [searchQuery, setSearchQuery] = useState("");
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0, status: "" });

  // For offscreen bulk rendering
  const [bulkRenderCert, setBulkRenderCert] = useState<any | null>(null);
  const bulkPrintRef = useRef<HTMLDivElement>(null);

  // Auto-fill course when student is selected in Single flow
  useEffect(() => {
    if (singleForm.student_id) {
      const student = students.find((s) => s.id === singleForm.student_id);
      if (student?.course_id) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSingleForm((prev) => ({ ...prev, course_id: student.course_id || "" }));
      }
    }
  }, [singleForm.student_id, students]);

  // Filter students by selected course in Bulk flow
  const filteredBulkStudents = students.filter((student) => {
    // Show students enrolled in the selected course
    const matchesCourse = bulkForm.course_id ? student.course_id === bulkForm.course_id : true;
    const matchesSearch = student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (student.phone && student.phone.includes(searchQuery));
    return matchesCourse && matchesSearch;
  });

  // Handle single certificate generation
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessCert(null);

    // Validate payload
    const validation = certificateGenerateSchema.safeParse(singleForm);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(singleForm),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate certificate");
      }

      setSuccessCert(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk certificate generation & ZIP download
  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate payload
    const validation = bulkCertificateGenerateSchema.safeParse({
      student_ids: bulkForm.selected_student_ids,
      course_id: bulkForm.course_id,
      grade: bulkForm.grade,
      completion_date: bulkForm.completion_date,
      issue_date: bulkForm.issue_date,
    });

    if (!validation.success) {
      setError(validation.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      setBulkProgress({ current: 0, total: bulkForm.selected_student_ids.length, status: "Saving to database..." });
      
      const res = await fetch("/api/certificates/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_ids: bulkForm.selected_student_ids,
          course_id: bulkForm.course_id,
          grade: bulkForm.grade,
          completion_date: bulkForm.completion_date,
          issue_date: bulkForm.issue_date,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Bulk generation failed");
      }

      // Success certificates generated in database
      const successResults = data.results.filter((r: any) => r.status === "success");
      
      if (successResults.length === 0) {
        throw new Error("All certificates were skipped or failed. No PDFs to download.");
      }

      // Start client-side PDF generation & zipping
      const { default: JSZip } = await import("jszip");
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const zip = new JSZip();

      setBulkProgress((prev) => ({ ...prev, status: "Compiling PDFs..." }));

      for (let i = 0; i < successResults.length; i++) {
        const item = successResults[i];
        const cert = item.certificate;
        
        setBulkProgress({
          current: i + 1,
          total: successResults.length,
          status: `Rendering PDF for ${item.student_name}...`
        });

        // Set the active cert to render in the hidden container
        setBulkRenderCert(cert);

        // Wait a tick for the React DOM mount and styles to load
        await new Promise((resolve) => setTimeout(resolve, 300));

        const element = document.getElementById("rci-certificate-bulk-render");
        if (element) {
          const canvas = await html2canvas(element, {
            scale: 3.125, // 300 DPI
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#fcfbf9",
            logging: false,
          });

          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
            compress: true,
          });

          pdf.addImage(imgData, "PNG", 0, 0, 297, 210, undefined, "FAST");
          const pdfBlob = pdf.output("blob");

          // Add to ZIP archive
          const filename = `${item.student_name.replace(/\s+/g, "_")}_${cert.certificate_number}.pdf`;
          zip.file(filename, pdfBlob);

          // Write Download Audit Log
          try {
            await fetch("/api/certificates/audit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "Downloaded",
                certificate_number: cert.certificate_number,
                details: `Bulk certificate downloaded in zip for student ${item.student_name}`,
              }),
            });
          } catch (auditError) {
            console.error("Failed to log bulk download audit:", auditError);
          }
        }
      }

      // Generate the ZIP file
      setBulkProgress((prev) => ({ ...prev, status: "Creating ZIP archive..." }));
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipBlob);
      link.download = `certificates_bulk_${new Date().toISOString().split("T")[0]}.zip`;
      link.click();

      setBulkProgress({ current: successResults.length, total: successResults.length, status: "Complete!" });
      alert(`Successfully generated and zipped ${successResults.length} certificates!`);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setBulkRenderCert(null);
      setBulkProgress({ current: 0, total: 0, status: "" });
    }
  };

  // Find names for previews
  const selectedStudent = students.find((s) => s.id === singleForm.student_id);
  const selectedCourse = courses.find((c) => c.id === singleForm.course_id);

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      {/* Offscreen / Hidden container for capturing bulk PDF generation */}
      {bulkRenderCert && (
        <div style={{ position: "fixed", left: "-9999px", top: "-9999px", width: "1536px", height: "1024px", overflow: "hidden", zIndex: -100, opacity: 0.01, pointerEvents: "none" }}>
          <div id="rci-certificate-bulk-render" style={{ width: "1536px", height: "1024px" }}>
            <CertificateTemplate
              certificateNumber={bulkRenderCert.certificate_number}
              studentName={bulkRenderCert.student_name}
              courseName={bulkRenderCert.course_name}
              duration={courses.find((c) => c.id === bulkForm.course_id)?.duration || "—"}
              grade={bulkRenderCert.grade}
              completionDate={bulkRenderCert.completion_date}
              issueDate={bulkRenderCert.issue_date}
            />
          </div>
        </div>
      )}

      {/* Hidden single certificate render area for printing and downloading */}
      {successCert && (
        <div style={{ position: "fixed", left: "-9999px", top: "-9999px", width: "1536px", height: "1024px", overflow: "hidden", zIndex: -100, opacity: 0.01, pointerEvents: "none" }}>
          <CertificateTemplate
            certificateNumber={successCert.certificate_number}
            studentName={successCert.student_name}
            courseName={successCert.course_name}
            duration={courses.find((c) => c.id === singleForm.course_id)?.duration || "—"}
            grade={successCert.grade}
            completionDate={successCert.completion_date}
            issueDate={successCert.issue_date}
            fatherName={selectedStudent ? selectedStudent.address || undefined : undefined}
          />
        </div>
      )}

      {/* Inputs panel */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          {/* Tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setActiveTab("single"); setError(""); setSuccessCert(null); }}
              className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "single"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Single Issue
            </button>
            <button
              onClick={() => { setActiveTab("bulk"); setError(""); setSuccessCert(null); }}
              className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "bulk"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Bulk Issue
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-xs mb-6 font-semibold">
              {error}
            </div>
          )}

          {successCert ? (
            /* Upgraded Professional Success Screen with QR Verification */
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Post-Action Instant Notification Banner */}
              <PostActionNotification
                type="success"
                title="Certificate Generated Successfully!"
                subtitle="Official credential issued. Send instant notification to candidate:"
                studentName={successCert.student_name}
                studentPhone={selectedStudent?.phone || ""}
                studentId={selectedStudent?.id}
                notificationType="certificate_generated"
                variables={{
                  student_name: successCert.student_name,
                  certificate_number: successCert.certificate_number,
                  certificate_url: typeof window !== "undefined"
                    ? `${window.location.origin}/verify/${successCert.certificate_number}`
                    : `https://rciknp.vercel.app/verify/${successCert.certificate_number}`,
                }}
                details={[
                  { label: "Certificate No", value: successCert.certificate_number },
                  { label: "Course Program", value: successCert.course_name },
                  { label: "Secured Grade", value: successCert.grade || "A+" },
                ]}
              />

              {/* 2-Column Info & QR Card */}
              <div className="bg-slate-50/80 rounded-2xl border border-slate-200/90 p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {/* Left Column: Certificate Details */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-4 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Certificate Number</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs sm:text-sm font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg break-all">
                        {successCert.certificate_number}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCertNumber(successCert.certificate_number)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors shrink-0"
                        title="Copy certificate number"
                        aria-label="Copy certificate number"
                      >
                        {copiedCertId ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {copiedCertId && <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Copied to clipboard!</span>}
                  </div>

                  <div className="border-t border-slate-100 pt-2.5 space-y-2 text-xs">
                    <div>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Student Name</span>
                      <span className="font-extrabold text-slate-950 block truncate">{successCert.student_name}</span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Course Program</span>
                      <span className="font-bold text-slate-700 block truncate">{successCert.course_name}</span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Issue Date</span>
                      <span className="font-medium text-slate-600 block">{successCert.issue_date || new Date().toISOString().split("T")[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: High-Res QR Code Box */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex flex-col items-center justify-center text-center space-y-2.5">
                  <CertificateQRCode certificateNumber={successCert.certificate_number} size={140} />
                  <div>
                    <span className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">Scan to Verify</span>
                    <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5 max-w-[180px]">
                      Scan this QR code with your phone camera to verify this certificate online.
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust & Security Info Box */}
              <div className="bg-blue-50/60 rounded-xl border border-blue-100 p-3.5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <h4 className="font-extrabold text-slate-900">How does verification work?</h4>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Anyone can scan this QR code or visit the RCI verification portal and enter the certificate number to verify the authenticity of this certificate.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DownloadButton
                  certificateNumber={successCert.certificate_number}
                  studentName={successCert.student_name}
                  className="w-full"
                />
                <PrintButton
                  certificateNumber={successCert.certificate_number}
                  studentName={successCert.student_name}
                  className="w-full"
                />
              </div>

              <button
                type="button"
                onClick={() => setSuccessCert(null)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Issue Another Certificate
              </button>
            </div>
          ) : activeTab === "single" ? (
            /* Single Certificate Form */
            <form onSubmit={handleSingleSubmit} className="space-y-5">
              {/* Student Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" /> Select Student ({students.length} registered)
                </label>
                <select
                  value={singleForm.student_id}
                  onChange={(e) => setSingleForm({ ...singleForm, student_id: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm font-semibold"
                  required
                >
                  <option value="">Choose a student...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name} {s.phone ? `(${s.phone})` : ""}
                    </option>
                  ))}
                </select>

                {/* Show warning if student has no course associated */}
                {singleForm.student_id && !students.find(s => s.id === singleForm.student_id)?.course_id && (
                  <div className="mt-2 text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs font-semibold leading-relaxed">
                    Warning: This student has no course enrolled. Please assign a course to this student in the Students edit section first.
                  </div>
                )}
              </div>



              {/* Grade */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Secured Grade
                </label>
                <select
                  value={singleForm.grade}
                  onChange={(e) => setSingleForm({ ...singleForm, grade: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm font-semibold"
                >
                  {["A+", "A", "B+", "B", "C", "D", "Ex"].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Date of Completion */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" /> Completion Date
                  </label>
                  <input
                    type="date"
                    value={singleForm.completion_date}
                    onChange={(e) => setSingleForm({ ...singleForm, completion_date: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" /> Issue Date
                  </label>
                  <input
                    type="date"
                    value={singleForm.issue_date}
                    onChange={(e) => setSingleForm({ ...singleForm, issue_date: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm font-semibold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || students.length === 0 || (!!singleForm.student_id && !students.find(s => s.id === singleForm.student_id)?.course_id)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-60 shadow-lg shadow-blue-500/10 text-sm mt-4 font-sans"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Issuing...</span>
                  </>
                ) : students.length === 0 ? (
                  <span>No Students Registered</span>
                ) : (!!singleForm.student_id && !students.find(s => s.id === singleForm.student_id)?.course_id) ? (
                  <span>Student Has No Enrolled Course</span>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Generate Certificate</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Bulk Certificate Form */
            <form onSubmit={handleBulkSubmit} className="space-y-5">
              {/* Select Course First */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-400" /> 1. Select Course ({courses.length} available)
                </label>
                <select
                  value={bulkForm.course_id}
                  onChange={(e) => setBulkForm({ ...bulkForm, course_id: e.target.value, selected_student_ids: [] })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm font-semibold"
                  required
                >
                  <option value="">Choose a course...</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.course_name} ({c.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Configure shared metadata */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Grade
                  </label>
                  <select
                    value={bulkForm.grade}
                    onChange={(e) => setBulkForm({ ...bulkForm, grade: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50 text-xs font-semibold"
                  >
                    {["A+", "A", "B+", "B", "C", "D", "Ex"].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    value={bulkForm.completion_date}
                    onChange={(e) => setBulkForm({ ...bulkForm, completion_date: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50 text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Student Checklist Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    2. Select Students ({bulkForm.selected_student_ids.length} selected)
                  </label>
                  {filteredBulkStudents.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const allIds = filteredBulkStudents.map(s => s.id);
                        const allSelected = allIds.every(id => bulkForm.selected_student_ids.includes(id));
                        if (allSelected) {
                          // Unselect all in view
                          setBulkForm({
                            ...bulkForm,
                            selected_student_ids: bulkForm.selected_student_ids.filter(id => !allIds.includes(id))
                          });
                        } else {
                          // Select all in view
                          const uniqueIds = Array.from(new Set([...bulkForm.selected_student_ids, ...allIds]));
                          setBulkForm({ ...bulkForm, selected_student_ids: uniqueIds });
                        }
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      Toggle All
                    </button>
                  )}
                </div>

                {/* Search field */}
                <input
                  type="text"
                  placeholder="Search student by name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 mb-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50 font-semibold"
                />

                <div className="border border-slate-150 rounded-xl p-3 bg-slate-50/50 max-h-56 overflow-y-auto space-y-2">
                  {filteredBulkStudents.length > 0 ? (
                    filteredBulkStudents.map((s) => {
                      const isChecked = bulkForm.selected_student_ids.includes(s.id);
                      return (
                        <label
                          key={s.id}
                          className="flex items-center gap-3 p-2 rounded-lg bg-white border border-slate-100 hover:bg-slate-50/50 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setBulkForm({
                                  ...bulkForm,
                                  selected_student_ids: bulkForm.selected_student_ids.filter((id) => id !== s.id),
                                });
                              } else {
                                setBulkForm({
                                  ...bulkForm,
                                  selected_student_ids: [...bulkForm.selected_student_ids, s.id],
                                });
                              }
                            }}
                            className="rounded border-slate-350 text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <div className="text-xs">
                            <p className="font-bold text-slate-800">{s.full_name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{s.phone || "No phone"} • {s.email || "No email"}</p>
                          </div>
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-center py-6 text-slate-400 text-xs font-semibold">
                      {bulkForm.course_id
                        ? "No student matches search or course."
                        : "Please select a course to load students."}
                    </p>
                  )}
                </div>
              </div>

              {/* Progress Indicator */}
              {bulkProgress.total > 0 && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                    <span>{bulkProgress.status}</span>
                    <span>
                      {bulkProgress.current} / {bulkProgress.total} (
                      {Math.round((bulkProgress.current / bulkProgress.total) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || bulkForm.selected_student_ids.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-60 shadow-lg shadow-indigo-500/10 text-sm mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing bulk issue...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Bulk Generate & ZIP ({bulkForm.selected_student_ids.length})</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
