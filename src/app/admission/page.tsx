"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdmissionPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [form, setForm] = useState({ student_name: "", email: "", phone: "", selected_course: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.from("courses").select("id, course_name").then(({ data }) => setCourses(data ?? []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.from("admissions").insert([{ ...form, status: "Pending" }]);
    if (error) { setError(error.message); setLoading(false); }
    else { setSuccess(true); setLoading(false); setForm({ student_name: "", email: "", phone: "", selected_course: "" }); }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-4">Apply for Admission</h1>
            <p className="text-slate-600 text-lg">Fill in the form below and our team will get back to you within 24 hours.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12">
            <AnimatePresence>
              {success ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h3>
                  <p className="text-slate-600">Thank you for applying. Our team will contact you shortly.</p>
                  <button onClick={() => setSuccess(false)} className="mt-6 text-blue-600 text-sm font-medium hover:underline">Submit another application</button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-6">
                  {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}
                  {[
                    { label: "Full Name", key: "student_name", type: "text", placeholder: "Your full name", required: true },
                    { label: "Email Address", key: "email", type: "email", placeholder: "your@email.com", required: false },
                    { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 98765 43210", required: true },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{field.label}</label>
                      <input type={field.type} value={(form as any)[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.placeholder} required={field.required} className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Course Interested In</label>
                    <select value={form.selected_course} onChange={(e) => setForm({ ...form, selected_course: e.target.value })} required className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select a course...</option>
                      {courses.map((c) => <option key={c.id} value={c.course_name}>{c.course_name}</option>)}
                    </select>
                  </div>
                  <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-md shadow-blue-500/20">
                    <Send className="w-5 h-5" />
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
