"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Plus, Trash, PlusCircle, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { createCourse, updateCourse } from "./course-actions-server";

interface CourseFormProps {
  initialData?: any;
}

export default function CourseForm({ initialData }: CourseFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigationUrl, setPendingNavigationUrl] = useState<string | null>(null);

  // Initial State for dirty tracking
  const [form, setForm] = useState({
    course_name: initialData?.course_name || "",
    slug: initialData?.slug || "",
    duration: initialData?.duration || "",
    fees: initialData?.fees !== undefined && initialData?.fees !== null ? initialData.fees.toString() : "",
    discount: initialData?.discount?.toString() || "0",
    status: (initialData?.status as "Active" | "Inactive") || "Active",
    thumbnail_url: initialData?.thumbnail_url || "",
    eligibility: initialData?.eligibility || "",
    description: initialData?.description || "",
  });

  const [requirements, setRequirements] = useState<string[]>(initialData?.requirements || []);
  const [reqInput, setReqInput] = useState("");

  const [seo, setSeo] = useState({
    title: initialData?.seo_metadata?.title || "",
    description: initialData?.seo_metadata?.description || "",
  });

  const [faqs, setFaqs] = useState<any[]>(initialData?.faqs || []);
  const [newFaq, setNewFaq] = useState({ q: "", a: "" });

  const [curriculum, setCurriculum] = useState<any[]>(initialData?.curriculum || []);
  const [newModule, setNewModule] = useState({ module: "", title: "", lessonsStr: "" });

  // Compute dirty status
  const isDirty = useCallback(() => {
    const origForm = {
      course_name: initialData?.course_name || "",
      slug: initialData?.slug || "",
      duration: initialData?.duration || "",
      fees: initialData?.fees !== undefined && initialData?.fees !== null ? initialData.fees.toString() : "",
      discount: initialData?.discount?.toString() || "0",
      status: (initialData?.status as "Active" | "Inactive") || "Active",
      thumbnail_url: initialData?.thumbnail_url || "",
      eligibility: initialData?.eligibility || "",
      description: initialData?.description || "",
    };

    const isBaseFormDirty =
      form.course_name !== origForm.course_name ||
      form.slug !== origForm.slug ||
      form.duration !== origForm.duration ||
      form.fees !== origForm.fees ||
      form.discount !== origForm.discount ||
      form.status !== origForm.status ||
      form.thumbnail_url !== origForm.thumbnail_url ||
      form.eligibility !== origForm.eligibility ||
      form.description !== origForm.description;

    const isReqsDirty = JSON.stringify(requirements) !== JSON.stringify(initialData?.requirements || []);
    const isFaqsDirty = JSON.stringify(faqs) !== JSON.stringify(initialData?.faqs || []);
    const isCurriculumDirty = JSON.stringify(curriculum) !== JSON.stringify(initialData?.curriculum || []);
    const isSeoDirty =
      seo.title !== (initialData?.seo_metadata?.title || "") ||
      seo.description !== (initialData?.seo_metadata?.description || "");

    return isBaseFormDirty || isReqsDirty || isFaqsDirty || isCurriculumDirty || isSeoDirty;
  }, [form, requirements, faqs, curriculum, seo, initialData]);

  // Window beforeunload prompt when dirty
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

  const handleCancelClick = (e: React.MouseEvent, url: string = "/admin/courses") => {
    if (isDirty()) {
      e.preventDefault();
      setPendingNavigationUrl(url);
      setShowUnsavedModal(true);
    } else {
      router.push(url);
    }
  };

  const addRequirement = () => {
    if (reqInput.trim() && !requirements.includes(reqInput.trim())) {
      setRequirements([...requirements, reqInput.trim()]);
      setReqInput("");
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    if (newFaq.q.trim() && newFaq.a.trim()) {
      setFaqs([...faqs, { q: newFaq.q.trim(), a: newFaq.a.trim() }]);
      setNewFaq({ q: "", a: "" });
    }
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const addModule = () => {
    if (newModule.module.trim() && newModule.title.trim()) {
      const lessons = newModule.lessonsStr
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      setCurriculum([
        ...curriculum,
        {
          module: newModule.module.trim(),
          title: newModule.title.trim(),
          lessons,
        },
      ]);
      setNewModule({ module: "", title: "", lessonsStr: "" });
    }
  };

  const removeModule = (index: number) => {
    setCurriculum(curriculum.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const name = form.course_name.trim();
    if (!name) {
      setError("Course Name is required and cannot be whitespace only.");
      return;
    }

    const feesNum = Number(form.fees);
    if (isNaN(feesNum) || feesNum < 0) {
      setError("Please enter a valid non-negative number for course fee.");
      return;
    }

    setLoading(true);

    const payload = {
      course_name: name,
      slug: form.slug.trim() || undefined,
      duration: form.duration.trim() || undefined,
      fees: feesNum,
      discount: Number(form.discount) || 0,
      status: form.status,
      thumbnail_url: form.thumbnail_url.trim() || undefined,
      eligibility: form.eligibility.trim() || undefined,
      description: form.description.trim() || undefined,
      requirements: requirements.length > 0 ? requirements : undefined,
      faqs: faqs.length > 0 ? faqs : undefined,
      curriculum: curriculum.length > 0 ? curriculum : undefined,
      seo_metadata: seo.title || seo.description ? seo : undefined,
    };

    let result;
    if (isEdit) {
      result = await updateCourse(initialData.id, payload);
    } else {
      result = await createCourse(payload);
    }

    if (!result.success) {
      setError(result.error || "Failed to save course.");
      setLoading(false);
    } else {
      router.push("/admin/courses");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={(e) => handleCancelClick(e, "/admin/courses")}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs sm:text-sm font-extrabold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </button>

        {isDirty() && (
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            Unsaved Changes
          </span>
        )}
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm mb-6 font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 text-xs sm:text-sm">
          {/* General Details Section */}
          <div className="border-b border-slate-100 pb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-950 tracking-tight">
                General Program Information
              </h2>
              <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider">
                Step 1 of 4
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Course Name */}
              <div className="sm:col-span-2">
                <label className="block font-extrabold text-slate-800 mb-1.5">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.course_name}
                  onChange={(e) => setForm({ ...form, course_name: e.target.value })}
                  placeholder="e.g. Tally Prime Professional & GST Accounting"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 font-medium"
                  required
                />
              </div>

              {/* Status & Fees */}
              <div>
                <label className="block font-extrabold text-slate-800 mb-1.5">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "Active" | "Inactive" })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 font-bold"
                >
                  <option value="Active">Active (Visible in public admission form)</option>
                  <option value="Inactive">Inactive (Hidden from public form)</option>
                </select>
              </div>

              <div>
                <label className="block font-extrabold text-slate-800 mb-1.5">
                  Course Fee (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.fees}
                  onChange={(e) => setForm({ ...form, fees: e.target.value })}
                  placeholder="e.g. 6000"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 font-medium"
                  required
                />
              </div>

              {/* Duration & Discount */}
              <div>
                <label className="block font-extrabold text-slate-800 mb-1.5">Duration</label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="e.g. 6 Months / 1 Year"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-800 mb-1.5">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  placeholder="e.g. 10"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 font-medium"
                />
              </div>

              {/* Slug & Eligibility */}
              <div>
                <label className="block font-extrabold text-slate-800 mb-1.5">URL Slug (Identifier)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. tally-prime-pro (Auto-generated if empty)"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-800 mb-1.5">Eligibility</label>
                <input
                  type="text"
                  value={form.eligibility}
                  onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                  placeholder="e.g. 10th / 12th Pass or Equivalent"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 font-medium"
                />
              </div>

              {/* Thumbnail URL */}
              <div className="sm:col-span-2">
                <label className="block font-extrabold text-slate-800 mb-1.5">Thumbnail Image Path</label>
                <input
                  type="text"
                  value={form.thumbnail_url}
                  onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                  placeholder="e.g. /courses/tally.jpg"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-extrabold text-slate-800 mb-1.5">Course Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Provide a comprehensive summary of program goals, software tools taught, and career prospects..."
                rows={4}
                className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 font-medium resize-none"
              />
            </div>
          </div>

          {/* Requirements Section */}
          <div className="border-b border-slate-100 pb-6 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-950">Prerequisites & System Requirements</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={reqInput}
                onChange={(e) => setReqInput(e.target.value)}
                placeholder="e.g. Basic literacy in computer usage"
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
              />
              <button
                type="button"
                onClick={addRequirement}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-xl font-extrabold text-xs transition-colors"
              >
                Add Rule
              </button>
            </div>

            {requirements.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {requirements.map((req, i) => (
                  <span key={i} className="bg-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-full flex items-center gap-2 text-xs">
                    <span>{req}</span>
                    <button type="button" onClick={() => removeRequirement(i)} className="text-slate-400 hover:text-red-600 font-bold">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Curriculum Section */}
          <div className="border-b border-slate-100 pb-6 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-950">Curriculum Modules</h3>

            {curriculum.length > 0 && (
              <div className="space-y-3">
                {curriculum.map((mod, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex justify-between items-start">
                    <div>
                      <span className="font-extrabold text-blue-600 text-[11px] uppercase tracking-wider">{mod.module}</span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{mod.title}</h4>
                      <ul className="list-disc pl-4 text-xs text-slate-500 mt-2 space-y-1">
                        {mod.lessons.map((l: string, j: number) => (
                          <li key={j}>{l}</li>
                        ))}
                      </ul>
                    </div>
                    <button type="button" onClick={() => removeModule(i)} className="text-slate-400 hover:text-red-600 p-1">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <p className="font-extrabold text-slate-800 text-xs">Add New Curriculum Module</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Module Tag (e.g. Module 1)"
                  value={newModule.module}
                  onChange={(e) => setNewModule({ ...newModule, module: e.target.value })}
                  className="border border-slate-200 bg-white rounded-lg px-3 py-2 font-medium text-slate-900"
                />
                <input
                  type="text"
                  placeholder="Module Title (e.g. GST Voucher Entry)"
                  value={newModule.title}
                  onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                  className="sm:col-span-2 border border-slate-200 bg-white rounded-lg px-3 py-2 font-medium text-slate-900"
                />
              </div>
              <textarea
                placeholder="Lessons (One lesson per line)"
                value={newModule.lessonsStr}
                onChange={(e) => setNewModule({ ...newModule, lessonsStr: e.target.value })}
                rows={3}
                className="w-full border border-slate-200 bg-white rounded-lg p-2.5 font-medium text-slate-900 text-xs resize-none"
              />
              <button
                type="button"
                onClick={addModule}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" /> Save Module
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={(e) => handleCancelClick(e, "/admin/courses")}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Course...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>{isEdit ? "Save Changes" : "Add Course"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Unsaved Changes Dialog Modal */}
      {showUnsavedModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowUnsavedModal(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Unsaved changes dialog"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-950">Unsaved Changes</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You have unsaved changes in this form. Are you sure you want to leave without saving?
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowUnsavedModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-extrabold text-xs hover:bg-slate-50 transition-colors"
              >
                Stay
              </button>
              <button
                onClick={() => {
                  setShowUnsavedModal(false);
                  if (pendingNavigationUrl) router.push(pendingNavigationUrl);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition-colors shadow-md shadow-red-600/20"
              >
                Leave Without Saving
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
