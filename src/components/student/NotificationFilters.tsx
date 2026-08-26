"use client";

import React from "react";

export type FilterTab =
  | "all"
  | "unread"
  | "NOTICE"
  | "STUDY_MATERIAL"
  | "TEST"
  | "FEE_REMINDER"
  | "CERTIFICATE"
  | "IMPORTANT";

interface NotificationFiltersProps {
  currentTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  unreadCount: number;
}

export default function NotificationFilters({
  currentTab,
  onTabChange,
  unreadCount,
}: NotificationFiltersProps) {
  const tabs: Array<{ id: FilterTab; label: string }> = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "NOTICE", label: "Notices" },
    { id: "STUDY_MATERIAL", label: "Study Material" },
    { id: "TEST", label: "Tests" },
    { id: "FEE_REMINDER", label: "Fees" },
    { id: "CERTIFICATE", label: "Certificates" },
    { id: "IMPORTANT", label: "Important" },
  ];

  return (
    <div className="overflow-x-auto pb-1 scrollbar-none">
      <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 w-max sm:w-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isActive
                  ? "bg-[#155EEF] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <span>{tab.label}</span>

              {tab.id === "unread" && unreadCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? "bg-white text-blue-700" : "bg-rose-600 text-white"
                  }`}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
