"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, UserPlus, Save, AlertCircle, ArrowLeft } from "lucide-react";
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

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("courses")
      .select("id, course_name")
      .order("course_name", { ascending: true })
      .then(({ data }) => setCourses(data ?? []));
  }, []);

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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8">
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold mb-6">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
          <div>
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

          {/* Course Dropdown */}
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
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.course_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Address */}
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

        {/* Form Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            href="/admin/students"
            className="h-11 px-5 inline-flex items-center justify-center rounded-xl border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors"
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
    </div>
  );
}
