"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, UserPlus, Save, AlertCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface Course {
  id: string;
  course_name: string;
}

interface StudentFormProps {
  mode: "create" | "edit";
  studentId?: string;
  initialData?: {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    course_id: string;
  };
}

export default function StudentForm({ mode, studentId, initialData }: StudentFormProps) {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  
  const [form, setForm] = useState({
    full_name: initialData?.full_name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    course_id: initialData?.course_id || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  // Track if any form value has changed from initial state
  const isDirty = useCallback(() => {
    const orig = {
      full_name: initialData?.full_name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      course_id: initialData?.course_id || "",
    };
    return (
      form.full_name !== orig.full_name ||
      form.email !== orig.email ||
      form.phone !== orig.phone ||
      form.address !== orig.address ||
      form.course_id !== orig.course_id
    );
  }, [form, initialData]);

  // Load courses
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("courses")
      .select("id, course_name, status")
      .order("course_name", { ascending: true })
      .then(({ data }) => setCourses(data ?? []));
  }, []);

  // Protect against accidental browser refresh / window close when form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleCancelClick = (e: React.MouseEvent) => {
    if (isDirty()) {
      e.preventDefault();
      setShowUnsavedModal(true);
    }
  };

  const handleLeaveConfirm = () => {
    setShowUnsavedModal(false);
    router.push("/admin/students");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    // Client-side Validation
    const cleanName = form.full_name.trim();
    const cleanEmail = form.email.trim();
    const cleanPhone = form.phone.trim();

    if (!cleanName) {
      setError("Full name is required.");
      return;
    }

    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (cleanPhone && !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(cleanPhone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === "create" ? "/api/students" : `/api/students/${studentId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: cleanName,
          email: cleanEmail || null,
          phone: cleanPhone || null,
          address: form.address.trim() || null,
          course_id: form.course_id || null,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || `Failed to ${mode === "create" ? "add" : "update"} student.`);
        setLoading(false);
      } else {
        router.push("/admin/students");
        router.refresh();
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-7">
        {/* SECTION 1: STUDENT INFORMATION */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-1.5">
            <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Student Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="e.g. Aman Gupta"
                required
                className="w-full h-12 px-4 border border-slate-200/90 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium bg-slate-50/40 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all"
              />
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. aman@example.com"
                className="w-full h-12 px-4 border border-slate-200/90 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium bg-slate-50/40 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all"
              />
            </div>

            {/* Phone Number */}
            <div className="sm:col-span-1">
              <label htmlFor="phone" className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. 98765 43210"
                className="w-full h-12 px-4 border border-slate-200/90 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium bg-slate-50/40 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: ENROLLMENT */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-1.5">
            <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Enrollment
            </h2>
          </div>

          <div>
            <label htmlFor="course_id" className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
              Course Program
            </label>
            <select
              id="course_id"
              name="course_id"
              value={form.course_id}
              onChange={(e) => setForm({ ...form, course_id: e.target.value })}
              className="w-full h-12 px-4 border border-slate-200/90 rounded-xl text-slate-900 text-sm font-medium bg-slate-50/40 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all"
            >
              <option value="">Select a course program...</option>
              {courses.map((c) => {
                const isInactive = (c as any).status === "Inactive";
                if (isInactive && c.id !== initialData?.course_id) {
                  return null;
                }
                return (
                  <option key={c.id} value={c.id}>
                    {c.course_name} {isInactive ? "(Inactive)" : ""}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* SECTION 3: CONTACT / ADDRESS */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-1.5">
            <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Contact / Address
            </h2>
          </div>

          <div>
            <label htmlFor="address" className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
              Address / Location
            </label>
            <input
              id="address"
              name="address"
              type="text"
              autoComplete="street-address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="e.g. Kidwai Nagar, Kanpur, UP"
              className="w-full h-12 px-4 border border-slate-200/90 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium bg-slate-50/40 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all"
            />
          </div>
        </div>

        {/* Form Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            href="/admin/students"
            onClick={handleCancelClick}
            className="h-11 px-5 inline-flex items-center justify-center rounded-xl border border-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm hover:bg-slate-100 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="h-11 px-6 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{mode === "create" ? "Adding Student..." : "Saving Changes..."}</span>
              </>
            ) : (
              <>
                {mode === "create" ? <UserPlus className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{mode === "create" ? "Add Student" : "Save Changes"}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* UNSAVED CHANGES PROTECTION MODAL */}
      {showUnsavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-950 tracking-tight">Unsaved changes</h3>
                <p className="text-xs text-slate-500">You have unsaved changes in this form.</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Are you sure you want to leave? Any information you entered will be lost.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowUnsavedModal(false)}
                className="h-11 px-5 rounded-xl border border-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm hover:bg-slate-100 transition-colors"
              >
                Stay
              </button>
              <button
                onClick={handleLeaveConfirm}
                className="h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
