"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  Smartphone,
  Search,
  RefreshCw,
  CheckCircle2,
  Eye,
  User
} from "lucide-react";
import { NotificationLogRecord } from "@/lib/notifications/types";
import { NOTIFICATION_TEMPLATES } from "@/lib/notifications/templates";
import NotificationTrigger from "@/components/admin/notifications/NotificationTrigger";

export default function NotificationHistoryView() {
  const [logs, setLogs] = useState<NotificationLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [markingId, setMarkingId] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (channelFilter !== "all") params.set("channel", channelFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/notifications?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error("Failed to fetch notification logs:", err);
    } finally {
      setLoading(false);
    }
  }, [channelFilter, statusFilter, typeFilter, search]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleMarkAsSent = async (logId: string) => {
    setMarkingId(logId);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId, status: "sent" }),
      });
      if (res.ok) {
        setLogs((prev) =>
          prev.map((l) => (l.id === logId ? { ...l, status: "sent" } : l))
        );
      }
    } catch (err) {
      console.error("Failed to mark notification as sent:", err);
    } finally {
      setMarkingId(null);
    }
  };

  const totalCount = logs.length;
  const whatsappCount = logs.filter((l) => (l.channel || "").toLowerCase() === "whatsapp").length;
  const smsCount = logs.filter((l) => (l.channel || "").toLowerCase() === "sms").length;
  const sentCount = logs.filter((l) => (l.status || "").toLowerCase() === "sent").length;

  return (
    <div className="p-6 sm:p-8 space-y-7 max-w-7xl mx-auto selection:bg-blue-500 selection:text-white">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-600 flex items-center justify-center font-extrabold shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                WhatsApp & SMS Notification Logs
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
                Audit manual WhatsApp & SMS student communication logs across RCI workflows.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationTrigger
            studentName="Select Student"
            studentPhone=""
            variant="single"
            size="md"
            onSuccess={fetchLogs}
          />
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="h-10 px-3.5 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition-colors shadow-2xs disabled:opacity-50 min-h-[44px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-1 shadow-2xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Logged</p>
          <p className="text-2xl font-extrabold text-slate-900 font-display">{totalCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200/90 p-4 space-y-1 shadow-2xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">WhatsApp Messages</p>
          <p className="text-2xl font-extrabold text-emerald-800 font-display">{whatsappCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-blue-200/90 p-4 space-y-1 shadow-2xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">SMS Messages</p>
          <p className="text-2xl font-extrabold text-blue-800 font-display">{smsCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-indigo-200/90 p-4 space-y-1 shadow-2xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">Marked as Sent</p>
          <p className="text-2xl font-extrabold text-indigo-800 font-display">{sentCount}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student, phone..."
              className="w-full h-10 pl-9 pr-3 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-900 bg-slate-50/40 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="w-full h-10 px-3 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-800 bg-white"
            >
              <option value="all">All Channels (WhatsApp & SMS)</option>
              <option value="whatsapp">WhatsApp Only</option>
              <option value="sms">SMS Only</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full h-10 px-3 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-800 bg-white"
            >
              <option value="all">All Notification Types</option>
              {Object.values(NOTIFICATION_TEMPLATES).map((t) => (
                <option key={t.type} value={t.type}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 px-3 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-800 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="opened">Opened / Previewed</option>
              <option value="sent">Confirmed Sent</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-bold animate-pulse">
            Loading notification logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-extrabold text-slate-700 font-display">No Notification Logs Found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No manual WhatsApp or SMS messages have been logged yet matching your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Student & Number</th>
                  <th className="py-3.5 px-4">Channel & Type</th>
                  <th className="py-3.5 px-4">Message Content</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Admin / Time</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => {
                  const isWhatsApp = (log.channel || "").toLowerCase() === "whatsapp";
                  const isSent = (log.status || "").toLowerCase() === "sent";

                  return (
                    <tr key={log.id || Math.random()} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 font-extrabold text-slate-700">
                            <User className="w-4 h-4 text-slate-500" />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900">{log.student_name || "Student"}</p>
                            <p className="font-mono text-[11px] text-slate-500 font-semibold">{log.phone_number}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-extrabold border ${
                            isWhatsApp
                              ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                              : "text-blue-700 bg-blue-50 border-blue-200"
                          }`}
                        >
                          {isWhatsApp ? <MessageSquare className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                          <span>{isWhatsApp ? "WhatsApp" : "SMS"}</span>
                        </span>
                        <p className="text-[11px] font-bold text-slate-700 capitalize">
                          {(log.notification_type || "general").replace("_", " ")}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-slate-700 font-medium line-clamp-2 leading-relaxed" title={log.message}>
                          {log.message}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-extrabold border ${
                            isSent
                              ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                              : "text-amber-700 bg-amber-50 border-amber-200"
                          }`}
                        >
                          {isSent ? <CheckCircle2 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span className="capitalize">{isSent ? "Confirmed Sent" : log.status || "Opened"}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="text-slate-800 font-bold">{log.sent_by || "Admin"}</p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {log.created_at ? new Date(log.created_at).toLocaleString("en-IN") : "Just now"}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {!isSent ? (
                          <button
                            onClick={() => log.id && handleMarkAsSent(log.id)}
                            disabled={markingId === log.id}
                            className="px-2.5 py-1 text-[11px] font-extrabold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors disabled:opacity-50 min-h-[36px]"
                          >
                            {markingId === log.id ? "Marking..." : "Mark as Sent"}
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-bold">Done</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
