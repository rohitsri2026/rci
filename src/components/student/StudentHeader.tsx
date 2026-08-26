"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
  Menu,
  X,
  ChevronDown,
  GraduationCap,
  FlaskConical,
  BookMarked
} from "lucide-react";

interface StudentHeaderProps {
  studentName: string;
  studentEmail: string;
  studentId?: string;
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

export default function StudentHeader({
  studentName,
  studentEmail,
  studentId,
  unreadCount = 0,
}: StudentHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
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
        setMobileDrawerOpen(false);
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
    const supabase = createClient();
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

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
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
            aria-label="View Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-[#07152F] animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          {/* Desktop User Avatar Dropdown */}
          <div className="relative hidden sm:block" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="min-h-[44px] flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-lg bg-[#155EEF] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {getInitials(studentName)}
              </div>
              <div className="hidden xl:block min-w-0 pr-1">
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

          {/* Mobile Drawer Hamburger Trigger (Min touch target 44px x 44px) */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="lg:hidden min-w-[44px] min-h-[44px] rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle Mobile Menu"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs animate-in fade-in"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Container */}
          <div className="relative w-4/5 max-w-xs bg-[#07152F] text-white h-full shadow-2xl flex flex-col justify-between p-5 z-10 border-r border-slate-800 animate-in slide-in-from-left duration-250">
            <div className="space-y-6">
              {/* Drawer Top Branding */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <Link href="/student/dashboard" onClick={() => setMobileDrawerOpen(false)} className="flex items-center gap-2.5">
                  <div className="bg-white rounded-xl p-1.5 shrink-0 border border-slate-700/50">
                    <Image
                      src="/logo.png"
                      alt="Rohit Computer Institute Logo"
                      width={32}
                      height={32}
                      className="w-7 h-7 object-contain"
                      priority
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-extrabold text-white tracking-tight leading-tight truncate">
                      Rohit Computer Institute
                    </span>
                    <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider leading-none mt-0.5">
                      Student Portal
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="min-w-[44px] min-h-[44px] rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center"
                  aria-label="Close Mobile Drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Student Profile Brief */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#155EEF] text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                  {getInitials(studentName)}
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-xs text-white truncate">{studentName}</p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">{studentEmail}</p>
                </div>
              </div>

              {/* Mobile Links */}
              <nav className="space-y-1">
                {navLinks.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/student/dashboard" && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`min-h-[44px] flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-extrabold transition-colors ${
                        isActive
                          ? "bg-[#155EEF] text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Footer Profile Actions */}
            <div className="border-t border-slate-800 pt-4 space-y-1">
              <Link
                href="/student/profile"
                onClick={() => setMobileDrawerOpen(false)}
                className="min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 rounded-xl"
              >
                <User className="w-4.5 h-4.5 text-blue-400" />
                <span>My Profile</span>
              </Link>

              <Link
                href="/student/change-password"
                onClick={() => setMobileDrawerOpen(false)}
                className="min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 rounded-xl"
              >
                <KeyRound className="w-4.5 h-4.5 text-purple-400" />
                <span>Change Password</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="min-h-[44px] w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-950/40 rounded-xl text-left"
              >
                <LogOut className="w-4.5 h-4.5 text-rose-400" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
