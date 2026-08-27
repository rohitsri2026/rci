"use client";

import React, { useState, useEffect } from "react";
import { useStudentNotifications } from "@/context/StudentNotificationContext";
import { Activity, RefreshCw } from "lucide-react";

export default function RealtimeDebugPanel() {
  const { connectionStatus, refreshNotifications, notifications } = useStudentNotifications();
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Show debug panel if in development environment or if ?debug=1 is in URL
    if (
      process.env.NODE_ENV !== "production" ||
      (typeof window !== "undefined" && window.location.search.includes("debug=1"))
    ) {
      setShowDebug(true);
    }
  }, []);

  if (!showDebug) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBSCRIBED":
        return "bg-emerald-500 text-emerald-100 border-emerald-400";
      case "CONNECTING":
        return "bg-amber-500 text-amber-100 border-amber-400 animate-pulse";
      case "ERROR":
        return "bg-rose-600 text-rose-100 border-rose-400";
      default:
        return "bg-slate-600 text-slate-100 border-slate-400";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#07152F]/95 text-white text-[11px] p-3 rounded-2xl border border-slate-700 shadow-2xl space-y-2 max-w-xs font-mono backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
        <div className="flex items-center gap-1.5 font-extrabold text-blue-400">
          <Activity className="w-3.5 h-3.5" />
          <span>RCI Realtime Debug</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full font-black text-[9px] border ${getStatusColor(connectionStatus)}`}>
          {connectionStatus}
        </span>
      </div>

      <div className="space-y-1 text-slate-300">
        <p className="flex justify-between">
          <span className="text-slate-400">Total Loaded:</span>
          <span className="font-bold text-white">{notifications.length}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-slate-400">Latest ID:</span>
          <span className="font-bold text-white truncate max-w-[120px]">
            {notifications[0]?.id?.slice(0, 8) || "None"}
          </span>
        </p>
      </div>

      <div className="pt-1 border-t border-slate-800 flex justify-end">
        <button
          onClick={refreshNotifications}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-sans font-extrabold text-[10px] transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Sync DB</span>
        </button>
      </div>
    </div>
  );
}
