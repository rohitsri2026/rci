"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Plus, Search, Filter, ArrowUpDown, Edit3, Trash2, 
  MoreVertical, BookOpen, Clock, Banknote, Users, Eye, 
  Power, AlertTriangle, Loader2, CheckCircle2, XCircle, Tag, X
} from "lucide-react";
import { Course } from "@/types/course";
import CourseProfileDrawer from "./CourseProfileDrawer";
import ActionDropdown from "@/components/ui/ActionDropdown";
import { toggleCourseStatus, deleteCourse } from "../course-actions-server";

interface CourseListClientProps {
  initialCourses: Course[];
}

export default function CourseListClient({ initialCourses }: CourseListClientProps) {
  const router = useRouter();

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "name">("newest");

  // Interaction & Drawer / Modal States
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [deleteBlockedError, setDeleteBlockedError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingId, setIsTogglingId] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Close active dropdown menu on global Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenuId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtered & Sorted Courses
  const filteredCourses = useMemo(() => {
    return initialCourses
      .filter((c) => {
        const query = search.toLowerCase().trim();
        const matchesName = c.course_name?.toLowerCase().includes(query);
        const matchesDesc = c.description?.toLowerCase().includes(query);
        const matchesQuery = !query || matchesName || matchesDesc;

        const currentStatus = c.status || "Active";
        const matchesStatus = statusFilter === "all" || currentStatus === statusFilter;

        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => {
        if (sortOrder === "newest") {
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        }
        if (sortOrder === "oldest") {
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        }
        if (sortOrder === "name") {
          return a.course_name.localeCompare(b.course_name);
        }
        return 0;
      });
  }, [initialCourses, search, statusFilter, sortOrder]);

  const handleToggleStatus = async (courseId: string, currentStatus: string) => {
    setIsTogglingId(courseId);
    setActiveMenuId(null);
    const res = await toggleCourseStatus(courseId, currentStatus);
    setIsTogglingId(null);

    if (res.success) {
      if (viewingCourse && viewingCourse.id === courseId) {
        setViewingCourse((prev) => prev ? { ...prev, status: res.newStatus || "Active" } : null);
      }
      setToast({
        message: `Course status updated to ${res.newStatus || "Active"}.`,
        type: "success",
      });
      router.refresh();
    } else {
      setToast({
        message: res.error || "Unable to update course status. Please try again.",
        type: "error",
      });
    }
  };

  const handleDeleteRequest = (course: Course) => {
    setActiveMenuId(null);
    setDeletingCourse(course);
    setDeleteBlockedError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCourse || isDeleting) return;

    setIsDeleting(true);
    setDeleteBlockedError(null);

    const res = await deleteCourse(deletingCourse.id);
    setIsDeleting(false);

    if (res.success) {
      setDeletingCourse(null);
      if (viewingCourse?.id === deletingCourse.id) {
        setViewingCourse(null);
      }
      router.refresh();
    } else {
      if (res.isReferenced || res.error?.toLowerCase().includes("cannot delete")) {
        setDeleteBlockedError(res.error || "Cannot delete this course because existing student/admission records are associated with it.");
      } else {
        alert(res.error || "Failed to delete course. Please try again.");
      }
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "RC";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-bottom-4 duration-200 ${
          toast.type === "success" 
            ? "bg-slate-900 text-white border-slate-800" 
            : "bg-red-950 text-red-100 border-red-800"
        }`}>
          <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-emerald-400" : "bg-red-400"}`} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-display">
            Course Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage institute courses, programs, fees and availability.
          </p>
        </div>

        <Link
          href="/admin/courses/new"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </Link>
      </div>

      {/* Toolbar: Search, Filters & Stats */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer"
            >
              <option value="all">Status: All</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
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

          {/* Result Count Badge */}
          <div className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-extrabold text-slate-600 shrink-0">
            {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredCourses.length > 0 ? (
        <>
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden lg:block bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 rounded-t-2xl">
                  <th className="py-3.5 px-5 rounded-tl-2xl">COURSE</th>
                  <th className="py-3.5 px-5">DESCRIPTION</th>
                  <th className="py-3.5 px-5">DURATION</th>
                  <th className="py-3.5 px-5">FEE</th>
                  <th className="py-3.5 px-5">STUDENTS</th>
                  <th className="py-3.5 px-5">STATUS</th>
                  <th className="py-3.5 px-5 text-right rounded-tr-2xl">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredCourses.map((course, index) => {
                  const isActive = (course.status || "Active") === "Active";
                  const isMenuOpen = activeMenuId === course.id;
                  const isNearBottom = index >= Math.max(1, filteredCourses.length - 2) && filteredCourses.length > 1;

                  return (
                    <tr 
                      key={course.id} 
                      className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                      onClick={() => setViewingCourse(course)}
                    >
                      {/* Course Column */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-200/60 flex items-center justify-center font-extrabold text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            {getInitials(course.course_name)}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block leading-tight text-sm">
                              {course.course_name}
                            </span>
                            {course.slug && (
                              <span className="text-[11px] text-slate-400 font-mono">
                                /{course.slug}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Description Column */}
                      <td className="py-4 px-5 max-w-xs">
                        <p className="text-slate-500 line-clamp-2 text-xs">
                          {course.description || "No description provided."}
                        </p>
                      </td>

                      {/* Duration Column */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{course.duration || "Self-Paced"}</span>
                        </div>
                      </td>

                      {/* Fee Column */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="font-extrabold text-slate-950 text-sm">
                          ₹{course.fees?.toLocaleString("en-IN") ?? "0"}
                        </span>
                      </td>

                      {/* Enrolled Students Count Column */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-700 text-xs">
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                          <span>{course.student_count ?? 0}</span>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide border ${
                          isActive 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                          {isActive ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-slate-400" />}
                          {course.status || "Active"}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="py-4 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <ActionDropdown ariaLabel="Course actions" menuClassName="w-48 bg-white rounded-xl border border-slate-200/90 shadow-xl p-1.5 text-left space-y-0.5">
                            {({ close }) => (
                              <>
                                <button
                                  onClick={() => {
                                    close();
                                    setViewingCourse(course);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                                  <span>View Course</span>
                                </button>

                                <Link
                                  href={`/admin/courses/${course.id}/edit`}
                                  onClick={close}
                                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Edit Course</span>
                                </Link>

                                <button
                                  onClick={() => {
                                    close();
                                    handleToggleStatus(course.id, course.status || "Active");
                                  }}
                                  disabled={isTogglingId === course.id}
                                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 transition-colors"
                                >
                                  <Power className={`w-3.5 h-3.5 ${isActive ? "text-amber-600" : "text-emerald-600"}`} />
                                  <span>{isTogglingId === course.id ? "Updating..." : isActive ? "Deactivate" : "Activate"}</span>
                                </button>

                                <div className="my-1 border-t border-slate-100" />

                                <button
                                  onClick={() => {
                                    close();
                                    handleDeleteRequest(course);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Course</span>
                                </button>
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

          {/* Mobile Course Cards (Shown on mobile & tablets < 1024px) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
            {filteredCourses.map((course) => {
              const isActive = (course.status || "Active") === "Active";

              return (
                <div 
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all cursor-pointer"
                  onClick={() => setViewingCourse(course)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-blue-600/10 text-blue-600 border border-blue-200/60 flex items-center justify-center font-extrabold text-sm shrink-0">
                        {getInitials(course.course_name)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-950 text-base leading-tight">
                          {course.course_name}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          {course.duration || "Self-Paced"}
                        </p>
                      </div>
                    </div>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase border ${
                      isActive 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      {course.status || "Active"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {course.description || "No description available."}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Fee</span>
                      <span className="font-extrabold text-slate-900 text-sm">₹{course.fees?.toLocaleString("en-IN") ?? "0"}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">Enrolled Students</span>
                      <span className="font-extrabold text-blue-600">{course.student_count ?? 0}</span>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setViewingCourse(course)}
                        className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs"
                        aria-label="View course profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl border border-slate-200 bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center font-bold text-xs"
                        aria-label="Edit course"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs py-16 px-4 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              {search || statusFilter !== "all" ? "No matching courses found" : "No courses published yet"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search || statusFilter !== "all" 
                ? "Try adjusting your search criteria or resetting status filters." 
                : "Create your first institute course to publish it to the student enrollment registry."}
            </p>
          </div>

          <div>
            {search || statusFilter !== "all" ? (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                href="/admin/courses/new"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" /> Add First Course
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Course Profile Drawer Component */}
      <CourseProfileDrawer
        course={viewingCourse}
        onClose={() => setViewingCourse(null)}
        onEdit={(id) => router.push(`/admin/courses/${id}/edit`)}
        onToggleStatus={handleToggleStatus}
      />

      {/* Delete Confirmation & Protection Modal */}
      {deletingCourse && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setDeletingCourse(null)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Delete course modal"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                deleteBlockedError ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-red-50 text-red-600 border border-red-200"
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-base font-extrabold text-slate-950 tracking-tight">
                  {deleteBlockedError ? "Course Cannot Be Deleted" : "Delete Course?"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {deleteBlockedError ? deleteBlockedError : (
                    <>Are you sure you want to permanently delete <strong className="text-slate-900">{deletingCourse.course_name}</strong>? This action cannot be undone.</>
                  )}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              {deleteBlockedError ? (
                <>
                  <button
                    onClick={() => setDeletingCourse(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-extrabold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const courseToToggle = deletingCourse;
                      setDeletingCourse(null);
                      handleToggleStatus(courseToToggle.id, courseToToggle.status || "Active");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition-colors shadow-md shadow-amber-600/20"
                  >
                    Deactivate Course Instead
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setDeletingCourse(null)}
                    disabled={isDeleting}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-extrabold text-xs hover:bg-slate-50 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs disabled:opacity-50 transition-colors shadow-md shadow-red-600/20"
                  >
                    {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isDeleting ? "Deleting..." : "Delete Course"}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
