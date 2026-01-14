import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewSubmission } from '@/features/courses/api/submission-api'

export const useGradeSubmission = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { submissionId: string; approved: boolean; comment?: string }) => {
      const { submissionId, approved, comment } = payload
      return reviewSubmission(submissionId, { approved, comment })
    },
    onSuccess: () => {
      // invalidate relevant queries so UI updates
      qc.invalidateQueries({ queryKey: ['video-submissions'] })
      qc.invalidateQueries({ queryKey: ['staff-submissions', 'unreviewed'] })
      qc.invalidateQueries({ queryKey: ['staff-submissions', 'failed'] })
    },
  })
}

export default useGradeSubmission
