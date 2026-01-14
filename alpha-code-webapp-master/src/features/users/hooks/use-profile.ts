import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getUserprofile, 
  updateUserProfile, 
  createUserProfile, 
  deleteUserProfile,
  getProfileByAccountId,
  getProfileById
} from '@/features/users/api/profile-api';
import { toast } from 'sonner';

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserprofile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProfileByAccountId = (accountId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['profile', 'account', accountId],
    queryFn: () => getProfileByAccountId(accountId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: options?.enabled !== false && !!accountId,
  });
};

export const useProfileById = (profileId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['profile', 'id', profileId],
    queryFn: () => getProfileById(profileId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: options?.enabled !== false && !!profileId, // Only fetch when enabled and profileId exists
  });
};

export const useUpdateUserProfile = (options?: { showToast?: boolean }) => {
  const queryClient = useQueryClient();
  const showToast = options?.showToast ?? true;

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      if (showToast) {
        toast.success('Profile updated successfully!');
      }
    },
    onError: (error: unknown) => {
      if (showToast) {
        const errorMessage = error && typeof error === 'object' && 'message' in error 
          ? (error as { message: string }).message 
          : 'Failed to update profile';
        toast.error(errorMessage);
      }
    },
  });
};

export const useCreateUserProfile = (options?: { showToast?: boolean }) => {
  const queryClient = useQueryClient();
  const showToast = options?.showToast ?? true;

  return useMutation({
    mutationFn: createUserProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      if (showToast) {
        toast.success('Profile created successfully!');
      }
    },
    onError: (error: unknown) => {
      if (showToast) {
        const errorMessage = error && typeof error === 'object' && 'message' in error 
          ? (error as { message: string }).message 
          : 'Failed to create profile';
        toast.error(errorMessage);
      }
    },
  });
};

export const useDeleteUserProfile = (options?: { showToast?: boolean }) => {
  const queryClient = useQueryClient();
  const showToast = options?.showToast ?? true;

  return useMutation({
    mutationFn: deleteUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      if (showToast) {
        toast.success('Profile deleted successfully!');
      }
    },
    onError: (error: unknown) => {
      if (showToast) {
        const errorMessage = error && typeof error === 'object' && 'message' in error 
          ? (error as { message: string }).message 
          : 'Failed to delete profile';
        toast.error(errorMessage);
      }
    },
  });
};


