"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Star, Bell } from "lucide-react";
import { AnnouncementItem } from "@/types/cms";

interface NoticeCardNoticeProps {
  notice: AnnouncementItem;
}

function formatISTDate(isoStr?: string | null): string {
  if (!isoStr) return "";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(isoStr));
  } catch {
    return isoStr;
  }
}

export default function NoticeCardNotice({ notice }: NoticeCardNoticeProps) {
  return (
    <div
      className={`bg-white rounded-3xl p-6 border shadow-2xs space-y-4 flex flex-col justify-between transition-all hover:shadow-md ${
        notice.priority === "urgent"
          ? "border-red-200"
          : notice.priority === "important"
          ? "border-amber-200"
          : "border-slate-200"
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          {notice.priority === "urgent" ? (
            <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
              URGENT
            </span>
          ) : notice.priority === "important" ? (
            <span className="px-2.5 py-0.5 rounded-md bg-[#D4A72C] text-slate-950 text-[10px] font-black uppercase tracking-wider">
              IMPORTANT
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black uppercase tracking-wider">
              NOTICE
            </span>
          )}

          <span className="text-[11px] font-bold text-slate-400 font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            {formatISTDate(notice.start_at)}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-black text-slate-900 leading-snug font-display line-clamp-2">
            {notice.title}
          </h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">
            {notice.message}
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        {notice.button_url && notice.button_text ? (
          <Link
            href={notice.button_url}
            className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-700 hover:underline"
          >
            <span>{notice.button_text}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <span className="text-xs font-semibold text-slate-400">Official Notice</span>
        )}
      </div>
    </div>
  );
}
