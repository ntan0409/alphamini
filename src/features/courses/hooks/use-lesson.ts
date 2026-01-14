import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import * as lessonApi from '@/features/courses/api/lesson-api'

// ==================== LESSON HOOKS ====================
export function useLessonsBySection( sectionId: string, params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: ['lessons', 'section', sectionId, params],
    queryFn: ({ signal }) => lessonApi.getLessonsBySectionId(sectionId, params, signal),
    enabled: !!sectionId,
  });
}

export function useLessonsSolutionBySection(courseId: string, sectionId: string) {
  return useQuery({
    queryKey: ['lessons', 'section', sectionId],
    queryFn: ({ signal }) => lessonApi.getLessonsSolutionBySectionId(courseId, sectionId, signal),
    enabled: !!courseId && !!sectionId,
  })
}

export function useAllLessons(params?: {
  page?: number
  size?: number
  courseId?: string
  sectionId?: string
  type?: number
  search?: string
}) {
  return useQuery({
    queryKey: ['lessons', 'all', params],
    queryFn: ({ signal }) => lessonApi.getAllLessons(params, signal),
  })
}

export function useLessonById(lessonId: string) {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: ({ signal }) => lessonApi.getLessonById(lessonId, signal),
    enabled: !!lessonId,
  })
}

export function useLessonBySlug(slug: string) {
  return useQuery({
    queryKey: ['lesson', 'slug', slug],
    queryFn: ({ signal }) => lessonApi.getLessonBySlug(slug, signal),
    enabled: !!slug,
  })
}

export function useCreateLesson(courseId: string, sectionId: string, courseSlug?: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: {
      title: string
      content: string
      videoUrl?: string | null
      duration: number
      requireRobot: boolean
      type: number
      solution?: object
    }) => lessonApi.createLesson(sectionId, data),
    onSuccess: async () => {
      // Invalidate queries - the target page will refetch them automatically
      await queryClient.invalidateQueries({ 
        queryKey: ['lessons', courseId]
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['sections', courseId]
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['staff', 'course']
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['course']
      })
      
      // Navigate - the course detail page will refetch invalidated queries
      if (courseSlug) {
        router.push(`/staff/courses/${courseSlug}`)
      } else {
        router.push(`/staff/courses/${courseId}`)
      }
    },
  })
}

export function useUpdateLesson(courseId: string, lessonId: string, sectionId?: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: {
      id: string
      title: string
      content: string
      videoUrl?: string | null
      duration: number
      requireRobot: boolean
      type: number
      orderNumber: number
      sectionId?: string
      solution?: object | null | undefined
      status: number
    }) => lessonApi.updateLesson(lessonId, data),
    onSuccess: async () => {
      // Invalidate queries to refresh data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['lessons'] }),
        queryClient.invalidateQueries({ queryKey: ['lesson'] }),
        queryClient.invalidateQueries({ queryKey: ['sections'] }),
        queryClient.invalidateQueries({ queryKey: ['staff', 'course'] }),
        queryClient.invalidateQueries({ queryKey: ['course'] })
      ])
      
      // Navigate back to previous page for better UX
      router.back()
    },
  })
}

export function useDeleteLesson(courseId: string, sectionId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lessonId: string) => lessonApi.deleteLesson(lessonId),
    onSuccess: async () => {
      // Invalidate all lessons queries for this course
      await queryClient.invalidateQueries({ 
        queryKey: ['lessons', courseId],
        refetchType: 'active'
      })
      if (sectionId) {
        await queryClient.invalidateQueries({ 
          queryKey: ['lessons', 'section', sectionId],
          refetchType: 'active'
        })
      }
      await queryClient.invalidateQueries({ 
        queryKey: ['sections', courseId],
        refetchType: 'active'
      })
      // Invalidate all course queries (both by ID and slug)
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

export function useUpdateLessonOrder(courseId: string, sectionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lessons: Array<{ id: string; orderNumber: number; sectionId: string }>) =>
      lessonApi.updateLessonOrder(sectionId, lessons),
    onSuccess: async () => {
      // Invalidate all lessons queries for this course and wait for refetch
      await queryClient.invalidateQueries({ 
        queryKey: ['lessons', courseId],
        refetchType: 'active'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['lessons', 'section', sectionId],
        refetchType: 'active'
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['sections', courseId],
        refetchType: 'active'
      })
      // Invalidate all course queries (both by ID and slug)
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
