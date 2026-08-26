"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, Lock, Phone, AlertCircle, Eye, EyeOff, 
  ArrowRight, ShieldCheck, ArrowLeft, Loader2, BookOpen,
  FileText, Award, HelpCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RCIConfig } from "@/lib/config";

export default function StudentLoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    const cleanInput = loginId.trim();
    if (!cleanInput || !password) {
      setError("Please enter your registered Phone Number / Login ID and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId: cleanInput, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid login credentials. Please verify your phone number and password.");
        setLoading(false);
      } else {
        router.push(data.redirect || "/student/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected connection error occurred. Please try again.");
      setLoading(false);
    }
  };

  const forgotPasswordWhatsappUrl = RCIConfig.getWhatsAppUrl(
    "Hello RCI, I am a registered student and need assistance logging into my Student Portal or resetting my password."
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-[10%] left-[15%] w-[450px] h-[450px] bg-blue-500/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-3 border-b border-slate-200/80 relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Back to RCI Website</span>
        </Link>

        <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
          <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
          Student Portal
        </span>
      </header>

      {/* Main Authentication Section */}
      <main className="max-w-5xl mx-auto w-full my-auto py-6 sm:py-10 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: RCI Student Portal Introduction */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            <div>
              <div className="flex flex-col items-center lg:items-start gap-3 mb-4">
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

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-extrabold uppercase tracking-wider shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  OFFICIAL RCI STUDENT PORTAL
                </div>
              </div>

              <h1 className="text-3xl sm:text-[38px] font-extrabold tracking-[-0.035em] text-[#07152F] leading-[1.14] mb-3 font-display">
                Your Learning Journey, <br className="hidden sm:block" />
                <span className="text-[#155EEF]">All in One Secure Place.</span>
              </h1>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto lg:mx-0 font-medium">
                Track your course progress, fee ledgers, exam results, downloadable receipts, and verifiable certificates.
              </p>
            </div>

            {/* Portal Credentials Guide Banner */}
            <div className="bg-gradient-to-br from-blue-900 to-[#07152F] text-white rounded-2xl p-5 shadow-lg max-w-md mx-auto lg:mx-0 space-y-2 text-left">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>First Time Student Login?</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                Your initial <strong>Login ID</strong> and <strong>Password</strong> is your 10-digit registered phone number. You will be prompted to create a new password on your first login.
              </p>
            </div>

            {/* Student Features Quick Grid */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0 text-left">
              {[
                { title: "Course Progress", icon: BookOpen },
                { title: "Fee Ledgers", icon: FileText },
                { title: "Exam Results", icon: Award },
                { title: "QR Certificates", icon: ShieldCheck },
              ].map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div key={idx} className="flex items-center gap-2.5 bg-white border border-slate-200/80 p-3 rounded-xl shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xs font-extrabold text-slate-800">{feat.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Login Form Card */}
          <div className="lg:col-span-6 max-w-md mx-auto w-full">
            <div className="relative">
              <div className="absolute -inset-1 bg-blue-600/10 rounded-[2rem] blur-xl opacity-75 pointer-events-none" />

              <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#155EEF]" />

                <div className="border-b border-slate-100 pb-4 mb-5">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07152F] tracking-tight font-display">
                    Student Login
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    Enter your registered phone number to sign in.
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold mb-5 leading-snug">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} noValidate className="space-y-4">
                  {/* Phone / Login ID Field */}
                  <div>
                    <label htmlFor="loginId" className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
                      Registered Phone Number / Login ID <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4.5 h-4.5" />
                      </div>
                      <input
                        id="loginId"
                        type="text"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        placeholder="e.g. 9876543210"
                        required
                        className="w-full h-12 pl-11 pr-4 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-semibold bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <label htmlFor="password" className="block text-xs sm:text-sm font-extrabold text-slate-800">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <a
                        href={forgotPasswordWhatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-extrabold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Forgot Password?
                      </a>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4.5 h-4.5" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password (initial = phone number)"
                        required
                        className="w-full h-12 pl-11 pr-11 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-semibold bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 min-h-[44px] inline-flex items-center justify-center gap-2 bg-[#155EEF] hover:bg-blue-700 text-white rounded-xl font-extrabold text-sm sm:text-base transition-all shadow-md shadow-blue-500/20 active:scale-98 disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
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

                  <div className="pt-2 text-center text-[11.5px] font-semibold text-slate-500 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Official RCI Student Authentication System</span>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="max-w-5xl mx-auto w-full text-center py-3 relative z-10 border-t border-slate-200/60 text-xs text-slate-500">
        &copy; {new Date().getFullYear()} {RCIConfig.instituteName}. All rights reserved.
      </footer>
    </div>
  );
}
