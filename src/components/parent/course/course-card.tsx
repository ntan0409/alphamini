"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { getUserIdFromToken } from '@/utils/tokenUtils'
import { getAccountCourseByCourseAndAccount } from '@/features/courses/api/account-course-api'
import type { Course } from '@/types/courses'
import type { AccountCourse } from '@/types/account-course'
import { cn } from '@/lib/utils'
import { BookOpen, Play } from 'lucide-react'
import { AvailableCourse } from '@/types/dashboard'

export type CourseLike = Course | AccountCourse | AvailableCourse

interface Props {
  course: CourseLike;
  variant?: 'grid' | 'list' | 'compact';
  basePath?: string;
  onSelect?: (course: CourseLike) => void;
}

export default function CourseCard({ course, variant = 'grid', basePath = '/parent/courses', onSelect }: Props) {
  const router = useRouter()
  const totalLessons = 'totalLesson' in course ? course.totalLesson : ('totalLessons' in course ? course.totalLessons : 0)
  const rawProgressPercent = 'progressPercent' in course ? course.progressPercent : undefined
  // Limit progress to maximum 100%
  const progressPercent = rawProgressPercent !== undefined ? Math.min(Math.round(rawProgressPercent), 100) : undefined
  const price = 'price' in course ? (course.price as number) : undefined

  const handleClick = async () => {
    const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') || '' : ''
    const accountId = accessToken ? getUserIdFromToken(accessToken) : null

    if (onSelect) return onSelect(course)

    if (!accountId) {
      router.push(`${basePath}/${course.slug}`)
      return
    }

    try {
      const courseIdToCheck = 'courseId' in course ? course.courseId : course.id
      const accountCourse = await getAccountCourseByCourseAndAccount(courseIdToCheck, accountId)

      if (accountCourse) {
        router.push(`${basePath}/learning/${course.slug}`)
      } else {
        router.push(`${basePath}/${course.slug}`)
      }
    } catch {
      router.push(`${basePath}/${course.slug}`)
    }
  }

  if (variant === 'compact') {
    return (
      <div className="flex gap-3 items-center">
        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
          {course.imageUrl ? (
            <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover rounded" />
          ) : (
            <BookOpen className="w-6 h-6 text-gray-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 line-clamp-2">{course.name}</h4>
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <span className="text-sm mr-5">{totalLessons} bài</span>
            {typeof progressPercent !== 'undefined' && (
              <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-semibold text-sm">
                <span className="text-xs font-medium">{progressPercent}%</span>
              </span>
            )}
          </div>
        </div>

        <button 
          onClick={handleClick} 
          className="ml-3 mr-5 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          <span className="font-medium">{progressPercent ? 'Tiếp tục' : 'Xem'}</span>
        </button>
      </div>
    )
  }

  return (
    <div 
      className={cn(
        "group bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200 hover:border-blue-300 cursor-pointer relative flex",
        variant === 'list' ? 'flex-row items-center' : 'flex-col'
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >

      <div className={cn(
        'relative overflow-hidden bg-gray-50',
        variant === 'list' ? 'w-28 h-28 flex-shrink-0' : 'h-40 md:h-48'
      )}>
        {course.imageUrl ? (
          <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl p-6 text-center">
            {course.name}
          </div>
        )}
      </div>

      <div className={cn(
        variant === 'list' ? 'p-4 pr-4 flex-1 flex flex-col justify-center' : 'p-4 pr-8 flex-1 flex flex-col'
      )}>

        <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.name}
        </h3>

          <div className={variant === 'list' ? 'space-y-0' : 'mt-auto space-y-3'}>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600 font-medium">
              <BookOpen className="w-4 h-4" />
              {totalLessons} bài
            </span>

            {typeof progressPercent !== 'undefined' ? (
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  {price === 0 ? 'Miễn phí' : price ? new Intl.NumberFormat('vi-VN').format(price) + 'đ' : ''}
                </div>

                <div className="inline-flex items-center bg-white/60 backdrop-blur-sm px-2 py-1 rounded-full border border-blue-100 shadow-sm">
                  <div className="w-28 bg-gray-100 rounded-full h-2 overflow-hidden mr-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-blue-700">{progressPercent}%</span>
                </div>
              </div>
            ) : (
              <span className="text-blue-600 font-bold text-base">
                {price === 0 ? 'Miễn phí' : price ? new Intl.NumberFormat('vi-VN').format(price) + 'đ' : ''}
              </span>
            )}
          </div>

          {/* 🎯🎯🎯 FIX VARIANT = 'list' Ở ĐÂY */}
          {variant === 'list' ? (
            <div className="flex items-center justify-between gap-4 pr-4">

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  {price === 0
                    ? 'Miễn phí'
                    : price
                      ? new Intl.NumberFormat('vi-VN').format(price) + 'đ'
                      : ''}
                </div>

                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold text-sm">
                  <span className="text-xs font-medium">{progressPercent ?? 0}%</span>
                </div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handleClick() }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-full shadow transition-all"
              >
                <Play className="w-4 h-4" />
                <span className="text-sm">{progressPercent ? 'Tiếp tục' : 'Xem'}</span>
              </button>

            </div>
          ) : (
            <>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-500 shadow-sm" style={{ width: `${progressPercent ?? 0}%` }} />
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handleClick() }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all group"
              >
                {progressPercent ? 'Tiếp tục học' : 'Xem chi tiết'}
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
