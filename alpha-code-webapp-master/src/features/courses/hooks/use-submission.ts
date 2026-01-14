import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as submissionApi from '@/features/courses/api/submission-api'

// ==================== SUBMISSION HOOKS ====================

// Get newest submission by account lesson ID
export function useNewestSubmission(accountLessonId: string) {
  return useQuery({
    queryKey: ['submission', 'newest', accountLessonId],
    queryFn: ({ signal }) => 
      submissionApi.getNewestSubmissionByAccountLessonId(accountLessonId, signal),
    enabled: !!accountLessonId,
    retry: false, // Don't retry on 404/400 errors (submission might not exist yet)
    throwOnError: false, // Don't throw error, just return undefined
  })
}

// Create a new submission
export function useCreateSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      accountLessonId: string
      logData?: string
      videoUrl?: string
      status?: number
    }) => submissionApi.createSubmission(data),
    onSuccess: (data) => {
      // Invalidate the newest submission query for this account lesson
      queryClient.invalidateQueries({
        queryKey: ['submission', 'newest', data.accountLessonId],
      })
      
      // Invalidate account lesson queries as submission might affect lesson progress
      queryClient.invalidateQueries({
        queryKey: ['account-lesson', data.accountLessonId],
      })
    },
  })
}

// Review a submission (staff only)
export function useReviewSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      submissionId,
      data,
    }: {
      submissionId: string
      data: {
        approved?: boolean
        comment?: string
      }
    }) => submissionApi.reviewSubmission(submissionId, data),
    onSuccess: (data) => {
      // Invalidate the specific submission query
      queryClient.invalidateQueries({
        queryKey: ['submission', 'newest', data.accountLessonId],
      })
      
      // Invalidate account lesson queries
      queryClient.invalidateQueries({
        queryKey: ['account-lesson', data.accountLessonId],
      })
    },
  })
}
