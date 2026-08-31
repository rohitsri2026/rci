"use client";

import React from "react";
import { AnnouncementItem, AnnouncementSettings } from "@/types/cms";
import TopStripNotice from "./formats/TopStripNotice";
import AlertBoxNotice from "./formats/AlertBoxNotice";
import NoticeCardNotice from "./formats/NoticeCardNotice";
import PopupNotice from "./formats/PopupNotice";
import StickyNotice from "./formats/StickyNotice";
import TickerNotice from "./formats/TickerNotice";

interface NoticeRendererProps {
  notice?: AnnouncementItem;
  notices?: AnnouncementItem[];
  settings?: AnnouncementSettings | null;
  forcedFormat?: string;
  onDismiss?: (id: string) => void;
}

export default function NoticeRenderer({
  notice,
  notices = [],
  settings,
  forcedFormat,
  onDismiss,
}: NoticeRendererProps) {
  // If a single notice is passed
  const activeNotice = notice || (notices.length > 0 ? notices[0] : null);
  const format = forcedFormat || activeNotice?.display_format || "top_strip";

  if (format === "top_strip") {
    return <TopStripNotice notices={notices.length > 0 ? notices : activeNotice ? [activeNotice] : []} settings={settings} onDismiss={onDismiss} />;
  }

  if (format === "alert_box" && activeNotice) {
    return <AlertBoxNotice notice={activeNotice} onDismiss={onDismiss} />;
  }

  if (format === "notice_card" && activeNotice) {
    return <NoticeCardNotice notice={activeNotice} />;
  }

  if (format === "popup" && activeNotice) {
    return <PopupNotice notice={activeNotice} onDismiss={onDismiss} />;
  }

  if (format === "sticky" && activeNotice) {
    return <StickyNotice notice={activeNotice} onDismiss={onDismiss} />;
  }

  if (format === "ticker" && notices.length > 0) {
    return <TickerNotice notices={notices} onDismiss={onDismiss} />;
  }

  // Default fallback
  return <TopStripNotice notices={notices.length > 0 ? notices : activeNotice ? [activeNotice] : []} settings={settings} onDismiss={onDismiss} />;
}
