"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  Send,
  X,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  FileText
} from "lucide-react";
import {
  NotificationType,
  NotificationVariables,
  NotificationChannel
} from "@/lib/notifications/types";
import {
  NOTIFICATION_TEMPLATES,
  renderNotificationTemplate
} from "@/lib/notifications/templates";
import { getWhatsAppUrl, openWhatsAppWeb } from "@/lib/notifications/whatsapp";
import { getSMSUrl, openSMSComposer, copyMessageToClipboard } from "@/lib/notifications/sms";
import { logManualNotification, updateNotificationLogStatus } from "@/lib/notifications/manual-service";
import { normalizePhone } from "@/lib/utils";

export interface MessagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId?: string | null;
  studentName: string;
  studentPhone: string;
  defaultType?: NotificationType;
  defaultChannel?: "whatsapp" | "sms";
  variables?: NotificationVariables;
  onSuccess?: () => void;
}

export default function MessagePreviewModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  studentPhone,
  defaultType = "general",
  defaultChannel = "whatsapp",
  variables = {},
  onSuccess,
}: MessagePreviewModalProps) {
  const [selectedType, setSelectedType] = useState<NotificationType>(defaultType);
  const [channel, setChannel] = useState<"whatsapp" | "sms">(defaultChannel);
  const [message, setMessage] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [smsSupported, setSmsSupported] = useState(true);
  const [logId, setLogId] = useState<string | null>(null);
  const [isSentMarked, setIsSentMarked] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const normalizedPhone = normalizePhone(studentPhone);
  const isValidPhone = normalizedPhone.length === 10;

  // Initialize and re-render template when modal opens or template selection changes
  useEffect(() => {
    if (isOpen) {
      const vars: NotificationVariables = {
        student_name: studentName,
        ...variables,
      };
      const rendered = renderNotificationTemplate(selectedType, vars);
      setMessage(rendered);
      setCopied(false);
      setIsSentMarked(false);
      setLogId(null);
      setStatusMessage(null);

      // Check device SMS capability
      const isMobile = typeof window !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setSmsSupported(isMobile);
    }
  }, [isOpen, selectedType, studentName, variables]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    const success = await copyMessageToClipboard(message);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      setStatusMessage("Message copied to clipboard!");

      // Log action
      const res = await logManualNotification({
        student_id: studentId,
        notification_type: selectedType,
        channel,
        message,
        phone_number: normalizedPhone || studentPhone,
        status: "opened",
        student_name: studentName,
      });
      if (res.logId) setLogId(res.logId);
    }
  };

  const handleOpenWhatsApp = async () => {
    if (!isValidPhone) {
      alert("Student does not have a valid 10-digit mobile number.");
      return;
    }

    const opened = openWhatsAppWeb(studentPhone, message);

    if (opened) {
      setStatusMessage("WhatsApp composer launched in a new tab.");

      // Insert log into notification_logs
      const res = await logManualNotification({
        student_id: studentId,
        notification_type: selectedType,
        channel: "whatsapp",
        message,
        phone_number: normalizedPhone,
        status: "opened",
        student_name: studentName,
      });
      if (res.logId) setLogId(res.logId);
      if (onSuccess) onSuccess();
    } else {
      alert("Unable to open WhatsApp Web. Please copy the message manually.");
    }
  };

  const handleOpenSMS = async () => {
    if (!isValidPhone) {
      alert("Student does not have a valid 10-digit mobile number.");
      return;
    }

    openSMSComposer(studentPhone, message);
    setStatusMessage("SMS composer triggered for mobile device.");

    // Insert log into notification_logs
    const res = await logManualNotification({
      student_id: studentId,
      notification_type: selectedType,
      channel: "sms",
      message,
      phone_number: normalizedPhone,
      status: "opened",
      student_name: studentName,
    });
    if (res.logId) setLogId(res.logId);
    if (onSuccess) onSuccess();
  };

  const handleMarkAsSent = async () => {
    if (logId) {
      await updateNotificationLogStatus(logId, "sent");
    } else {
      const res = await logManualNotification({
        student_id: studentId,
        notification_type: selectedType,
        channel,
        message,
        phone_number: normalizedPhone || studentPhone,
        status: "sent",
        student_name: studentName,
      });
      if (res.logId) setLogId(res.logId);
    }
    setIsSentMarked(true);
    setStatusMessage("Notification marked as SENT in database history.");
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">Manual Notification Composer</h3>
              <p className="text-slate-400 text-xs font-semibold">Preview & Dispatch via WhatsApp or SMS</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Student Recipient Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Recipient</p>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">{studentName || "Student"}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Mobile Number</p>
              <p className={`font-mono text-xs font-extrabold mt-0.5 ${isValidPhone ? "text-blue-700" : "text-red-600"}`}>
                {studentPhone ? `+91 ${normalizedPhone}` : "No Phone Registered"}
              </p>
            </div>
          </div>

          {!isValidPhone && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>Student does not have a valid 10-digit registered mobile number.</span>
            </div>
          )}

          {/* Controls: Template Selector & Channel Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Template Selector */}
            <div>
              <label htmlFor="modal_template_select" className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Message Template
              </label>
              <select
                id="modal_template_select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as NotificationType)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl text-slate-900 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(NOTIFICATION_TEMPLATES).map((t) => (
                  <option key={t.type} value={t.type}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Channel Tabs */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Notification Channel</label>
              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setChannel("whatsapp")}
                  className={`py-1.5 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    channel === "whatsapp"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel("sms")}
                  className={`py-1.5 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    channel === "sms"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>SMS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Rendered Editable Message Text Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="rendered_message_text" className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Message Preview & Editor</span>
              </label>
              <span className="text-[11px] font-semibold text-slate-400">{message.length} chars</span>
            </div>
            <textarea
              id="rendered_message_text"
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3.5 border border-slate-200 rounded-2xl text-xs text-slate-900 font-medium leading-relaxed bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 resize-none transition-all"
            />
          </div>

          {/* SMS Un-supported Warning banner */}
          {channel === "sms" && !smsSupported && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-xs font-semibold flex items-center justify-between">
              <span>SMS composer is not natively supported on desktop. Use Copy Message below.</span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-[11px] font-extrabold shrink-0"
              >
                Copy
              </button>
            </div>
          )}

          {/* Feedback Status Message Banner */}
          {statusMessage && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-xl text-xs font-bold animate-fade-in">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="h-10 px-4 inline-flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-extrabold text-xs rounded-xl transition-all shadow-2xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? "Copied!" : "Copy Message"}</span>
          </button>

          <div className="flex items-center gap-2">
            {!isSentMarked ? (
              <button
                type="button"
                onClick={handleMarkAsSent}
                className="h-10 px-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-extrabold text-xs rounded-xl transition-colors"
                title="Mark as sent in database history"
              >
                Mark as Sent
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Sent Logged
              </span>
            )}

            {channel === "whatsapp" ? (
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                disabled={!isValidPhone}
                className="h-10 px-5 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open WhatsApp</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenSMS}
                disabled={!isValidPhone}
                className="h-10 px-5 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Send SMS</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
