"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, RefreshCw, X } from "lucide-react";

export type ToastType = "success" | "error" | "saving";

export interface ToastState {
  id: string;
  type: ToastType;
  message: string;
  categoryTitle?: string;
  autoClose?: boolean;
}

interface CMSToastProps {
  toast: ToastState | null;
  onDismiss: () => void;
}

export function CMSToast({ toast, onDismiss }: CMSToastProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && toast) {
        onDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";
  const isSaving = toast.type === "saving";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live="polite"
      className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 z-[9999] max-w-md w-[calc(100%-32px)] sm:w-[400px] pointer-events-auto transition-all duration-300 animate-in slide-in-from-top-4 fade-in-50"
    >
      <div
        className={`relative overflow-hidden rounded-2xl p-4 shadow-2xl border backdrop-blur-xl transition-all ${
          isSuccess
            ? "bg-white/95 border-emerald-300 text-slate-900 shadow-emerald-500/10"
            : isError
            ? "bg-white/95 border-red-300 text-slate-900 shadow-red-500/10"
            : "bg-white/95 border-blue-300 text-slate-900 shadow-blue-500/10"
        }`}
      >
        {/* Accent Bar at top */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${
            isSuccess ? "bg-emerald-500" : isError ? "bg-red-500" : "bg-blue-600 animate-pulse"
          }`}
        />

        <div className="flex items-start gap-3.5">
          {/* Status Icon */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              isSuccess
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : isError
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-blue-50 text-blue-600 border border-blue-200"
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5" />}
            {isError && <AlertCircle className="w-5 h-5" />}
            {isSaving && <RefreshCw className="w-5 h-5 animate-spin" />}
          </div>

          {/* Toast Message Content */}
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2 mb-0.5">
              <p
                className={`text-xs font-black uppercase tracking-wider ${
                  isSuccess ? "text-emerald-700" : isError ? "text-red-700" : "text-blue-700"
                }`}
              >
                {isSuccess
                  ? toast.categoryTitle ? `${toast.categoryTitle} Saved` : "Save Successful"
                  : isError
                  ? "Save Failed"
                  : "Saving Changes..."}
              </p>
            </div>
            <p className="text-xs font-bold text-slate-800 leading-snug break-words">
              {toast.message}
            </p>
            {isSuccess && (
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                All public website pages have been updated.
              </p>
            )}
          </div>

          {/* Dismiss Button (Min 44x44px touch target) */}
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Close notification"
            className="w-11 h-11 min-w-[44px] min-h-[44px] -mr-2 -mt-2 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
