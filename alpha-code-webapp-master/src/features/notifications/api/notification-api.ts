import { Notification } from '@/types/notification';
import { usersHttp } from '@/utils/http';

// ✅ Backend response format
export interface BackendPagedResponse {
  data: Notification[];
  page: number;
  total_count: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

// ✅ Frontend format (transform để dễ sử dụng)
export interface PagedNotifications {
  content: Notification[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// GET /api/v1/notifications - Get all notifications with pagination
export const getNotifications = async (params: {
  page?: number;
  size?: number;
  accountId?: string;
  status?: number;
}): Promise<PagedNotifications> => {
  const response = await usersHttp.get<BackendPagedResponse>('/notifications', { params });

  // ✅ Transform backend response to frontend format
  return {
    content: response.data.data || [],
    totalPages: response.data.total_pages || 0,
    totalElements: response.data.total_count || 0,
    size: response.data.per_page || 20,
    number: response.data.page || 1,
  };
};

// GET /api/v1/notifications/{id} - Get notification by id
export const getNotificationById = async (id: string): Promise<Notification> => {
  const response = await usersHttp.get<Notification>(`/notifications/${id}`);
  return response.data;
};

// PATCH /api/v1/notifications/{id}/read - Mark notification as read
export const markNotificationAsRead = async (id: string): Promise<Notification> => {
  const response = await usersHttp.patch<Notification>(`/notifications/${id}/read`);
  return response.data;
};

// PATCH /api/v1/notifications/read-all - Mark all notifications as read
export const markAllNotificationsAsRead = async (
  accountId: string
): Promise<{ message: string; count: number }> => {
  const response = await usersHttp.patch<{ message: string; count: number }>(
    `/notifications/read-all`,
    null, // body là null
    { params: { accountId } } // query param
  );
  return response.data;
};


// DELETE /api/v1/notifications/{id} - Delete notification
export const deleteNotification = async (id: string): Promise<{ message: string }> => {
  const response = await usersHttp.delete<{ message: string }>(`/notifications/${id}`);
  return response.data;
};
