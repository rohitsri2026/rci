"use client";

import React, { createContext, useContext } from "react";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { NotificationItem } from "@/components/student/StudentNotificationCard";

interface StudentNotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  toastNotification: NotificationItem | null;
  connectionStatus: "CONNECTING" | "SUBSCRIBED" | "CLOSED" | "ERROR";
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  dismissToast: () => void;
}

const StudentNotificationContext =
  createContext<StudentNotificationContextType | null>(null);

interface StudentNotificationProviderProps {
  userId?: string;
  studentId?: string;
  initialUnreadCount?: number;
  initialNotifications?: NotificationItem[];
  children: React.ReactNode;
}

export function StudentNotificationProvider({
  userId,
  studentId,
  initialUnreadCount = 0,
  initialNotifications = [],
  children,
}: StudentNotificationProviderProps) {
  const notificationState = useRealtimeNotifications({
    userId,
    studentId,
    initialUnreadCount,
    initialNotifications,
  });

  return (
    <StudentNotificationContext.Provider value={notificationState}>
      {children}
    </StudentNotificationContext.Provider>
  );
}

export function useStudentNotifications() {
  const context = useContext(StudentNotificationContext);
  if (!context) {
    // Fallback safe defaults if rendered outside provider
    return {
      notifications: [],
      unreadCount: 0,
      toastNotification: null,
      connectionStatus: "CLOSED" as const,
      loading: false,
      markAsRead: async () => {},
      markAllAsRead: async () => {},
      refreshNotifications: async () => {},
      dismissToast: () => {},
    };
  }
  return context;
}
