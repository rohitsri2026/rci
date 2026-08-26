"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Search, MessageSquare, Send, Copy, Check, 
  User, Sparkles, Loader2, AlertCircle, X, CheckCircle2,
  RefreshCw, CheckSquare, Square
} from "lucide-react";
import MessagePreviewModal from "@/components/admin/notifications/MessagePreviewModal";
import NotificationTrigger from "@/components/admin/notifications/NotificationTrigger";
import { NotificationType, NotificationVariables } from "@/lib/notifications/types";
import { openWhatsAppWeb } from "@/lib/notifications/whatsapp";
import { openSMSComposer } from "@/lib/notifications/sms";
import { renderNotificationTemplate } from "@/lib/notifications/templates";
import { logManualNotification, updateNotificationLogStatus } from "@/lib/notifications/manual-service";

interface EnrichedStudent {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  course_id: string | null;
  course_name: string;
  course_duration: string;
  application?: {
    id: string;
    application_id: string;
    status: string;
    selected_course: string | null;
  } | null;
  certificate?: {
    id: string;
    certificate_number: string;
    issue_date: string;
    status: string;
    url: string;
  } | null;
  fee_ledger?: {
    id: string;
    total_paid: number;
    status: string;
  } | null;
}

export default function CommunicationCenterPage() {
  const [students, setStudents] = useState<EnrichedStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<EnrichedStudent | null>(null);

  // Multi-select state
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Composer Form State
  const [channel, setChannel] = useState<"whatsapp" | "sms">("whatsapp");
  const [templateType, setTemplateType] = useState<NotificationType>("general");
  const [messageBody, setMessageBody] = useState("");
  const [customReason] = useState("दस्तावेज़ अपूर्ण हैं (Incomplete documents)");

  // Interaction & Modal States
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Recent Logs State
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Auto-dismiss toasts
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load students from API
  const fetchStudents = useCallback(async (query: string) => {
    setLoadingStudents(true);
    try {
      const res = await fetch(`/api/admin/communication/students?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok && data.students) {
        setStudents(data.students);
        if (data.students.length > 0 && !selectedStudent) {
          setSelectedStudent(data.students[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch students for communication center:", err);
    } finally {
      setLoadingStudents(false);
    }
  }, [selectedStudent]);

  // Load recent audit logs
  const fetchRecentLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      if (res.ok && data.logs) {
        setRecentLogs(data.logs.slice(0, 10));
      }
    } catch (err) {
      console.error("Failed to load notification logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchStudents(searchQuery);
    fetchRecentLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced student search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchStudents]);

  // Compute dynamic variables for selected student
  const currentVariables: NotificationVariables = useMemo(() => {
    if (!selectedStudent) return {};

    const studentName = selectedStudent.full_name || "विद्यार्थी";
    const appId = selectedStudent.application?.application_id || selectedStudent.id.slice(0, 8).toUpperCase();
    const certNum = selectedStudent.certificate?.certificate_number || `RCI-CERT-${appId}`;
    const certUrl = selectedStudent.certificate?.url || `https://rciknp.vercel.app/verify/${certNum}`;
    const paidAmount = selectedStudent.fee_ledger?.total_paid || 1500;
    const txId = selectedStudent.fee_ledger?.id?.slice(0, 8).toUpperCase() || `TXN-${appId}`;

    return {
      student_name: studentName,
      application_id: appId,
      rejection_reason: customReason,
      login_url: "https://rciknp.vercel.app/student/login",
      certificate_number: certNum,
      certificate_url: certUrl,
      payment_amount: paidAmount,
      transaction_id: txId,
      custom_message: "आपकी प्रैक्टिकल कंप्यूटर क्लास कल सुबह 10:00 बजे आयोजित की जाएगी।",
    };
  }, [selectedStudent, customReason]);

  // Auto-update message body when template or student changes
  useEffect(() => {
    if (selectedStudent) {
      const rendered = renderNotificationTemplate(templateType, currentVariables);
      setMessageBody(rendered);
    }
  }, [templateType, selectedStudent, currentVariables]);

  // Copy message to clipboard
  const handleCopyMessage = () => {
    if (!messageBody) return;
    navigator.clipboard.writeText(messageBody);
    setCopiedText(true);
    setToast({ message: "Message text copied to clipboard!", type: "success" });
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Launch WhatsApp
  const handleLaunchWhatsApp = async () => {
    if (!selectedStudent || !selectedStudent.phone) {
      setToast({ message: "Student mobile number is missing or invalid.", type: "error" });
      return;
    }
    setActionLoading(true);

    try {
      const success = openWhatsAppWeb(selectedStudent.phone, messageBody);
      if (!success) {
        setToast({ message: "Unable to launch WhatsApp Web. Please check phone number format.", type: "error" });
      } else {
        await logManualNotification({
          student_id: selectedStudent.id,
          notification_type: templateType,
          channel: "whatsapp",
          message: messageBody,
          phone_number: selectedStudent.phone,
          status: "opened",
        });
        setToast({ message: "WhatsApp Web opened with pre-filled message!", type: "success" });
        fetchRecentLogs();
      }
    } catch (err: any) {
      setToast({ message: err.message || "Failed to open WhatsApp.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Launch SMS
  const handleLaunchSMS = async () => {
    if (!selectedStudent || !selectedStudent.phone) {
      setToast({ message: "Student mobile number is missing or invalid.", type: "error" });
      return;
    }
    setActionLoading(true);

    try {
      const success = openSMSComposer(selectedStudent.phone, messageBody);
      await logManualNotification({
        student_id: selectedStudent.id,
        notification_type: templateType,
        channel: "sms",
        message: messageBody,
        phone_number: selectedStudent.phone,
        status: success ? "opened" : "previewed",
      });

      if (!success) {
        setToast({ message: "SMS composer not supported. Message copied to clipboard instead!", type: "error" });
      } else {
        setToast({ message: "SMS composer triggered on device!", type: "success" });
      }
      fetchRecentLogs();
    } catch (err: any) {
      setToast({ message: err.message || "Failed to trigger SMS.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle multi-select
  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map((s) => s.id));
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "ST";
    const parts = name.trim().split(" ");
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-3 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-bottom-4 duration-200 ${
          toast.type === "success" 
            ? "bg-slate-900 text-white border-slate-800" 
            : "bg-rose-950 text-white border-rose-900"
        }`}>
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 border border-blue-200/60 flex items-center justify-center font-extrabold shrink-0 shadow-2xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-display">
                Communication Center
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Send manual WhatsApp and SMS notifications directly to RCI students.
              </p>
            </div>
          </div>
        </div>

        {/* Messaging Cost Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/90 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-extrabold self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Manual Messaging Cost = ₹0</span>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Student Search & Selection (col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student by name, phone, application ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* List Header & Multi-Select Indicator */}
            <div className="flex items-center justify-between pt-1 pb-1 border-b border-slate-100 text-xs">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-[11px] font-extrabold text-slate-500 hover:text-slate-900 uppercase tracking-wider"
              >
                {selectedStudentIds.length === students.length && students.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>Select All ({students.length})</span>
              </button>

              {selectedStudentIds.length > 0 && (
                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-extrabold text-[11px]">
                  Selected: {selectedStudentIds.length}
                </span>
              )}
            </div>

            {/* Student Cards List */}
            <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
              {loadingStudents ? (
                <div className="py-12 text-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-500">Querying student records...</p>
                </div>
              ) : students.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 border border-slate-200/80 rounded-xl p-6 space-y-2">
                  <User className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-extrabold text-slate-800">No students found</p>
                  <p className="text-[11px] text-slate-500">Try searching by student name, phone number, or application ID.</p>
                </div>
              ) : (
                students.map((student) => {
                  const isSelected = selectedStudent?.id === student.id;
                  const isChecked = selectedStudentIds.includes(student.id);

                  return (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                        isSelected
                          ? "bg-blue-50/70 border-blue-500/80 shadow-xs ring-1 ring-blue-500/30"
                          : "bg-slate-50/50 border-slate-200/80 hover:bg-slate-100/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Checkbox */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelectStudent(student.id);
                            }}
                            className="p-0.5 text-slate-400 hover:text-blue-600 shrink-0"
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300" />
                            )}
                          </button>

                          {/* Avatar */}
                          <div className={`w-9 h-9 rounded-xl font-extrabold text-xs flex items-center justify-center shrink-0 border ${
                            isSelected 
                              ? "bg-blue-600 text-white border-blue-600" 
                              : "bg-white text-blue-600 border-slate-200"
                          }`}>
                            {getInitials(student.full_name)}
                          </div>

                          {/* Student Details */}
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-extrabold text-slate-950 truncate leading-snug">
                              {student.full_name}
                            </h4>
                            <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                              {student.phone || "No phone number"}
                            </p>
                          </div>
                        </div>

                        {/* Course Badge */}
                        <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md shrink-0 max-w-[100px] truncate">
                          {student.course_name}
                        </span>
                      </div>

                      {/* Quick Trigger Bar */}
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {student.application ? `App: ${student.application.application_id}` : "Registered Student"}
                        </span>

                        <NotificationTrigger
                          studentId={student.id}
                          studentName={student.full_name}
                          studentPhone={student.phone || ""}
                          type={templateType}
                          variables={currentVariables}
                          size="xs"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Communication Composer (col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedStudent ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
              
              {/* Selected Student Banner */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-2xs">
                    {getInitials(selectedStudent.full_name)}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-950 tracking-tight font-display">
                      {selectedStudent.full_name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-700">{selectedStudent.phone || "No phone"}</span>
                      <span>•</span>
                      <span className="font-semibold text-blue-700">{selectedStudent.course_name}</span>
                    </div>
                  </div>
                </div>

                {selectedStudent.application && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/90 px-3 py-1 rounded-full text-xs font-extrabold shrink-0 self-start sm:self-auto">
                    App: {selectedStudent.application.application_id} ({selectedStudent.application.status})
                  </span>
                )}
              </div>

              {/* Context Warnings if Phone is Missing */}
              {!selectedStudent.phone && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5">
                  <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
                  <span>⚠️ Student mobile number is missing or invalid. Please update student profile phone number.</span>
                </div>
              )}

              {/* Channel Selector Tabs */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  1. Select Communication Channel
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setChannel("whatsapp")}
                    className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                      channel === "whatsapp"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>📱 WhatsApp Web</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel("sms")}
                    className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                      channel === "sms"
                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>✉️ Device SMS</span>
                  </button>
                </div>
              </div>

              {/* Template Selector */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  2. Select Notification Template
                </label>
                <select
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value as NotificationType)}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="application_submitted">📋 आवेदन जमा हुआ (Application Submitted)</option>
                  <option value="application_approved">🎉 आवेदन स्वीकृत (Application Approved)</option>
                  <option value="application_rejected">❌ आवेदन अस्वीकृत (Application Rejected)</option>
                  <option value="payment_successful">💳 भुगतान सफल (Payment Successful)</option>
                  <option value="payment_failed">⚠️ भुगतान असफल (Payment Failed)</option>
                  <option value="certificate_generated">🎓 प्रमाण-पत्र तैयार (Certificate Generated)</option>
                  <option value="certificate_updated">📜 प्रमाण-पत्र अपडेट (Certificate Updated)</option>
                  <option value="general">📢 सामान्य सूचना (General Notice)</option>
                </select>
              </div>

              {/* Dynamic Variables Resolver Bar */}
              <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-3 space-y-1.5">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Resolved Dynamic Variables
                </span>
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono font-semibold">
                  <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-blue-700">
                    name: {currentVariables.student_name}
                  </span>
                  <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-purple-700">
                    app_id: {currentVariables.application_id}
                  </span>
                  {selectedStudent.certificate && (
                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-emerald-700">
                      cert_no: {currentVariables.certificate_number}
                    </span>
                  )}
                </div>
              </div>

              {/* Message Editor Textarea */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    3. Live Message Content (Fully Editable)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">{messageBody.length} characters</span>
                </div>
                <textarea
                  rows={7}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all leading-relaxed"
                  placeholder="Type or customize your notification message..."
                />
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="h-11 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-extrabold text-xs transition-colors flex items-center gap-2 min-h-[44px]"
                >
                  {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                  <span>{copiedText ? "Copied!" : "Copy Text"}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewModalOpen(true)}
                    className="h-11 px-4 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs transition-colors min-h-[44px]"
                  >
                    Modal Preview
                  </button>

                  {channel === "whatsapp" ? (
                    <button
                      type="button"
                      onClick={handleLaunchWhatsApp}
                      disabled={actionLoading || !selectedStudent.phone}
                      className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 disabled:opacity-60 flex items-center gap-2 min-h-[44px]"
                    >
                      {actionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>Open WhatsApp</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleLaunchSMS}
                      disabled={actionLoading || !selectedStudent.phone}
                      className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-600/20 disabled:opacity-60 flex items-center gap-2 min-h-[44px]"
                    >
                      {actionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>Send SMS</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-16 text-center text-slate-400 space-y-2">
              <User className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-extrabold text-slate-800">Select a student</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Choose a student from the left panel to compose a manual WhatsApp or SMS message.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RECENT NOTIFICATIONS AUDIT LOG SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-950 font-display">Recent Notification Audit Logs</h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time log of manual notifications previewed or opened by Admins.</p>
          </div>
          <button
            onClick={fetchRecentLogs}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loadingLogs ? (
          <div className="py-8 text-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">Loading recent notification logs...</p>
          </div>
        ) : recentLogs.length === 0 ? (
          <p className="text-center py-8 text-xs text-slate-400 font-semibold">No notification logs recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
                  <th className="py-3 px-4">STUDENT</th>
                  <th className="py-3 px-4">CHANNEL</th>
                  <th className="py-3 px-4">TYPE</th>
                  <th className="py-3 px-4">MESSAGE SNIPPET</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-950 whitespace-nowrap">
                      {log.student_name}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${
                        log.channel === "whatsapp" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {log.channel}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {log.notification_type}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                      {log.message}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                        log.status === "sent" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {log.status !== "sent" && (
                        <button
                          onClick={async () => {
                            await updateNotificationLogStatus(log.id, "sent");
                            fetchRecentLogs();
                          }}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[10.5px] font-extrabold border border-emerald-200 transition-colors"
                        >
                          Mark Sent
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* REUSED MESSAGE PREVIEW MODAL */}
      {selectedStudent && previewModalOpen && (
        <MessagePreviewModal
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          studentName={selectedStudent.full_name}
          studentPhone={selectedStudent.phone || ""}
          studentId={selectedStudent.id}
          defaultType={templateType}
          defaultChannel={channel}
          variables={currentVariables}
        />
      )}
    </div>
  );
}
