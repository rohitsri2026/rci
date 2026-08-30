"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminBrowserClient } from "@/lib/supabase/client-admin";
import { 
  Lock, Mail, AlertCircle, Eye, EyeOff, 
  ArrowRight, ShieldCheck, ArrowLeft, Loader2,
  Users, BookOpen, Award, Building2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RCIConfig } from "@/lib/config";

export default function AdminLoginPage() {
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
      const supabase = createAdminBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ 
        email: cleanEmail, 
        password 
      });

      if (authError) {
        setError(authError.message || "Invalid administrator credentials. Access denied.");
        setLoading(false);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An unexpected connection error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Sophisticated Layered Background Ambient Glow Orbs */}
      <div className="absolute -top-28 -left-28 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] bg-[#155EEF]/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute top-10 -right-28 w-[450px] sm:w-[550px] h-[450px] sm:h-[550px] bg-[#07152F]/8 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-24 right-[10%] w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-[#D4A72C]/7 rounded-full blur-[110px] sm:blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#155EEF]/4 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Glass Header Row */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-3.5 px-1 sm:px-2 relative z-10 border-b border-slate-200/60">
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#155EEF] px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white/60 backdrop-blur-md shadow-2xs hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#155EEF]/40"
        >
          <ArrowLeft className="w-4 h-4 text-[#155EEF] transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Back to RCI Website</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] bg-blue-50/80 border border-blue-200/60 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#155EEF]" />
          <span>Official Admin Portal</span>
        </div>
      </header>

      {/* Main Authentication Grid Container */}
      <main className="max-w-6xl mx-auto w-full my-auto py-6 sm:py-10 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: RCI Admin Portal Institutional Introduction */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div>
              {/* Official RCI Logo Badge & Eyebrow */}
              <div className="flex flex-col items-center lg:items-start gap-3 mb-4">
                <Link 
                  href="/" 
                  className="inline-block bg-white/90 backdrop-blur-md border border-white/80 rounded-2xl p-3 sm:p-3.5 shadow-md shadow-slate-900/5 hover:shadow-lg hover:border-blue-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
                >
                  <Image
                    src="/logo.png"
                    alt={`${RCIConfig.instituteName} Logo`}
                    width={180}
                    height={65}
                    className="h-14 sm:h-16 w-auto object-contain mx-auto lg:mx-0"
                    priority
                  />
                </Link>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50/80 border border-blue-200/60 text-[#155EEF] text-[11px] font-extrabold uppercase tracking-wider shadow-2xs backdrop-blur-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#155EEF]" />
                  <span>RCI ADMIN PORTAL</span>
                </div>
              </div>

              {/* Responsive Display Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight text-[#07152F] leading-[1.15] mb-3">
                Manage RCI, <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-[#155EEF] via-blue-600 to-[#2563EB] bg-clip-text text-transparent">
                  All in One Place.
                </span>
              </h1>

              {/* Decorative Accent Bar */}
              <div className="h-1 w-16 bg-gradient-to-r from-[#155EEF] to-[#2563EB] rounded-full mx-auto lg:mx-0 mb-4" />

              {/* Supporting Text */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0 font-medium">
                Secure access to manage students, courses, certificates, admissions and institute operations.
              </p>
            </div>

            {/* Admin Portal Controls Glass Container */}
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-4 sm:p-5 shadow-lg shadow-slate-900/5 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center justify-between mb-3 text-left">
                <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Administrative Controls
                </h2>
                <span className="h-2 w-2 rounded-full bg-[#155EEF] animate-pulse" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-left">
                {[
                  { title: "Student Management", icon: Users, desc: "Records & Enrollment" },
                  { title: "Course & Admissions", icon: BookOpen, desc: "Programs & Intake" },
                  { title: "Certificate Verification", icon: Award, desc: "Instant Validation" },
                  { title: "Institute Operations", icon: Building2, desc: "System Administration" },
                ].map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div 
                      key={idx} 
                      className="group min-h-[44px] flex items-center gap-3 bg-white/80 border border-slate-200/70 backdrop-blur-md p-3 rounded-xl transition-all duration-200 hover:-translate-y-[2px] hover:border-[#155EEF]/40 hover:bg-white hover:shadow-md hover:shadow-blue-500/5 cursor-pointer"
                    >
                      <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg bg-blue-50/80 border border-blue-100/80 text-[#155EEF] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#155EEF] group-hover:text-white transition-all duration-200">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-slate-950 transition-colors leading-tight truncate">
                          {feature.title}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 truncate">
                          {feature.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Premium Glass Login Focal Card */}
          <div className="lg:col-span-6 max-w-md mx-auto w-full">
            <div className="relative group">
              {/* Soft Ambient Outer Card Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#155EEF]/20 via-blue-600/10 to-[#07152F]/10 rounded-[32px] blur-2xl opacity-75 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

              {/* Main Translucent Glass Surface */}
              <div className="relative bg-white/80 backdrop-blur-xl rounded-[28px] border border-white/80 shadow-[0_20px_60px_rgba(7,21,47,0.10)] p-6 sm:p-8 overflow-hidden">
                {/* Royal Blue Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#155EEF] via-blue-500 to-[#155EEF]" />

                {/* Card Header */}
                <div className="border-b border-slate-200/60 pb-4 sm:pb-5 mb-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/80 border border-blue-200/60 text-[#155EEF] text-[10.5px] font-extrabold uppercase tracking-wider mb-2.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#155EEF]" />
                    SECURE ADMIN LOGIN
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07152F] tracking-tight">
                    Welcome back
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                    Sign in to access the RCI administration portal.
                  </p>
                </div>

                {/* Inline Error Alert */}
                {error && (
                  <div className="flex items-center gap-3 bg-red-50/90 border border-red-200/90 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold mb-5 shadow-xs animate-in fade-in duration-200">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Authentication Form */}
                <form onSubmit={handleLogin} noValidate className="space-y-4 sm:space-y-4.5">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="admin_email" className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4.5 h-4.5" />
                      </div>
                      <input
                        id="admin_email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@rciknp.com"
                        aria-required="true"
                        required
                        className="w-full h-12 pl-11 pr-4 border border-slate-200/90 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium bg-white/60 backdrop-blur-md focus:bg-white focus:border-[#155EEF] focus:ring-4 focus:ring-[#155EEF]/15 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="admin_password" className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
                      Password <span className="text-red-500">*</span>
                    </label>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4.5 h-4.5" />
                      </div>
                      <input
                        id="admin_password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your admin password"
                        aria-required="true"
                        required
                        className="w-full h-12 pl-11 pr-11 border border-slate-200/90 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium bg-white/60 backdrop-blur-md focus:bg-white focus:border-[#155EEF] focus:ring-4 focus:ring-[#155EEF]/15 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#155EEF]/30"
                      >
                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Primary CTA Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 sm:h-12.5 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#155EEF] to-[#2563EB] hover:from-[#1151ce] hover:to-[#1d4ed8] text-white rounded-xl font-extrabold text-sm sm:text-base transition-all duration-200 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 focus:outline-none focus:ring-4 focus:ring-[#155EEF]/30"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Admin Portal</span>
                        <ArrowRight className="w-4.5 h-4.5" />
                      </>
                    )}
                  </button>

                  {/* Security Trust Footer */}
                  <div className="pt-3 border-t border-slate-200/60 mt-4 text-center">
                    <div className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 mb-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00A86B] shrink-0" />
                      <span>Authorized RCI personnel only</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Administrative access is securely protected.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Copyright */}
      <footer className="max-w-6xl mx-auto w-full text-center py-3.5 relative z-10 border-t border-slate-200/60">
        <p className="text-xs text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} {RCIConfig.instituteName}. Authorized personnel only.
        </p>
      </footer>
    </div>
  );
}

