"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { RCIConfig } from "@/lib/config";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import { submitAdmission } from "@/components/admin/admission-actions-server";
import WhatsAppCounsellingBanner from "@/components/whatsapp-counselling-banner";

// Animation Variants for Smooth, Lightweight Motion
const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: custom * 0.08, ease: "easeOut" as const },
  }),
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const benefitItemVariant: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

interface CourseItem {
  id: string;
  course_name: string;
  slug?: string;
}

interface AdmissionFormContentProps {
  initialCourses?: CourseItem[];
  initialContact?: {
    whatsapp: string;
    phone: string;
    phoneRaw: string;
    email: string;
  };
  initialSite?: {
    short_name: string;
    site_name: string;
  };
}

function AdmissionFormContent({ initialCourses = [], initialContact, initialSite }: AdmissionFormContentProps) {
  const searchParams = useSearchParams();
  const courseParam = searchParams.get("course") || "";

  const [courses, setCourses] = useState<CourseItem[]>(initialCourses);
  const [form, setForm] = useState({ student_name: "", email: "", phone: "", selected_course: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedRef, setSubmittedRef] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ student_name?: string; phone?: string; email?: string; selected_course?: string }>({});

  const [siteSettings, setSiteSettings] = useState({
    short_name: initialSite?.short_name || RCIConfig.shortName,
    site_name: initialSite?.site_name || RCIConfig.instituteName,
  });
  const [contactSettings, setContactSettings] = useState({
    whatsapp: initialContact?.whatsapp || RCIConfig.whatsappNumber,
    phone: initialContact?.phone || RCIConfig.phoneFormatted,
    phoneRaw: initialContact?.phoneRaw || RCIConfig.phoneRaw,
    email: initialContact?.email || RCIConfig.email,
  });

  useEffect(() => {
    const supabase = createClient();

    if (!initialSite) {
      supabase.from("site_settings").select("short_name, site_name").eq("id", "default").single().then(({ data }) => {
        if (data) {
          setSiteSettings({
            short_name: data.short_name || RCIConfig.shortName,
            site_name: data.site_name || RCIConfig.instituteName,
          });
        }
      });
    }

    if (!initialContact) {
      supabase.from("contact_settings").select("whatsapp, phone, email").eq("id", "default").single().then(({ data }) => {
        if (data) {
          setContactSettings({
            whatsapp: data.whatsapp ? data.whatsapp.replace(/\D/g, "") : RCIConfig.whatsappNumber,
            phone: data.phone || RCIConfig.phoneFormatted,
            phoneRaw: data.phone ? data.phone.replace(/\s+/g, "") : RCIConfig.phoneRaw,
            email: data.email || RCIConfig.email,
          });
        }
      });
    }

    if (initialCourses.length > 0) {
      if (courseParam) {
        const paramLower = courseParam.toLowerCase();
        const match = initialCourses.find((c) => 
          (c.slug && c.slug.toLowerCase() === paramLower) ||
          c.course_name.toLowerCase() === paramLower ||
          c.course_name.toLowerCase().includes(paramLower) || 
          paramLower.includes(c.course_name.toLowerCase())
        );
        if (match) {
          setForm((prev) => ({ ...prev, selected_course: match.course_name }));
        } else {
          setForm((prev) => ({ ...prev, selected_course: courseParam }));
        }
      }
    } else {
      supabase
        .from("courses")
        .select("id, course_name, slug")
        .or("status.eq.Active,status.is.null")
        .order("course_name", { ascending: true })
        .then(({ data }) => {
          const loadedCourses = data || [];
          setCourses(loadedCourses);

          if (courseParam) {
            const paramLower = courseParam.toLowerCase();
            const match = loadedCourses.find((c) => 
              (c.slug && c.slug.toLowerCase() === paramLower) ||
              c.course_name.toLowerCase() === paramLower ||
              c.course_name.toLowerCase().includes(paramLower) || 
              paramLower.includes(c.course_name.toLowerCase())
            );
            if (match) {
              setForm((prev) => ({ ...prev, selected_course: match.course_name }));
            } else {
              setForm((prev) => ({ ...prev, selected_course: courseParam }));
            }
          }
        });
    }
  }, [courseParam, initialCourses, initialSite, initialContact]);

  const validateForm = () => {
    const errors: { student_name?: string; phone?: string; email?: string; selected_course?: string } = {};

    if (!form.student_name.trim()) {
      errors.student_name = "Full Name is required.";
    }

    const cleanPhone = form.phone.replace(/\D/g, "");
    if (!cleanPhone) {
      errors.phone = "Mobile Number is required.";
    } else if (cleanPhone.length !== 10) {
      errors.phone = "Enter a valid 10-digit mobile number.";
    }

    if (form.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        errors.email = "Please enter a valid email address.";
      }
    }

    if (!form.selected_course.trim()) {
      errors.selected_course = "Please select a course to continue.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await submitAdmission({
        student_name: form.student_name.trim(),
        phone: form.phone.replace(/\D/g, ""),
        email: form.email.trim() || undefined,
        selected_course: form.selected_course,
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to submit application. Please try again.");
      }

      setSubmittedRef(res.admissionId || "");
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong while submitting. Please try again or WhatsApp us.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const whatsappText = `Hello ${siteSettings.short_name} Admissions Desk, I have submitted an online admission application on your portal.\n\n*Name:* ${form.student_name}\n*Mobile:* ${form.phone}\n*Course:* ${form.selected_course}${submittedRef ? `\n*Ref ID:* #${submittedRef}` : ""}\n\nPlease confirm my application and share batch timing options.`;
  const whatsappUrl = `https://wa.me/${contactSettings.whatsapp}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="relative">
      {/* Visual Ambient Glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500 pointer-events-none" />

      <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-9 border border-blue-100 shadow-xl shadow-blue-900/5">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="text-center py-6 sm:py-8"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-200/80 shadow-md shadow-emerald-500/10">
                <i className="fa-solid fa-check text-2xl sm:text-3xl" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Application Registered</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-display text-[#07152F] mb-2 tracking-tight">
                Admission Form Submitted!
              </h2>

              {submittedRef && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm font-mono font-bold mb-4 shadow-2xs">
                  <i className="fa-solid fa-receipt text-blue-600" />
                  <span>Application Reference ID: <strong>#{submittedRef}</strong></span>
                </div>
              )}

              <p className="text-slate-600 text-xs sm:text-sm md:text-base max-w-md mx-auto mb-7 leading-relaxed font-normal">
                Thank you for choosing <strong>{siteSettings.short_name}</strong>. Our academic counseling coordinator will call you shortly to confirm your batch timing, syllabus, and fee installment plan.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#07152F] hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm transition-all shadow-md active:scale-98 min-h-[46px]"
                >
                  <i className="fa-solid fa-house text-xs" />
                  <span>Return to Home</span>
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/25 active:scale-98 min-h-[46px] cursor-pointer"
                >
                  <i className="fa-brands fa-whatsapp text-base" />
                  <span>Instant WhatsApp Confirmation</span>
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              noValidate
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {/* Card Form Header with Real-time Pill */}
              <div className="border-b border-slate-100 pb-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 border border-blue-100 text-[#155EEF] text-xs font-black uppercase tracking-wider mb-1.5">
                    <i className="bi bi-shield-check text-[#D4A72C] text-xs" />
                    <span>Official RCI Admission Form</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-display text-[#07152F] tracking-tight leading-tight">
                    Complete Your Application
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm mt-0.5 leading-relaxed font-normal">
                    Submit your details and our admission team will contact you.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Session 2026 Active</span>
                </div>
              </div>

              {/* Error Alert Box */}
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-2xs">
                  <i className="bi bi-exclamation-triangle-fill text-rose-500 text-sm shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Pre-Selected Course Banner */}
              {courseParam && form.selected_course && (
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50/70 to-blue-50 border border-blue-200/90 px-4 py-2.5 rounded-xl text-xs font-bold text-blue-950 flex items-center justify-between shadow-2xs">
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-check-circle text-blue-600 text-sm" />
                    <span>Selected Course:</span>
                  </span>
                  <span className="bg-gradient-to-r from-[#155EEF] to-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-black tracking-wide shadow-2xs">
                    {form.selected_course}
                  </span>
                </div>
              )}

              {/* 1. Student Name Field */}
              <div>
                <label htmlFor="student_name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <i className="bi bi-person-fill text-sm" />
                  </div>
                  <input
                    id="student_name"
                    name="student_name"
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={form.student_name}
                    onChange={(e) => {
                      setForm({ ...form, student_name: e.target.value });
                      if (fieldErrors.student_name) setFieldErrors({ ...fieldErrors, student_name: undefined });
                    }}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50/70 border rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.student_name ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:border-[#155EEF] focus:ring-[#155EEF]/15"
                    }`}
                  />
                </div>
                {fieldErrors.student_name && (
                  <p className="text-[11.5px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <i className="bi bi-exclamation-circle-fill text-[10px]" />
                    <span>{fieldErrors.student_name}</span>
                  </p>
                )}
              </div>

              {/* 2. Contact Fields (Mobile & Email Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Mobile Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <span className="text-xs font-bold text-slate-500">+91</span>
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={form.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setForm({ ...form, phone: val });
                        if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: undefined });
                      }}
                      className={`w-full pl-12 pr-4 py-3 bg-slate-50/70 border rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.phone ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:border-[#155EEF] focus:ring-[#155EEF]/15"
                      }`}
                    />
                  </div>
                  {fieldErrors.phone ? (
                    <p className="text-[11.5px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                      <i className="bi bi-exclamation-circle-fill text-[10px]" />
                      <span>{fieldErrors.phone}</span>
                    </p>
                  ) : (
                    <p className="text-[10.5px] text-slate-400 mt-1">10-digit mobile number for WhatsApp &amp; SMS updates.</p>
                  )}
                </div>

                {/* Email Field (Optional) */}
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <i className="bi bi-envelope-fill text-sm" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="rahul@example.com"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                      }}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50/70 border rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.email ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:border-[#155EEF] focus:ring-[#155EEF]/15"
                      }`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-[11.5px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                      <i className="bi bi-exclamation-circle-fill text-[10px]" />
                      <span>{fieldErrors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* 3. Course Selection Dropdown */}
              <div>
                <label htmlFor="selected_course" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Desired Course <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <i className="fa-solid fa-graduation-cap text-xs" />
                  </div>
                  <select
                    id="selected_course"
                    name="selected_course"
                    required
                    value={form.selected_course}
                    onChange={(e) => {
                      setForm({ ...form, selected_course: e.target.value });
                      if (fieldErrors.selected_course) setFieldErrors({ ...fieldErrors, selected_course: undefined });
                    }}
                    className={`w-full pl-10 pr-10 py-3 bg-slate-50/70 border rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                      fieldErrors.selected_course ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:border-[#155EEF] focus:ring-[#155EEF]/15"
                    }`}
                  >
                    <option value="">-- Select a Computer Course --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.course_name}>
                        {c.course_name}
                      </option>
                    ))}
                    {/* Fallback Option if selected course isn't in DB */}
                    {form.selected_course && !courses.some((c) => c.course_name === form.selected_course) && (
                      <option value={form.selected_course}>{form.selected_course}</option>
                    )}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <i className="fa-solid fa-chevron-down text-xs" />
                  </div>
                </div>
                {fieldErrors.selected_course ? (
                  <p className="text-[11.5px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <i className="bi bi-exclamation-circle-fill text-[10px]" />
                    <span>{fieldErrors.selected_course}</span>
                  </p>
                ) : (
                  <p className="text-[10.5px] text-slate-400 mt-1">
                    Not sure which course fits best? Choose your closest interest and our mentor will guide you.
                  </p>
                )}
              </div>

              {/* 4. Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative group overflow-hidden bg-gradient-to-r from-[#155EEF] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3.5 sm:py-4 px-6 rounded-xl font-black text-sm tracking-wide shadow-lg shadow-blue-600/25 transition-all duration-300 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Submitting Admission Form...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Admission Application</span>
                      <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {/* Trust Subtext */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-center text-[11px] text-slate-500">
                <i className="bi bi-shield-lock-fill text-emerald-600 text-xs" />
                <span>Zero registration fees for counselling. Your data is 100% confidential.</span>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export interface AdmissionFormClientProps {
  initialCourses?: CourseItem[];
  contactSettings?: {
    whatsapp: string;
    phone: string;
    phoneRaw: string;
    email: string;
  };
  siteSettings?: {
    short_name: string;
    site_name: string;
  };
}

export default function AdmissionFormClient({
  initialCourses = [],
  contactSettings = {
    whatsapp: RCIConfig.whatsappNumber,
    phone: RCIConfig.phoneFormatted,
    phoneRaw: RCIConfig.phoneRaw,
    email: RCIConfig.email,
  },
  siteSettings = {
    short_name: RCIConfig.shortName,
    site_name: RCIConfig.instituteName,
  },
}: AdmissionFormClientProps) {
  return (
    <main className="min-h-screen bg-[#f8fafc] pt-6 sm:pt-14 pb-20 relative overflow-hidden">
      {/* Subtle, Tasteful Background Ambient Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 via-white to-slate-50/70 pointer-events-none" />

      {/* Clean Blueprint Geometry Rings */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[720px] h-[720px] pointer-events-none opacity-[0.04] select-none text-slate-800">
        <svg viewBox="0 0 720 720" className="w-full h-full animate-[spin_90s_linear_infinite]">
          <circle cx="360" cy="360" r="330" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
          <circle cx="360" cy="360" r="250" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="360" cy="360" r="160" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="360" y1="0" x2="360" y2="720" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="0" y1="360" x2="720" y2="360" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
        </svg>
      </div>

      {/* Clean Subtle Micro-Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.22] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        
        {/* 1. Academic Hero Header with Framer Motion Entrance */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-12"
        >
          <motion.div variants={fadeUpVariant} custom={0}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-blue-200/80 shadow-xs text-xs font-black uppercase tracking-wider text-[#155EEF] mb-3.5">
              <span className="w-5 h-5 rounded-md bg-blue-50 text-[#155EEF] flex items-center justify-center">
                <i className="bi bi-mortarboard-fill text-xs text-[#D4A72C]" />
              </span>
              <span>Online Admissions Open Session 2026-27</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUpVariant}
            custom={1}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black font-display tracking-tight text-[#07152F] mb-3 leading-[1.15]"
          >
            Launch Your Career with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 animate-gradient-text font-black">
              {siteSettings.site_name || "Rohit Computer Institute"}
            </span>
          </motion.h1>
          
          <motion.p
            variants={fadeUpVariant}
            custom={2}
            className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-normal"
          >
            Fill out the quick admission form below. Our academic counselors will contact you to explain the curriculum, batch timings, and career pathways.
          </motion.p>

          {/* Quick Feature Badges Strip */}
          <motion.div
            variants={fadeUpVariant}
            custom={3}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4"
          >
            <span className="inline-flex items-center gap-1.5 bg-blue-50/90 text-blue-900 border border-blue-200/60 px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
              <i className="fa-solid fa-check text-emerald-600 text-[11px]" />
              100% Practical Lab Training
            </span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-50/90 text-indigo-900 border border-indigo-200/60 px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
              <i className="fa-solid fa-check text-emerald-600 text-[11px]" />
              MSME Certified
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-50/90 text-amber-900 border border-amber-200/60 px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
              <i className="fa-solid fa-check text-emerald-600 text-[11px]" />
              Flexible Batch Timings
            </span>
          </motion.div>
        </motion.div>

        {/* 2. Two-Column Admission Workspace */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-14 sm:mb-20">
          
          {/* RIGHT COLUMN: Admission Form */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
            className="order-1 lg:order-2 w-full lg:col-span-7"
          >
            <Suspense fallback={
              <div className="bg-white/95 backdrop-blur-md p-10 rounded-3xl border border-blue-100 shadow-xl text-center text-slate-500 font-bold">
                <div className="w-8 h-8 rounded-full border-3 border-blue-600 border-t-transparent animate-spin mx-auto mb-3" />
                Loading RCI admission portal...
              </div>
            }>
              <AdmissionFormContent
                initialCourses={initialCourses}
                initialContact={contactSettings}
                initialSite={siteSettings}
              />
            </Suspense>

            {/* 4-Feature Trust Strip Below the Form */}
            <div className="mt-5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 sm:px-6 sm:py-4 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 items-center">
                <div className="flex items-center gap-2.5 group">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#155EEF] flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-110 group-hover:rotate-2 transition-transform duration-200">
                    <i className="fa-solid fa-desktop text-xs" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-[#07152F] leading-tight">1:1 PC Lab</p>
                    <p className="text-[10px] text-slate-500">Individual Seat</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 group">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 group-hover:scale-110 group-hover:rotate-2 transition-transform duration-200">
                    <i className="fa-solid fa-chalkboard-user text-xs" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-[#07152F] leading-tight">Expert Mentors</p>
                    <p className="text-[10px] text-slate-500">10+ Yrs Exp.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 group">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 group-hover:scale-110 group-hover:rotate-2 transition-transform duration-200">
                    <i className="fa-solid fa-award text-xs" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-[#07152F] leading-tight">RCI Certified</p>
                    <p className="text-[10px] text-slate-500">Valid Diploma</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 group">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-110 group-hover:rotate-2 transition-transform duration-200">
                    <i className="bi bi-person-workspace text-xs" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-[#07152F] leading-tight">Student Portal</p>
                    <p className="text-[10px] text-slate-500">24/7 Online</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* LEFT COLUMN: Why Choose RCI Benefits */}
          <div className="order-2 lg:order-1 w-full lg:col-span-5 space-y-5">
            
            {/* Why Choose RCI Card with Staggered Viewport Reveal */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#155EEF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-flex items-center gap-1.5">
                  <i className="bi bi-stars text-amber-500" />
                  <span>The RCI Advantage</span>
                </span>
                <span className="text-[11px] font-bold text-slate-500">Est. 2012</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-display text-[#07152F] mb-4 tracking-tight leading-tight">
                Why Study at Rohit Computer Institute?
              </h2>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={staggerContainer}
                className="space-y-4"
              >
                {[
                  {
                    title: "Individual Desktop Labs",
                    desc: "Daily hands-on lab sessions with 1-student per dedicated PC. No waiting or sharing desks.",
                    icon: "fa-solid fa-computer",
                    color: "bg-blue-50 text-[#155EEF] border-blue-100",
                  },
                  {
                    title: "Job-Ready Curriculum",
                    desc: "Updated syllabus for DCA, ADCA, Tally Prime + GST, Web Development & Python Programming.",
                    icon: "fa-solid fa-briefcase",
                    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
                  },
                  {
                    title: "Verifiable ISO & MSME Credentials",
                    desc: "Certificates with cryptographic QR security accepted by government and private firms nationwide.",
                    icon: "fa-solid fa-certificate",
                    color: "bg-amber-50 text-amber-600 border-amber-100",
                  },
                  {
                    title: "Full-Featured Student Portal",
                    desc: "Instant access to exam results, lecture notes, attendance tracking, and fee installment receipts.",
                    icon: "bi bi-mortarboard-fill",
                    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
                  },
                ].map((feat, idx) => (
                  <motion.div
                    key={idx}
                    variants={benefitItemVariant}
                    className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all duration-200 flex items-start gap-3.5 group shadow-2xs hover:shadow-xs hover:-translate-y-0.5"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${feat.color} shadow-2xs group-hover:scale-110 group-hover:rotate-2 transition-transform duration-200`}>
                      <i className={`${feat.icon} text-xs`} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-[#07152F] group-hover:text-[#155EEF] transition-colors leading-snug">
                        {feat.title}
                      </h3>
                      <p className="text-[11.5px] text-slate-500 mt-0.5 leading-relaxed font-normal">
                        {feat.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Limited Batch Seats Urgency Card */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-50/50 to-orange-500/10 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                  <i className="fa-solid fa-users-line text-sm" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black text-[#07152F]">
                    Small Batches: Max 15 Students
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    We maintain small batch sizes so every candidate receives personal doubt clearing and guidance.
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp Counselling Banner */}
            <WhatsAppCounsellingBanner
              badge="Personal Admission Desk"
              title="Need Guidance on Courses & Fees?"
              description="Chat with our senior counselor directly on WhatsApp to choose the best curriculum for your career."
              buttonText="Connect on WhatsApp"
              customMessage="Hello RCI Admissions Team, I would like guidance on computer courses, fees, and batch timings."
              variant="compact"
              maxWidthClass="w-full"
              className="!p-6 !rounded-3xl shadow-lg border-emerald-800/40"
            />

          </div>

        </div>

        {/* 3. What Happens After You Apply (3-Step Roadmap) with Viewport Reveal */}
        <div className="border-t border-slate-200/90 pt-14 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#155EEF] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
              <i className="bi bi-lightning-charge-fill text-amber-500" />
              <span>Transparent Admission Journey</span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-[#07152F] mt-2.5 tracking-tight">
              What Happens After You Apply?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-normal">
              From application submission to your first hands-on lab class in 3 simple steps.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto"
          >
            {[
              {
                number: "01",
                title: "Submit Online Application",
                desc: "Complete the online application form above in under 60 seconds. Zero initial registration charges.",
                icon: "fa-solid fa-file-signature",
                color: "text-blue-600 bg-blue-50 border-blue-200",
              },
              {
                number: "02",
                title: "Admissions Counselling Call",
                desc: "Our coordinator contacts you to review suitable courses, fee installment structure, and lab timings.",
                icon: "fa-solid fa-headset",
                color: "text-indigo-600 bg-indigo-50 border-indigo-200",
              },
              {
                number: "03",
                title: "Seat & Portal Confirmation",
                desc: "Select your convenient morning/evening batch, receive your student ID, and begin hands-on practicals.",
                icon: "fa-solid fa-id-badge",
                color: "text-emerald-600 bg-emerald-50 border-emerald-200",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={benefitItemVariant}
                className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase text-[#155EEF] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                      Step {step.number}
                    </span>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${step.color} shadow-2xs group-hover:scale-110 transition-transform`}>
                      <i className={`${step.icon} text-xs`} />
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#07152F] mb-1.5 group-hover:text-[#155EEF] transition-colors leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span>Smooth Onboarding</span>
                  <i className="fa-solid fa-arrow-right text-[9px] group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 4. Direct Assistance Helpline Bar */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 sm:p-5 max-w-2xl mx-auto text-center shadow-sm">
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Have questions or prefer in-person registration? Call admissions at{" "}
            <a
              href={`tel:${contactSettings.phoneRaw}`}
              className="text-[#155EEF] font-black hover:underline inline-flex items-center gap-1"
            >
              <i className="fa-solid fa-phone text-xs" />
              <span>{contactSettings.phone}</span>
            </a>{" "}
            or email{" "}
            <a
              href={`mailto:${contactSettings.email}`}
              className="text-[#07152F] font-black hover:underline inline-flex items-center gap-1"
            >
              <i className="fa-solid fa-envelope text-xs" />
              <span>{contactSettings.email}</span>
            </a>
            .
          </p>
        </div>

      </div>
    </main>
  );
}
