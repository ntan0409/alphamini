import { useQuery } from '@tanstack/react-query'
import { getFailedSubmissions, getUnReviewedSubmissions } from '../api/staff-submission-api'
import { StaffSubmissionListItem } from '@/types/staff-submission'

// Fetch and combine unreviewed + failed submissions to provide a simple array the UI can use
export const useVideoSubmissions = (page = 1, size = 100) => {
  return useQuery<StaffSubmissionListItem[]>({
    queryKey: ['video-submissions', page, size],
    queryFn: async () => {
      // Fetch both lists and merge (dedupe by id)
      const [unreviewedPaged, failedPaged] = await Promise.all([
        getUnReviewedSubmissions(page, size),
        getFailedSubmissions(page, size),
      ])

  const combined = [...(unreviewedPaged.data || []), ...(failedPaged.data || [])]

      // reduce to unique by id
      const map = new Map<string, StaffSubmissionListItem>()
      for (const item of combined) {
        map.set(item.id, item)
      }

      return Array.from(map.values())
    },
    staleTime: 1000 * 60, // 1 minute
  })
}

export default useVideoSubmissions
