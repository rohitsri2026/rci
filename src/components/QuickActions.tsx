"use client";

import Link from "next/link";
import { BookOpen, GraduationCap, ShieldCheck, ChevronRight } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      id: "explore-courses",
      title: "Explore Courses",
      subtitle: "Certified IT programs",
      href: "/courses",
      icon: BookOpen,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50/80 group-hover:bg-blue-600 group-hover:text-white",
    },
    {
      id: "student-login",
      title: "Student Login",
      subtitle: "Portal, notes & exams",
      href: "/student/login",
      icon: GraduationCap,
      iconColor: "text-[#07152F]",
      bgColor: "bg-slate-100 group-hover:bg-[#07152F] group-hover:text-white",
    },
    {
      id: "verify-certificate",
      title: "Verify Certificate",
      subtitle: "Instant QR check",
      href: "/verify",
      icon: ShieldCheck,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white",
    },
  ];

  return (
    <section 
      aria-label="Quick Actions"
      className="relative z-20 py-2 sm:py-3 bg-slate-100/70 border-b border-slate-200/80"
    >
      <div className="container mx-auto px-3.5 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-3">
          {actions.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center justify-between px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all duration-150 group min-h-[44px]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${item.bgColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-extrabold text-[#07152F] tracking-tight group-hover:text-blue-600 transition-colors block leading-tight truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-500 hidden xs:block sm:hidden md:block leading-none mt-0.5 truncate">
                      {item.subtitle}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
