"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createAdminBrowserClient } from "@/lib/supabase/client-admin";
import {
  LayoutDashboard,
  Users,
  FileText,
  Award,
  MoreHorizontal,
  BookOpen,
  TrendingUp,
  FilePlus,
  ShieldCheck,
  Settings,
  MessageSquare,
  History,
  Globe,
} from "lucide-react";
import MobileMoreSheet, { MoreSheetGroup } from "@/components/mobile/MobileMoreSheet";

interface AdminMobileBottomNavProps {
  userEmail?: string;
}

export default function AdminMobileBottomNav({ userEmail }: AdminMobileBottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createAdminBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  // Check active states for primary tabs
  const isDashboardActive = pathname === "/admin";
  const isStudentsActive = pathname.startsWith("/admin/students");
  const isAdmissionsActive = pathname.startsWith("/admin/admissions");
  const isCertificatesActive =
    pathname === "/admin/certificates" || pathname === "/admin/certificates/new";

  // Items included in the More Sheet
  const moreGroups: MoreSheetGroup[] = [
    {
      groupTitle: "Website & Content",
      items: [
        {
          label: "Website CMS",
          href: "/admin/cms",
          icon: Globe,
          active: pathname.startsWith("/admin/cms"),
        },
      ],
    },
    {
      groupTitle: "Academic Management",
      items: [
        {
          label: "Courses",
          href: "/admin/courses",
          icon: BookOpen,
          active: pathname.startsWith("/admin/courses"),
        },
        {
          label: "Certificates Overview",
          href: "/admin/certificates/dashboard",
          icon: TrendingUp,
          active: pathname === "/admin/certificates/dashboard",
        },
        {
          label: "Generate Certificate",
          href: "/admin/certificates/generate",
          icon: FilePlus,
          active: pathname === "/admin/certificates/generate",
        },
        {
          label: "QR Verification",
          href: "/admin/certificates/verification",
          icon: ShieldCheck,
          active: pathname === "/admin/certificates/verification",
        },
        {
          label: "Settings & System",
          href: "/admin/certificates/settings",
          icon: Settings,
          active: pathname === "/admin/certificates/settings",
        },
      ],
    },
    {
      groupTitle: "Logs & Communication",
      items: [
        {
          label: "Communication",
          href: "/admin/communication",
          icon: MessageSquare,
          active: pathname.startsWith("/admin/communication"),
        },
        {
          label: "Notification Logs",
          href: "/admin/notifications",
          icon: History,
          active: pathname.startsWith("/admin/notifications"),
        },
      ],
    },
  ];

  // More button is active if any item inside More sheet is active
  const isMoreActive = moreGroups.some((group) =>
    group.items.some((item) => item.active)
  );

  const primaryItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      active: isDashboardActive,
    },
    {
      label: "Students",
      href: "/admin/students",
      icon: Users,
      active: isStudentsActive,
    },
    {
      label: "Admissions",
      href: "/admin/admissions",
      icon: FileText,
      active: isAdmissionsActive,
    },
    {
      label: "Certificates",
      href: "/admin/certificates",
      icon: Award,
      active: isCertificatesActive,
    },
  ];

  return (
    <>
      {/* Fixed Bottom Navigation Bar (< 768px) */}
      <nav
        aria-label="Admin Mobile Navigation"
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

          {/* 5th Item: More Button */}
          <button
            type="button"
            onClick={() => setMoreSheetOpen(true)}
            aria-label="Open more menu items"
            aria-expanded={moreSheetOpen}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl transition-all ${
              isMoreActive
                ? "text-[#155EEF] font-extrabold"
                : "text-slate-500 hover:text-slate-900 font-semibold"
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-transform ${
                isMoreActive
                  ? "bg-blue-50 text-[#155EEF] scale-105"
                  : "bg-transparent text-slate-500"
              }`}
            >
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10.5px] tracking-tight truncate w-full text-center leading-none">
              More
            </span>
          </button>
        </div>
      </nav>

      {/* Admin Overflow More Sheet */}
      <MobileMoreSheet
        isOpen={moreSheetOpen}
        onClose={() => setMoreSheetOpen(false)}
        title="Admin Controls"
        subtitle="RCI Administration System"
        groups={moreGroups}
        onLogout={handleLogout}
        userEmail={userEmail}
      />
    </>
  );
}
