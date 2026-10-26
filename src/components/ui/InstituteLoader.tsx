"use client";

import React from "react";

interface InstituteLoaderProps {
  size?: "sm" | "md" | "lg" | "fullscreen";
  title?: string;
  subtitle?: string;
  showBadge?: boolean;
  className?: string;
}

export default function InstituteLoader({
  size = "md",
  title = "Rohit Computer Institute",
  subtitle = "Preparing digital excellence...",
  showBadge = true,
  className = "",
}: InstituteLoaderProps) {
  // Size-specific adjustments
  const isSm = size === "sm";
  const isLg = size === "lg" || size === "fullscreen";
  const isFullscreen = size === "fullscreen";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`${title} is loading`}
      className={`flex flex-col items-center justify-center select-none ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-[#07152F]/90 backdrop-blur-md p-6 text-white"
          : isLg
          ? "min-h-[60vh] p-8 text-center"
          : isSm
          ? "py-4 text-center"
          : "min-h-[45vh] p-6 text-center"
      } ${className}`}
    >
      {/* Central Spinner Sphere with Dual Rotating Orbital Rings */}
      <div className="relative flex items-center justify-center mb-5">
        {/* Ambient Glow */}
        <div
          className={`absolute rounded-full bg-blue-600/20 blur-xl pointer-events-none ${
            isSm ? "w-16 h-16" : isLg ? "w-36 h-36" : "w-28 h-28"
          }`}
        />

        {/* Outer Ring: Conic Gradient Border with Clockwise Spin */}
        <div
          className={`rounded-full p-[2.5px] bg-gradient-to-tr from-[#155EEF] via-indigo-500 to-[#D4A72C] animate-institute-spin ${
            isSm ? "w-12 h-12" : isLg ? "w-24 h-24" : "w-18 h-18"
          }`}
        >
          <div className="w-full h-full bg-slate-900 rounded-full" />
        </div>

        {/* Inner Counter-Rotating Ring with Accents */}
        <div
          className={`absolute rounded-full border-2 border-dashed border-sky-400/60 animate-institute-spin-reverse ${
            isSm ? "w-9 h-9" : isLg ? "w-18 h-18" : "w-14 h-14"
          }`}
        />

        {/* Center Core: Academic Crest with Glow */}
        <div
          className={`absolute flex items-center justify-center rounded-full bg-gradient-to-br from-[#155EEF] to-[#0A2558] text-white shadow-lg shadow-blue-500/30 animate-pulse-glow ${
            isSm ? "w-7 h-7" : isLg ? "w-12 h-12" : "w-10 h-10"
          }`}
        >
          <i
            className={`fa-solid fa-graduation-cap ${
              isSm ? "text-[11px]" : isLg ? "text-xl" : "text-base"
            } text-amber-300`}
          />
        </div>
      </div>

      {/* Typography with Google Fonts */}
      {!isSm && (
        <div className="max-w-xs sm:max-w-sm flex flex-col items-center">
          <h3 className="text-base sm:text-lg font-black font-display tracking-tight text-[#07152F] dark:text-white leading-snug">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 mt-1 font-medium flex items-center justify-center gap-1.5">
            <span>{subtitle}</span>
            <span className="inline-flex gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
          </p>

          {/* Micro Shimmer Progress Bar */}
          <div className="w-36 sm:w-44 h-1.5 bg-slate-200 dark:bg-slate-700/60 rounded-full mt-3.5 overflow-hidden relative">
            <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-[#155EEF] to-transparent rounded-full animate-shimmer-slide" />
          </div>

          {/* Trust Badge */}
          {showBadge && (
            <div className="inline-flex items-center gap-1.5 mt-4 px-2.5 py-1 rounded-full bg-blue-50/90 dark:bg-white/10 border border-blue-100 dark:border-white/15 text-[10.5px] font-bold text-blue-700 dark:text-blue-200">
              <i className="bi bi-patch-check-fill text-[#D4A72C] text-xs" />
              <span>ISO 9001:2015 Verified Portal</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
