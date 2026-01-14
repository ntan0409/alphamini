import { AccountLesson } from "./account-lessons"

export type SectionwithLessons = {
    id: string
    courseId: string
    createdDate?: string
    lastUpdated?: string
    orderNumber: number
    status: number
    statusText?: string
    title: string
    accountLessons: AccountLesson[]
}