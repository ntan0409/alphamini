import { Submission } from '@/types/submission'
import { coursesHttp } from '@/utils/http'
import { PagedResult } from '@/types/page-result'

// Create a new submission
export const createSubmission = async (data: {
  accountLessonId: string
  logData?: string
  videoUrl?: string
  status?: number
}) => {
  try {
    const response = await coursesHttp.post<Submission>('/submissions', data)
    return response.data
  } catch (error) {
    console.error('API Error in createSubmission:', error)
    throw error
  }
}

// Get newest submission by account lesson ID
export const getNewestSubmissionByAccountLessonId = async (
  accountLessonId: string,
  signal?: AbortSignal
) => {
  try {
    const response = await coursesHttp.get<Submission>(
      `/submissions/by-account-lesson-id/${accountLessonId}`,
      { signal }
    )
    return response.data
  } catch (error) {
    console.error('API Error in getNewestSubmissionByAccountLessonId:', error)
    throw error
  }
}

// Staff review a submission
export const reviewSubmission = async (
  submissionId: string,
  data: {
    approved?: boolean
    comment?: string
  }
) => {
  try {
    // Backend expects { approved: boolean, comment?: string }
    const response = await coursesHttp.put<Submission>(
      `/submissions/${submissionId}/review`,
      data
    )
    return response.data
  } catch (error) {
    console.error('API Error in reviewSubmission:', error)
    throw error
  }
}

// Presign upload for S3 (for student submissions)
export const presignSubmissionUpload = async (params: {
  filename: string
  contentType?: string
  folder?: string
  expiresInSeconds?: number
}, signal?: AbortSignal) => {
  try {
    const response = await coursesHttp.get<{
      key: string
      uploadUrl: string
      publicUrl: string
      expiresInSeconds: number
    }>(`/submissions/presign`, {
      params: {
        filename: params.filename,
        contentType: params.contentType || 'video/mp4',
        folder: params.folder || 'submissions',
        expiresInSeconds: params.expiresInSeconds || 900,
      },
      signal,
    })
    return response.data
  } catch (error) {
    console.error('API Error in presignSubmissionUpload:', error)
    throw error
  }
}
