"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X, ChevronRight } from "lucide-react";

export interface MoreSheetItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  active?: boolean;
}

export interface MoreSheetGroup {
  groupTitle?: string;
  items: MoreSheetItem[];
}

interface MobileMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  groups: MoreSheetGroup[];
  onLogout?: () => void;
  userEmail?: string;
}

export default function MobileMoreSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  groups,
  onLogout,
  userEmail,
}: MobileMoreSheetProps) {
  // Handle escape key and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Sliding Bottom Sheet Container */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-h-[85vh] bg-white/95 backdrop-blur-xl border-t border-slate-200/90 rounded-t-3xl shadow-2xl flex flex-col z-10 overflow-hidden pb-[calc(1rem+env(safe-area-inset-bottom))]"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {/* Sheet Handle Indicator */}
            <div className="pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            {/* Sheet Header */}
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight font-display">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{subtitle}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Close menu"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Sheet Scrollable Content */}
            <div className="p-4 overflow-y-auto space-y-5 flex-1">
              {userEmail && (
                <div className="px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Account</span>
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[200px]" title={userEmail}>
                    {userEmail}
                  </span>
                </div>
              )}

              {groups.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-1">
                  {group.groupTitle && (
                    <p className="px-3 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      {group.groupTitle}
                    </p>
                  )}
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.active;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={`min-h-[48px] px-3.5 py-3 rounded-2xl flex items-center justify-between transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                            isActive
                              ? "bg-blue-50 text-[#155EEF] font-extrabold border border-blue-100 shadow-2xs"
                              : "text-slate-700 hover:bg-slate-100/80 font-bold"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                isActive
                                  ? "bg-[#155EEF] text-white shadow-xs"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              <Icon className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-xs truncate">{item.label}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.badge !== undefined && item.badge !== null && item.badge !== 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] min-w-[20px] text-center shadow-xs">
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight className={`w-4 h-4 ${isActive ? "text-[#155EEF]" : "text-slate-400"}`} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Logout Option */}
              {onLogout && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLogout();
                    }}
                    className="w-full min-h-[48px] px-3.5 py-3 rounded-2xl flex items-center justify-between text-rose-600 hover:bg-rose-50 font-extrabold transition-colors border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <LogOut className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-xs">Sign Out</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-rose-400" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
