export type AccountCourse = {
    id: string
    name: string
    accountId: string
    completed: boolean
    completedLesson: number
    courseId: string
    imageUrl?: string
    lastAccessed?: string
    progressPercent: number
    purchaseDate: string
    slug: string
    status: number
    statusText: string
    totalLesson: number
}