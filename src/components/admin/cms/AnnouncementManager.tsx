"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone, Plus, Trash2, Edit3, CheckCircle, AlertTriangle, Eye,
  Sparkles, Calendar, Clock, Link as LinkIcon, Star, Bell, GraduationCap,
  FileText, DollarSign, Award, BookOpen, RefreshCw, X, ShieldAlert, Copy,
  Check, ToggleLeft, ToggleRight
} from "lucide-react";
import { AnnouncementItem, AnnouncementType, AnnouncementPriority } from "@/types/cms";
import {
  saveAnnouncementItemAction,
  deleteAnnouncementItemAction,
} from "@/app/admin/(dashboard)/cms/cms-actions";
import { useCMSFeedback } from "./CMSFeedbackProvider";

interface AnnouncementManagerProps {
  initialData?: AnnouncementItem[];
  onRefresh?: () => void;
}

// Convert ISO string to HTML datetime-local input string in IST (Asia/Kolkata)
function isoToDatetimeLocal(isoStr?: string | null): string {
  if (!isoStr) return "";
  try {
    const date = new Date(isoStr);
    // Offset for IST (+5:30)
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const localDate = new Date(date.getTime() + istOffsetMs);
    return localDate.toISOString().slice(0, 16);
  } catch {
    return "";
  }
}

// Convert HTML datetime-local string (assumed IST) to UTC ISO string
function datetimeLocalToIso(localStr?: string | null): string | null {
  if (!localStr) return null;
  try {
    const [datePart, timePart] = localStr.split("T");
    if (!datePart || !timePart) return null;
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);
    
    // Create Date object in UTC subtracting 5:30 IST offset
    const utcTimeMs = Date.UTC(year, month - 1, day, hours, minutes) - (5.5 * 60 * 60 * 1000);
    return new Date(utcTimeMs).toISOString();
  } catch {
    return null;
  }
}

// Format ISO date string into Indian locale format (DD MMM YYYY, hh:mm AM/PM)
function formatISTDisplay(isoStr?: string | null): string {
  if (!isoStr) return "No Expiry";
  try {
    const date = new Date(isoStr);
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return isoStr;
  }
}

// Compute notice status
function getNoticeStatus(item: AnnouncementItem): "LIVE" | "SCHEDULED" | "DRAFT" | "EXPIRED" {
  if (!item.is_enabled) return "DRAFT";
  const now = new Date();
  if (item.start_at && new Date(item.start_at) > now) return "SCHEDULED";
  if (item.end_at && new Date(item.end_at) < now) return "EXPIRED";
  return "LIVE";
}

