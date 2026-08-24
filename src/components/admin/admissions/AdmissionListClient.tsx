"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Search, Filter, ArrowUpDown, MoreVertical, CheckCircle2, XCircle, 
  Clock, FileText, Trash2, MessageSquare, UserCheck, AlertTriangle, Loader2, Eye, Inbox
} from "lucide-react";
import AdmissionProfileDrawer from "./AdmissionProfileDrawer";
import { updateAdmissionStatus, convertAdmissionToStudent, deleteAdmission } from "../admission-actions-server";

interface Admission {
  id: string;
  student_name: string;
  email: string | null;
  phone: string | null;
  selected_course: string | null;
  status: "Pending" | "Approved" | "Rejected" | string;
  created_at: string;
  address?: string | null;
}

interface Student {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
}

interface Course {
  id: string;
  course_name: string;
}

interface AdmissionListClientProps {
  initialAdmissions: Admission[];
  existingStudents: Student[];
  courses: Course[];
}

export default function AdmissionListClient({
  initialAdmissions,
  existingStudents,
  courses,
}: AdmissionListClientProps) {
  const router = useRouter();

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "name">("newest");

  // Interaction States
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [viewingAdmission, setViewingAdmission] = useState<Admission | null>(null);

  // Workflow Confirmation Modal States
  const [approvingAdmission, setApprovingAdmission] = useState<Admission | null>(null);
  const [rejectingAdmission, setRejectingAdmission] = useState<Admission | null>(null);
  const [deletingAdmissionObj, setDeletingAdmissionObj] = useState<Admission | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState("");

  // Global Escape key handler with event listener cleanup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenuId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Normalized Map of existing student records for duplicate detection (keyed by email & last 10 digits of phone)
  const studentMap = useMemo(() => {
    const map = new Map<string, string>();
    existingStudents.forEach((s) => {
      if (s.email && s.email.trim()) {
        map.set(`email:${s.email.toLowerCase().trim()}`, s.id);
      }
      if (s.phone) {
        const digits = s.phone.replace(/[^0-9]/g, "");
        if (digits.length >= 7) {
          map.set(`phone:${digits.slice(-10)}`, s.id);
        }
      }
    });
    return map;
  }, [existingStudents]);

  const getMatchingStudentId = (adm: Admission): string | null => {
    if (adm.email && adm.email.trim()) {
      const cleanEmail = adm.email.toLowerCase().trim();
      if (studentMap.has(`email:${cleanEmail}`)) {
        return studentMap.get(`email:${cleanEmail}`)!;
      }
    }
    if (adm.phone) {
      const digits = adm.phone.replace(/[^0-9]/g, "");
      if (digits.length >= 7 && studentMap.has(`phone:${digits.slice(-10)}`)) {
        return studentMap.get(`phone:${digits.slice(-10)}`)!;
      }
    }
    return null;
  };

  // Real-data metrics computation
  const metrics = useMemo(() => {
    const total = initialAdmissions.length;
    const pending = initialAdmissions.filter((a) => a.status === "Pending").length;
    const approved = initialAdmissions.filter((a) => a.status === "Approved").length;
    const rejected = initialAdmissions.filter((a) => a.status === "Rejected").length;
    return { total, pending, approved, rejected };
  }, [initialAdmissions]);

  // Filtered & Sorted Admissions
  const filteredAdmissions = useMemo(() => {
    return initialAdmissions
      .filter((a) => {
        const query = search.toLowerCase().trim();
        const matchesName = a.student_name?.toLowerCase().includes(query);
        const matchesEmail = a.email?.toLowerCase().includes(query);
        const matchesPhone = a.phone?.toLowerCase().includes(query);
        const matchesQuery = !query || matchesName || matchesEmail || matchesPhone;

        const matchesCourse = selectedCourse === "all" || a.selected_course === selectedCourse;
        const matchesStatus = selectedStatus === "all" || a.status === selectedStatus;

        return matchesQuery && matchesCourse && matchesStatus;
      })
      .sort((a, b) => {
        if (sortOrder === "newest") {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortOrder === "oldest") {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortOrder === "name") {
          return a.student_name.localeCompare(b.student_name);
        }
        return 0;
      });
  }, [initialAdmissions, search, selectedCourse, selectedStatus, sortOrder]);

  // Handle Approve Action
  const handleApproveConfirm = async () => {
    if (!approvingAdmission || isProcessing) return;
    setIsProcessing(true);
    setActionError("");

    const res = await updateAdmissionStatus(approvingAdmission.id, "Approved");
    setIsProcessing(false);

    if (res.success) {
      setApprovingAdmission(null);
      router.refresh();
    } else {
      setActionError(res.error || "Unable to approve this application. Please try again.");
    }
  };

  // Handle Explicit Student Conversion Recovery Action
  const handleConvertAction = async (adm: Admission) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setActionError("");

    const res = await convertAdmissionToStudent(adm.id);
    setIsProcessing(false);

    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Unable to create student record. Please try again.");
    }
  };

  // Handle Reject Action
  const handleRejectConfirm = async () => {
    if (!rejectingAdmission || isProcessing) return;
    setIsProcessing(true);
    setActionError("");

    const res = await updateAdmissionStatus(rejectingAdmission.id, "Rejected");
    setIsProcessing(false);

    if (res.success) {
      setRejectingAdmission(null);
      router.refresh();
    } else {
      setActionError(res.error || "Unable to reject this application. Please try again.");
    }
  };

  // Handle Delete Action
  const handleDeleteConfirm = async () => {
    if (!deletingAdmissionObj || isProcessing) return;
    setIsProcessing(true);
    setActionError("");

    const res = await deleteAdmission(deletingAdmissionObj.id);
    setIsProcessing(false);

    if (res.success) {
      setDeletingAdmissionObj(null);
      router.refresh();
    } else {
      setActionError(res.error || "Unable to delete this application. Please try again.");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "AP";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getStatusPill = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/90 px-2.5 py-1 rounded-full text-[11px] font-extrabold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Approved</span>
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200/90 px-2.5 py-1 rounded-full text-[11px] font-extrabold">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/90 px-2.5 py-1 rounded-full text-[11px] font-extrabold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-display">
            Admissions
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Review and manage student admission applications.
          </p>
        </div>
      </div>

      {/* Real-Data Admission Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Applications */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Applications</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">{metrics.total}</p>
          <p className="text-[11px] text-slate-500 font-medium truncate">All admission applications</p>
        </div>

        {/* Metric 2: Pending Review */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">{metrics.pending}</p>
          <p className="text-[11px] text-slate-500 font-medium truncate">Awaiting admin review</p>
        </div>

        {/* Metric 3: Approved */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">{metrics.approved}</p>
          <p className="text-[11px] text-slate-500 font-medium truncate">Successfully approved</p>
        </div>

        {/* Metric 4: Rejected */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Rejected</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">{metrics.rejected}</p>
          <p className="text-[11px] text-slate-500 font-medium truncate">Applications not approved</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full h-10 pl-10 pr-4 border border-slate-200/90 rounded-xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium bg-slate-50/40 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all"
            />
          </div>

          {/* Course Filter Dropdown */}
          <div className="relative min-w-[150px]">
            <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full h-10 pl-9 pr-8 border border-slate-200/90 rounded-xl text-slate-800 text-xs font-bold bg-slate-50/40 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.course_name}>
                  {c.course_name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative min-w-[140px]">
            <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-10 pl-9 pr-8 border border-slate-200/90 rounded-xl text-slate-800 text-xs font-bold bg-slate-50/40 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative min-w-[140px]">
            <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest" | "name")}
              className="w-full h-10 pl-9 pr-8 border border-slate-200/90 rounded-xl text-slate-800 text-xs font-bold bg-slate-50/40 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all appearance-none cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="name">Sort: Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Counter Pill */}
        <div className="text-xs font-extrabold text-slate-600 bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-full text-center shrink-0">
          {filteredAdmissions.length} {filteredAdmissions.length === 1 ? "application" : "applications"} found
        </div>
      </div>

      {/* DESKTOP ADMISSIONS TABLE */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10.5px] border-b border-slate-200/90">
              <tr>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Applied On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAdmissions.length > 0 ? (
                filteredAdmissions.map((adm) => {
                  const initials = getInitials(adm.student_name);
                  const isMenuOpen = activeMenuId === adm.id;
                  const matchingStudentId = getMatchingStudentId(adm);

                  const rawDigits = adm.phone?.replace(/[^0-9]/g, "") || "";
                  const whatsappUrl = rawDigits.length >= 7
                    ? `https://wa.me/${rawDigits}?text=Hello%20${encodeURIComponent(adm.student_name)},%20regarding%20your%20RCI%20admission%20application...`
                    : null;

                  return (
                    <tr key={adm.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* APPLICANT NAME */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-950 text-sm leading-snug">{adm.student_name}</p>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="px-6 py-4 text-slate-600 font-medium text-xs">{adm.email || "—"}</td>

                      {/* PHONE */}
                      <td className="px-6 py-4 font-mono text-slate-600 text-xs">{adm.phone || "—"}</td>

                      {/* COURSE */}
                      <td className="px-6 py-4 font-bold text-slate-800 text-xs leading-snug max-w-[200px]">
                        {adm.selected_course || "—"}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">{getStatusPill(adm.status)}</td>

                      {/* APPLIED ON */}
                      <td className="px-6 py-4 text-slate-600 font-medium text-xs">
                        {new Date(adm.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4 text-right relative">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <div className="relative">
                            <button
                              onClick={() => setActiveMenuId(isMenuOpen ? null : adm.id)}
                              className="w-10 h-10 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-600/30 outline-none"
                              aria-label="Application actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Deterministic Dropdown Menu */}
                            {isMenuOpen && (
                              <div
                                className="absolute right-0 top-11 w-52 bg-white rounded-xl border border-slate-200/90 shadow-lg z-30 p-1 space-y-0.5 text-left"
                                onMouseLeave={() => setActiveMenuId(null)}
                              >
                                <button
                                  onClick={() => {
                                    setViewingAdmission(adm);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                                  <span>View Application</span>
                                </button>

                                {/* CASE 1: PENDING */}
                                {adm.status === "Pending" && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setApprovingAdmission(adm);
                                        setActiveMenuId(null);
                                      }}
                                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Approve Application</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        setRejectingAdmission(adm);
                                        setActiveMenuId(null);
                                      }}
                                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                                      <span>Reject Application</span>
                                    </button>
                                  </>
                                )}

                                {/* CASE 2 & 3: APPROVED */}
                                {adm.status === "Approved" && (
                                  <>
                                    {matchingStudentId ? (
                                      // CASE 2: Approved + Student Exists
                                      <Link
                                        href={`/admin/students/${matchingStudentId}/edit`}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                        onClick={() => setActiveMenuId(null)}
                                      >
                                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>View Student Record</span>
                                      </Link>
                                    ) : (
                                      // CASE 3: Approved + Student Missing (Recovery Action)
                                      <button
                                        onClick={() => {
                                          handleConvertAction(adm);
                                          setActiveMenuId(null);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      >
                                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                                        <span>Convert to Student</span>
                                      </button>
                                    )}

                                    {whatsappUrl && (
                                      <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                        onClick={() => setActiveMenuId(null)}
                                      >
                                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Contact Applicant</span>
                                      </a>
                                    )}
                                  </>
                                )}

                                {/* CASE 4: REJECTED */}
                                {adm.status === "Rejected" && (
                                  <>
                                    {whatsappUrl && (
                                      <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                        onClick={() => setActiveMenuId(null)}
                                      >
                                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Contact Applicant</span>
                                      </a>
                                    )}

                                    <div className="border-t border-slate-100 my-1" />

                                    <button
                                      onClick={() => {
                                        setDeletingAdmissionObj(adm);
                                        setActiveMenuId(null);
                                      }}
                                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                      <span>Delete Application</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 max-w-sm mx-auto">
                      <Inbox className="w-10 h-10 text-slate-300 mb-3" />
                      <p className="text-sm font-extrabold text-slate-800">No admission applications found</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        New applications submitted through the RCI admission process will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE ADMISSIONS CARD VIEW (< 768px) */}
      <div className="md:hidden space-y-3">
        {filteredAdmissions.length > 0 ? (
          filteredAdmissions.map((adm) => {
            const initials = getInitials(adm.student_name);
            const isMenuOpen = activeMenuId === adm.id;
            const matchingStudentId = getMatchingStudentId(adm);

            const rawDigits = adm.phone?.replace(/[^0-9]/g, "") || "";
            const whatsappUrl = rawDigits.length >= 7
              ? `https://wa.me/${rawDigits}?text=Hello%20${encodeURIComponent(adm.student_name)},%20regarding%20your%20RCI%20admission%20application...`
              : null;

            return (
              <div key={adm.id} className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3 relative">
                {/* Header Row */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-slate-950 text-sm leading-snug truncate">{adm.student_name}</h3>
                      <p className="text-[11px] font-bold text-slate-700 truncate">{adm.selected_course || "Unspecified Course"}</p>
                    </div>
                  </div>

                  {/* Actions Dropdown Button */}
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setActiveMenuId(isMenuOpen ? null : adm.id)}
                      className="w-11 h-11 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-600/30 outline-none"
                      aria-label="Application actions"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 top-12 w-52 bg-white rounded-xl border border-slate-200 shadow-xl z-30 p-1 space-y-0.5 text-left">
                        <button
                          onClick={() => {
                            setViewingAdmission(adm);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span>View Application</span>
                        </button>

                        {adm.status === "Pending" && (
                          <>
                            <button
                              onClick={() => {
                                setApprovingAdmission(adm);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Approve Application</span>
                            </button>

                            <button
                              onClick={() => {
                                setRejectingAdmission(adm);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span>Reject Application</span>
                            </button>
                          </>
                        )}

                        {adm.status === "Approved" && (
                          <>
                            {matchingStudentId ? (
                              <Link
                                href={`/admin/students/${matchingStudentId}/edit`}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
                                onClick={() => setActiveMenuId(null)}
                              >
                                <UserCheck className="w-4 h-4 text-emerald-600" />
                                <span>View Student Record</span>
                              </Link>
                            ) : (
                              <button
                                onClick={() => {
                                  handleConvertAction(adm);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg"
                              >
                                <UserCheck className="w-4 h-4 text-blue-600" />
                                <span>Convert to Student</span>
                              </button>
                            )}

                            {whatsappUrl && (
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
                                onClick={() => setActiveMenuId(null)}
                              >
                                <MessageSquare className="w-4 h-4 text-emerald-600" />
                                <span>Contact Applicant</span>
                              </a>
                            )}
                          </>
                        )}

                        {adm.status === "Rejected" && (
                          <>
                            {whatsappUrl && (
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
                                onClick={() => setActiveMenuId(null)}
                              >
                                <MessageSquare className="w-4 h-4 text-slate-500" />
                                <span>Contact Applicant</span>
                              </a>
                            )}

                            <div className="border-t border-slate-100 my-1" />

                            <button
                              onClick={() => {
                                setDeletingAdmissionObj(adm);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                              <span>Delete Application</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase text-slate-400">Email</span>
                    <span className="font-medium text-slate-700 truncate block">{adm.email || "—"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase text-slate-400">Phone</span>
                    <span className="font-mono text-slate-700 block">{adm.phone || "—"}</span>
                  </div>
                </div>

                {/* Footer Status & Date */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  {getStatusPill(adm.status)}
                  <span className="text-[11px] text-slate-500 font-medium">
                    Applied: {new Date(adm.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center text-slate-400">
            <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-extrabold text-slate-800">No admission applications found</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or filters.</p>
          </div>
        )}
      </div>

      {/* QUICK PREVIEW ADMISSION PROFILE DRAWER */}
      <AdmissionProfileDrawer
        admission={viewingAdmission}
        matchingStudentId={viewingAdmission ? getMatchingStudentId(viewingAdmission) : null}
        onClose={() => setViewingAdmission(null)}
        onApprove={(adm) => setApprovingAdmission(adm)}
        onReject={(adm) => setRejectingAdmission(adm)}
        onDelete={(adm) => setDeletingAdmissionObj(adm)}
        onConvert={(adm) => handleConvertAction(adm)}
      />

      {/* APPROVE APPLICATION CONFIRMATION MODAL */}
      {approvingAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-950 tracking-tight">Approve Application?</h3>
                <p className="text-xs text-slate-500">Student profile creation & notification trigger.</p>
              </div>
            </div>

            {actionError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-semibold">
                {actionError}
              </div>
            )}

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Are you sure you want to approve the application for <strong className="text-slate-900 font-bold">{approvingAdmission.student_name}</strong>? This will create a student record and notify the candidate.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setApprovingAdmission(null);
                  setActionError("");
                }}
                disabled={isProcessing}
                className="h-11 px-5 rounded-xl border border-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveConfirm}
                disabled={isProcessing}
                className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-md shadow-emerald-500/20 disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Approving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Application</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT APPLICATION CONFIRMATION MODAL */}
      {rejectingAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-950 tracking-tight">Reject Application?</h3>
                <p className="text-xs text-slate-500">Application status update.</p>
              </div>
            </div>

            {actionError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-semibold">
                {actionError}
              </div>
            )}

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Are you sure you want to reject the application for <strong className="text-slate-900 font-bold">{rejectingAdmission.student_name}</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setRejectingAdmission(null);
                  setActionError("");
                }}
                disabled={isProcessing}
                className="h-11 px-5 rounded-xl border border-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={isProcessing}
                className="h-11 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-md shadow-red-500/20 disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Rejecting...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Reject Application</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE APPLICATION CONFIRMATION MODAL */}
      {deletingAdmissionObj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-950 tracking-tight">Delete Application?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            {actionError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-semibold">
                {actionError}
              </div>
            )}

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete the application for <strong className="text-slate-900 font-bold">{deletingAdmissionObj.student_name}</strong>? This will permanently remove the application record from the database.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setDeletingAdmissionObj(null);
                  setActionError("");
                }}
                disabled={isProcessing}
                className="h-11 px-5 rounded-xl border border-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isProcessing}
                className="h-11 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-md shadow-red-500/20 disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Application</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
