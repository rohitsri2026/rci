"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, BookOpen, Trash2, PlusCircle, AlertTriangle, CheckCircle2, 
  Loader2, Eye, ExternalLink, ArrowUp, ArrowDown, Star, MessageSquare, 
  Layers, FileText, Check, Award, Image as ImageIcon, Plus, Edit2, X
} from "lucide-react";
import { createCourse, updateCourse } from "./course-actions-server";

interface CourseFormProps {
  initialData?: any;
}

export type ReviewItem = {
  name: string;
  rating: number;
  comment: string;
  avatar?: string;
  course?: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type ModuleItem = {
  module: string;
  title: string;
  lessons: string[];
};

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getInitials(name: string): string {
  if (!name) return "ST";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function CourseForm({ initialData }: CourseFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [activeTab, setActiveTab] = useState<"general" | "curriculum" | "reviews" | "faq">("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigationUrl, setPendingNavigationUrl] = useState<string | null>(null);

  // Extract initial metadata JSONB
  const seoData = initialData?.seo_metadata || {};

  // Form State — General & Pricing
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
    category: seoData.category || "Computer",
    certificate_included: seoData.certificate_included !== undefined ? seoData.certificate_included : true,
  });

  // Requirements List
  const [requirements, setRequirements] = useState<string[]>(initialData?.requirements || []);
  const [reqInput, setReqInput] = useState("");

  // Curriculum State
  const [curriculum, setCurriculum] = useState<ModuleItem[]>(initialData?.curriculum || []);
  const [newModule, setNewModule] = useState({ module: "", title: "", lessonsStr: "" });

  // Reviews State
  const [reviews, setReviews] = useState<ReviewItem[]>(seoData.reviews || []);
  const [displayRating, setDisplayRating] = useState<number>(seoData.rating || 4.9);
  const [displayReviewCount, setDisplayReviewCount] = useState<number>(seoData.review_count || 36);
  const [newReview, setNewReview] = useState<ReviewItem>({
    name: "",
    rating: 5,
    comment: "",
    avatar: "",
    course: "Completed",
  });

  // FAQs State
  const [faqs, setFaqs] = useState<FaqItem[]>(initialData?.faqs || []);
  const [newFaq, setNewFaq] = useState<FaqItem>({ q: "", a: "" });

  // SEO State
  const [seo, setSeo] = useState({
    title: seoData.title || "",
    description: seoData.description || "",
  });

  // Compute calculated counters
  const totalLessonsCount = useMemo(() => {
    return curriculum.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  }, [curriculum]);

  // Compute dirty status for unsaved changes warning
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
      category: seoData.category || "Computer",
      certificate_included: seoData.certificate_included !== undefined ? seoData.certificate_included : true,
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
      form.description !== origForm.description ||
      form.category !== origForm.category ||
      form.certificate_included !== origForm.certificate_included;

    const isReqsDirty = JSON.stringify(requirements) !== JSON.stringify(initialData?.requirements || []);
    const isCurriculumDirty = JSON.stringify(curriculum) !== JSON.stringify(initialData?.curriculum || []);
    const isFaqsDirty = JSON.stringify(faqs) !== JSON.stringify(initialData?.faqs || []);
    const isReviewsDirty = JSON.stringify(reviews) !== JSON.stringify(seoData.reviews || []);
    const isSeoDirty =
      seo.title !== (seoData.title || "") ||
      seo.description !== (seoData.description || "") ||
      displayRating !== (seoData.rating || 4.9) ||
      displayReviewCount !== (seoData.review_count || 36);

    return isBaseFormDirty || isReqsDirty || isCurriculumDirty || isFaqsDirty || isReviewsDirty || isSeoDirty;
  }, [form, requirements, curriculum, faqs, reviews, seo, displayRating, displayReviewCount, initialData, seoData]);

  // Window beforeunload listener
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showUnsavedModal) {
        setShowUnsavedModal(false);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDirty, showUnsavedModal]);

  const handleCancelClick = (e: React.MouseEvent, url: string = "/admin/courses") => {
    if (isDirty()) {
      e.preventDefault();
      setPendingNavigationUrl(url);
      setShowUnsavedModal(true);
    } else {
      router.push(url);
    }
  };

  // --- REQUIREMENTS HANDLERS ---
  const addRequirement = () => {
    if (reqInput.trim() && !requirements.includes(reqInput.trim())) {
      setRequirements([...requirements, reqInput.trim()]);
      setReqInput("");
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  // --- CURRICULUM MODULE & LESSON HANDLERS ---
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

  const moveModule = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === curriculum.length - 1)) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const nextCurriculum = [...curriculum];
    const temp = nextCurriculum[index];
    nextCurriculum[index] = nextCurriculum[targetIdx];
    nextCurriculum[targetIdx] = temp;
    setCurriculum(nextCurriculum);
  };

  const addLessonToModule = (moduleIndex: number, lessonText: string) => {
    if (!lessonText.trim()) return;
    const updated = [...curriculum];
    updated[moduleIndex].lessons = [...(updated[moduleIndex].lessons || []), lessonText.trim()];
    setCurriculum(updated);
  };

  const removeLessonFromModule = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...curriculum];
    updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter((_, j) => j !== lessonIndex);
    setCurriculum(updated);
  };

  const moveLessonInModule = (moduleIndex: number, lessonIndex: number, direction: "up" | "down") => {
    const lessons = curriculum[moduleIndex].lessons;
    if ((direction === "up" && lessonIndex === 0) || (direction === "down" && lessonIndex === lessons.length - 1)) return;
    const targetIdx = direction === "up" ? lessonIndex - 1 : lessonIndex + 1;
    const updatedLessons = [...lessons];
    const temp = updatedLessons[lessonIndex];
    updatedLessons[lessonIndex] = updatedLessons[targetIdx];
    updatedLessons[targetIdx] = temp;

    const updatedCurriculum = [...curriculum];
    updatedCurriculum[moduleIndex].lessons = updatedLessons;
    setCurriculum(updatedCurriculum);
  };

  // --- REVIEWS HANDLERS ---
  const addReview = () => {
    if (newReview.name.trim() && newReview.comment.trim()) {
      const avatar = newReview.avatar?.trim() || getInitials(newReview.name);
      setReviews([...reviews, { ...newReview, name: newReview.name.trim(), comment: newReview.comment.trim(), avatar }]);
      setNewReview({ name: "", rating: 5, comment: "", avatar: "", course: "Completed" });
    }
  };

  const removeReview = (index: number) => {
    setReviews(reviews.filter((_, i) => i !== index));
  };

  const moveReview = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === reviews.length - 1)) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const updated = [...reviews];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setReviews(updated);
  };

  // --- FAQ HANDLERS ---
  const addFaq = () => {
    if (newFaq.q.trim() && newFaq.a.trim()) {
      setFaqs([...faqs, { q: newFaq.q.trim(), a: newFaq.a.trim() }]);
      setNewFaq({ q: "", a: "" });
    }
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const moveFaq = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === faqs.length - 1)) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const updated = [...faqs];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setFaqs(updated);
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessToast("");

    const name = form.course_name.trim();
    if (!name) {
      setError("Course Name is required.");
      setActiveTab("general");
      return;
    }

    const feesNum = Number(form.fees);
    if (isNaN(feesNum) || feesNum < 0) {
      setError("Please enter a valid non-negative number for course fee.");
      setActiveTab("general");
      return;
    }

    const discountNum = Number(form.discount) || 0;
    if (discountNum < 0 || discountNum > 100) {
      setError("Discount percentage must be between 0 and 100.");
      setActiveTab("general");
      return;
    }

    setLoading(true);

    const mergedSeo = {
      title: seo.title.trim() || undefined,
      description: seo.description.trim() || undefined,
      category: form.category,
      certificate_included: form.certificate_included,
      rating: displayRating,
      review_count: displayReviewCount,
      reviews: reviews.length > 0 ? reviews : undefined,
    };

    const payload = {
      course_name: name,
      slug: form.slug.trim() || toSlug(name),
      duration: form.duration.trim() || undefined,
      fees: feesNum,
      discount: discountNum,
      status: form.status,
      thumbnail_url: form.thumbnail_url.trim() || undefined,
      eligibility: form.eligibility.trim() || undefined,
      description: form.description.trim() || undefined,
      requirements: requirements.length > 0 ? requirements : undefined,
      faqs: faqs.length > 0 ? faqs : undefined,
      curriculum: curriculum.length > 0 ? curriculum : undefined,
      seo_metadata: mergedSeo,
    };

    let result;
    if (isEdit) {
      result = await updateCourse(initialData.id, payload);
    } else {
      result = await createCourse(payload);
    }

    if (!result.success) {
      setError(result.error || "Failed to save course changes.");
      setLoading(false);
    } else {
      setSuccessToast(isEdit ? "Course changes saved successfully!" : "Course added successfully!");
      setLoading(false);
      setTimeout(() => {
        router.push("/admin/courses");
        router.refresh();
      }, 1000);
    }
  };

  const previewSlug = form.slug.trim() || toSlug(form.course_name || "");

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-950 text-emerald-100 border border-emerald-800 shadow-xl flex items-center gap-3 text-xs sm:text-sm font-bold animate-in fade-in duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => handleCancelClick(e, "/admin/courses")}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="Back to courses"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-950 leading-tight font-display">
              {isEdit ? `Edit "${form.course_name || "Course"}"` : "Create New Course"}
            </h2>
            <p className="text-xs text-slate-500">
              Manage course information, curriculum modules, reviews, FAQs and metadata.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {previewSlug && (
            <Link
              href={`/courses/${previewSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors border border-slate-200/80"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Preview Course</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          )}

          {isDirty() && (
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              Unsaved Edits
            </span>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === "general"
              ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
              : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. General &amp; Pricing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("curriculum")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === "curriculum"
              ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
              : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. Curriculum ({curriculum.length} Modules)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === "reviews"
              ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
              : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
          }`}
        >
          <Star className="w-4 h-4" />
          <span>3. Reviews ({reviews.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("faq")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === "faq"
              ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
              : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>4. FAQ &amp; SEO</span>
        </button>
      </div>

      {/* Main Form Box */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs sm:text-sm mb-6 font-bold flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 text-xs sm:text-sm">
          {/* TAB 1: GENERAL INFORMATION */}
          {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-extrabold text-slate-950">General Information &amp; Fee Structure</h3>
                <p className="text-xs text-slate-500">Basic course details, thumbnail, pricing, and prerequisites.</p>
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
                    placeholder="e.g. Diploma in Computer Applications (DCA)"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-bold"
                    required
                  />
                </div>

                {/* Status & Category */}
                <div>
                  <label className="block font-extrabold text-slate-800 mb-1.5">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as "Active" | "Inactive" })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-bold"
                  >
                    <option value="Active">Active (Visible publicly &amp; in admission form)</option>
                    <option value="Inactive">Inactive (Hidden from public catalog)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-bold"
                  >
                    <option value="Computer">Computer</option>
                    <option value="Accounting">Accounting</option>
                    <option value="Programming">Programming</option>
                    <option value="Typing">Typing</option>
                  </select>
                </div>

                {/* Fees & Discount */}
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
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-extrabold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1.5">Discount Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    placeholder="e.g. 500"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                  />
                </div>

                {/* Duration & Slug */}
                <div>
                  <label className="block font-extrabold text-slate-800 mb-1.5">Duration</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="e.g. 1 Year / 6 Months"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1.5">URL Slug (Identifier)</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="e.g. dca (Auto-generated if empty)"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-mono text-xs"
                  />
                </div>

                {/* Eligibility & Certificate */}
                <div>
                  <label className="block font-extrabold text-slate-800 mb-1.5">Eligibility Criteria</label>
                  <input
                    type="text"
                    value={form.eligibility}
                    onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                    placeholder="e.g. 10th / 12th Pass or Equivalent"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1.5">Certificate Provided</label>
                  <select
                    value={form.certificate_included ? "yes" : "no"}
                    onChange={(e) => setForm({ ...form, certificate_included: e.target.value === "yes" })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                  >
                    <option value="yes">Yes — Government Recognized Certificate</option>
                    <option value="no">No Certificate</option>
                  </select>
                </div>

                {/* Thumbnail Image */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block font-extrabold text-slate-800">Thumbnail Image Path / URL</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={form.thumbnail_url}
                      onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                      placeholder="e.g. /courses/dca.jpg or https://..."
                      className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-mono text-xs"
                    />
                  </div>
                  {form.thumbnail_url && (
                    <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mt-2">
                      <Image
                        src={form.thumbnail_url}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block font-extrabold text-slate-800 mb-1.5">Course Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Provide a comprehensive summary of program goals, practical lab tools taught, and career prospects..."
                    rows={4}
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium resize-none"
                  />
                </div>

                {/* Prerequisites / Requirements */}
                <div className="sm:col-span-2 space-y-3 pt-2">
                  <label className="block font-extrabold text-slate-800">Prerequisites &amp; System Requirements</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={reqInput}
                      onChange={(e) => setReqInput(e.target.value)}
                      placeholder="e.g. Basic literacy in computer usage"
                      className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                    />
                    <button
                      type="button"
                      onClick={addRequirement}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-colors shrink-0"
                    >
                      Add Requirement
                    </button>
                  </div>

                  {requirements.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {requirements.map((req, i) => (
                        <span key={i} className="bg-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-full flex items-center gap-2 text-xs border border-slate-200">
                          <span>{req}</span>
                          <button type="button" onClick={() => removeRequirement(i)} className="text-slate-400 hover:text-red-600 font-bold">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CURRICULUM CMS BUILDER */}
          {activeTab === "curriculum" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-950">Curriculum Modules &amp; Lesson Builder</h3>
                  <p className="text-xs text-slate-500">Add, edit, reorder, or delete module sections and lessons.</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl">
                    {curriculum.length} Modules
                  </span>
                  <span className="text-xs font-black text-purple-700 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-xl">
                    {totalLessonsCount} Total Lessons
                  </span>
                </div>
              </div>

              {/* Module List */}
              {curriculum.length > 0 ? (
                <div className="space-y-4">
                  {curriculum.map((mod, i) => (
                    <div key={i} className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                      {/* Module Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => moveModule(i, "up")}
                              disabled={i === 0}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                              title="Move Module Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveModule(i, "down")}
                              disabled={i === curriculum.length - 1}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                              title="Move Module Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={mod.module}
                                onChange={(e) => {
                                  const updated = [...curriculum];
                                  updated[i].module = e.target.value;
                                  setCurriculum(updated);
                                }}
                                className="text-xs font-black uppercase text-blue-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="Module 01"
                              />
                              <span className="text-xs text-slate-400 font-bold">• {mod.lessons?.length || 0} lessons</span>
                            </div>

                            <input
                              type="text"
                              value={mod.title}
                              onChange={(e) => {
                                const updated = [...curriculum];
                                updated[i].title = e.target.value;
                                setCurriculum(updated);
                              }}
                              className="w-full text-sm font-extrabold text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                              placeholder="Module Title"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeModule(i)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                          title="Delete Module"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Lesson List */}
                      <div className="pl-6 border-l-2 border-slate-200 space-y-2">
                        {mod.lessons?.map((lesson, j) => (
                          <div key={j} className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-xl px-3 py-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <input
                              type="text"
                              value={lesson}
                              onChange={(e) => {
                                const updated = [...curriculum];
                                updated[i].lessons[j] = e.target.value;
                                setCurriculum(updated);
                              }}
                              className="flex-1 text-xs font-semibold text-slate-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
                            />

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => moveLessonInModule(i, j, "up")}
                                disabled={j === 0}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveLessonInModule(i, j, "down")}
                                disabled={j === mod.lessons.length - 1}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeLessonFromModule(i, j)}
                                className="p-1 text-slate-400 hover:text-red-600"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Add Lesson Input */}
                        <div className="pt-1 flex gap-2">
                          <input
                            type="text"
                            placeholder="Add lesson title to this module..."
                            id={`add-lesson-input-${i}`}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const val = (e.target as HTMLInputElement).value;
                                addLessonToModule(i, val);
                                (e.target as HTMLInputElement).value = "";
                              }
                            }}
                            className="flex-1 border border-slate-200 rounded-xl px-3 py-1.5 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const inputEl = document.getElementById(`add-lesson-input-${i}`) as HTMLInputElement;
                              if (inputEl && inputEl.value) {
                                addLessonToModule(i, inputEl.value);
                                inputEl.value = "";
                              }
                            }}
                            className="bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 font-extrabold px-3 py-1.5 rounded-xl text-xs transition-colors shrink-0"
                          >
                            + Add Lesson
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 border border-slate-200 rounded-2xl">
                  <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-extrabold text-slate-700">No curriculum modules added yet.</p>
                  <p className="text-[11px] text-slate-400">Use the form below to add your first module.</p>
                </div>
              )}

              {/* Add New Module Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs">
                <p className="font-extrabold text-slate-900 text-xs sm:text-sm">Add New Curriculum Module</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Module Tag (e.g. Module 01)"
                    value={newModule.module}
                    onChange={(e) => setNewModule({ ...newModule, module: e.target.value })}
                    className="border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 font-bold text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="text"
                    placeholder="Module Title (e.g. Computer Fundamentals)"
                    value={newModule.title}
                    onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                    className="sm:col-span-2 border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 font-bold text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <textarea
                  placeholder="Lessons list (One lesson per line)&#10;e.g.&#10;1. Introduction to computers&#10;2. Operating system basics&#10;3. File management"
                  value={newModule.lessonsStr}
                  onChange={(e) => setNewModule({ ...newModule, lessonsStr: e.target.value })}
                  rows={4}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 font-medium text-slate-900 text-xs resize-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={addModule}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2 shadow-sm shadow-blue-600/20"
                >
                  <PlusCircle className="w-4 h-4" /> Save Module
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: STUDENT REVIEWS MANAGER */}
          {activeTab === "reviews" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-950">Student Reviews &amp; Testimonials CMS</h3>
                  <p className="text-xs text-slate-500">Manage student reviews displayed on the public course page.</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold">
                    <span>Rating:</span>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={displayRating}
                      onChange={(e) => setDisplayRating(Number(e.target.value) || 4.9)}
                      className="w-14 border border-slate-300 rounded px-1.5 py-0.5 text-xs font-black text-slate-900 bg-white"
                    />
                    <span>/ 5</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold">
                    <span>Count:</span>
                    <input
                      type="number"
                      min="0"
                      value={displayReviewCount}
                      onChange={(e) => setDisplayReviewCount(Number(e.target.value) || 0)}
                      className="w-16 border border-slate-300 rounded px-1.5 py-0.5 text-xs font-black text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((r, i) => (
                    <div key={i} className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between space-y-3 relative group">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                            {r.avatar || getInitials(r.name)}
                          </div>
                          <div className="flex-1 space-y-1">
                            <input
                              type="text"
                              value={r.name}
                              onChange={(e) => {
                                const updated = [...reviews];
                                updated[i].name = e.target.value;
                                updated[i].avatar = getInitials(e.target.value);
                                setReviews(updated);
                              }}
                              placeholder="Student Name"
                              className="w-full text-xs sm:text-sm font-extrabold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={r.course || "Completed"}
                                onChange={(e) => {
                                  const updated = [...reviews];
                                  updated[i].course = e.target.value;
                                  setReviews(updated);
                                }}
                                placeholder="Status Tag"
                                className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 rounded px-2 py-0.5 w-28 focus:outline-none focus:ring-1 focus:ring-blue-600"
                              />
                              <select
                                value={r.rating}
                                onChange={(e) => {
                                  const updated = [...reviews];
                                  updated[i].rating = Number(e.target.value);
                                  setReviews(updated);
                                }}
                                className="text-[11px] font-extrabold text-yellow-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 focus:outline-none"
                              >
                                <option value="5">5 ★</option>
                                <option value="4">4 ★</option>
                                <option value="3">3 ★</option>
                                <option value="2">2 ★</option>
                                <option value="1">1 ★</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveReview(i, "up")}
                            disabled={i === 0}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 min-h-[36px] min-w-[36px] flex items-center justify-center"
                            title="Move Review Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveReview(i, "down")}
                            disabled={i === reviews.length - 1}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 min-h-[36px] min-w-[36px] flex items-center justify-center"
                            title="Move Review Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeReview(i)}
                            className="p-1 text-slate-400 hover:text-red-600 min-h-[36px] min-w-[36px] flex items-center justify-center"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <textarea
                        value={r.comment}
                        onChange={(e) => {
                          const updated = [...reviews];
                          updated[i].comment = e.target.value;
                          setReviews(updated);
                        }}
                        rows={2}
                        placeholder="Review comment..."
                        className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none font-medium"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 border border-slate-200 rounded-2xl">
                  <Star className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-extrabold text-slate-700">No student reviews added yet.</p>
                  <p className="text-[11px] text-slate-400">Add authentic student feedback using the form below.</p>
                </div>
              )}

              {/* Add New Review Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs">
                <p className="font-extrabold text-slate-900 text-xs sm:text-sm">Add New Student Testimonial</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Student Name (e.g. Priya Sharma)"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 font-bold text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                  <div>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                      className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 font-bold text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="5">5 Stars (Excellent)</option>
                      <option value="4">4 Stars (Good)</option>
                      <option value="3">3 Stars (Average)</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Status Tag (e.g. Completed / Graduate)"
                    value={newReview.course}
                    onChange={(e) => setNewReview({ ...newReview, course: e.target.value })}
                    className="border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 font-medium text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <textarea
                  placeholder="Review Comment / Feedback text..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={3}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 font-medium text-slate-900 text-xs resize-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={addReview}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2 shadow-sm shadow-blue-600/20"
                >
                  <PlusCircle className="w-4 h-4" /> Save Review
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: FAQ & SEO MANAGER */}
          {activeTab === "faq" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-extrabold text-slate-950">Frequently Asked Questions &amp; SEO Metadata</h3>
                <p className="text-xs text-slate-500">Manage course FAQs and Google search engine optimization fields.</p>
              </div>

              {/* FAQ Section */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Course FAQs</h4>

                {faqs.length > 0 ? (
                  <div className="space-y-3">
                    {faqs.map((faq, i) => (
                      <div key={i} className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-4 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <input
                            type="text"
                            value={faq.q}
                            onChange={(e) => {
                              const updated = [...faqs];
                              updated[i].q = e.target.value;
                              setFaqs(updated);
                            }}
                            className="flex-1 font-extrabold text-slate-900 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Question"
                          />

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => moveFaq(i, "up")}
                              disabled={i === 0}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveFaq(i, "down")}
                              disabled={i === faqs.length - 1}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFaq(i)}
                              className="p-1 text-slate-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <textarea
                          value={faq.a}
                          onChange={(e) => {
                            const updated = [...faqs];
                            updated[i].a = e.target.value;
                            setFaqs(updated);
                          }}
                          rows={2}
                          className="w-full text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                          placeholder="Answer"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 border border-slate-200 rounded-2xl">
                    <MessageSquare className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs font-extrabold text-slate-700">No FAQs added yet.</p>
                  </div>
                )}

                {/* Add New FAQ Box */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs">
                  <p className="font-extrabold text-slate-900 text-xs">Add New FAQ</p>
                  <input
                    type="text"
                    placeholder="Question (e.g. What are the eligibility criteria?)"
                    value={newFaq.q}
                    onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 font-bold text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                  <textarea
                    placeholder="Answer details..."
                    value={newFaq.a}
                    onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
                    rows={2}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-2.5 font-medium text-slate-900 text-xs resize-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={addFaq}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-3 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-sm shadow-blue-600/20"
                  >
                    <PlusCircle className="w-4 h-4" /> Save FAQ
                  </button>
                </div>
              </div>

              {/* SEO Section */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">SEO Meta Information</h4>
                <div>
                  <label className="block font-extrabold text-slate-800 mb-1.5">Meta Title</label>
                  <input
                    type="text"
                    value={seo.title}
                    onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                    placeholder="e.g. Diploma in Computer Applications (DCA) | RCI Kanpur"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium text-xs"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-slate-800 mb-1.5">Meta Description</label>
                  <textarea
                    value={seo.description}
                    onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                    placeholder="Brief description for Google search snippet..."
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium text-xs resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Action Buttons */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-400 font-medium">
              {activeTab === "general" && "Step 1 of 4: Basic Info & Pricing"}
              {activeTab === "curriculum" && "Step 2 of 4: Curriculum Builder"}
              {activeTab === "reviews" && "Step 3 of 4: Student Testimonials"}
              {activeTab === "faq" && "Step 4 of 4: FAQ & SEO Configuration"}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
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
                type="button"
                onClick={() => setShowUnsavedModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-extrabold text-xs hover:bg-slate-50 transition-colors"
              >
                Stay
              </button>
              <button
                type="button"
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
