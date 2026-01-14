import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createTokenRule, deleteTokenRule, getTokenRules, getTokenRuleById, updateTokenRule, patchTokenRule } from '../api/token-rule-api';
import { CreateTokenRuleRequest, PatchTokenRuleRequest, UpdateTokenRuleRequest } from '@/types/pricing';

// Get paginated token rules (cho các dịch vụ trong hệ thống)
export const useGetTokenRules = (page: number, limit: number, search?: string) => {
  return useQuery({
    queryKey: ['token-rules', page, limit, search],
    queryFn: () => getTokenRules(page, limit, search),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get single token rule by ID
export const useGetTokenRuleById = (id: string) => {
  return useQuery({
    queryKey: ['token-rules', id],
    queryFn: () => getTokenRuleById(id),
    enabled: !!id,
  });
};

// Tạo mới token rule
export const useCreateTokenRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTokenRuleRequest) => createTokenRule(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['token-rules'] });
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create token rule');
    },
  });
};

// Cập nhật token rule
export const useUpdateTokenRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTokenRuleRequest) => updateTokenRule(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['token-rules'] });
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update token rule');
    },
  });
};

// Xóa token rule
export const useDeleteTokenRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTokenRule(id),

    onSuccess: () => {
      toast.success('Token rule deleted');
      queryClient.invalidateQueries({ queryKey: ['token-rules'] });
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete token rule');
    },
  });
};