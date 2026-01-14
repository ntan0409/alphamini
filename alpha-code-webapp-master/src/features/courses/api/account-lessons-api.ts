import { AccountLesson } from '@/types/account-lessons'
import { PagedResult } from '@/types/page-result'
import { coursesHttp } from '@/utils/http'

// Get account lessons by courseId and accountId (returns array with duration/title)
export const getAccountLessons = async (courseId?: string, accountId?: string, signal?: AbortSignal) => {
  try {
    const params: Record<string, string> = {}
    if (courseId) params.courseId = courseId
    if (accountId) params.accountId = accountId

    const response = await coursesHttp.get<AccountLesson[]>(`/account-lessons`, {
      params,
      signal,
    })

    return response.data
  } catch (error) {
    console.error('API Error in getAccountLessons:', error)
    throw error
  }
}

// Create an account lesson (assign lesson progress to account)
export const createAccountLesson = async (data: Partial<AccountLesson>) => {
  try {
    const response = await coursesHttp.post<AccountLesson>('/account-lessons', data)
    return response.data
  } catch (error) {
    console.error('API Error in createAccountLesson:', error)
    throw error
  }
}

// Mark account lesson as complete
export const markAccountLessonComplete = async (accountLessonId: string) => {
  try {
    const response = await coursesHttp.post(`/account-lessons/mark-complete/${accountLessonId}`)
    return response.data
  } catch (error) {
    console.error('API Error in markAccountLessonComplete:', error)
    throw error
  }
}

// Get account lesson by id
export const getAccountLessonById = async (id: string, signal?: AbortSignal) => {
  try {
    const response = await coursesHttp.get<AccountLesson>(`/account-lessons/${id}`, { signal })
    return response.data
  } catch (error) {
    console.error('API Error in getAccountLessonById:', error)
    throw error
  }
}
