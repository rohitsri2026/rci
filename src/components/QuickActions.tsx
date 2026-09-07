"use client";

import Link from "next/link";
import { BookOpen, GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      id: "explore-courses",
      title: "Explore Courses",
      description: "Browse certified computer & IT programs",
      href: "/courses",
      icon: BookOpen,
      iconBg: "bg-[#155EEF] text-white",
      hoverBorder: "hover:border-blue-400",
      arrowColor: "text-blue-600",
    },
    {
      id: "student-login",
      title: "Student Login",
      description: "Access portal, attendance & exam updates",
      href: "/student/login",
      icon: GraduationCap,
      iconBg: "bg-[#07152F] text-white",
      hoverBorder: "hover:border-slate-400",
      arrowColor: "text-[#07152F]",
    },
    {
      id: "verify-certificate",
      title: "Verify Certificate",
      description: "Authenticate official ISO & MSME credentials",
      href: "/verify",
      icon: ShieldCheck,
      iconBg: "bg-emerald-600 text-white",
      hoverBorder: "hover:border-emerald-400",
      arrowColor: "text-emerald-600",
    },
  ];

  return (
    <section 
      aria-label="Institute Quick Actions"
      className="relative z-20 pt-[112px] sm:pt-[118px] pb-2.5 sm:pb-3.5 bg-slate-50/90 border-b border-slate-200/70"
    >
      <div className="container mx-auto px-3.5 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
          {actions.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group ${item.hoverBorder} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[52px] sm:min-h-[64px]`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-200 group-hover:scale-105 ${item.iconBg}`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 pr-1">
                    <h3 className="text-xs sm:text-base font-extrabold text-[#07152F] tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[10.5px] sm:text-xs text-slate-500 leading-snug truncate mt-0.5 hidden xs:block">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-center shrink-0 transition-colors group-hover:bg-white ${item.arrowColor}`}
                >
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
