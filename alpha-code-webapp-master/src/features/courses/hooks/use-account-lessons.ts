import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AccountLesson } from '@/types/account-lessons'
import * as accountLessonsApi from '@/features/courses/api/account-lessons-api'

const STALE_TIME = 24 * 3600 * 1000

export const useGetAccountLessons = (courseId?: string, accountId?: string) => {
  return useQuery<AccountLesson[] | null>({
    queryKey: ['account-lessons', courseId, accountId],
    queryFn: ({ signal }) => accountLessonsApi.getAccountLessons(courseId, accountId, signal),
    enabled: !!courseId && !!accountId,
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  })
}

export const useGetAccountLessonById = (id?: string) => {
  return useQuery<AccountLesson | undefined>({
    queryKey: ['account-lesson', id],
    queryFn: ({ signal }) => accountLessonsApi.getAccountLessonById(id || '', signal),
    enabled: !!id,
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  })
}

export function useCreateAccountLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<AccountLesson>) => accountLessonsApi.createAccountLesson(data),
    onSuccess: () => {
      // Invalidate account lessons queries
      queryClient.invalidateQueries({ queryKey: ['account-lessons'] })
      queryClient.invalidateQueries({ queryKey: ['account-lesson'] })
      // Invalidate section queries that include account lessons
      queryClient.invalidateQueries({ queryKey: ['section-by-account-and-slug'] })
      queryClient.invalidateQueries({ queryKey: ['section-by-account-and-course'] })
    },
  })
}

export function useMarkAccountLessonComplete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (accountLessonId: string) => accountLessonsApi.markAccountLessonComplete(accountLessonId),
    onSuccess: () => {
      // Invalidate account lessons queries
      queryClient.invalidateQueries({ queryKey: ['account-lessons'] })
      queryClient.invalidateQueries({ queryKey: ['account-lesson'] })
      // Invalidate section queries that include account lessons
      queryClient.invalidateQueries({ queryKey: ['section-by-account-and-slug'] })
      queryClient.invalidateQueries({ queryKey: ['section-by-account-and-course'] })
    },
  })
}

const accountLessonsHooks = {
  useGetAccountLessons,
  useGetAccountLessonById,
  useCreateAccountLesson,
  useMarkAccountLessonComplete,
}

export default accountLessonsHooks
