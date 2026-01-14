import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import * as categoryApi from '@/features/courses/api/category-api'
import type { PagedResult } from '@/types/page-result'
import type { Category } from '@/types/courses'


export function useGetAllCategories(params?: {
  page?: number
  size?: number
  search?: string
}): ReturnType<typeof useQuery<PagedResult<Category>>> {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: ({ signal }) => categoryApi.getCategories(
      params?.page || 1,
      params?.size || 20,
      params?.search,
      signal
    ),
  })
}
// ==================== CATEGORY HOOKS ====================

export function useNoneDeleteCategories(params?: {
  page?: number
  size?: number
  search?: string
}): ReturnType<typeof useQuery<PagedResult<Category>>> {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: ({ signal }) => categoryApi.getNoneDeleteCategories(
      params?.page || 1,
      params?.size || 20,
      params?.search,
      signal
    ),
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: ({ signal }) => categoryApi.getCategoryById(id, signal),
    enabled: !!id,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: { name: string; description: string; image: File }) =>
      categoryApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      router.push('/staff/categories')
    },
  })
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FormData) =>
      categoryApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category', id] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
