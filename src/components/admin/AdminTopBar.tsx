"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { RCIConfig } from "@/lib/config";

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/students": "Student Management",
  "/admin/students/new": "Add Student",
  "/admin/certificates": "Certificate History",
  "/admin/certificates/dashboard": "Certificates Overview",
  "/admin/certificates/generate": "Generate Certificate",
  "/admin/certificates/verification": "QR Verification",
  "/admin/certificates/settings": "Certificate Settings",
  "/admin/admissions": "Admissions Management",
  "/admin/courses": "Course Programs",
  "/admin/courses/new": "Add Course",
  "/admin/fees": "Fee Management",
};

interface AdminTopBarProps {
  userEmail?: string;
  onMenuToggle?: () => void;
}

export default function AdminTopBar({ userEmail, onMenuToggle }: AdminTopBarProps) {
  const pathname = usePathname();
  const title = breadcrumbMap[pathname] ?? "Admin Control Center";

  return (
    <header className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3.5 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left Side: Page Title Hierarchy */}
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ADMIN PANEL</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight leading-tight font-display">
                {title}
              </h1>
            </div>
          </div>

        {/* Right Side: Quick Action Utilities & Admin Profile Pill */}
        <div className="flex items-center gap-2.5">
          {/* Notifications Button */}
          <button 
            type="button"
            className="relative w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
            title="System notifications"
            aria-label="View notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>

          {/* Admin Avatar & Email */}
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/90 rounded-xl p-1 pr-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-2xs">
              A
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-extrabold text-slate-900 leading-none">RCI Admin</p>
              <p className="text-[10.5px] text-slate-500 font-medium truncate max-w-[130px] mt-0.5" title={userEmail}>
                {userEmail || "admin@rciknp.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
