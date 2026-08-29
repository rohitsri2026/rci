"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  X,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  MapPin,
  Edit3,
  User,
  MessageSquare,
  Camera,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import NotificationTrigger from "@/components/admin/notifications/NotificationTrigger";
import StudentAvatar from "@/components/student/StudentAvatar";
import { validateStudentPhoto, optimizeStudentPhoto } from "@/lib/image-utils";

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

interface StudentProfileDrawerProps {
  student: Student | null;
  onClose: () => void;
  onPhotoUpdated?: (studentId: string, photoUrl: string | null) => void;
}

export default function StudentProfileDrawer({
  student,
  onClose,
  onPhotoUpdated,
}: StudentProfileDrawerProps) {
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state when student prop changes
  useEffect(() => {
    if (student) {
      setCurrentPhotoUrl(student.photo_url || null);
      setFeedback(null);
    }
  }, [student]);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!student) return null;

  const isProcessing = isUploading || isDeleting;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFeedback(null);

    // 1. Validate file
    const validation = validateStudentPhoto(selectedFile);
    if (!validation.valid) {
      setFeedback({ type: "error", message: validation.error! });
      // Reset input value
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);

    try {
      // 2. Client-side crop & compress
      const { blob } = await optimizeStudentPhoto(selectedFile, 600);
      const uploadFile = new File([blob], selectedFile.name, {
        type: blob.type,
      });

      const formData = new FormData();
      formData.append("file", uploadFile);

      // 3. Upload via protected API endpoint
      const res = await fetch(`/api/admin/students/${student.id}/photo`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to update student photo. Please try again.");
      }

      setCurrentPhotoUrl(data.photo_url);
      setFeedback({
        type: "success",
        message: "Student photo updated successfully.",
      });

      // Notify parent component if callback provided
      onPhotoUpdated?.(student.id, data.photo_url);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Unable to update student photo. Please try again.",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeletePhoto = async () => {
    if (!currentPhotoUrl || isProcessing) return;

    if (!confirm(`Are you sure you want to remove the profile photo for ${student.full_name}?`)) {
      return;
    }

    setFeedback(null);
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/students/${student.id}/photo`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to remove student photo. Please try again.");
      }

      setCurrentPhotoUrl(null);
      setFeedback({
        type: "success",
        message: "Student photo removed successfully.",
      });

      onPhotoUpdated?.(student.id, null);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Unable to remove student photo. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />

      {/* Drawer Container */}
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200/90 flex flex-col justify-between z-10 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-drawer-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <h2 id="student-drawer-title" className="text-base font-extrabold text-slate-950 tracking-tight">
              Student Profile
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close profile drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* PREMIUM STUDENT PHOTO SECTION */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Photo Preview Container */}
              <div className="relative group">
                <StudentAvatar
                  photoUrl={currentPhotoUrl}
                  studentName={student.full_name}
                  size="2xl"
                  border={true}
                  className="shadow-md ring-4 ring-white"
                />
                
                {isProcessing && (
                  <div className="absolute inset-0 bg-slate-950/60 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center text-white gap-1 backdrop-blur-2xs">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">
                      {isUploading ? "Uploading..." : "Removing..."}
                    </span>
                  </div>
                )}
              </div>

              {/* Identity & Photo Action Buttons */}
              <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950 tracking-tight leading-snug truncate">
                    {student.full_name}
                  </h3>
                  <p className="text-xs font-bold text-blue-600 mt-0.5 truncate">
                    {student.courses?.course_name || "Enrolled Student"}
                  </p>
                </div>

                {/* Upload & Delete Controls */}
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="min-h-[44px] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-xs inline-flex items-center gap-2 transition-all shadow-sm shadow-blue-500/20 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                    <span>{currentPhotoUrl ? "Change Photo" : "Upload Photo"}</span>
                  </button>

                  {currentPhotoUrl && (
                    <button
                      type="button"
                      onClick={handleDeletePhoto}
                      disabled={isProcessing}
                      className="min-h-[44px] px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-xl font-extrabold text-xs inline-flex items-center gap-1.5 transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Remove student photo"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-rose-600" />
                      )}
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Inline Toast / Feedback Banner */}
            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-start gap-2 animate-in fade-in duration-200 ${
                  feedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span className="leading-snug">{feedback.message}</span>
              </div>
            )}
          </div>

          {/* Section 1: CONTACT */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
              Contact Information
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase text-slate-400">Email Address</span>
                  <span className="font-semibold text-slate-900 truncate block">{student.email || "Not provided"}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase text-slate-400">Phone Number</span>
                  <span className="font-mono font-semibold text-slate-900 block">{student.phone || "Not provided"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: ENROLLMENT */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
              Enrollment Details
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                <BookOpen className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase text-slate-400">Enrolled Course</span>
                  <span className="font-bold text-slate-900 block leading-snug">{student.courses?.course_name || "Unassigned"}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase text-slate-400">Enrolled On</span>
                  <span className="font-semibold text-slate-900 block">
                    {new Date(student.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: STUDENT AUTHENTICATION */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100 flex items-center justify-between">
              <span>Student Authentication</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                student.phone
                  ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                  : "text-amber-700 bg-amber-50 border-amber-200"
              }`}>
                {student.phone ? "Student Login Ready" : "Phone Number Required"}
              </span>
            </h4>

            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Login Credentials:</span>
                <span className="font-mono font-extrabold text-blue-700">
                  {student.phone ? "10-Digit Registered Phone" : "Not Set"}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Initial Login ID and Password is the student&apos;s registered phone number. Passwords are securely hashed via Supabase Auth.
              </p>

              {student.phone && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm(`Reset password for ${student.full_name} to registered phone number (${student.phone})?`)) {
                      return;
                    }
                    try {
                      const res = await fetch("/api/student/reset-password", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ studentId: student.id }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error || "Failed to reset password");
                      alert(data.message || "Student password reset successfully!");
                    } catch (err: any) {
                      alert(err.message || "Failed to reset password.");
                    }
                  }}
                  className="w-full min-h-[44px] mt-1.5 py-2 px-3 bg-white hover:bg-slate-50 border border-blue-200 text-blue-700 font-extrabold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Reset Student Password</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 4: MANUAL NOTIFICATIONS */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Send Manual Notification
            </h4>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold text-slate-900">WhatsApp / SMS</p>
                <p className="text-[11px] text-slate-500 font-medium">Send template or custom message</p>
              </div>
              <NotificationTrigger
                studentId={student.id}
                studentName={student.full_name}
                studentPhone={student.phone || ""}
                type="general"
                size="xs"
              />
            </div>
          </div>

          {/* Section 5: ADDRESS (Rendered ONLY if address exists) */}
          {student.address && (
            <div className="space-y-3">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                Address / Location
              </h4>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100 text-xs">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase text-slate-400">Address</span>
                  <span className="font-semibold text-slate-900 block leading-relaxed">{student.address}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-5 border-t border-slate-100 bg-white sticky bottom-0 z-10 space-y-2">
          <Link
            href={`/admin/communication?student_id=${student.id}`}
            className="w-full h-11 inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-extrabold text-xs sm:text-sm transition-all"
            onClick={onClose}
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Open Communication Center</span>
          </Link>

          <Link
            href={`/admin/students/${student.id}/edit`}
            className="w-full h-11 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98"
            onClick={onClose}
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Student Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
