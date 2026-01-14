import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import * as sectionApi from '@/features/courses/api/section-api'

// ==================== SECTION HOOKS ====================

export function useSections(courseId: string) {
  return useQuery({
    queryKey: ['sections', courseId],
    queryFn: ({ signal }) => sectionApi.getSectionsByCourseId(courseId, signal),
    enabled: !!courseId,
    staleTime: 0, // Always refetch on mount to get fresh data
  })
}

export function useSection(courseId: string, sectionId: string) {
  return useQuery({
    queryKey: ['section', courseId, sectionId],
    queryFn: ({ signal }) => sectionApi.getSectionById(courseId, sectionId, signal),
    enabled: !!courseId && !!sectionId,
  })
}

export function useGetSectionByAccountIdAndCourseId(
  accountId: string,
  courseId: string
) {
  return useQuery({
    queryKey: ['section-by-account-and-course', accountId, courseId],
    queryFn: ({ signal }) =>
    sectionApi.getSectionByAccountIdAndCourseId(accountId, courseId, signal),
    enabled: !!accountId && !!courseId,
  })  
}

export function useGetSectionByAccountIdAndCourseSlug(
  accountId: string,
  slug: string
) {
  return useQuery({
    queryKey: ['section-by-account-and-slug', accountId, slug],
    queryFn: ({ signal }) =>
    sectionApi.getSectionByAccountIdAndCourseSlug(slug, accountId, signal),
    enabled: !!accountId && !!slug,
  })  
}

export function useCreateSection(courseId: string, courseSlug?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { title: string; }) =>
      sectionApi.createSection(courseId, data),
    onSuccess: async () => {
      // Invalidate all related queries
      await queryClient.invalidateQueries({ 
        queryKey: ['lessons', courseId],
        refetchType: 'active'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['sections', courseId],
        refetchType: 'active'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['sections'],
        refetchType: 'active'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['staff', 'course'],
        refetchType: 'active'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['course'],
        refetchType: 'active'
      })
    },
  })
}

export function useUpdateSection(sectionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { title: string; orderNumber: number }) =>
      sectionApi.updateSection(sectionId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ 
        queryKey: ['sections'],
        refetchType: 'active'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['section', sectionId],
        refetchType: 'active'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['staff', 'course'],
        refetchType: 'active'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['course'],
        refetchType: 'active'
      })
    },
  })
}

export function useDeleteSection(courseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sectionId: string) => sectionApi.deleteSection(sectionId),
    onSuccess: async () => {
      // Invalidate all section-related queries
      await queryClient.invalidateQueries({ 
        queryKey: ['sections'],
        refetchType: 'active'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['sections', courseId],
        refetchType: 'active'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['lessons', courseId],
        refetchType: 'active'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['staff', 'course'],
        refetchType: 'active'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['course'],
        refetchType: 'active'
      })
    },
  })
}

export function useUpdateSectionOrder(courseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sections: Array<{ id: string; orderNumber: number }>) =>
      sectionApi.updateSectionOrder(courseId, sections),
    onSuccess: async () => {
      // Invalidate all related queries and wait for refetch
      await queryClient.invalidateQueries({ 
        queryKey: ['lessons', courseId],
        refetchType: 'active'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['sections', courseId],
        refetchType: 'active'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['staff', 'course'],
        refetchType: 'active'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['course'],
        refetchType: 'active'
      })
    },
  })
}
