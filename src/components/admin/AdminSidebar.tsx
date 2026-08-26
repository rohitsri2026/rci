"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Award,
  FileText,
  BookOpen,
  LogOut,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Settings,
  ShieldCheck,
  History,
  FilePlus,
  X,
  UserCheck,
  MessageSquare
} from "lucide-react";
import { RCIConfig } from "@/lib/config";

interface AdminSidebarProps {
  userEmail: string;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

const mainNavGroup = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
];

const managementNavGroup = [
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Admissions", href: "/admin/admissions", icon: FileText },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Communication", href: "/admin/communication", icon: MessageSquare },
  { label: "Notification Logs", href: "/admin/notifications", icon: History },
];

const certificateSubItems = [
  { label: "Overview Dashboard", href: "/admin/certificates/dashboard", icon: TrendingUp },
  { label: "Generate Certificate", href: "/admin/certificates/generate", icon: FilePlus },
  { label: "Certificate History", href: "/admin/certificates", icon: History },
  { label: "QR Verification", href: "/admin/certificates/verification", icon: ShieldCheck },
  { label: "Settings & System", href: "/admin/certificates/settings", icon: Settings },
];

export default function AdminSidebar({ userEmail, mobileOpen, setMobileOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const isCertsPage = pathname.startsWith("/admin/certificates") || pathname === "/admin/certificates/new";
  const [certsOpen, setCertsOpen] = useState(isCertsPage);

  useEffect(() => {
    if (isCertsPage) {
      setCertsOpen(true);
    }
  }, [pathname, isCertsPage]);

  // Close mobile drawer on route change
  useEffect(() => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  }, [pathname, setMobileOpen]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const sidebarContent = (
    <aside className="w-64 h-full bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800 selection:bg-blue-500 selection:text-white">
      <div>
        {/* Logo & Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-1">
            <div className="bg-white rounded-xl p-1.5 shrink-0 shadow-sm transition-transform group-hover:scale-105">
              <Image src="/logo.png" alt="RCI" width={32} height={32} className="w-7 h-7 object-contain" />
            </div>
            <div>
              <p className="text-white font-extrabold text-sm tracking-tight leading-none">RCI Admin</p>
              <p className="text-slate-400 text-[11px] font-semibold mt-1">Control Center</p>
            </div>
          </Link>

          {/* Close Button for Mobile Drawer */}
          {setMobileOpen && (
            <button 
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <nav className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-160px)]">
          {/* Group 1: OVERVIEW */}
          <div>
            <p className="px-3 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Overview
            </p>
            <div className="space-y-1">
              {mainNavGroup.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                      {item.label}
                    </span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Group 2: MANAGEMENT */}
          <div>
            <p className="px-3 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Management
            </p>
            <div className="space-y-1">
              {managementNavGroup.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                      {item.label}
                    </span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Group 3: CERTIFICATES (Collapsible) */}
          <div>
            <p className="px-3 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Certificates
            </p>
            <div className="space-y-1">
              <button
                onClick={() => setCertsOpen(!certsOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isCertsPage
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Award className="w-4 h-4 shrink-0 text-blue-400" />
                  <span>Certificates Portal</span>
                </span>
                {certsOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {certsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden pl-3 pr-1 space-y-1 border-l-2 border-slate-800 ml-4.5 my-1"
                  >
                    {certificateSubItems.map((item) => {
                      const isActive = pathname === item.href || (item.href === "/admin/certificates" && pathname === "/admin/certificates/new");
                      const SubIcon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11.5px] font-bold transition-all ${
                            isActive
                              ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                          }`}
                        >
                          <SubIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>
      </div>

      {/* User Identity & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/90">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-2 bg-slate-800/60 rounded-xl border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-extrabold text-xs shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 leading-none">Logged in as</p>
            <p className="text-white text-xs font-bold truncate mt-1" title={userEmail}>
              {userEmail || "admin@rciknp.com"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-950/40 hover:text-red-400 hover:border-red-900/40 border border-transparent transition-all text-xs font-extrabold"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Width) */}
      <div className="hidden md:block w-64 min-h-screen shrink-0 sticky top-0 h-screen overflow-hidden">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-64 max-w-[80vw] h-full z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
