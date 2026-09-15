"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { RCIConfig } from "@/lib/config";
import { 
  Send, CheckCircle2, GraduationCap, ShieldCheck, Laptop, 
  Users, Award, MessageCircle, HelpCircle, Sparkles, Loader2,
  User, Phone, Mail, BookOpen, Lock, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { submitAdmission } from "@/components/admin/admission-actions-server";
import WhatsAppCounsellingBanner from "@/components/whatsapp-counselling-banner";

function AdmissionFormContent() {
  const searchParams = useSearchParams();
  const courseParam = searchParams.get("course") || "";

  const [courses, setCourses] = useState<{ id: string; course_name: string }[]>([]);
  const [form, setForm] = useState({ student_name: "", email: "", phone: "", selected_course: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedRef, setSubmittedRef] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ student_name?: string; phone?: string; email?: string; selected_course?: string }>({});

  const [siteSettings, setSiteSettings] = useState({ short_name: RCIConfig.shortName, site_name: RCIConfig.instituteName });
  const [contactSettings, setContactSettings] = useState({ whatsapp: RCIConfig.whatsappNumber, phone: RCIConfig.phoneFormatted, phoneRaw: RCIConfig.phoneRaw, email: RCIConfig.email });

  useEffect(() => {
    const supabase = createClient();

    supabase.from("site_settings").select("short_name, site_name").eq("id", "default").single().then(({ data }) => {
      if (data) setSiteSettings({ short_name: data.short_name || RCIConfig.shortName, site_name: data.site_name || RCIConfig.instituteName });
    });

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
  }, [courseParam]);

  const validateForm = () => {
    const errors: { student_name?: string; phone?: string; email?: string; selected_course?: string } = {};

    if (!form.student_name.trim()) {
      errors.student_name = "Full Name is required.";
    }

    const cleanPhone = form.phone.replace(/\D/g, "");
    if (!cleanPhone) {
      errors.phone = "Phone Number is required.";
    } else if (cleanPhone.length !== 10) {
      errors.phone = "Please enter a valid 10-digit Indian mobile number.";
    }

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!form.selected_course.trim()) {
      errors.selected_course = "Please select a course program.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent double submission

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await submitAdmission({
        student_name: form.student_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        selected_course: form.selected_course.trim(),
      });

      if (!res.success) {
        setError(res.error || "Unable to submit application. Please try again or contact admissions.");
        setLoading(false);
      } else {
        if (res.admissionId) {
          setSubmittedRef(res.admissionId.slice(0, 8).toUpperCase());
        }
        setSuccess(true);
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred. Please check your connection and try again.");
      setLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/${contactSettings.whatsapp}?text=${encodeURIComponent(
    `Hello RCI, I have submitted an online application for ${form.selected_course || "a computer course"}${submittedRef ? ` (Ref: #${submittedRef})` : ""}. Please guide me on batch timings and fees.`
  )}`;

  return (
    <div className="relative group">
      {/* Subtle Ambient Background Glow for Form Card Emphasis */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-blue-500/15 rounded-[2rem] blur-xl opacity-75 transition-all duration-500 group-hover:opacity-100 pointer-events-none" />

      {/* Main Premium Form Surface Card */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-blue-100 shadow-xl shadow-blue-950/5 p-4 sm:p-7 md:p-9 overflow-hidden">
        {/* Subtle Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-5 sm:py-8"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
                <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-display text-slate-900 mb-2">
                Application Submitted Successfully!
              </h3>

              {submittedRef && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-bold mb-3">
                  Reference ID: #{submittedRef}
                </div>
              )}

              <p className="text-slate-600 text-xs sm:text-sm md:text-base max-w-md mx-auto mb-6 leading-relaxed">
                Thank you for applying to {siteSettings.short_name}. Our admissions counseling team will contact you shortly to confirm your course schedule, installment fees, and lab batch timing.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-xs active:scale-98 min-h-[44px]"
                >
                  Back to Home
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 active:scale-98 min-h-[44px]"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp RCI
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} noValidate className="space-y-3.5 sm:space-y-4">
              
              {/* Card Form Header */}
              <div className="border-b border-slate-100 pb-3 sm:pb-4 mb-3 sm:mb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  RCI Admission Form
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-display text-slate-900 tracking-tight leading-tight">
                  Complete Your Application
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-0.5 leading-relaxed">
                  Fill in your details and our team will get in touch.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <span>{error}</span>
                </div>
              )}

              {/* Pre-Selected Course Banner */}
              {courseParam && form.selected_course && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200/80 px-3.5 py-2 rounded-xl text-xs font-extrabold text-blue-900 flex items-center justify-between shadow-2xs">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    Selected Course:
                  </span>
                  <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-md text-[11px] font-black tracking-wide shadow-2xs">
                    {form.selected_course}
                  </span>
                </div>
              )}

              {/* Full Name Field */}
              <div>
                <label htmlFor="student_name" className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="student_name"
                    type="text"
                    value={form.student_name}
                    onChange={(e) => {
                      setForm({ ...form, student_name: e.target.value });
                      if (fieldErrors.student_name) setFieldErrors((prev) => ({ ...prev, student_name: undefined }));
                    }}
                    placeholder="Enter your full name"
                    aria-required="true"
                    aria-invalid={!!fieldErrors.student_name}
                    aria-describedby={fieldErrors.student_name ? "student_name_error" : undefined}
                    className={`w-full h-11 sm:h-12 pl-10 pr-3.5 border rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium transition-all ${
                      fieldErrors.student_name 
                        ? "border-red-300 bg-red-50/50 focus:ring-2 focus:ring-red-400 focus:border-transparent" 
                        : "border-slate-200/90 bg-slate-50/40 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                    }`}
                    required
                  />
                </div>
                {fieldErrors.student_name && (
                  <p id="student_name_error" className="text-red-500 text-xs font-semibold mt-1">
                    {fieldErrors.student_name}
                  </p>
                )}
              </div>

              {/* Phone & Email Fields Grid */}
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => {
                        setForm({ ...form, phone: e.target.value });
                        if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      placeholder="10-digit mobile number"
                      aria-required="true"
                      aria-invalid={!!fieldErrors.phone}
                      aria-describedby={fieldErrors.phone ? "phone_error" : undefined}
                      className={`w-full h-11 sm:h-12 pl-10 pr-3.5 border rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium transition-all ${
                        fieldErrors.phone 
                          ? "border-red-300 bg-red-50/50 focus:ring-2 focus:ring-red-400 focus:border-transparent" 
                          : "border-slate-200/90 bg-slate-50/40 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                      }`}
                      required
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p id="phone_error" className="text-red-500 text-xs font-semibold mt-1">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1">
                    Email Address <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="name@example.com"
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? "email_error" : undefined}
                      className={`w-full h-11 sm:h-12 pl-10 pr-3.5 border rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium transition-all ${
                        fieldErrors.email 
                          ? "border-red-300 bg-red-50/50 focus:ring-2 focus:ring-red-400 focus:border-transparent" 
                          : "border-slate-200/90 bg-slate-50/40 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                      }`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p id="email_error" className="text-red-500 text-xs font-semibold mt-1">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Course Selection Field */}
              <div>
                <label htmlFor="selected_course" className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1">
                  Course Interested In <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <select
                    id="selected_course"
                    value={form.selected_course}
                    onChange={(e) => {
                      setForm({ ...form, selected_course: e.target.value });
                      if (fieldErrors.selected_course) setFieldErrors((prev) => ({ ...prev, selected_course: undefined }));
                    }}
                    aria-required="true"
                    aria-invalid={!!fieldErrors.selected_course}
                    aria-describedby={fieldErrors.selected_course ? "course_error" : undefined}
                    required
                    className={`w-full h-11 sm:h-12 pl-10 pr-7 border rounded-xl text-slate-900 font-medium text-sm transition-all appearance-none bg-slate-50/40 focus:bg-white ${
                      fieldErrors.selected_course 
                        ? "border-red-300 bg-red-50/50 focus:ring-2 focus:ring-red-400 focus:border-transparent" 
                        : "border-slate-200/90 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                    }`}
                  >
                    <option value="">
                      {courses.length === 0 ? "No courses are currently available" : "Select a course program..."}
                    </option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.course_name}>
                        {c.course_name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
                {fieldErrors.selected_course && (
                  <p id="course_error" className="text-red-500 text-xs font-semibold mt-1">
                    {fieldErrors.selected_course}
                  </p>
                )}
              </div>

              {/* Primary CTA Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 sm:h-13 min-h-[46px] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-extrabold text-sm sm:text-base transition-all shadow-md shadow-blue-500/25 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-500/30 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Admission Application</span>
                  </>
                )}
              </button>

              {/* Form Card Security Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500">
                <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Your information is securely submitted for admission counselling.</span>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function AdmissionPage() {
  const [contact, setContact] = useState({ phone: RCIConfig.phoneFormatted, phoneRaw: RCIConfig.phoneRaw, email: RCIConfig.email });

  useEffect(() => {
    const supabase = createClient();
    supabase.from("contact_settings").select("phone, email").eq("id", "default").single().then(({ data }) => {
      if (data) {
        setContact({
          phone: data.phone || RCIConfig.phoneFormatted,
          phoneRaw: data.phone ? data.phone.replace(/\s+/g, "") : RCIConfig.phoneRaw,
          email: data.email || RCIConfig.email,
        });
      }
    });
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-4 sm:pt-8 md:pt-10 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          {/* 1. Compact Task-First Admission Hero */}
          <div className="text-center max-w-2xl mx-auto mb-3.5 sm:mb-6">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-1.5 sm:mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              ONLINE ADMISSIONS 2026
            </span>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black font-display text-slate-900 mb-1 leading-tight tracking-tight">
              Apply for Admission
            </h1>
            
            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              Fill out the quick application below. Our counseling team will guide you on course selection, fee plans, and lab timings.
            </p>
          </div>

          {/* 2. Two-Column Admission Area */}
          {/* Mobile: Form Card (order-1) FIRST with Trust Strip below it, then Left Column (order-2) */}
          {/* Desktop: Left 40% (lg:col-span-5), Right 60% (lg:col-span-7) */}
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-10 items-start mb-12 sm:mb-16">
            
            {/* RIGHT Column (FIRST on Mobile / 60% on Desktop): Admission Form Card */}
            <div className="order-1 lg:order-2 w-full lg:col-span-7">
              <Suspense fallback={<div className="bg-white p-8 rounded-2xl text-center text-slate-400 font-medium">Loading admission form...</div>}>
                <AdmissionFormContent />
              </Suspense>

              {/* 4-Feature Trust Strip: Relocated BELOW the Form */}
              <div className="mt-4 sm:mt-5 bg-white/90 border border-slate-200/90 rounded-2xl p-3 sm:px-5 sm:py-3.5 shadow-2xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 items-center text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Laptop className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] sm:text-xs">Practical Lab Training</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] sm:text-xs">Dedicated IT Faculty</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] sm:text-xs">Online Verification</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] sm:text-xs">Student Portal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LEFT Column (40% Desktop / SECOND on Mobile): Why Choose RCI & WhatsApp Help */}
            <div className="order-2 lg:order-1 w-full lg:col-span-5 space-y-6">
              
              {/* Why Choose RCI Card (Visually Lighter) */}
              <div className="bg-white/80 border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xs">
                <span className="text-[11px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  RCI Advantage
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900 mt-2.5 mb-4">
                  Why Choose RCI?
                </h3>

                <ul className="space-y-4 text-xs sm:text-sm text-slate-700 font-medium">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</div>
                    <div>
                      <strong className="text-slate-900 font-extrabold block">Practical Lab Training</strong>
                      Daily hands-on lab sessions on individual computer desktops.
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</div>
                    <div>
                      <strong className="text-slate-900 font-extrabold block">Career-Oriented Courses</strong>
                      Updated modules for DCA, Tally Prime, Web Design, and Programming.
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</div>
                    <div>
                      <strong className="text-slate-900 font-extrabold block">QR & Online Certificate Verification</strong>
                      Verifiable certificates registered under MSME quality standards.
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</div>
                    <div>
                      <strong className="text-slate-900 font-extrabold block">Digital Student Portal Access</strong>
                      Access to fee ledgers, exam results, attendance, and study downloads.
                    </div>
                  </li>
                </ul>
              </div>

              {/* WhatsApp Help Banner (Secondary CTA) */}
              <WhatsAppCounsellingBanner
                badge="Admission Counseling"
                title="Need help choosing a course?"
                description="Chat directly with an RCI admissions counselor about courses, fees and batch timings."
                buttonText="Chat with RCI on WhatsApp"
                customMessage="Hello RCI, I am interested in admission and would like to talk to a counselor."
                variant="compact"
                maxWidthClass="w-full"
                className="!p-6"
              />

            </div>

          </div>

          {/* 4. What Happens After You Apply (3-Step Section) */}
          <div className="border-t border-slate-200 pt-12">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Simple Workflow
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display text-slate-900 mt-2">
                What Happens After You Apply?
              </h3>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                { number: "01", title: "Submit Application", desc: "Fill out and submit your online form in under 1 minute." },
                { number: "02", title: "Counselling Call", desc: "RCI admissions coordinator contacts you to discuss course & fees." },
                { number: "03", title: "Admission Confirmation", desc: "Choose your batch timing and unlock your student portal." },
              ].map((step, i) => (
                <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold uppercase text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">Step {step.number}</span>
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 mb-1">{step.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Contact Help Line Direct Contact */}
          <div className="mt-10 text-center text-xs text-slate-500">
            Have questions before applying? Call RCI Admissions at{" "}
            <a href={`tel:${contact.phoneRaw}`} className="text-slate-900 font-bold hover:underline">
              {contact.phone}
            </a>{" "}
            or email{" "}
            <a href={`mailto:${contact.email}`} className="text-slate-900 font-bold hover:underline">
              {contact.email}
            </a>
            .
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
