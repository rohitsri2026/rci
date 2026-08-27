"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  GraduationCap,
  MoreHorizontal,
  Award,
  BookMarked,
  Bell,
  User,
  KeyRound,
} from "lucide-react";
import MobileMoreSheet, { MoreSheetGroup } from "@/components/mobile/MobileMoreSheet";
import { useStudentNotifications } from "@/context/StudentNotificationContext";

interface StudentMobileBottomNavProps {
  studentEmail?: string;
}

export default function StudentMobileBottomNav({ studentEmail }: StudentMobileBottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const { unreadCount } = useStudentNotifications();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/student/login");
    router.refresh();
  };

  const isHomeActive = pathname === "/student/dashboard" || pathname === "/student";
  const isCoursesActive = pathname.startsWith("/student/courses");
  const isFeesActive = pathname.startsWith("/student/fees");
  const isExamsActive = pathname.startsWith("/student/exams");

  const moreGroups: MoreSheetGroup[] = [
    {
      groupTitle: "Academics & Documents",
      items: [
        {
          label: "Certificates",
          href: "/student/certificates",
          icon: Award,
          active: pathname.startsWith("/student/certificates"),
        },
        {
          label: "Study Materials",
          href: "/student/materials",
          icon: BookMarked,
          active: pathname.startsWith("/student/materials"),
        },
      ],
    },
    {
      groupTitle: "Account & Updates",
      items: [
        {
          label: "Notifications",
          href: "/student/notifications",
          icon: Bell,
          badge: unreadCount > 0 ? (unreadCount > 99 ? "99+" : unreadCount) : undefined,
          active: pathname.startsWith("/student/notifications"),
        },
        {
          label: "My Profile",
          href: "/student/profile",
          icon: User,
          active: pathname.startsWith("/student/profile"),
        },
        {
          label: "Change Password",
          href: "/student/change-password",
          icon: KeyRound,
          active: pathname.startsWith("/student/change-password"),
        },
      ],
    },
  ];

  const isMoreActive = moreGroups.some((group) =>
    group.items.some((item) => item.active)
  );

  const primaryItems = [
    {
      label: "Home",
      href: "/student/dashboard",
      icon: LayoutDashboard,
      active: isHomeActive,
    },
    {
      label: "My Course",
      href: "/student/courses",
      icon: BookOpen,
      active: isCoursesActive,
    },
    {
      label: "Fees",
      href: "/student/fees",
      icon: CreditCard,
      active: isFeesActive,
    },
    {
      label: "Exams",
      href: "/student/exams",
      icon: GraduationCap,
      active: isExamsActive,
    },
  ];

  return (
    <>
      {/* Fixed Bottom Navigation Bar (< 768px) */}
      <nav
        aria-label="Student Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-2xl pb-[env(safe-area-inset-bottom)]"
      >
        <div className="h-[72px] grid grid-cols-5 items-center px-1 max-w-md mx-auto">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={`min-h-[44px] flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl transition-all ${
                  item.active
                    ? "text-[#155EEF] font-extrabold"
                    : "text-slate-500 hover:text-slate-900 font-semibold"
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-transform ${
                    item.active
                      ? "bg-blue-50 text-[#155EEF] scale-105"
                      : "bg-transparent text-slate-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10.5px] tracking-tight truncate w-full text-center leading-none">
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* 5th Item: More Button with Notification Badge */}
          <button
            type="button"
            onClick={() => setMoreSheetOpen(true)}
            aria-label={
              unreadCount > 0
                ? `Open more menu items, ${unreadCount} unread notifications`
                : "Open more menu items"
            }
            aria-expanded={moreSheetOpen}
            className={`relative min-h-[44px] flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl transition-all ${
              isMoreActive
                ? "text-[#155EEF] font-extrabold"
                : "text-slate-500 hover:text-slate-900 font-semibold"
            }`}
          >
            <div
              className={`relative p-1.5 rounded-xl transition-transform ${
                isMoreActive
                  ? "bg-blue-50 text-[#155EEF] scale-105"
                  : "bg-transparent text-slate-500"
              }`}
            >
              <MoreHorizontal className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white font-extrabold text-[9.5px] flex items-center justify-center border-2 border-white animate-pulse">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10.5px] tracking-tight truncate w-full text-center leading-none">
              More
            </span>
          </button>
        </div>
      </nav>

      {/* Student Overflow More Sheet */}
      <MobileMoreSheet
        isOpen={moreSheetOpen}
        onClose={() => setMoreSheetOpen(false)}
        title="Student Menu"
        subtitle="Rohit Computer Institute"
        groups={moreGroups}
        onLogout={handleLogout}
        userEmail={studentEmail}
      />
    </>
  );
}
