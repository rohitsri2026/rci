"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Megaphone, ArrowRight, X, AlertTriangle, Star, Bell } from "lucide-react";
import { AnnouncementItem } from "@/types/cms";

interface PopupNoticeProps {
  notice: AnnouncementItem;
  onDismiss?: (id: string) => void;
}

export default function PopupNotice({ notice, onDismiss }: PopupNoticeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Check if user has already seen/dismissed this popup notice in current browser session
    try {
      const sessionKey = `rci_popup_seen_${notice.id}`;
      const seen = sessionStorage.getItem(sessionKey);
      if (!seen) {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }
  }, [notice.id]);

  useEffect(() => {
    if (!isOpen) return;

    // Focus close button
    if (closeBtnRef.current) {
      closeBtnRef.current.focus();
    }

    // Lock body scroll
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Escape listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(`rci_popup_seen_${notice.id}`, "true");
    } catch {}
    if (onDismiss) onDismiss(notice.id);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-notice-title"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative animate-in zoom-in-95 duration-200">
        {/* Header Badges & Close */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {notice.priority === "urgent" ? (
              <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white text-[10.5px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                URGENT POPUP
              </span>
            ) : notice.priority === "important" ? (
              <span className="px-2.5 py-0.5 rounded-md bg-[#D4A72C] text-slate-950 text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-slate-950" />
                IMPORTANT POPUP
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1">
                <Bell className="w-3.5 h-3.5" />
                POPUP NOTICE
              </span>
            )}
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close popup notice"
            title="Close popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h2 id="popup-notice-title" className="text-xl sm:text-2xl font-black text-slate-900 font-display leading-tight">
            {notice.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {notice.message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="min-h-[44px] px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black transition-all cursor-pointer"
          >
            Dismiss
          </button>

          {notice.button_url && notice.button_text && (
            <Link
              href={notice.button_url}
              onClick={handleClose}
              className={`min-h-[44px] px-6 py-2.5 rounded-xl text-xs font-black transition-all inline-flex items-center gap-1.5 shadow-md ${
                notice.priority === "urgent"
                  ? "bg-red-600 hover:bg-red-500 text-white"
                  : notice.priority === "important"
                  ? "bg-[#D4A72C] hover:bg-amber-300 text-slate-950"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              <span>{notice.button_text}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
