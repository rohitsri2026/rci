"use client";

import React, { useState, useEffect } from "react";

export type StudentAvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface StudentAvatarProps {
  photoUrl?: string | null;
  studentName: string;
  size?: StudentAvatarSize;
  className?: string;
  fallbackInitials?: string;
  alt?: string;
  border?: boolean;
}

const sizeClasses: Record<StudentAvatarSize, { container: string; text: string }> = {
  xs: { container: "w-6 h-6 rounded-lg", text: "text-[10px]" },
  sm: { container: "w-8 h-8 rounded-xl", text: "text-xs" },
  md: { container: "w-10 h-10 rounded-xl", text: "text-sm" },
  lg: { container: "w-12 h-12 rounded-2xl", text: "text-base" },
  xl: { container: "w-16 h-16 rounded-2xl", text: "text-xl" },
  "2xl": { container: "w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl", text: "text-2xl sm:text-3xl" },
};

export default function StudentAvatar({
  photoUrl,
  studentName,
  size = "md",
  className = "",
  fallbackInitials,
  alt,
  border = true,
}: StudentAvatarProps) {
  const [imgError, setImgError] = useState(false);

  // Reset image error state whenever photoUrl changes
  useEffect(() => {
    setImgError(false);
  }, [photoUrl]);

  const getInitials = (name: string) => {
    if (fallbackInitials) return fallbackInitials;
    if (!name) return "ST";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(studentName);
  const sizeConfig = sizeClasses[size] || sizeClasses.md;
  const borderStyle = border ? "border border-slate-200/80 shadow-2xs" : "";

  const hasPhoto = Boolean(photoUrl && photoUrl.trim() !== "" && !imgError);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden ${sizeConfig.container} ${borderStyle} ${className}`}
    >
      {hasPhoto ? (
        <img
          src={photoUrl!}
          alt={alt || `Student photo - ${studentName}`}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-br from-[#155EEF] to-[#07152F] text-white font-extrabold flex items-center justify-center select-none ${sizeConfig.text}`}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
