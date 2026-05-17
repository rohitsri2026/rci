"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditCoursePage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [form, setForm] = useState({ course_name: "", duration: "", fees: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    async function fetchCourse() {
      const supabase = createClient();
      const { data, error } = await supabase.from("courses").select("*").eq("id", id).single();
      if (error) {
        setError("Failed to load course details.");
      } else if (data) {
        setForm({
          course_name: data.course_name || "",
          duration: data.duration || "",
          fees: data.fees?.toString() || "",
          description: data.description || "",
        });
      }
      setInitialLoading(false);
    }
    fetchCourse();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.from("courses").update({ ...form, fees: Number(form.fees) }).eq("id", id);
    if (error) { setError(error.message); setLoading(false); }
    else { router.push("/admin/courses"); router.refresh(); }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/courses" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </Link>
      <h1 className="text-3xl font-bold text-slate-900 font-display mb-8">Edit Course</h1>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Course Name", key: "course_name", type: "text", placeholder: "e.g. Advanced Web Development", required: true },
            { label: "Duration", key: "duration", type: "text", placeholder: "e.g. 6 Months", required: false },
            { label: "Fees (₹)", key: "fees", type: "number", placeholder: "e.g. 14999", required: false },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-slate-700 mb-2">{field.label}</label>
              <input
                type={field.type}
                value={(form as any)[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="Brief course description..."
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-60 transition-colors">
            <BookOpen className="w-5 h-5" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
