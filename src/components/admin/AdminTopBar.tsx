"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/students": "Students",
  "/admin/students/new": "Add Student",
  "/admin/certificates": "Certificates",
  "/admin/certificates/new": "Issue Certificate",
  "/admin/admissions": "Admissions",
  "/admin/courses": "Courses",
  "/admin/courses/new": "Add Course",
};

export default function AdminTopBar() {
  const pathname = usePathname();
  const title = breadcrumbMap[pathname] ?? "Admin";

  return (
    <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Admin Panel</p>
        <h1 className="text-2xl font-bold text-slate-900 font-display">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-sm transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          A
        </div>
      </div>
    </div>
  );
}
