"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  GraduationCap, Lock, Mail, AlertCircle, Eye, EyeOff, 
  ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft, Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RCIConfig } from "@/lib/config";

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError("Please enter both your email address and password.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ 
        email: cleanEmail, 
        password 
      });

      if (authError) {
        setError(authError.message || "Invalid credentials. Please check your email and password.");
        setLoading(false);
      } else {
        router.push("/student");
        router.refresh();
      }
    } catch {
      setError("An unexpected connection error occurred. Please try again.");
      setLoading(false);
    }
  };

  const forgotPasswordWhatsappUrl = RCIConfig.getWhatsAppUrl(
    "Hello RCI, I am a registered student and need assistance resetting my Student Portal password."
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Subtle Blue Background Ambient Glow */}
      <div className="absolute top-[10%] left-[15%] w-[450px] h-[450px] bg-blue-500/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Utility Header Row */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-3 border-b border-slate-200/80 relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 px-2 py-1"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Back to RCI Website</span>
        </Link>

        <span className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
          Official Student Portal
        </span>
      </header>

      {/* Main Authentication Grid Container */}
      <main className="max-w-5xl mx-auto w-full my-auto py-5 sm:py-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT COLUMN: RCI Student Portal Introduction */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-center lg:text-left">
            <div>
              {/* Tightly Grouped Official RCI Logo & Eyebrow Badge */}
              <div className="flex flex-col items-center lg:items-start gap-3 mb-3">
                <Link href="/" className="inline-block focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-xl p-1">
                  <Image
                    src="/logo.png"
                    alt={`${RCIConfig.instituteName} Logo`}
                    width={180}
                    height={65}
                    className="h-14 sm:h-16 w-auto object-contain mx-auto lg:mx-0"
                    priority
                  />
                </Link>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100/80 text-blue-700 text-[11px] font-extrabold uppercase tracking-wider shadow-2xs">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  RCI STUDENT PORTAL
                </div>
              </div>

              {/* Display Heading */}
              <h1 className="text-3xl sm:text-[38px] font-extrabold tracking-[-0.035em] text-slate-950 leading-[1.12] mb-2.5">
                Your Learning Journey, <br className="hidden sm:block" />
                <span className="text-blue-600">
                  All in One Place.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto lg:mx-0">
                Access your courses, fees, results, certificates and academic records from one secure portal.
              </p>
            </div>

            {/* Trust Checklist Points */}
            <div className="bg-white/90 border border-slate-200/90 rounded-2xl p-4.5 sm:p-5 shadow-2xs max-w-md mx-auto lg:mx-0">
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-3 text-left">
                Student Portal Features
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-2.5 text-left">
                {[
                  "Course Info & Modules",
                  "Fee Ledgers & Receipts",
                  "Exam Results & Marks",
                  "Verifiable Certificates",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-800 leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Premium White Login Card */}
          <div className="lg:col-span-6 max-w-md mx-auto w-full">
            <div className="relative group">
              {/* Subtle Ambient Card Glow */}
              <div className="absolute -inset-1 bg-blue-600/10 rounded-[2rem] blur-xl opacity-75 transition-all duration-500 pointer-events-none" />

              {/* Main White Card Surface */}
              <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-950/5 p-6 sm:p-8 overflow-hidden">
                {/* RCI Blue Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />

                {/* Card Header */}
                <div className="border-b border-slate-100 pb-4 mb-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10.5px] font-extrabold uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    SECURE STUDENT LOGIN
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                    Welcome back
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    Sign in to access your RCI student dashboard.
                  </p>
                </div>

                {/* Inline Error Alert */}
                {error && (
                  <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold mb-5">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} noValidate className="space-y-4.5">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4.5 h-4.5" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        aria-required="true"
                        required
                        className="w-full h-12 pl-11 pr-4 border border-slate-200/90 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium bg-slate-50/40 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="password" className="block text-xs sm:text-sm font-extrabold text-slate-800">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <a
                        href={forgotPasswordWhatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Contact RCI support on WhatsApp to reset your password"
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Forgot Password? Get Help
                      </a>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4.5 h-4.5" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        aria-required="true"
                        required
                        className="w-full h-12 pl-11 pr-11 border border-slate-200/90 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium bg-slate-50/40 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      >
                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Primary CTA Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-sm sm:text-base transition-all shadow-md shadow-blue-500/20 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Student Portal</span>
                        <ArrowRight className="w-4.5 h-4.5" />
                      </>
                    )}
                  </button>

                  {/* Security Trust Signal */}
                  <div className="pt-2 text-center text-[11.5px] font-semibold text-slate-500 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Your academic information is securely protected.</span>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Copyright */}
      <footer className="max-w-5xl mx-auto w-full text-center py-3 relative z-10 border-t border-slate-200/60">
        <p className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} {RCIConfig.instituteName}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
