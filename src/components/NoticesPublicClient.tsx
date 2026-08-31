"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Megaphone, Search, ArrowRight, Calendar, Star, Bell, GraduationCap,
  FileText, DollarSign, Award, BookOpen, Sparkles, Filter, ChevronRight
} from "lucide-react";
import { AnnouncementItem, AnnouncementType, AnnouncementPriority } from "@/types/cms";

interface NoticesPublicClientProps {
  initialNotices: AnnouncementItem[];
}

function formatISTDate(isoStr?: string | null): string {
  if (!isoStr) return "";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(isoStr));
  } catch {
    return isoStr;
  }
}

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType }> = {
  notice: { label: "General Notice", icon: Bell },
  admission: { label: "Admission", icon: GraduationCap },
  exam: { label: "Exam Notice", icon: FileText },
  fee: { label: "Fee Alert", icon: DollarSign },
  course: { label: "Course Notice", icon: BookOpen },
  certificate: { label: "Certificate", icon: Award },
  update: { label: "System Update", icon: Sparkles },
  urgent: { label: "Urgent Alert", icon: Megaphone },
};

export default function NoticesPublicClient({ initialNotices }: NoticesPublicClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [visibleCount, setVisibleCount] = useState(9);

  const filteredNotices = initialNotices.filter((item) => {
    if (selectedType !== "ALL" && item.announcement_type !== selectedType) return false;
    if (selectedPriority !== "ALL" && item.priority !== selectedPriority) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q) ||
        (item.button_text && item.button_text.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const visibleNotices = filteredNotices.slice(0, visibleCount);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#07152F] via-[#155EEF] to-[#07152F] rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-black uppercase tracking-wider backdrop-blur-md">
          <Megaphone className="w-3.5 h-3.5 text-amber-400" />
          <span>Official RCI Notice Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
          Notices & Official Updates
        </h1>
        <p className="text-sm sm:text-base text-blue-100/90 font-medium max-w-2xl leading-relaxed">
          Access all public announcements, examination dates, batch admissions, fee circulars, and institutional notifications from Rohit Computer Institute.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by notice title or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Priority Select */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="min-h-[44px] px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="urgent">🔴 Urgent Alerts</option>
              <option value="important">⭐ Important Notices</option>
              <option value="normal">🔹 Normal Notices</option>
            </select>
          </div>
        </div>

        {/* Type Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100">
          {[
            { id: "ALL", label: "All Categories" },
            { id: "admission", label: "🎓 Admission" },
            { id: "exam", label: "📝 Exam" },
            { id: "fee", label: "💰 Fee Alert" },
            { id: "course", label: "📚 Course" },
            { id: "certificate", label: "🏆 Certificate" },
            { id: "notice", label: "📢 General" },
            { id: "update", label: "🔔 Update" },
            { id: "urgent", label: "🔴 Urgent Alert" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedType(tab.id)}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                selectedType === tab.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      {filteredNotices.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <Megaphone className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-black text-slate-900">No Notices Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No active public notices match your search or category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleNotices.map((item) => {
            const typeConf = TYPE_CONFIG[item.announcement_type] || TYPE_CONFIG.notice;
            const TypeIcon = typeConf.icon;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-6 border shadow-2xs space-y-4 flex flex-col justify-between transition-all hover:shadow-md ${
                  item.priority === "urgent"
                    ? "border-red-200"
                    : item.priority === "important"
                    ? "border-amber-200"
                    : "border-slate-200"
                }`}
              >
                <div className="space-y-3">
                  {/* Badges & Date */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {item.priority === "urgent" ? (
                        <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                          URGENT
                        </span>
                      ) : item.priority === "important" ? (
                        <span className="px-2.5 py-0.5 rounded-md bg-[#D4A72C] text-slate-950 text-[10px] font-black uppercase tracking-wider">
                          IMPORTANT
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase tracking-wider">
                          NOTICE
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center gap-1">
                        <TypeIcon className="w-3 h-3" />
                        <span>{typeConf.label}</span>
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h2 className="text-sm font-black text-slate-900 leading-snug font-display">
                      {item.title}
                    </h2>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>

                {/* Date & CTA Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {formatISTDate(item.start_at)}
                  </span>

                  {item.button_url && item.button_text && (
                    <Link
                      href={item.button_url}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all inline-flex items-center gap-1 shadow-2xs ${
                        item.priority === "urgent"
                          ? "bg-red-600 hover:bg-red-500 text-white"
                          : item.priority === "important"
                          ? "bg-[#D4A72C] hover:bg-amber-300 text-slate-950"
                          : "bg-[#155EEF] hover:bg-blue-500 text-white"
                      }`}
                    >
                      <span>{item.button_text}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Load More Button */}
      {filteredNotices.length > visibleCount && (
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 9)}
            className="min-h-[44px] px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer"
          >
            Load More Notices ({filteredNotices.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
