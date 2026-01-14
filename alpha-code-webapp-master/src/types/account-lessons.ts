import { Lesson } from "./courses"

export type AccountLesson = {
    accountId: string
    id: string
    completedAt?: string // timestamp
    lessonId: string
    status: number // int4
    statusText: string
    submissionStatus?: number | null // submission status code
    submissionStatusText?: string | null // submission status text
    lesson: Lesson  
}