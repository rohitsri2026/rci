"use client";

import React, { useState, useEffect } from "react";
import StudentNotificationCard, {
  NotificationItem,
} from "./StudentNotificationCard";
import NotificationFilters, { FilterTab } from "./NotificationFilters";
import { Check, CheckCircle2, Bell, AlertCircle, RefreshCw } from "lucide-react";

interface StudentNotificationsListProps {
  initialNotifications?: NotificationItem[];
  initialUnreadCount?: number;
}

export default function StudentNotificationsList({
  initialNotifications = [],
  initialUnreadCount = 0,
}: StudentNotificationsListProps) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState<number>(initialUnreadCount);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [loading, setLoading] = useState<boolean>(initialNotifications.length === 0);
  const [markingAll, setMarkingAll] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchNotifications = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/student/notifications");
      const data = await res.json();
      if (res.ok && data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount ?? 0);
      } else {
        setErrorMessage(data.error || "Failed to load notifications.");
      }
    } catch (err: any) {
      console.error("Fetch notifications error:", err);
      setErrorMessage("Unable to load notifications. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialNotifications.length === 0) {
      fetchNotifications();
    }
  }, []);

  // Optimistic Mark Single as Read
  const handleMarkAsRead = async (id: string) => {
    const originalNotifications = [...notifications];
    const originalUnread = unreadCount;

    // Optimistic state update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      const res = await fetch("/api/student/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });

      if (!res.ok) {
        const data = await res.json();
        // Revert on error
        setNotifications(originalNotifications);
        setUnreadCount(originalUnread);
        setErrorMessage(data.error || "Failed to update notification status.");
      }
    } catch (err) {
      console.error("Mark read error:", err);
      setNotifications(originalNotifications);
      setUnreadCount(originalUnread);
      setErrorMessage("Network error marking notification as read.");
    }
  };

  // Optimistic Mark All as Read
  const handleMarkAllRead = async () => {
    if (unreadCount === 0 || markingAll) return;

    const originalNotifications = [...notifications];
    const originalUnread = unreadCount;

    setMarkingAll(true);
    setErrorMessage("");

    // Optimistic state update
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
      const res = await fetch("/api/student/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });

      if (!res.ok) {
        const data = await res.json();
        setNotifications(originalNotifications);
        setUnreadCount(originalUnread);
        setErrorMessage(data.error || "Failed to mark all notifications as read.");
      }
    } catch (err) {
      console.error("Mark all read error:", err);
      setNotifications(originalNotifications);
      setUnreadCount(originalUnread);
      setErrorMessage("Network error marking all as read.");
    } finally {
      setMarkingAll(false);
    }
  };

  // Filter Logic
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.is_read;

    const rawType = (n.metadata?.category || n.type || "NOTICE").toUpperCase();
    if (activeTab === "STUDY_MATERIAL") return rawType.includes("MATERIAL") || rawType.includes("STUDY");
    if (activeTab === "TEST") return rawType.includes("TEST") || rawType.includes("EXAM");
    if (activeTab === "FEE_REMINDER") return rawType.includes("FEE") || rawType.includes("PAYMENT");
    if (activeTab === "CERTIFICATE") return rawType.includes("CERT");
    if (activeTab === "IMPORTANT") return rawType.includes("IMPORTANT") || rawType.includes("URGENT");
    if (activeTab === "NOTICE") return rawType.includes("NOTICE") || rawType === "INAPP" || rawType === "GENERAL";

    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display tracking-tight">
            Notifications Center
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
            Stay updated with important announcements, fees, exams, and study modules from Rohit Computer Institute.
          </p>
        </div>

        {unreadCount > 0 ? (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#155EEF] hover:bg-blue-700 text-white font-extrabold text-xs inline-flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] shrink-0 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{markingAll ? "Marking All..." : "Mark all as read"}</span>
          </button>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All Caught Up</span>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="flex items-center justify-between gap-3 bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-semibold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={fetchNotifications}
            className="text-xs font-extrabold underline hover:text-rose-950 shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <NotificationFilters
        currentTab={activeTab}
        onTabChange={setActiveTab}
        unreadCount={unreadCount}
      />

      {/* Notification Cards List */}
      <div className="space-y-3.5">
        {loading ? (
          // Skeleton Loading State
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200" />
                  <div className="w-32 h-4 bg-slate-200 rounded-md" />
                </div>
                <div className="w-16 h-3 bg-slate-200 rounded-md" />
              </div>
              <div className="w-3/4 h-4 bg-slate-200 rounded-md" />
              <div className="w-1/2 h-3 bg-slate-100 rounded-md" />
            </div>
          ))
        ) : filteredNotifications.length === 0 ? (
          // Polished Empty States
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-8 sm:p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#155EEF] border border-blue-100 flex items-center justify-center mx-auto shadow-2xs">
              <Bell className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-950 font-display">
                {activeTab === "unread"
                  ? "✓ You're all caught up"
                  : activeTab === "all"
                  ? "No notifications yet"
                  : "No notifications in this category"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed mt-1">
                {activeTab === "unread"
                  ? "You have read all your notifications. New updates will appear here when published."
                  : activeTab === "all"
                  ? "Important updates from Rohit Computer Institute will appear here."
                  : "There are currently no notification records in this category."}
              </p>
            </div>

            {activeTab !== "all" && (
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab("all")}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-colors min-h-[40px]"
                >
                  Show All Notifications
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <StudentNotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
}
