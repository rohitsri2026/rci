"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Plus, Search, Filter, ArrowUpDown, Edit3, Trash2, 
  MoreVertical, Copy, Check, Users, AlertTriangle, Loader2, User
} from "lucide-react";
import StudentProfileDrawer from "./StudentProfileDrawer";
import ActionDropdown from "@/components/ui/ActionDropdown";
import StudentAvatar from "@/components/student/StudentAvatar";

interface Student {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  photo_url?: string | null;
  created_at: string;
  course_id: string | null;
  courses?: {
    course_name: string;
  } | null;
}

interface Course {
  id: string;
  course_name: string;
}

interface StudentListClientProps {
  initialStudents: Student[];
  courses: Course[];
}

export default function StudentListClient({ initialStudents, courses }: StudentListClientProps) {
  const router = useRouter();

  // Local state for students
  const [students, setStudents] = useState<Student[]>(initialStudents);

  useEffect(() => {
    setStudents(initialStudents);
  }, [initialStudents]);

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "name">("newest");

  // Interaction & Modal States
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Filtered & Sorted Students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const query = search.toLowerCase().trim();
        const matchesName = s.full_name?.toLowerCase().includes(query);
        const matchesEmail = s.email?.toLowerCase().includes(query);
        const matchesPhone = s.phone?.toLowerCase().includes(query);
        const matchesQuery = !query || matchesName || matchesEmail || matchesPhone;

        const matchesCourse =
          selectedCourse === "all" || s.course_id === selectedCourse || s.courses?.course_name === selectedCourse;

        return matchesQuery && matchesCourse;
      })
      .sort((a, b) => {
        if (sortOrder === "newest") {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortOrder === "oldest") {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortOrder === "name") {
          return a.full_name.localeCompare(b.full_name);
        }
        return 0;
      });
  }, [students, search, selectedCourse, sortOrder]);

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
    setActiveMenuId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent || isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/students/${deletingStudent.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeletingStudent(null);
        router.refresh();
      } else {
        alert("Failed to delete student. Please try again.");
      }
    } catch {
      alert("A network error occurred while deleting the student.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "ST";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-display">
            Students
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage all registered students.
          </p>
        </div>

        <Link
          href="/admin/students/new"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Student</span>
        </Link>
      </div>

      {/* Professional Search & Filtering Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          {/* Search Field */}
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
          <div className="relative min-w-[160px]">
            <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full h-10 pl-9 pr-8 border border-slate-200/90 rounded-xl text-slate-800 text-xs font-bold bg-slate-50/40 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.course_name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order Dropdown */}
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

        {/* Results Counter Pill */}
        <div className="text-xs font-extrabold text-slate-600 bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-full text-center shrink-0">
          {filteredStudents.length} {filteredStudents.length === 1 ? "student" : "students"} found
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10.5px] border-b border-slate-200/90">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Enrolled On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const initials = getInitials(student.full_name);
                  const isMenuOpen = activeMenuId === student.id;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* STUDENT NAME: font-extrabold text-slate-950 (Visually Strongest) */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <StudentAvatar
                            photoUrl={student.photo_url}
                            studentName={student.full_name}
                            size="sm"
                          />
                          <div>
                            <p className="font-extrabold text-slate-950 text-sm leading-snug">{student.full_name}</p>
                            {student.address && (
                              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[180px]">{student.address}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* EMAIL: text-xs text-slate-600 font-medium */}
                      <td className="px-6 py-4 text-slate-600 font-medium text-xs">{student.email || "—"}</td>

                      {/* PHONE: text-xs text-slate-600 font-mono */}
                      <td className="px-6 py-4 font-mono text-slate-600 text-xs">{student.phone || "—"}</td>

                      {/* COURSE: font-bold text-slate-800 text-xs (Allows Natural Wrapping) */}
                      <td className="px-6 py-4 font-bold text-slate-800 text-xs leading-snug max-w-[220px]">
                        {student.courses?.course_name || "—"}
                      </td>

                      {/* ENROLLED DATE: text-xs text-slate-600 font-medium */}
                      <td className="px-6 py-4 text-slate-600 font-medium text-xs">
                        {new Date(student.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <ActionDropdown ariaLabel="Student actions" menuClassName="w-48 bg-white rounded-xl border border-slate-200/90 shadow-xl p-1 space-y-0.5 text-left">
                            {({ close }) => (
                              <>
                                <button
                                  onClick={() => {
                                    setViewingStudent(student);
                                    close();
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                  <User className="w-3.5 h-3.5 text-blue-600" />
                                  <span>View Profile</span>
                                </button>

                                <Link
                                  href={`/admin/students/${student.id}/edit`}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                  onClick={close}
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Edit Student</span>
                                </Link>

                                {student.email && (
                                  <button
                                    onClick={() => handleCopy(student.email!, `email-${student.id}`)}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                  >
                                    {copiedField === `email-${student.id}` ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                                    )}
                                    <span>{copiedField === `email-${student.id}` ? "Copied Email!" : "Copy Email"}</span>
                                  </button>
                                )}

                                {student.phone && (
                                  <button
                                    onClick={() => handleCopy(student.phone!, `phone-${student.id}`)}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                  >
                                    {copiedField === `phone-${student.id}` ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                                    )}
                                    <span>{copiedField === `phone-${student.id}` ? "Copied Phone!" : "Copy Phone"}</span>
                                  </button>
                                )}

                                <div className="border-t border-slate-100 my-1" />

                                <button
                                  onClick={() => {
                                    setDeletingStudent(student);
                                    close();
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                  <span>Delete Student</span>
                                </button>
                              </>
                            )}
                          </ActionDropdown>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 max-w-sm mx-auto">
                      <Users className="w-10 h-10 text-slate-300 mb-3" />
                      <p className="text-sm font-extrabold text-slate-800">No students found</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Try adjusting your search query or course filters, or add a new student.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE STUDENT CARD LIST */}
      <div className="md:hidden space-y-3">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => {
            const initials = getInitials(student.full_name);
            const isMenuOpen = activeMenuId === student.id;

            return (
              <div key={student.id} className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3 relative">
                {/* Header Row */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <StudentAvatar
                      photoUrl={student.photo_url}
                      studentName={student.full_name}
                      size="md"
                    />
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-slate-950 text-sm leading-snug truncate">{student.full_name}</h3>
                      <p className="text-[11px] font-bold text-blue-600 truncate">{student.courses?.course_name || "No Course"}</p>
                    </div>
                  </div>

                  {/* Actions Dropdown Button */}
                  <div className="shrink-0">
                    <ActionDropdown
                      ariaLabel="Student actions"
                      triggerClassName="w-11 h-11 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-600/30 outline-none"
                      triggerIcon={<MoreVertical className="w-5 h-5" />}
                      menuClassName="w-48 bg-white rounded-xl border border-slate-200 shadow-xl p-1 space-y-0.5 text-left"
                    >
                      {({ close }) => (
                        <>
                          <button
                            onClick={() => {
                              setViewingStudent(student);
                              close();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
                          >
                            <User className="w-4 h-4 text-blue-600" />
                            <span>View Profile</span>
                          </button>

                          <Link
                            href={`/admin/students/${student.id}/edit`}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
                            onClick={close}
                          >
                            <Edit3 className="w-4 h-4 text-slate-500" />
                            <span>Edit Student</span>
                          </Link>

                          {student.email && (
                            <button
                              onClick={() => handleCopy(student.email!, `email-${student.id}`)}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
                            >
                              <Copy className="w-4 h-4 text-slate-400" />
                              <span>{copiedField === `email-${student.id}` ? "Copied Email!" : "Copy Email"}</span>
                            </button>
                          )}

                          {student.phone && (
                            <button
                              onClick={() => handleCopy(student.phone!, `phone-${student.id}`)}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
                            >
                              <Copy className="w-4 h-4 text-slate-400" />
                              <span>{copiedField === `phone-${student.id}` ? "Copied Phone!" : "Copy Phone"}</span>
                            </button>
                          )}

                          <div className="border-t border-slate-100 my-1" />

                          <button
                            onClick={() => {
                              setDeletingStudent(student);
                              close();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                            <span>Delete Student</span>
                          </button>
                        </>
                      )}
                    </ActionDropdown>
                  </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase text-slate-400">Email</span>
                    <span className="font-medium text-slate-700 truncate block">{student.email || "—"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase text-slate-400">Phone</span>
                    <span className="font-mono text-slate-700 block">{student.phone || "—"}</span>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Enrolled: {new Date(student.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  {student.address && <span className="truncate max-w-[140px]">{student.address}</span>}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center text-slate-400">
            <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-extrabold text-slate-800">No students found</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or filters.</p>
          </div>
        )}
      </div>

      {/* QUICK PREVIEW STUDENT PROFILE DRAWER */}
      <StudentProfileDrawer
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
        onPhotoUpdated={(studentId, photoUrl) => {
          setStudents((prev) =>
            prev.map((s) => (s.id === studentId ? { ...s, photo_url: photoUrl } : s))
          );
          if (viewingStudent && viewingStudent.id === studentId) {
            setViewingStudent({ ...viewingStudent, photo_url: photoUrl });
          }
        }}
      />

      {/* DELETE CONFIRMATION DIALOG MODAL */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-950 tracking-tight">Delete Student?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900 font-bold">{deletingStudent.full_name}</strong>? This will permanently remove their student profile from the database.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDeletingStudent(null)}
                disabled={isDeleting}
                className="h-11 px-5 rounded-xl border border-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="h-11 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-md shadow-red-500/20 disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Student</span>
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
