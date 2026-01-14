import { coursesHttp } from '@/utils/http'
import { PagedStaffSubmissions, StaffSubmissionDetail } from '@/types/staff-submission'

// GET /submissions/unreviewed?page=1&size=10
export const getUnReviewedSubmissions = async (page = 1, size = 10): Promise<PagedStaffSubmissions> => {
  const response = await coursesHttp.get('/submissions/unreviewed', { params: { page, size } })
  return response.data
}

// GET /submissions/failed?page=1&size=10
export const getFailedSubmissions = async (page = 1, size = 10): Promise<PagedStaffSubmissions> => {
  const response = await coursesHttp.get('/submissions/failed', { params: { page, size } })
  return response.data
}

// GET /submissions/detail/{submissionId}
export const getSubmissionDetail = async (submissionId: string): Promise<StaffSubmissionDetail> => {
  const response = await coursesHttp.get(`/submissions/detail/${submissionId}`)
  return response.data
}
