"use client";

import React, { useState } from "react";
import AdminNotificationCenter from "@/components/admin/notifications/AdminNotificationCenter";
import { Bell, MessageSquare } from "lucide-react";

// Existing WhatsApp & SMS logs logic
import NotificationHistoryPage from "@/components/admin/notifications/NotificationHistoryView";

export default function AdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState<"inapp" | "logs">("inapp");

  return (
    <div className="space-y-6">
      {/* Top Main Navigation Tabs */}
      <div className="bg-[#07152F] text-white px-6 sm:px-8 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold font-display">Notification Control Center</h2>
          <p className="text-xs text-slate-400 font-medium">Manage student portal alerts and audit manual WhatsApp/SMS communications.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => setActiveTab("inapp")}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-extrabold transition-all inline-flex items-center gap-2 ${
              activeTab === "inapp"
                ? "bg-[#155EEF] text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-700/60"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Student In-App Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-extrabold transition-all inline-flex items-center gap-2 ${
              activeTab === "logs"
                ? "bg-[#155EEF] text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-700/60"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp & SMS Audit Logs</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "inapp" ? (
        <AdminNotificationCenter />
      ) : (
        <NotificationHistoryPage />
      )}
    </div>
  );
}
