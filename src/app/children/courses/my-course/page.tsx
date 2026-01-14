"use client"
import React, { useState } from 'react'
import { useGetAccountCoursesByAccount } from '@/features/courses/hooks/use-account-course'
import { getUserIdFromToken } from '@/utils/tokenUtils'
import LoadingState from '@/components/loading-state'
import { useRouter } from 'next/navigation'
import { BookOpen, GraduationCap } from 'lucide-react'
import CourseCard from '@/components/parent/course/course-card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ChildrenMyCoursePage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const size = 12

  const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') || '' : ''
  const accountId = accessToken ? getUserIdFromToken(accessToken) : null

  const { data: paged, isLoading } = useGetAccountCoursesByAccount(accountId || '', page, size)
  const courses = paged?.data ?? []
  const total = paged?.total_count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / size))

  if (!accountId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Bạn chưa đăng nhập</h2>
          <p className="text-sm text-gray-600 mb-6">Vui lòng đăng nhập để xem các khoá học của bé.</p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => router.push('/login')}>Đăng nhập</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl p-8 bg-white/60 backdrop-blur-sm shadow-xl border border-yellow-100">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-3 bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold mb-3 shadow-sm">
                <BookOpen className="w-5 h-5" />
                <span>Góc học tập</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">Khoá học của bé</h1>
              <p className="text-sm text-gray-700 mt-2 max-w-xl">Các khoá học bé đang học — tiếp tục học ngay hoặc nhờ ba mẹ đăng ký khi cần khóa trả phí.</p>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => toast('Hãy nhờ ba mẹ thanh toán học phần nếu muốn mua thêm.')} className="bg-yellow-600 text-white hover:bg-yellow-700 shadow-md">
                Nhờ ba mẹ mua thêm
              </Button>
              <Button variant="ghost" onClick={() => router.push('/children/courses')} className="hidden md:inline-flex">
                Khám phá khóa học
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12"><LoadingState message="Đang tải các khoá học của bé..." /></div>
          ) : courses.length === 0 ? (
            <div className="py-12 text-center text-gray-700">
              <img src="/empty_kid_books.svg" alt="empty" className="mx-auto w-48 mb-6" />
              <h3 className="text-xl font-semibold mb-2">Chưa có khóa học nào cho bé</h3>
              <p className="text-sm text-gray-600 mb-6">Hãy khám phá các khóa học phù hợp với sở thích của bé.</p>
              <div className="flex justify-center">
                <Button onClick={() => router.push('/children/courses')} className="bg-yellow-500 text-white">Khám phá ngay</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((c) => (
                  <div key={c.id} className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-lg transition-shadow">
                    <CourseCard course={c} variant="grid" basePath="/children/courses" />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="inline-flex items-center bg-white rounded-full shadow-sm p-1">
                    <Button variant="ghost" onClick={() => setPage(Math.max(1, page - 1))} className="px-3">Prev</Button>
                    <div className="px-4 py-2 text-sm font-medium">{page} / {totalPages}</div>
                    <Button variant="ghost" onClick={() => setPage(Math.min(totalPages, page + 1))} className="px-3">Next</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
