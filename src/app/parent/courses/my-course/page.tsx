"use client"
import React, { useMemo, useState } from 'react'
import { useGetAccountCoursesByAccount } from '@/features/courses/hooks/use-account-course'
import { getUserIdFromToken } from '@/utils/tokenUtils'
import { Pagination } from '@/components/parent/course/pagination'
import { Button } from '@/components/ui/button'
import LoadingState from '@/components/loading-state'
import { useRouter } from 'next/navigation'
import { BookOpen, TrendingUp, Award, ArrowRight, GraduationCap, ShoppingCart } from 'lucide-react'
import CourseCard from '@/components/parent/course/course-card'

export default function MyCoursePage() {
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
          <p className="text-sm text-gray-600 mb-6">Vui lòng đăng nhập để xem các khoá học bạn đã đăng ký hoặc mua.</p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => router.push('/login')}>Đăng nhập</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner with Robot Reading - Improved Design */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <BookOpen className="w-4 h-4" />
                <span>Học tập thông minh</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Khoá học của tôi
              </h1>
              <p className="text-base md:text-lg text-gray-600 mb-6">
                Tiếp tục hành trình học tập của bạn. Bạn đã đăng ký <span className="font-bold text-blue-600">{total} khóa học</span>.
              </p>
              
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-2">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="font-bold text-2xl text-gray-900 mb-1">{total}</div>
                  <div className="text-xs text-gray-600">Khóa học đã đăng ký</div>
                </div>
                
                <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="font-bold text-2xl text-gray-900 mb-1">Tốt</div>
                  <div className="text-xs text-gray-600">Tiến độ học tập</div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex justify-end items-center">
              <img 
                src="/img_reading.webp" 
                alt="Robot Reading" 
                className="w-full max-w-2xl object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {isLoading ? (
          <div className="py-12">
            <LoadingState message="Đang tải các khoá học..." />
          </div>
        ) : courses.length === 0 ? (
          <div className="py-12">
            {/* Empty State Banner - No Image */}
            <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl overflow-hidden p-12 md:p-16 max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-xs font-bold mb-6 shadow-lg">
                <GraduationCap className="w-4 h-4" />
                <span>Bắt đầu hành trình mới</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Chưa có khóa học nào?
              </h2>
              
              <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                Khám phá hàng trăm khóa học lập trình robot, AI và công nghệ hiện đại. 
                Học cùng <span className="font-bold text-blue-600">Alpha Code</span> để trở thành nhà sáng tạo công nghệ tương lai!
              </p>
              
              <div className="space-y-4 mb-10 max-w-xl mx-auto text-left">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-base text-gray-900 mb-0.5">Chứng chỉ hoàn thành</div>
                    <div className="text-sm text-gray-600">Nhận chứng chỉ khi hoàn thành khóa học</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-base text-gray-900 mb-0.5">Học mọi lúc, mọi nơi</div>
                    <div className="text-sm text-gray-600">Truy cập trọn đời, không giới hạn</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-base text-gray-900 mb-0.5">Cập nhật liên tục</div>
                    <div className="text-sm text-gray-600">Nội dung mới được bổ sung thường xuyên</div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => router.push('/course')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-10 py-6 text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all group"
              >
                Khám phá khóa học ngay
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Promotional Banner - Purchase More Courses */}
            <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl overflow-hidden p-8 md:p-10 mb-8 shadow-lg border-2 border-blue-200 hover:shadow-xl transition-all duration-300">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 -z-0"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100 rounded-full blur-3xl opacity-30 -z-0"></div>
              
              <div className="relative z-10 max-w-5xl mx-auto">
                <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold mb-4 shadow-md">
                      <Award className="w-4 h-4" />
                      <span>Đặc biệt dành cho bạn</span>
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                      Mở rộng kiến thức với thêm nhiều khóa học mới! 🚀
                    </h3>
                    
                    <p className="text-sm text-gray-700 mb-5 leading-relaxed font-medium">
                      Khám phá thêm hàng trăm khóa học chất lượng cao về lập trình robot, AI, và công nghệ.
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-blue-100">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-xs text-gray-700">100+ Khóa học</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-purple-100">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                          <GraduationCap className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-xs text-gray-700">Chứng chỉ</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-pink-100">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                          <Award className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-xs text-gray-700">Ưu đãi đặc biệt</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => router.push('/course')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-7 py-4 text-sm rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group whitespace-nowrap"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Mua khóa học mới
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c} variant="grid" />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
