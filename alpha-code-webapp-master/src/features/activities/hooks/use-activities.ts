import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllActivities, 
  getPagedActivitiesByAccount, 
  getActivityById, 
  createActivity, 
  updateActivity, 
  deleteActivity 
} from '@/features/activities/api/activities-api';
import { Activity } from '@/types/activities';
import { toast } from 'sonner';

export const useActivities = (
  page: number = 1,
  size: number = 10,
  accountId: string,
  search?: string,
  robotModelId?: string // 👈 thêm tham số
) => {
  return useQuery({
    queryKey: ['activities', page, size, search || '', robotModelId, accountId], // 👈 thêm vào queryKey để cache theo model
    queryFn: ({ signal }) => getPagedActivitiesByAccount(page, size, accountId, search, signal, robotModelId), // 👈 truyền vào đây
    // only enable the query when an accountId is provided to avoid invalid backend calls
    enabled: !!accountId,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: (failureCount, error: unknown) => {
      if (error && typeof error === 'object') {
        const errorObj = error as { name?: string; code?: string };
        if (errorObj.name === 'CanceledError' || errorObj.code === 'ERR_CANCELED') {
          return false;
        }
      }
      return failureCount < 3;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useAllActivities = () => {
  return useQuery({
    queryKey: ['activities', 'all'],
    queryFn: getAllActivities,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useActivity = (id: string) => {
  return useQuery({
    queryKey: ['activities', id],
    queryFn: () => getActivityById(id),
    enabled: !!id,
  });
};

export const useCreateActivity = (options?: { showToast?: boolean }) => {
  const queryClient = useQueryClient();
  const showToast = options?.showToast ?? true;

  return useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      if (showToast) {
        toast.success('Activity created successfully!');
      }
    },
    onError: (error: unknown) => {
      if (showToast) {
        const errorMessage = error && typeof error === 'object' && 'message' in error 
          ? (error as { message: string }).message 
          : 'Failed to create activity';
        toast.error(errorMessage);
      }
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Activity> }) => 
      updateActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Chỉnh sửa hoạt động thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as { message: string }).message 
        : 'Failed to update activity';
      toast.error(errorMessage);
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Xóa hoạt động thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as { message: string }).message 
        : 'Failed to delete activity';
      toast.error(errorMessage);
    },
  });
};