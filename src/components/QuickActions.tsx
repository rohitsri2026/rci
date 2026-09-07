"use client";

import Link from "next/link";
import { BookOpen, GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      id: "explore-courses",
      title: "Explore Courses",
      description: "Browse certified computer applications, Tally & IT programs",
      href: "/courses",
      icon: BookOpen,
      iconBg: "bg-blue-600 text-white",
      hoverBorder: "hover:border-blue-400",
      arrowColor: "text-blue-600",
    },
    {
      id: "student-login",
      title: "Student Login",
      description: "Access your portal, attendance, notes & examination updates",
      href: "/student/login",
      icon: GraduationCap,
      iconBg: "bg-[#07152F] text-white",
      hoverBorder: "hover:border-slate-400",
      arrowColor: "text-[#07152F]",
    },
    {
      id: "verify-certificate",
      title: "Verify Certificate",
      description: "Authenticate official ISO & MSME recognized credentials instantly",
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
      className="relative z-20 pt-[114px] sm:pt-[120px] pb-3 sm:pb-4 bg-slate-50/80 border-b border-slate-200/70"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {actions.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group ${item.hoverBorder} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-200 group-hover:scale-105 ${item.iconBg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 pr-1">
                    <h3 className="text-sm sm:text-base font-extrabold text-[#07152F] tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-snug truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-center shrink-0 transition-colors group-hover:bg-white ${item.arrowColor}`}
                >
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
