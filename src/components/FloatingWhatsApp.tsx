"use client";

import { MessageCircle } from "lucide-react";
import { RCIConfig } from "@/lib/config";

export default function FloatingWhatsApp() {
  const whatsappUrl = RCIConfig.getWhatsAppUrl("Hello RCI, I am looking for information about your computer courses.");

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp with RCI"
      className="fixed bottom-20 right-5 sm:bottom-8 sm:right-8 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group"
    >
      <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
        Chat with Us
      </span>
    </a>
  );
}
