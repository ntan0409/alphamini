"use client";

import React from "react";
import Image from "next/image";
import { CheckCheck } from "lucide-react";
import { Notification } from "@/types/notification";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "./notification-item";
import { useMarkAllNotificationsAsRead } from "@/features/notifications/hooks/use-notifications";

interface NotificationListProps {
  notifications: Notification[];
  accountId?: string;
  onClose: () => void;
}

export function NotificationList({ notifications, accountId, onClose }: NotificationListProps) {
  const markAllAsRead = useMarkAllNotificationsAsRead();
  
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    if (accountId && unreadCount > 0) {
      markAllAsRead.mutate(accountId);
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <Image
          src="/ic_msg_default.webp"
          alt="No notifications"
          width={120}
          height={120}
          className="mb-4 opacity-50"
        />
        <p className="text-sm text-gray-500">Bạn chưa có thông báo nào</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Thông báo</h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsRead.isPending}
            className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <CheckCheck className="w-4 h-4 mr-1" />
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>
      <ScrollArea className="h-[400px]">
        <div className="divide-y divide-gray-100">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={onClose}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
