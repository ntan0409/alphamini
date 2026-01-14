import { PagedResult } from '@/types/page-result'

export interface StaffSubmissionListItem {
  id: string
  accountLessonId?: string
  accountId: string
  accountName?: string | null
  lessonId?: string
  lessonTitle?: string | null
  videoUrl?: string | null
  status: number
  statusText?: string | null
  createdDate: string
  lastUpdated?: string | null
}

export interface StaffSubmissionDetail {
  id: string
  accountLessonId?: string
  accountId: string
  accountName?: string | null
  lessonId?: string
  lessonTitle?: string | null
  videoUrl?: string | null
  logData?: string | null
  status: number
  statusText?: string | null
  staffComment?: string | null
  missingActions?: string | null
  createdDate: string
  lastUpdated?: string | null
}

// Use the shared paged result shape across the app
export type PagedStaffSubmissions = PagedResult<StaffSubmissionListItem>

export interface StaffSubmissionListItem {
  id: string
  accountLessonId?: string
  accountId: string
  accountName?: string | null
  lessonId?: string
  lessonTitle?: string | null
  videoUrl?: string | null
  status: number
  statusText?: string | null
  createdDate: string
  lastUpdated?: string | null
}

export interface StaffSubmissionDetail {
  id: string
  accountLessonId?: string
  accountId: string
  accountName?: string | null
  lessonId?: string
  lessonTitle?: string | null
  videoUrl?: string | null
  logData?: string | null
  status: number
  statusText?: string | null
  staffComment?: string | null
  missingActions?: string | null
  createdDate: string
  lastUpdated?: string | null
}
