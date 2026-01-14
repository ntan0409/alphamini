import { AccountCourse } from "@/types/account-course";
import { BookOpen, Clock, TrendingUp } from "lucide-react";
import CourseCard from '@/components/parent/course/course-card'

interface CourseGridProps {
    courses: AccountCourse[]
    showProgress?: boolean
    progressData?: Record<string, number>, // courseId -> progress percentage
    onCourseChosen: (c: AccountCourse) => void
}

export function CourseGrid({ courses, showProgress = false, progressData = {}, onCourseChosen }: CourseGridProps) {
    if (courses.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg text-muted-foreground">Không có khóa học nào phù hợp</p>
            </div>
        )
    }

    return (
        <div className="space-y-4 mb-8">
            {courses.map((course) => {
                const progress = progressData[course.id] || 0

                return (
                    <div key={course.id}>
                        <CourseCard
                            course={course}
                            variant="list"
                            basePath="/courses"
                            onSelect={() => onCourseChosen(course)}
                        />
                    </div>
                )
            })}
        </div>
    )
}