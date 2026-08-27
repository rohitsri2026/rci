"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { NotificationItem } from "@/components/student/StudentNotificationCard";

interface UseRealtimeNotificationsProps {
  userId?: string;
  studentId?: string;
  initialNotifications?: NotificationItem[];
  initialUnreadCount?: number;
}

export function useRealtimeNotifications({
  userId,
  studentId,
  initialNotifications = [],
  initialUnreadCount = 0,
}: UseRealtimeNotificationsProps) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState<number>(initialUnreadCount);
  const [toastNotification, setToastNotification] =
    useState<NotificationItem | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "CONNECTING" | "SUBSCRIBED" | "CLOSED" | "ERROR"
  >("CONNECTING");
  const [loading, setLoading] = useState<boolean>(false);

  // Keep ref to notifications for sync deduplication in listeners
  const notificationsRef = useRef<NotificationItem[]>(notifications);
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  // Sync initial props if changed
  useEffect(() => {
    if (initialNotifications.length > 0) {
      setNotifications(initialNotifications);
    }
  }, [initialNotifications]);

  useEffect(() => {
    setUnreadCount(initialUnreadCount);
  }, [initialUnreadCount]);

  // Fetch / Sync notifications from API endpoint
  const refreshNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student/notifications");
      const data = await res.json();
      if (res.ok && data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount ?? 0);
      }
    } catch (err) {
      console.error("[useRealtimeNotifications] Refresh error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up Supabase Realtime subscription
  useEffect(() => {
    if (!userId && !studentId) {
      return;
    }

    const supabase = createClient();
    let isMounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;

    const setupSubscription = () => {
      if (!isMounted) return;

      const channelName = `student_notifications_${userId || studentId}`;
      setConnectionStatus("CONNECTING");
      if (process.env.NODE_ENV !== "production") {
        console.log(`[Realtime] Channel created: ${channelName}`);
      }

      channel = supabase.channel(channelName);

      // Handler for incoming INSERT payloads
      const handleInsertPayload = (payload: any) => {
        if (!payload || !payload.new) return;
        const newRow = payload.new;

        if (process.env.NODE_ENV !== "production") {
          console.log(`[Realtime] INSERT received notification ID: ${newRow.id}`, newRow);
        }

        // Security / Scope Check: verify notification is meant for this student or broadcast (user_id IS NULL)
        const isForThisUser =
          newRow.user_id === null ||
          (userId && newRow.user_id === userId) ||
          (studentId && newRow.user_id === studentId);

        if (!isForThisUser) {
          return;
        }

        // Deduplication Check by notification ID
        const alreadyExists = notificationsRef.current.some(
          (n) => n.id === newRow.id
        );
        if (alreadyExists) {
          return;
        }

        const formattedNotif: NotificationItem = {
          id: newRow.id,
          title: newRow.title,
          message: newRow.message,
          type: newRow.metadata?.category || newRow.type || "NOTICE",
          is_read: newRow.is_read || false,
          created_at: newRow.created_at || new Date().toISOString(),
          metadata: newRow.metadata || null,
        };

        // Prepend new notification to state
        setNotifications((prev) => {
          if (prev.some((n) => n.id === formattedNotif.id)) return prev;
          return [formattedNotif, ...prev];
        });

        // Increment unread count if unread
        if (!formattedNotif.is_read) {
          setUnreadCount((prev) => prev + 1);
        }

        // Set visual toast notification
        setToastNotification(formattedNotif);
      };

      // Subscribe to all INSERT events on notifications table (RLS enforces student security at DB level)
      channel = channel.on(
        "postgres_changes" as any,
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        handleInsertPayload
      );

      // Subscribe & status callback handler
      channel.subscribe((status: string) => {
        if (!isMounted) return;
        if (process.env.NODE_ENV !== "production") {
          console.log(`[Realtime] Subscription status: ${status}`);
        }
        if (status === "SUBSCRIBED") {
          setConnectionStatus("SUBSCRIBED");
          // Reconcile initial state to prevent race conditions during websocket connection setup
          refreshNotifications();
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setConnectionStatus("ERROR");
          // Attempt graceful reconnect after 4s
          reconnectTimer = setTimeout(() => {
            if (isMounted) {
              if (channel) supabase.removeChannel(channel);
              setupSubscription();
            }
          }, 4000);
        } else if (status === "CLOSED") {
          setConnectionStatus("CLOSED");
        }
      });
    };

    setupSubscription();

    return () => {
      isMounted = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId, studentId]);

  // Optimistic Mark Single as Read
  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      const res = await fetch("/api/student/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      if (!res.ok) {
        // Refresh to reconcile on error
        refreshNotifications();
      }
    } catch (err) {
      console.error("[useRealtimeNotifications] Mark read error:", err);
      refreshNotifications();
    }
  }, [refreshNotifications]);

  // Optimistic Mark All as Read
  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
      const res = await fetch("/api/student/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      if (!res.ok) {
        refreshNotifications();
      }
    } catch (err) {
      console.error("[useRealtimeNotifications] Mark all read error:", err);
      refreshNotifications();
    }
  }, [refreshNotifications]);

  const dismissToast = useCallback(() => {
    setToastNotification(null);
  }, []);

  return {
    notifications,
    unreadCount,
    toastNotification,
    connectionStatus,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    dismissToast,
  };
}
