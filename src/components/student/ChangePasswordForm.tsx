"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  Lock, Eye, EyeOff, Check, X, ShieldCheck, AlertCircle, Loader2, KeyRound 
} from "lucide-react";

interface ChangePasswordFormProps {
  isFirstLogin?: boolean;
}

export default function ChangePasswordForm({ isFirstLogin = false }: ChangePasswordFormProps) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validation rules
  const hasMinLength = newPassword.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const isValid = hasMinLength && hasLetter && hasNumber && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");

    if (!isValid) {
      setError("Please ensure your new password meets all security requirements.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      // 1. Re-authenticate current password if provided
      if (currentPassword) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
          const { error: signInErr } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: currentPassword,
          });
          if (signInErr) {
            setError("Current password is incorrect.");
            setLoading(false);
            return;
          }
        }
      }

      // 2. Update password in Supabase Auth & set user metadata password_changed = true
      const { error: updateErr } = await supabase.auth.updateUser({
        password: newPassword,
        data: {
          password_changed: true,
        },
      });

      if (updateErr) {
        setError(updateErr.message || "Failed to update password. Please try again.");
        setLoading(false);
      } else {
        setSuccess("Password updated successfully! Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/student/dashboard");
          router.refresh();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#155EEF]" />

        {/* Header */}
        <div className="border-b border-slate-100 pb-5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-3 shadow-2xs">
            <KeyRound className="w-6 h-6 text-blue-600" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#07152F] tracking-tight font-display">
            {isFirstLogin ? "Secure Your Account" : "Change Password"}
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed font-medium">
            {isFirstLogin
              ? "Your current password is your registered phone number. Please create a new password to keep your account secure."
              : "Update your password to ensure your RCI Student Portal account remains protected."}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold mb-6">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold mb-6 animate-in fade-in">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
              Current Password <span className="text-slate-400 font-normal">(Initial = Phone Number)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full h-12 pl-11 pr-11 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-semibold bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showCurrent ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
              New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full h-12 pl-11 pr-11 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-semibold bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showNew ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
              Confirm New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full h-12 pl-11 pr-11 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-semibold bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showConfirm ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Password Requirements Checklist */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 text-xs">
            <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[10.5px] block mb-1">
              Password Requirements
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2 font-semibold">
                {hasMinLength ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className={hasMinLength ? "text-emerald-700 font-bold" : "text-slate-500"}>
                  At least 8 characters
                </span>
              </div>

              <div className="flex items-center gap-2 font-semibold">
                {hasLetter ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className={hasLetter ? "text-emerald-700 font-bold" : "text-slate-500"}>
                  Contains a letter
                </span>
              </div>

              <div className="flex items-center gap-2 font-semibold">
                {hasNumber ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className={hasNumber ? "text-emerald-700 font-bold" : "text-slate-500"}>
                  Contains a number
                </span>
              </div>

              <div className="flex items-center gap-2 font-semibold">
                {passwordsMatch ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className={passwordsMatch ? "text-emerald-700 font-bold" : "text-slate-500"}>
                  Passwords match
                </span>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-end gap-3">
            {!isFirstLogin && (
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-extrabold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={loading || !isValid}
              className="flex-1 sm:flex-initial min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#155EEF] hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
