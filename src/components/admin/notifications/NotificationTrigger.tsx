"use client";

import { useState } from "react";
import { MessageSquare, Smartphone } from "lucide-react";
import { NotificationType, NotificationVariables } from "@/lib/notifications/types";
import MessagePreviewModal from "./MessagePreviewModal";

export interface NotificationTriggerProps {
  studentId?: string | null;
  studentName: string;
  studentPhone: string;
  type?: NotificationType;
  variables?: NotificationVariables;
  variant?: "buttons" | "single" | "icon";
  size?: "xs" | "sm" | "md";
  className?: string;
  onSuccess?: () => void;
}

export default function NotificationTrigger({
  studentId,
  studentName,
  studentPhone,
  type = "general",
  variables = {},
  variant = "buttons",
  size = "sm",
  className = "",
  onSuccess,
}: NotificationTriggerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState<"whatsapp" | "sms">("whatsapp");

  const openModal = (channel: "whatsapp" | "sms") => {
    setActiveChannel(channel);
    setModalOpen(true);
  };

  const py = size === "xs" ? "py-1 px-2 text-[11px]" : size === "sm" ? "py-1.5 px-3 text-xs" : "py-2 px-4 text-xs";

  return (
    <>
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        {variant === "buttons" ? (
          <>
            <button
              type="button"
              onClick={() => openModal("whatsapp")}
              className={`inline-flex items-center gap-1 font-extrabold rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors ${py}`}
              title={`Send WhatsApp notification to ${studentName}`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={() => openModal("sms")}
              className={`inline-flex items-center gap-1 font-extrabold rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors ${py}`}
              title={`Send SMS notification to ${studentName}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>SMS</span>
            </button>
          </>
        ) : variant === "icon" ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => openModal("whatsapp")}
              className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
              title="WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => openModal("sms")}
              className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
              title="SMS"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openModal("whatsapp")}
            className={`inline-flex items-center gap-1.5 font-extrabold rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors ${py}`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>Send Notification</span>
          </button>
        )}
      </div>

      <MessagePreviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        studentId={studentId}
        studentName={studentName}
        studentPhone={studentPhone}
        defaultType={type}
        defaultChannel={activeChannel}
        variables={variables}
        onSuccess={onSuccess}
      />
    </>
  );
}