const TYPE_CONFIG: Record<AnnouncementType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  notice: { label: "General Notice", icon: Bell, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  important: { label: "Important", icon: Star, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  admission: { label: "Admission", icon: GraduationCap, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  exam: { label: "Exam Notice", icon: FileText, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  fee: { label: "Fee Alert", icon: DollarSign, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  event: { label: "Event", icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200" },
  update: { label: "System Update", icon: Sparkles, color: "text-cyan-600", bg: "bg-cyan-50 border-cyan-200" },
  certificate: { label: "Certificate", icon: Award, color: "text-teal-600", bg: "bg-teal-50 border-teal-200" },
  material: { label: "Study Material", icon: BookOpen, color: "text-rose-600", bg: "bg-rose-50 border-rose-200" },
};

export default function AnnouncementManager({ initialData = [], onRefresh }: AnnouncementManagerProps) {
  const [items, setItems] = useState<AnnouncementItem[]>(initialData);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "LIVE" | "SCHEDULED" | "DRAFT" | "EXPIRED">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<AnnouncementItem> | null>(null);
  const [startLocal, setStartLocal] = useState("");
  const [endLocal, setEndLocal] = useState("");
  
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { showSuccess, showError, showSaving } = useCMSFeedback();

  useEffect(() => {
    setItems(initialData);
  }, [initialData]);

  // Statistics
  const liveCount = items.filter((i) => getNoticeStatus(i) === "LIVE").length;
  const scheduledCount = items.filter((i) => getNoticeStatus(i) === "SCHEDULED").length;
  const draftCount = items.filter((i) => getNoticeStatus(i) === "DRAFT").length;
  const expiredCount = items.filter((i) => getNoticeStatus(i) === "EXPIRED").length;

  const filteredItems = items.filter((item) => {
    const status = getNoticeStatus(item);
    if (activeFilter === "LIVE" && status !== "LIVE") return false;
    if (activeFilter === "SCHEDULED" && status !== "SCHEDULED") return false;
    if (activeFilter === "DRAFT" && status !== "DRAFT") return false;
    if (activeFilter === "EXPIRED" && status !== "EXPIRED") return false;

    if (priorityFilter !== "ALL" && item.priority !== priorityFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q) ||
        (item.button_text && item.button_text.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenCreate = () => {
    const nowLocal = isoToDatetimeLocal(new Date().toISOString());
    setEditingItem({
      title: "",
      message: "",
      announcement_type: "admission",
      priority: "important",
      is_enabled: true,
      button_text: "Apply Now",
      button_url: "/admission",
      display_order: items.length + 1,
      is_dismissible: true,
    });
    setStartLocal(nowLocal);
    setEndLocal("");
    setModalOpen(true);
  };

  const handleOpenEdit = (item: AnnouncementItem) => {
    setEditingItem(item);
    setStartLocal(isoToDatetimeLocal(item.start_at));
    setEndLocal(isoToDatetimeLocal(item.end_at));
    setModalOpen(true);
  };

  const handleDuplicate = (item: AnnouncementItem) => {
    setEditingItem({
      title: `${item.title} (Copy)`,
      message: item.message,
      announcement_type: item.announcement_type,
      priority: item.priority,
      is_enabled: true,
      button_text: item.button_text,
      button_url: item.button_url,
      display_order: items.length + 1,
      is_dismissible: item.is_dismissible,
    });
    setStartLocal(isoToDatetimeLocal(new Date().toISOString()));
    setEndLocal(isoToDatetimeLocal(item.end_at));
    setModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || saving) return;

    if (!editingItem.title?.trim() || !editingItem.message?.trim()) {
      showError("Please enter both a Notice Title and Description message.");
      return;
    }

    const startIso = datetimeLocalToIso(startLocal) || new Date().toISOString();
    const endIso = datetimeLocalToIso(endLocal);

    if (endIso && new Date(endIso) <= new Date(startIso)) {
      showError("Notice End date/time must be after the Start date/time.");
      return;
    }

    setSaving(true);
    showSaving("Saving announcement notice...");

    const payload: Partial<AnnouncementItem> = {
      ...editingItem,
      start_at: startIso,
      end_at: endIso,
    };

    try {
      const res = await saveAnnouncementItemAction(payload);
      if (res.success) {
        if (res.data) {
          setItems((prev) => {
            const exists = prev.some((i) => i.id === res.data.id);
            if (exists) return prev.map((i) => (i.id === res.data.id ? res.data : i));
            return [res.data, ...prev];
          });
        }
        showSuccess(res.message || "Announcement notice saved successfully!");
        setModalOpen(false);
        if (onRefresh) onRefresh();
      } else {
        showError(res.error || "Failed to save announcement notice.");
      }
    } catch (err) {
      showError("An unexpected error occurred while saving notice.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnable = async (item: AnnouncementItem) => {
    const updatedStatus = !item.is_enabled;
    const payload = { ...item, is_enabled: updatedStatus };
    setItems((prev) => prev.map((i) => (i.id === item.id ? payload : i)));

    showSaving(`${updatedStatus ? "Enabling" : "Disabling"} notice...`);
    const res = await saveAnnouncementItemAction(payload);
    if (res.success) {
      showSuccess(`Notice "${item.title}" ${updatedStatus ? "enabled" : "disabled"}.`);
      if (onRefresh) onRefresh();
    } else {
      showError(res.error || "Failed to update notice status.");
      setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
    }
  };

  const handleDelete = async (id: string) => {
    showSaving("Deleting notice...");
    const res = await deleteAnnouncementItemAction(id);
    if (res.success) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      showSuccess("Announcement notice deleted successfully!");
      setDeleteConfirmId(null);
      if (onRefresh) onRefresh();
    } else {
      showError(res.error || "Failed to delete notice.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Glassmorphism Top Header & Counters */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider">
              <Megaphone className="w-3.5 h-3.5 text-blue-600" />
              <span>RCI Notice & Announcement Control Center</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              Announcements & Notice Management
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Publish, schedule, and prioritize dynamic website announcements across all RCI public pages.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="min-h-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Announcement</span>
          </button>
        </div>

        {/* Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <p className="text-[10px] font-black uppercase text-slate-400">Total Notices</p>
            <p className="text-xl font-black text-slate-900 font-mono">{items.length}</p>
          </div>
          <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200/80 space-y-1">
            <p className="text-[10px] font-black uppercase text-emerald-700">🟢 Live Now</p>
            <p className="text-xl font-black text-emerald-900 font-mono">{liveCount}</p>
          </div>
          <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 space-y-1">
            <p className="text-[10px] font-black uppercase text-amber-700">🟡 Scheduled</p>
            <p className="text-xl font-black text-amber-900 font-mono">{scheduledCount}</p>
          </div>
          <div className="bg-slate-100 p-3.5 rounded-2xl border border-slate-200 space-y-1">
            <p className="text-[10px] font-black uppercase text-slate-500">⚪ Draft / Disabled</p>
            <p className="text-xl font-black text-slate-700 font-mono">{draftCount}</p>
          </div>
          <div className="bg-rose-50/80 p-3.5 rounded-2xl border border-rose-200/80 col-span-2 sm:col-span-1 space-y-1">
            <p className="text-[10px] font-black uppercase text-rose-700">🔴 Expired</p>
            <p className="text-xl font-black text-rose-900 font-mono">{expiredCount}</p>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {(["ALL", "LIVE", "SCHEDULED", "DRAFT", "EXPIRED"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                  activeFilter === tab
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab === "ALL" && "All Notices"}
                {tab === "LIVE" && "🟢 Live"}
                {tab === "SCHEDULED" && "🟡 Scheduled"}
                {tab === "DRAFT" && "⚪ Draft"}
                {tab === "EXPIRED" && "🔴 Expired"}
              </button>
            ))}
          </div>

          {/* Priority & Search inputs */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="min-h-[38px] px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">All Priorities</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="important">⭐ Important</option>
              <option value="normal">🔹 Normal</option>
            </select>

            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-h-[38px] px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 w-44"
            />
          </div>
        </div>
      </div>

      {/* 2. Notice List Cards */}
      {filteredItems.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
            <Megaphone className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900">No Announcements Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {searchQuery || activeFilter !== "ALL" || priorityFilter !== "ALL"
                ? "No announcements match your current filter criteria."
                : "Create your first RCI website notice to inform students about admissions, exams, or fee schedules."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="min-h-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Announcement</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const status = getNoticeStatus(item);
            const typeConf = TYPE_CONFIG[item.announcement_type] || TYPE_CONFIG.notice;
            const TypeIcon = typeConf.icon;

            return (
              <div
                key={item.id}
                className={`bg-white/95 backdrop-blur-xl border rounded-3xl p-5 shadow-xs space-y-4 transition-all hover:shadow-md ${
                  status === "LIVE"
                    ? "border-emerald-200/90 shadow-emerald-500/5"
                    : status === "SCHEDULED"
                    ? "border-amber-200/90"
                    : status === "EXPIRED"
                    ? "border-rose-200/90 opacity-75"
                    : "border-slate-200 opacity-60"
                }`}
              >
                {/* Notice Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status Badge */}
                    {status === "LIVE" && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        LIVE NOW
                      </span>
                    )}
                    {status === "SCHEDULED" && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        SCHEDULED
                      </span>
                    )}
                    {status === "DRAFT" && (
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-[10.5px] font-black uppercase tracking-wider">
                        ⚪ DISABLED
                      </span>
                    )}
                    {status === "EXPIRED" && (
                      <span className="px-2.5 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-800 text-[10.5px] font-black uppercase tracking-wider">
                        🔴 EXPIRED
                      </span>
                    )}

                    {/* Priority Badge */}
                    {item.priority === "urgent" && (
                      <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                        URGENT
                      </span>
                    )}
                    {item.priority === "important" && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                        IMPORTANT
                      </span>
                    )}

                    {/* Type Badge */}
                    <span className={`px-2 py-0.5 rounded-full border ${typeConf.bg} ${typeConf.color} text-[10px] font-bold flex items-center gap-1`}>
                      <TypeIcon className="w-3 h-3" />
                      <span>{typeConf.label}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleEnable(item)}
                      className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                        item.is_enabled ? "text-emerald-600 hover:bg-emerald-50" : "text-slate-400 hover:bg-slate-100"
                      }`}
                      title={item.is_enabled ? "Disable Notice" : "Enable Notice"}
                    >
                      {item.is_enabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                  </div>
                </div>

                {/* Notice Title & Content */}
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                    {item.message}
                  </p>
                </div>

                {/* Dates & Button Info */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-500">
                  <div className="space-y-0.5">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Start (IST)</span>
                    <span className="text-slate-800 font-mono">{formatISTDisplay(item.start_at)}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 block">End (IST)</span>
                    <span className="text-slate-800 font-mono">{formatISTDisplay(item.end_at)}</span>
                  </div>
                </div>

                {/* CTA URL & Action Buttons */}
                <div className="pt-2 flex items-center justify-between gap-2">
                  <div className="truncate text-xs font-bold text-blue-600">
                    {item.button_text && item.button_url ? (
                      <span className="inline-flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                        <LinkIcon className="w-3 h-3" />
                        <span>{item.button_text} ({item.button_url})</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">No CTA Button</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(item)}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                      title="Duplicate Notice"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                      title="Edit Notice"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Create / Edit Notice Modal Dialog */}
      {modalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-display">
                    {editingItem.id ? "Edit Announcement Notice" : "Create New Announcement Notice"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Configure notice details, type, priority, and scheduling parameters.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs font-bold text-slate-700">
              {/* Notice Title */}
              <div className="space-y-1.5">
                <label className="text-slate-800">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Admissions Open for New CCC & DCA Batches 2026"
                  value={editingItem.title || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Notice Message */}
              <div className="space-y-1.5">
                <label className="text-slate-800">Notice Description / Message *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Write clear, engaging announcement content for students..."
                  value={editingItem.message || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, message: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Type & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-800">Announcement Type</label>
                  <select
                    value={editingItem.announcement_type || "admission"}
                    onChange={(e) => setEditingItem({ ...editingItem, announcement_type: e.target.value as AnnouncementType })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="admission">🎓 Admission Open</option>
                    <option value="notice">📢 General Notice</option>
                    <option value="important">⭐ Important Notice</option>
                    <option value="exam">📝 Exam Notice</option>
                    <option value="fee">💰 Fee Alert</option>
                    <option value="certificate">🏆 Certificate Distribution</option>
                    <option value="material">📚 Study Material</option>
                    <option value="event">📅 Event / Holiday</option>
                    <option value="update">🔔 System Update</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-800">Priority Level</label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                    {(["normal", "important", "urgent"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, priority: p })}
                        className={`py-2 rounded-xl text-[11px] font-black uppercase transition-all cursor-pointer ${
                          editingItem.priority === p
                            ? p === "urgent"
                              ? "bg-red-600 text-white shadow-sm"
                              : p === "important"
                              ? "bg-amber-500 text-slate-950 shadow-sm"
                              : "bg-blue-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Start & End Date-Time Pickers (IST) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-800">Start Date & Time (IST) *</label>
                  <input
                    type="datetime-local"
                    required
                    value={startLocal}
                    onChange={(e) => setStartLocal(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="text-[10.5px] text-slate-400 font-medium">Converted automatically to India Standard Time.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-800">End Date & Time (IST Optional)</label>
                  <input
                    type="datetime-local"
                    value={endLocal}
                    onChange={(e) => setEndLocal(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="text-[10.5px] text-slate-400 font-medium">Leave empty for no expiration date.</span>
                </div>
              </div>

              {/* Button Text & Button URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-800">CTA Button Text (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Apply Now / View Details"
                    value={editingItem.button_text || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, button_text: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-800">CTA Button URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. /admission or https://..."
                    value={editingItem.button_url || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, button_url: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Toggles & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-xs font-bold text-slate-800">Enable Notice</span>
                  <button
                    type="button"
                    onClick={() => setEditingItem({ ...editingItem, is_enabled: !editingItem.is_enabled })}
                    className={`p-1 rounded-xl transition-all cursor-pointer ${
                      editingItem.is_enabled ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    {editingItem.is_enabled ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-xs font-bold text-slate-800">Dismissible</span>
                  <button
                    type="button"
                    onClick={() => setEditingItem({ ...editingItem, is_dismissible: !editingItem.is_dismissible })}
                    className={`p-1 rounded-xl transition-all cursor-pointer ${
                      editingItem.is_dismissible ? "text-blue-600" : "text-slate-400"
                    }`}
                  >
                    {editingItem.is_dismissible ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-800">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={editingItem.display_order ?? 1}
                    onChange={(e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="min-h-[44px] px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="min-h-[44px] px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{saving ? "Saving..." : "Save Announcement Notice"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center mx-auto text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">Delete Announcement Notice?</h3>
              <p className="text-xs text-slate-500 font-medium">
                This action cannot be undone. The notice will be permanently removed from the website database.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="min-h-[44px] px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="min-h-[44px] px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black shadow-md shadow-red-600/20 transition-all cursor-pointer"
              >
                Delete Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
