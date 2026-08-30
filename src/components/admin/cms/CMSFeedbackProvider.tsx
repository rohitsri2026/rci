"use client";

import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { CMSToast, ToastState } from "./CMSToast";

interface CMSFeedbackContextType {
  showSuccess: (message: string, categoryTitle?: string) => void;
  showError: (message: string) => void;
  showSaving: (message?: string) => void;
  dismissToast: () => void;
}

const CMSFeedbackContext = createContext<CMSFeedbackContextType | null>(null);

export function CMSFeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const dismissToast = useCallback(() => {
    clearTimer();
    setToast(null);
  }, []);

  const showSuccess = useCallback((message: string, categoryTitle?: string) => {
    clearTimer();
    const id = Date.now().toString();
    console.log(`[CMS] Success Toast (${categoryTitle || "CMS"}): ${message}`);
    setToast({ id, type: "success", message, categoryTitle });

    // Toast stays visible for 4.5 seconds
    timerRef.current = setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4500);
  }, []);

  const showError = useCallback((message: string) => {
    clearTimer();
    const id = Date.now().toString();
    console.error(`[CMS] Error Toast: ${message}`);
    setToast({ id, type: "error", message });

    // Error toast stays visible for 6 seconds
    timerRef.current = setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 6000);
  }, []);

  const showSaving = useCallback((message = "Saving changes to remote database...") => {
    clearTimer();
    const id = Date.now().toString();
    console.log(`[CMS] Saving Toast: ${message}`);
    setToast({ id, type: "saving", message });
  }, []);

  return (
    <CMSFeedbackContext.Provider value={{ showSuccess, showError, showSaving, dismissToast }}>
      {children}
      <CMSToast toast={toast} onDismiss={dismissToast} />
    </CMSFeedbackContext.Provider>
  );
}

export function useCMSFeedback() {
  const ctx = useContext(CMSFeedbackContext);
  if (!ctx) {
    throw new Error("useCMSFeedback must be used within a CMSFeedbackProvider");
  }
  return ctx;
}
