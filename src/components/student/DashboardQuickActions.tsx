"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, CreditCard, Award, GraduationCap, ChevronRight } from "lucide-react";

export default function DashboardQuickActions() {
  const actions = [
    {
      title: "My Course",
      subtitle: "View course progress",
      icon: BookOpen,
      href: "/student/courses",
      color: "bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white",
    },
    {
      title: "Fee Details",
      subtitle: "View payments & balance",
      icon: CreditCard,
      href: "/student/fees",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white",
    },
    {
      title: "Exam Results",
      subtitle: "View marks & performance",
      icon: Award,
      href: "/student/exams",
      color: "bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-600 group-hover:text-white",
    },
    {
      title: "Certificates",
      subtitle: "View issued certificates",
      icon: GraduationCap,
      href: "/student/certificates",
      color: "bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-600 group-hover:text-white",
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-display">
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className="group min-h-[72px] bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex items-center justify-between hover:border-blue-500/50 hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${action.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-extrabold text-slate-950 truncate font-display group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {action.subtitle}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
