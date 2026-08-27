"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  Send,
  Trash2,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  BookMarked,
  FlaskConical,
  CreditCard,
  Award,
  AlertCircle,
  RefreshCw,
  Search,
  MessageSquare,
} from "lucide-react";

interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  status: string;
  created_at: string;
  recipient_scope: "all" | "student" | "course";
  student_name?: string;
  action_url?: string;
  sent_by?: string;
}

interface StudentOption {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
}

interface CourseOption {
  id: string;
  course_name: string;
}

export default function AdminNotificationCenter() {
  const [activeTab, setActiveTab] = useState<"inapp" | "logs">("inapp");
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("NOTICE");
  const [recipientScope, setRecipientScope] = useState<"all" | "student" | "course">("all");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [publishing, setPublishing] = useState(false);

  // Student loading & search state for dropdown
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState("");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");

  // Feedback & Search
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Dedicated Student loader to guarantee students populate cleanly in dropdown
  const loadStudents = useCallback(async () => {
    setStudentsLoading(true);
    setStudentsError("");
    try {
      const res = await fetch("/api/students");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setStudents(
            data.map((s: any) => ({
              id: s.id,
              full_name: s.full_name,
              phone: s.phone,
              email: s.email,
              user_id: s.user_id,
            }))
          );
          return;
        }
      }

      // Fallback query to /api/admin/notifications/inapp
      const fallbackRes = await fetch("/api/admin/notifications/inapp");
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        if (fallbackData.students && fallbackData.students.length > 0) {
          setStudents(fallbackData.students);
        } else {
          setStudentsError("No registered students found.");
        }
      } else {
        setStudentsError("Unable to load student registry.");
      }
    } catch (err: any) {
      console.error("Failed to load student registry:", err);
      setStudentsError("Network error loading student list.");
    } finally {
      setStudentsLoading(false);
    }
  }, []);

  const fetchInAppNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications/inapp");
      const data = await res.json();
      if (res.ok && data.notifications) {
        setNotifications(data.notifications);
        if (data.students && data.students.length > 0) {
          setStudents(data.students);
        } else {
          loadStudents();
        }
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [loadStudents]);

  useEffect(() => {
    fetchInAppNotifications();
  }, [fetchInAppNotifications]);

  // Eagerly trigger student loading when Create Notification modal opens
  useEffect(() => {
    if (showCreateModal && students.length === 0 && !studentsLoading) {
      loadStudents();
    }
  }, [showCreateModal, students.length, studentsLoading, loadStudents]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setFeedback({ type: "error", text: "Please provide both title and message content." });
      return;
    }

    if (recipientScope === "student" && !selectedStudentId) {
      setFeedback({ type: "error", text: "Please select a specific student from the dropdown." });
      return;
    }

    if (recipientScope === "course" && !selectedCourseId) {
      setFeedback({ type: "error", text: "Please select a target course from the dropdown." });
      return;
    }

    setPublishing(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/notifications/inapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          category,
          recipientScope,
          studentId: selectedStudentId,
          courseId: selectedCourseId,
          actionUrl: actionUrl.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setFeedback({
          type: "success",
          text: data.message || "Notification published successfully to student portal!",
        });
        setTitle("");
        setMessage("");
        setActionUrl("");
        setShowCreateModal(false);
        fetchInAppNotifications();
      } else {
        setFeedback({ type: "error", text: data.error || "Failed to publish notification." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Network error publishing notification." });
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification record?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/notifications/inapp?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setFeedback({ type: "success", text: "Notification deleted successfully." });
      } else {
        const data = await res.json();
        setFeedback({ type: "error", text: data.error || "Failed to delete notification." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: "Network error deleting notification." });
    } finally {
      setDeletingId(null);
    }
  };

  // KPI Calculations
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const todayStr = new Date().toISOString().split("T")[0];
  const sentTodayCount = notifications.filter(
    (n) => n.created_at && n.created_at.startsWith(todayStr)
  ).length;
  const studentsReachedCount = Array.from(
    new Set(notifications.map((n) => n.student_name))
  ).length;

  const filteredNotifications = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.student_name && n.student_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 sm:p-8 space-y-7 max-w-7xl mx-auto selection:bg-blue-500 selection:text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#155EEF] text-white flex items-center justify-center font-extrabold shadow-md shadow-blue-500/20 shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-display tracking-tight">
              Student Notification Management
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
              Create, publish, and audit in-app announcements, fee alerts, and student notifications.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#155EEF] hover:bg-blue-700 text-white font-extrabold text-xs inline-flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Notification</span>
          </button>

          <button
            onClick={fetchInAppNotifications}
            disabled={loading}
            className="min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs inline-flex items-center justify-center gap-1.5 transition-colors shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="text-xs font-black underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Overview KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-1 shadow-2xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Total Notifications
          </p>
          <p className="text-2xl font-extrabold text-slate-900 font-display">{totalCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-amber-200/90 p-4 space-y-1 shadow-2xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
            Unread Notifications
          </p>
          <p className="text-2xl font-extrabold text-amber-800 font-display">{unreadCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-blue-200/90 p-4 space-y-1 shadow-2xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">
            Published Today
          </p>
          <p className="text-2xl font-extrabold text-blue-800 font-display">{sentTodayCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-purple-200/90 p-4 space-y-1 shadow-2xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700">
            Students Reached
          </p>
          <p className="text-2xl font-extrabold text-purple-800 font-display">{studentsReachedCount}</p>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, message, student..."
              className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-slate-50/40 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <span className="text-xs text-slate-500 font-bold">
            Showing {filteredNotifications.length} records
          </span>
        </div>

        {/* Notifications Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs font-bold animate-pulse">
              Loading in-app notifications...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Bell className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-extrabold text-slate-800">No Student Notifications Found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No in-app student notifications have been created yet. Click &quot;Create Notification&quot; to publish announcements to students.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Category & Scope</th>
                  <th className="py-3.5 px-4">Title & Content</th>
                  <th className="py-3.5 px-4">Recipient</th>
                  <th className="py-3.5 px-4">Date / Time</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNotifications.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Category & Scope */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                          {n.type}
                        </span>
                        <span className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                          Scope: {n.recipient_scope}
                        </span>
                      </div>
                    </td>

                    {/* Title & Message */}
                    <td className="py-3.5 px-4 max-w-md">
                      <p className="font-extrabold text-slate-900 text-sm">{n.title}</p>
                      <p className="text-slate-500 font-medium line-clamp-2 mt-0.5" title={n.message}>
                        {n.message}
                      </p>
                      {n.action_url && (
                        <span className="text-[10px] text-blue-600 font-mono font-bold mt-1 inline-block truncate max-w-xs">
                          Action: {n.action_url}
                        </span>
                      )}
                    </td>

                    {/* Recipient */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800">{n.student_name}</span>
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {n.created_at ? new Date(n.created_at).toLocaleString("en-IN") : "—"}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(n.id)}
                        disabled={deletingId === n.id}
                        className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors disabled:opacity-50 min-h-[36px] min-w-[36px]"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#155EEF] border border-blue-100 flex items-center justify-center">
                  <Send className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-950 font-display">
                  Create Student Notification
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-4 text-xs">
              {/* Category */}
              <div>
                <label className="block font-extrabold text-slate-800 mb-1">
                  Notification Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3 border border-slate-200 rounded-xl font-bold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="NOTICE">📢 New Notice (General)</option>
                  <option value="STUDY_MATERIAL">📚 New Study Material</option>
                  <option value="TEST">📝 New Test / Exam</option>
                  <option value="FEE_REMINDER">💰 Fee Reminder</option>
                  <option value="CERTIFICATE">🏆 Certificate Issued</option>
                  <option value="IMPORTANT">🔔 Important Announcement</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block font-extrabold text-slate-800 mb-1">
                  Notification Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hindi Typing Assessment Scheduled"
                  required
                  className="w-full h-11 px-3 border border-slate-200 rounded-xl font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Message Content */}
              <div>
                <label className="block font-extrabold text-slate-800 mb-1">
                  Message Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write clear, concise notification details..."
                  rows={4}
                  required
                  className="w-full p-3 border border-slate-200 rounded-xl font-medium text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Recipient Scope */}
              <div>
                <label className="block font-extrabold text-slate-800 mb-1">
                  Recipient Scope <span className="text-rose-500">*</span>
                </label>
                <select
                  value={recipientScope}
                  onChange={(e) => setRecipientScope(e.target.value as any)}
                  className="w-full h-11 px-3 border border-slate-200 rounded-xl font-bold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">📢 All Students (Broadcast)</option>
                  <option value="student">👤 Specific Student</option>
                  <option value="course">🎓 Students of Specific Course</option>
                </select>
              </div>

              {/* Specific Student Select */}
              {recipientScope === "student" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-extrabold text-slate-800">
                      Select Recipient Student <span className="text-rose-500">*</span>
                    </label>
                    {studentsError && (
                      <button
                        type="button"
                        onClick={loadStudents}
                        className="text-[10px] font-black text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Retry Loading</span>
                      </button>
                    )}
                  </div>

                  {/* Search Filter Box */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                      placeholder="Type to filter student name, phone, or email..."
                      className="w-full h-9 pl-8 pr-3 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    required
                    disabled={studentsLoading}
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="">
                      {studentsLoading
                        ? "⏳ Loading student registry..."
                        : studentsError
                        ? `⚠️ ${studentsError}`
                        : students.length === 0
                        ? "No registered students found"
                        : "-- Choose Recipient Student --"}
                    </option>
                    {students
                      .filter((s) => {
                        if (!studentSearchQuery.trim()) return true;
                        const q = studentSearchQuery.toLowerCase().trim();
                        return (
                          s.full_name?.toLowerCase().includes(q) ||
                          (s.phone && s.phone.includes(q)) ||
                          (s.email && s.email.toLowerCase().includes(q))
                        );
                      })
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.full_name} {s.phone ? `— ${s.phone}` : ""} {s.email ? `(${s.email})` : ""}
                        </option>
                      ))}
                  </select>

                  <p className="text-[10.5px] text-slate-500 font-medium">
                    {students.length > 0 ? (
                      <span>Found <strong>{students.length}</strong> eligible student(s) in database.</span>
                    ) : (
                      <span className="text-amber-600 font-bold">Checking student registry...</span>
                    )}
                  </p>
                </div>
              )}

              {/* Course Select */}
              {recipientScope === "course" && (
                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">
                    Select Target Course <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    required
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Choose Course --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.course_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Optional Action URL */}
              <div>
                <label className="block font-extrabold text-slate-800 mb-1">
                  Action Button URL <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="e.g. /student/fees or /student/materials"
                  className="w-full h-11 px-3 border border-slate-200 rounded-xl font-mono text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-extrabold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishing}
                  className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#155EEF] hover:bg-blue-700 text-white font-extrabold text-xs inline-flex items-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{publishing ? "Publishing..." : "Send Notification"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
