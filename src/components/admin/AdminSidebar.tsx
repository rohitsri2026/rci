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
  Layers,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Admissions", href: "/admin/admissions", icon: FileText },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
];

const certificateSubItems = [
  { label: "Dashboard", href: "/admin/certificates/dashboard", icon: TrendingUp },
  { label: "Generate", href: "/admin/certificates/generate", icon: FilePlus },
  { label: "History", href: "/admin/certificates", icon: History },
  { label: "Verification", href: "/admin/certificates/verification", icon: ShieldCheck },
  { label: "Settings", href: "/admin/certificates/settings", icon: Settings },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Open certificates submenu automatically if the active route is a certificates page
  const isCertsPage = pathname.startsWith("/admin/certificates") || pathname === "/admin/certificates/new";
  const [certsOpen, setCertsOpen] = useState(isCertsPage);

  useEffect(() => {
    if (isCertsPage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCertsOpen(true);
    }
  }, [pathname, isCertsPage]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="bg-white rounded-xl p-1.5 shrink-0">
            <Image src="/logo.png" alt="RCI" width={32} height={32} className="w-8 h-8 object-contain" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">RCI Admin</p>
            <p className="text-slate-500 text-xs mt-0.5">Control Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <item.icon className="w-5 h-5 shrink-0" />
                {item.label}
              </span>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}

        {/* Collapsible Certificates Section */}
        <div className="space-y-1">
          <button
            onClick={() => setCertsOpen(!certsOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
              isCertsPage
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <Award className="w-5 h-5 shrink-0 text-blue-500 group-hover:scale-110 transition-transform" />
              <span>Certificates</span>
            </span>
            {certsOpen ? (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <AnimatePresence initial={false}>
            {certsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pl-4 pr-1 space-y-1"
              >
                {certificateSubItems.map((item) => {
                  const isActive = pathname === item.href || (item.href === "/admin/certificates" && pathname === "/admin/certificates/new");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-blue-600/15 text-blue-400"
                          : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
                      }`}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-slate-800">
        <div className="px-4 py-2 mb-2">
          <p className="text-xs text-slate-500">Logged in as</p>
          <p className="text-white text-sm font-medium truncate">{userEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all text-sm font-medium"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
