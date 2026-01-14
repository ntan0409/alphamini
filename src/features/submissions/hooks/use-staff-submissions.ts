import { useQuery } from '@tanstack/react-query'
import {  getFailedSubmissions, getSubmissionDetail, getUnReviewedSubmissions } from '../api/staff-submission-api'
import { PagedStaffSubmissions, StaffSubmissionDetail } from '@/types/staff-submission'

export const useUnReviewedSubmissions = (page = 1, size = 10) => {
  return useQuery<PagedStaffSubmissions>({
    queryKey: ['staff-submissions', 'unreviewed', page, size],
    queryFn: () => getUnReviewedSubmissions(page, size),
  })
}

export const useFailedSubmissions = (page = 1, size = 10) => {
  return useQuery<PagedStaffSubmissions>({
    queryKey: ['staff-submissions', 'failed', page, size],
    queryFn: () => getFailedSubmissions(page, size),
  })
}

export const useSubmissionDetail = (submissionId?: string) => {
  return useQuery<StaffSubmissionDetail>({
    queryKey: ['staff-submissions', 'detail', submissionId],
    queryFn: () => getSubmissionDetail(submissionId || ''),
    enabled: !!submissionId,
  })
}
