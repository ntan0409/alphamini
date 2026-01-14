"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useNotificationWebSocket } from "@/features/notifications/hooks/use-notification-websocket";
import { NotificationList } from "./notification-list";
import { useQueryClient, Query } from '@tanstack/react-query';
import { Notification } from '@/types/notification';
import { PagedNotifications } from '@/features/notifications/api/notification-api';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { addNotification, setNotifications } from '@/store/notification-slice';

interface NotificationBellProps {
  accountId: string | null;
}

export function NotificationBell({ accountId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications
  const { data: notificationsData, refetch } = useNotifications({
    page: 1,
    size: 20,
    accountId: accountId || undefined,
    status: undefined, // Get both read and unread
  });

  // ✅ Refetch khi mở popup để có data mới nhất
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (open) {
      console.log("📂 Opening notifications popup, refetching...");
      refetch();
    }
  }, [refetch]);

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  // Local unread counter to ensure badge updates immediately when socket arrives
  const [unreadLocal, setUnreadLocal] = useState<number>(
    notificationsData?.content?.filter((n: Notification) => !n.isRead).length || 0
  );

  // Keep local unread in sync when notifications data changes (e.g., after refetch or marking read)
  useEffect(() => {
    const count = notificationsData?.content?.filter((n: Notification) => !n.isRead).length || 0;
    setUnreadLocal(count);
  }, [notificationsData]);

  // Memoize callback để tránh re-render vô tận
  // Accept the notification object from websocket and insert it into the cache
  const handleNewNotification = useCallback((notification?: Notification) => {
    try {
      console.log("🔔 New notification arrived:", notification);

      if (!notification || !notification.id) {
        refetch();
        return;
      }

      // Find all cached queries whose key starts with 'notifications'
      const cached = queryClient.getQueriesData({ queryKey: ['notifications'] });

      if (!cached || cached.length === 0) {
        // no cache yet, just refetch to populate
        refetch();
        return;
      }

      // Update each matching cached query individually to ensure components depending on specific params update
      cached.forEach(([query, data]: [unknown, unknown]) => {
        try {
          if (!data) return;
          // interpret cached data as PagedNotifications
          const page = data as PagedNotifications;
          // normalize notification shape: ensure isRead boolean exists
          const normalized: Notification = { ...notification, isRead: notification.isRead ?? false } as Notification;

          const alreadyExists = page.content?.some((n: Notification) => n.id === normalized.id);
          if (alreadyExists) return;

          const newData: PagedNotifications = {
            ...page,
            content: [normalized, ...(page.content || [])],
            totalElements: (page.totalElements || 0) + 1,
          };

          // query is a Query object; use its queryKey to set data
          const q = (query as Query).queryKey ?? ['notifications'];
          queryClient.setQueryData(q, newData);
        } catch (e) {
          // ignore per-query failures
          console.warn('Failed to update one notifications cache entry', e);
        }
      });

      // also add to redux store for immediate UI update
      try {
        const normalizedGlobal = { ...notification, isRead: notification.isRead ?? false };
        dispatch(addNotification(normalizedGlobal));
      } catch (e) {
        console.warn('Failed to dispatch notification to redux', e);
      }

      // After updating caches, increment local unread counter if the incoming notification is unread
      const normalizedGlobal = { ...notification, isRead: notification.isRead ?? false };
      if (!normalizedGlobal.isRead) {
        setUnreadLocal((v) => v + 1);
      }

      // Also trigger a background refetch to ensure server state is in-sync
      // Invalidate all notifications queries to force React Query to refetch and update any components
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      // Keep refetch for the local query as well
      refetch();
    } catch (err) {
      console.error('Error handling new notification:', err);
      // fallback to refetch
      refetch();
    }
  }, [queryClient, refetch]);

  // Setup WebSocket to receive real-time notifications
  useNotificationWebSocket({
    accountId,
    onNotificationReceived: handleNewNotification,
  });

  // Keep Redux notification list in sync with query results
  useEffect(() => {
    if (notificationsData?.content) {
      dispatch(setNotifications(notificationsData.content));
    }
  }, [notificationsData, dispatch]);

  // Read unread count from Redux so the bell updates immediately
  const unreadCount = useSelector((state: RootState) => state.notification.unreadCount);

  if (!accountId) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[560px] max-w-[calc(100vw-2rem)] p-0" align="end">
        <NotificationList
          notifications={notificationsData?.content || []}
          accountId={accountId || undefined}
          onClose={() => setIsOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}
