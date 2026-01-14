import { useQuery } from '@tanstack/react-query'
import { getSubmissionDetail } from '../api/staff-submission-api'
import { StaffSubmissionDetail } from '@/types/staff-submission'

export const useVideoSubmission = (submissionId?: string) => {
  return useQuery<StaffSubmissionDetail>({
    queryKey: ['video-submission', submissionId],
    queryFn: () => getSubmissionDetail(submissionId || ''),
    enabled: !!submissionId,
  })
}

export default useVideoSubmission
