"use client";

import React from "react";
import { Notification } from "@/types/notification";
import { useMarkNotificationAsRead, useDeleteNotification } from "@/features/notifications/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const markAsRead = useMarkNotificationAsRead();
  const deleteNotif = useDeleteNotification();

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }
    // You can add navigation logic here if needed
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotif.mutate(notification.id);
  };

  const isUnread = !notification.isRead;

  return (
    <div
      onClick={handleClick}
      className={`relative w-full p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
        isUnread ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3 w-full">
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            {isUnread && (
              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
            )}
            <h4 className="font-semibold text-gray-900 text-sm truncate">
              {notification.title}
            </h4>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2 break-words break-all whitespace-normal">
            {notification.message}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(notification.createdDate), {
                addSuffix: true,
                locale: vi,
              })}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {notification.typeText}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="h-8 w-8 absolute right-3 top-4 text-gray-400 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
