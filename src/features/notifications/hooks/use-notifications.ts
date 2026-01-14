import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getNotifications, 
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification 
} from '../api/notification-api';
import { toast } from 'sonner';
import { Notification } from '@/types/notification';
import { PagedNotifications } from '../api/notification-api';

// Hook to get notifications with pagination
export const useNotifications = (params: {
  page?: number;
  size?: number;
  accountId?: string;
  status?: number;
}) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => getNotifications(params),
    enabled: !!params.accountId,
  });
};

// Hook to mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    // Optimistic update: mark the notification as read in all cached 'notifications' queries
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      queryClient.setQueriesData<PagedNotifications | undefined>({ queryKey: ['notifications'] }, (old) => {
        if (!old) return old;
        try {
          return {
            ...old,
            content: old.content.map((n: Notification) => (n.id === id ? { ...n, isRead: true } : n)),
          };
        } catch (e) {
          return old;
        }
      });

      // no manual rollback stored; on error we will invalidate queries to sync with server
    },
    onError: (err) => {
      const errorMessage =
        err && typeof err === 'object' && 'message' in err
          ? (err as { message: string }).message
          : 'Không thể đánh dấu đã đọc';
      toast.error(errorMessage);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onSettled: () => {
      // ensure we have latest server state
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Hook to mark all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (accountId: string) => markAllNotificationsAsRead(accountId),
    onMutate: async (accountId: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      queryClient.setQueriesData<PagedNotifications | undefined>({ queryKey: ['notifications'] }, (old) => {
        if (!old) return old;
        try {
          return {
            ...old,
            content: old.content.map((n: Notification) => ({ ...n, isRead: true })),
          };
        } catch (e) {
          return old;
        }
      });

      // no manual rollback stored; on error we will invalidate queries to sync with server
    },
    onSuccess: (data) => {
      toast.success(`Đã đánh dấu ${data.count} thông báo là đã đọc`);
    },
    onError: (err) => {
      const errorMessage =
        err && typeof err === 'object' && 'message' in err
          ? (err as { message: string }).message
          : 'Không thể đánh dấu tất cả đã đọc';
      toast.error(errorMessage);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Hook to delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      toast.success('Đã xóa thông báo');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : 'Không thể xóa thông báo';
      toast.error(errorMessage);
    },
  });
};
