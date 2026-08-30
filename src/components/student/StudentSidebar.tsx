"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createStudentBrowserClient } from "@/lib/supabase/client-student";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  BookOpen,
  CalendarCheck,
  FlaskConical,
  BarChart3,
  CreditCard,
  Receipt,
  Award,
  Download,
  Bell,
  Settings,
  LogOut,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/student", icon: LayoutDashboard },
  { label: "My Profile", href: "/student/profile", icon: User },
  { label: "Courses", href: "/student/courses", icon: BookOpen },
  { label: "Attendance", href: "/student/attendance", icon: CalendarCheck },
  { label: "Exams", href: "/student/exams", icon: FlaskConical },
  { label: "Results", href: "/student/results", icon: BarChart3 },
  { label: "Fees", href: "/student/fees", icon: CreditCard },
  { label: "Receipts", href: "/student/receipts", icon: Receipt },
  { label: "Certificates", href: "/student/certificates", icon: Award },
  { label: "Downloads", href: "/student/downloads", icon: Download },
  { label: "Notifications", href: "/student/notifications", icon: Bell },
  { label: "Settings", href: "/student/settings", icon: Settings },
];

export default function StudentSidebar({ studentName, studentEmail }: { studentName: string; studentEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createStudentBrowserClient();
    await supabase.auth.signOut();
    router.push("/student/login");
    router.refresh();
  };

  return (
    <aside className="w-64 shrink-0 bg-gradient-to-b from-indigo-950 to-purple-950 flex flex-col h-screen sticky top-0 border-r border-white/10 shadow-2xl">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-500/30 border border-indigo-400/40 rounded-xl flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-indigo-300" />
          </div>
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm truncate font-display">RCI Portal</p>
            <p className="text-white/40 text-[10px] truncate">Student Dashboard</p>
          </div>
        </div>
      </div>

      {/* Student Info */}
      <div className="mx-3 mt-4 mb-2 bg-white/5 border border-white/10 rounded-2xl p-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/40 border border-indigo-400/40 flex items-center justify-center shrink-0 text-indigo-200 font-bold text-sm">
            {studentName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-white/90 font-semibold text-sm truncate">{studentName}</p>
            <p className="text-white/40 text-[10px] truncate">{studentEmail}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/student" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "bg-indigo-500/30 text-white border border-indigo-400/30 shadow-sm"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-indigo-300" : "text-white/40 group-hover:text-white/60"}`} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-red-500/10 text-sm font-medium transition-all group"
        >
          <LogOut className="w-4 h-4 shrink-0 group-hover:text-red-400 transition-colors" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
