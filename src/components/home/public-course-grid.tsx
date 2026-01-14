"use client"
import { cn } from "@/lib/utils";
import { Course, mapDifficulty, formatTimespan, formatPrice } from "@/types/courses";
import { useRouter } from 'next/navigation'
import React from 'react'
import { getUserIdFromToken } from '@/utils/tokenUtils'
import { getAccountCourseByCourseAndAccount } from '@/features/courses/api/account-course-api'
import { getUserRoleFromToken } from '@/utils/tokenUtils'

interface PublicCourseGridProps {
    courses: Course[];
}

interface PublicCourseCardProps {
    course: Course;
}

function PublicCourseCard({ course }: PublicCourseCardProps) {
    const router = useRouter()

    const handleCourseClick = async () => {
        const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') || '' : ''
        const accountId = accessToken ? getUserIdFromToken(accessToken) : null
        const roleName = accessToken ? (getUserRoleFromToken(accessToken) || '').toLowerCase() : ''

        const roleBasePath = roleName === 'children' || roleName.includes('child') ? '/children/courses' : '/parent/courses'

        // If not logged in -> go to public course detail page
        if (!accountId) {
            router.push(`/course/${course.slug}`)
            return
        }

        try {
            const accountCourse = await getAccountCourseByCourseAndAccount(course.id, accountId)

            if (accountCourse) {
                // Already enrolled/purchased -> go to learning page under role-specific base
                router.push(`${roleBasePath}/learning/${course.slug}`)
            } else {
                // Not enrolled -> go to role-specific course detail if logged in, otherwise public detail
                if (accountId) router.push(`${roleBasePath}/${course.slug}`)
                else router.push(`/course/${course.slug}`)
            }
        } catch (error) {
            console.error('Error checking enrollment:', error)
            // On error, go to public course detail page (safe fallback)
            router.push(`/course/${course.slug}`)
        }
    }

    const diff = mapDifficulty(course.level)

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleCourseClick}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCourseClick() }}
            className="group bg-white shadow-sm rounded-xl overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200 hover:border-blue-300 cursor-pointer relative"
        >
            <div className="relative overflow-hidden">
                {course.imageUrl ? (
                    <img
                        src={course.imageUrl}
                        alt={course.name}
                        className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className={cn(
                        "w-full h-40 md:h-48 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600",
                    )}>
                        <span className="text-lg md:text-xl font-semibold text-white text-center px-4">
                            {course.name}
                        </span>
                    </div>
                )}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                    <span className={cn("text-xs md:text-sm font-bold", diff.color)}>
                        {diff.text}
                    </span>
                </div>
            </div>

            <div className="flex-grow p-4 md:p-5">
                <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.name}
                </h3>
                <div className="flex items-center justify-between text-xs md:text-sm text-slate-600 bg-slate-50 rounded-lg p-2">
                    <span className="flex items-center gap-1 font-medium">📚 {course.totalLessons} bài</span>
                    <span className="flex items-center gap-1 font-medium">⏱️ {formatTimespan(course.totalDuration)}</span>
                </div>
            </div>
                    
            <div className="px-4 md:px-5 pb-4 md:pb-5">
                <div className="flex bg-blue-50 rounded-lg p-3 border border-slate-200 text-xl font-bold text-blue-600 justify-center">
                    {course.price === 0 ? "Miễn phí" : formatPrice(course.price)}
                </div>
            </div>
        </div>
    )
}

export function PublicCourseGrid({ courses }: PublicCourseGridProps) {
    if (courses.length === 0) {
        return <div className="text-center py-12 text-slate-600">Không có khóa học nào phù hợp</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
            {courses.map(course => (
                <PublicCourseCard key={course.id} course={course} />
            ))}
        </div>
    );
}
