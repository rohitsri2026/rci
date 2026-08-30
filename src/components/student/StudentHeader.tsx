"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createStudentBrowserClient } from "@/lib/supabase/client-student";
import { RCIConfig } from "@/lib/config";
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  Award,
  Bell,
  User,
  KeyRound,
  LogOut,
  ChevronDown,
  GraduationCap,
  FlaskConical,
  BookMarked
} from "lucide-react";

import StudentAvatar from "@/components/student/StudentAvatar";

interface StudentHeaderProps {
  studentName: string;
  studentEmail: string;
  studentId?: string;
  photoUrl?: string | null;
  unreadCount?: number;
}

const navLinks = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Course", href: "/student/courses", icon: BookOpen },
  { label: "Fees", href: "/student/fees", icon: CreditCard },
  { label: "Exams", href: "/student/exams", icon: FlaskConical },
  { label: "Certificates", href: "/student/certificates", icon: Award },
  { label: "Study Materials", href: "/student/materials", icon: BookMarked },
];

import { useStudentNotifications } from "@/context/StudentNotificationContext";

export default function StudentHeader({
  studentName,
  studentEmail,
  studentId,
  photoUrl,
  unreadCount: initialUnreadCount = 0,
}: StudentHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount: realtimeUnreadCount } = useStudentNotifications();
  const displayUnreadCount = realtimeUnreadCount ?? initialUnreadCount;
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  // Close profile dropdown on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createStudentBrowserClient();
    await supabase.auth.signOut();
    router.push("/student/login");
    router.refresh();
  };

  const getInitials = (name: string) => {
    if (!name) return "ST";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#07152F] text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: RCI Logo & Student Portal Branding */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/student/dashboard" className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-1 group">
            <div className="bg-white rounded-xl p-1.5 shrink-0 shadow-xs flex items-center justify-center border border-slate-700/50">
              <Image
                src="/logo.png"
                alt="Rohit Computer Institute Logo"
                width={36}
                height={36}
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-base font-extrabold text-white tracking-tight leading-tight truncate font-display group-hover:text-blue-400 transition-colors">
                Rohit Computer Institute
              </span>
              <span className="text-[10px] sm:text-[11px] font-extrabold text-blue-400 uppercase tracking-wider leading-none mt-0.5">
                Student Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links (>= 768px) */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-1">
          {navLinks.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/student/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  isActive
                    ? "bg-[#155EEF] text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Notifications & User Profile Menu */}
        <div className="flex items-center gap-3">
          {/* Notifications Icon Link */}
          <Link
            href="/student/notifications"
            className="relative min-w-[44px] min-h-[44px] rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={displayUnreadCount > 0 ? `Notifications, ${displayUnreadCount} unread` : "Notifications"}
          >
            <Bell className="w-4.5 h-4.5" />
            {displayUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-rose-600 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-[#07152F] animate-pulse">
                {displayUnreadCount > 99 ? "99+" : displayUnreadCount}
              </span>
            )}
          </Link>

          {/* User Avatar Dropdown */}
          <div className="relative flex items-center" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="min-h-[44px] flex items-center gap-2.5 p-1.5 pl-2 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <StudentAvatar photoUrl={photoUrl} studentName={studentName} size="sm" />
              <div className="hidden sm:block min-w-0 pr-1">
                <span className="block text-xs font-extrabold text-white truncate max-w-[120px] leading-tight">
                  {studentName}
                </span>
                <span className="block text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                  {studentId || "Student"}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="font-extrabold text-xs text-slate-950 truncate">{studentName}</p>
                  <p className="text-[11px] font-medium text-slate-500 truncate">{studentEmail}</p>
                </div>

                <Link
                  href="/student/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <span>My Profile</span>
                </Link>

                <Link
                  href="/student/change-password"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-purple-600" />
                  <span>Change Password</span>
                </Link>

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
