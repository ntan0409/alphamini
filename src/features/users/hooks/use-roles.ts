import { useQuery } from '@tanstack/react-query'
import { getRoles, getRoleById } from '@/features/users/api/role-api'

// Query keys
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
}

// Hook để lấy danh sách roles
export const useRoles = () => {
  return useQuery({
    queryKey: roleKeys.lists(),
    queryFn: async () => {
      try {
        const data = await getRoles();
        // Handle both direct array and paged result
        return Array.isArray(data) ? data : data?.data || [];
      } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 phút
    retry: 2
  })
}

// Hook để lấy role theo ID
export const useRole = (id: string, enabled = true) => {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => getRoleById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000,
    retry: 2
  })
}
