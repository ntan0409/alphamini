export type Submission = {
    id: string 
    accountLessonId: string
    logData: string
    videoUrl: string
    status: number
    statusText: string
    staffComment?: string | null
    missingActions?: string | null
    createdDate: string
    lastUpdated: string
}