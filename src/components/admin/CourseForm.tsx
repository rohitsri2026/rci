"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, BookOpen, Plus, Trash, PlusCircle } from "lucide-react";
import Link from "next/link";

interface CourseFormProps {
  initialData?: any;
}

export default function CourseForm({ initialData }: CourseFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Base fields
  const [form, setForm] = useState({
    course_name: initialData?.course_name || "",
    slug: initialData?.slug || "",
    duration: initialData?.duration || "",
    fees: initialData?.fees?.toString() || "",
    discount: initialData?.discount?.toString() || "0",
    thumbnail_url: initialData?.thumbnail_url || "",
    eligibility: initialData?.eligibility || "",
    description: initialData?.description || "",
  });

  // Requirements (Array of strings)
  const [reqInput, setReqInput] = useState("");
  const [requirements, setRequirements] = useState<string[]>(initialData?.requirements || []);

  const addRequirement = () => {
    if (reqInput.trim() && !requirements.includes(reqInput.trim())) {
      setRequirements([...requirements, reqInput.trim()]);
      setReqInput("");
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  // SEO Metadata
  const [seo, setSeo] = useState({
    title: initialData?.seo_metadata?.title || "",
    description: initialData?.seo_metadata?.description || "",
  });

  // FAQs (Array of objects { q, a })
  const [faqs, setFaqs] = useState<any[]>(initialData?.faqs || []);
  const [newFaq, setNewFaq] = useState({ q: "", a: "" });

  const addFaq = () => {
    if (newFaq.q.trim() && newFaq.a.trim()) {
      setFaqs([...faqs, { q: newFaq.q.trim(), a: newFaq.a.trim() }]);
      setNewFaq({ q: "", a: "" });
    }
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  // Curriculum (Array of objects { module, title, lessons })
  const [curriculum, setCurriculum] = useState<any[]>(initialData?.curriculum || []);
  const [newModule, setNewModule] = useState({ module: "", title: "", lessonsStr: "" });

  const addModule = () => {
    if (newModule.module.trim() && newModule.title.trim()) {
      const lessons = newModule.lessonsStr
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      setCurriculum([...curriculum, {
        module: newModule.module.trim(),
        title: newModule.title.trim(),
        lessons
      }]);
      setNewModule({ module: "", title: "", lessonsStr: "" });
    }
  };

  const removeModule = (index: number) => {
    setCurriculum(curriculum.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      course_name: form.course_name.trim(),
      slug: form.slug.trim() || undefined, // Trigger will generate if undefined
      duration: form.duration.trim(),
      fees: Number(form.fees) || 0,
      discount: Number(form.discount) || 0,
      thumbnail_url: form.thumbnail_url.trim() || null,
      eligibility: form.eligibility.trim() || null,
      description: form.description.trim() || null,
      requirements: requirements.length > 0 ? requirements : null,
      faqs: faqs.length > 0 ? faqs : null,
      curriculum: curriculum.length > 0 ? curriculum : null,
      seo_metadata: seo.title || seo.description ? seo : null,
    };

    const supabase = createClient();
    
    let dbError;
    if (isEdit) {
      const { error } = await supabase
        .from("courses")
        .update(payload)
        .eq("id", initialData.id);
      dbError = error;
    } else {
      const { error } = await supabase
        .from("courses")
        .insert([payload]);
      dbError = error;
    }

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
    } else {
      router.push("/admin/courses");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/admin/courses" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-4 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          {/* General Section */}
          <div className="border-b border-slate-100 pb-5">
            <h3 className="text-base font-bold text-slate-950 mb-4">General Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Course Name</label>
                <input
                  type="text"
                  value={form.course_name}
                  onChange={(e) => setForm({ ...form, course_name: e.target.value })}
                  placeholder="e.g. Tally Prime Professional"
                  className="w-full border border-slate-250 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Slug (URL identifier)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. tally-prime-pro (Auto-generated if empty)"
                  className="w-full border border-slate-250 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Duration</label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="e.g. 6 Months"
                  className="w-full border border-slate-250 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Fees (₹)</label>
                  <input
                    type="number"
                    value={form.fees}
                    onChange={(e) => setForm({ ...form, fees: e.target.value })}
                    placeholder="e.g. 8000"
                    className="w-full border border-slate-250 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Discount (%)</label>
                  <input
                    type="number"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    placeholder="e.g. 10"
                    min="0"
                    max="100"
                    className="w-full border border-slate-250 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Thumbnail URL</label>
                <input
                  type="text"
                  value={form.thumbnail_url}
                  onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                  placeholder="e.g. /courses/tally.jpg"
                  className="w-full border border-slate-250 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Eligibility</label>
                <input
                  type="text"
                  value={form.eligibility}
                  onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                  placeholder="e.g. 10th or 12th Pass"
                  className="w-full border border-slate-250 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block font-semibold text-slate-700 mb-1.5">Course Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Write a clear overview of what the course covers..."
                className="w-full border border-slate-250 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 h-28 resize-none"
              />
            </div>
          </div>

          {/* Requirements List */}
          <div className="border-b border-slate-100 pb-5">
            <h3 className="text-base font-bold text-slate-950 mb-2">Requirements</h3>
            <p className="text-xs text-slate-400 mb-3">Add skill prerequisites or system requirements.</p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={reqInput}
                onChange={(e) => setReqInput(e.target.value)}
                placeholder="e.g. Basic understanding of files & folders"
                className="flex-1 border border-slate-250 rounded-xl px-4 py-2 bg-slate-50 focus:outline-none text-slate-900"
              />
              <button
                type="button"
                onClick={addRequirement}
                className="bg-slate-100 text-slate-800 hover:bg-slate-250 px-4 py-2 rounded-xl transition-colors font-semibold"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {requirements.map((req, i) => (
                <span key={i} className="bg-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 text-xs">
                  {req}
                  <button type="button" onClick={() => removeRequirement(i)} className="text-slate-400 hover:text-red-500 font-bold">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Curriculum */}
          <div className="border-b border-slate-100 pb-5">
            <h3 className="text-base font-bold text-slate-950 mb-2">Course Curriculum Modules</h3>
            <p className="text-xs text-slate-400 mb-4">Set up course lessons grouped by modules.</p>
            
            {/* Added modules */}
            <div className="space-y-3 mb-4">
              {curriculum.map((mod, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex justify-between items-start">
                  <div>
                    <span className="font-bold text-purple-700 text-xs uppercase tracking-wide">{mod.module}</span>
                    <h4 className="font-bold text-slate-900 mt-0.5">{mod.title}</h4>
                    <ul className="list-disc pl-4 text-xs text-slate-500 mt-2 space-y-0.5">
                      {mod.lessons.map((l: string, j: number) => (
                        <li key={j}>{l}</li>
                      ))}
                    </ul>
                  </div>
                  <button type="button" onClick={() => removeModule(i)} className="text-slate-400 hover:text-red-500 p-1">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Module subform */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <p className="font-bold text-slate-800 text-xs">Add New Curriculum Module</p>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="e.g. Module 1"
                  value={newModule.module}
                  onChange={(e) => setNewModule({ ...newModule, module: e.target.value })}
                  className="border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-slate-850"
                />
                <input
                  type="text"
                  placeholder="e.g. Advanced Ledgers Configuration"
                  value={newModule.title}
                  onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                  className="col-span-2 border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-slate-850"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 font-bold mb-1">Module Lessons (One lesson per line)</label>
                <textarea
                  placeholder="Creating Multi-State Tax Groups&#10;Manual Adjustments Ledger vouchers&#10;Debit and Credit Note configuration"
                  value={newModule.lessonsStr}
                  onChange={(e) => setNewModule({ ...newModule, lessonsStr: e.target.value })}
                  rows={3}
                  className="w-full border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-slate-850 text-xs resize-none"
                />
              </div>
              <button
                type="button"
                onClick={addModule}
                className="bg-purple-600 text-white hover:bg-purple-750 text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Save Module
              </button>
            </div>
          </div>

          {/* FAQs */}
          <div className="border-b border-slate-100 pb-5">
            <h3 className="text-base font-bold text-slate-950 mb-2">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-400 mb-4">Provide quick FAQs for potential students on the detail page.</p>

            {/* Added FAQs */}
            <div className="space-y-3 mb-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex justify-between items-start text-xs">
                  <div>
                    <p className="font-bold text-slate-950">Q: {faq.q}</p>
                    <p className="text-slate-650 mt-1">A: {faq.a}</p>
                  </div>
                  <button type="button" onClick={() => removeFaq(i)} className="text-slate-400 hover:text-red-500 p-1">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add FAQ form */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <p className="font-bold text-slate-800 text-xs">Add New FAQ</p>
              <input
                type="text"
                placeholder="Question (e.g. Will I receive placement support?)"
                value={newFaq.q}
                onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
                className="w-full border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-slate-850"
              />
              <textarea
                placeholder="Answer (e.g. Yes! We provide resume support and direct contacts with hiring partners.)"
                value={newFaq.a}
                onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
                rows={2}
                className="w-full border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-slate-850 text-xs resize-none"
              />
              <button
                type="button"
                onClick={addFaq}
                className="bg-purple-600 text-white hover:bg-purple-750 text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Save FAQ
              </button>
            </div>
          </div>

          {/* SEO Metadata */}
          <div>
            <h3 className="text-base font-bold text-slate-950 mb-3">SEO Tags (Search Engines)</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Meta Title</label>
                <input
                  type="text"
                  value={seo.title}
                  onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                  placeholder="e.g. Learn Tally Prime Accounting Course in Kanpur | RCI"
                  className="w-full border border-slate-250 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Meta Description</label>
                <textarea
                  value={seo.description}
                  onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                  placeholder="Enroll in the best accounting course at Rohit Computer Institute. Practical ledger tracking, GST calculations, and placement support."
                  className="w-full border border-slate-250 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 h-20 resize-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3.5 rounded-xl font-bold hover:bg-purple-750 disabled:opacity-60 transition-colors mt-6 text-sm"
          >
            <BookOpen className="w-5 h-5" />
            {loading ? "Saving Course..." : isEdit ? "Update Course Settings" : "Publish Course Catalog"}
          </button>
        </form>
      </div>
    </div>
  );
}
