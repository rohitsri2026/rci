"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";

export default function NewStudentPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", address: "", course_id: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.from("courses").select("id, course_name").then(({ data }) => setCourses(data ?? []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error);
      setLoading(false);
    } else {
      router.push("/admin/students");
      router.refresh();
    }
  };

  const fields = [
    { label: "Full Name", key: "full_name", type: "text", placeholder: "e.g. Aman Gupta", required: true },
    { label: "Email Address", key: "email", type: "email", placeholder: "e.g. aman@example.com", required: false },
    { label: "Phone Number", key: "phone", type: "tel", placeholder: "e.g. +91 98765 43210", required: false },
    { label: "Address", key: "address", type: "text", placeholder: "e.g. Kanpur, UP", required: false },
  ];

  return (
    <div className="max-w-2xl">
      <Link href="/admin/students" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Students
      </Link>
      <h1 className="text-3xl font-bold text-slate-900 font-display mb-8">Add New Student</h1>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-slate-700 mb-2">{field.label}</label>
              <input
                type={field.type}
                value={(form as any)[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Course (Optional)</label>
            <select
              value={form.course_id}
              onChange={(e) => setForm({ ...form, course_id: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a course...</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.course_name}</option>)}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            {loading ? "Adding..." : "Add Student"}
          </button>
        </form>
      </div>
    </div>
  );
}
