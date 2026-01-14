"use client"
import React from 'react'
import LoadingState from '@/components/loading-state'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import type { Course, Section, Lesson } from '@/types/courses'
import type { AccountCourse } from '@/types/account-course'
import type { UseMutationResult } from '@tanstack/react-query'

interface Props {
  courseData: Course | null
  sectionsData?: Section[]
  isCourseLoading: boolean
  isSectionsLoading: boolean
  sectionsError?: unknown
  expandedSections: string[]
  toggleSection: (id: string) => void
  toggleAllSections: () => void
  handleRegisterClick: () => void
  isDialogOpen: boolean
  setIsDialogOpen: (b: boolean) => void
  createMutation?: UseMutationResult<unknown, unknown, Partial<AccountCourse>, unknown>
  handleConfirmRegister: () => Promise<void>
  breadcrumbBase?: string
  formatPriceFn?: (n: number) => string
}

export function CourseDetail({
  courseData,
  sectionsData,
  isCourseLoading,
  isSectionsLoading,
  sectionsError,
  expandedSections,
  toggleSection,
  toggleAllSections,
  handleRegisterClick,
  isDialogOpen,
  setIsDialogOpen,
  createMutation,
  handleConfirmRegister,
  breadcrumbBase = '/course',
  formatPriceFn,
}: Props) {
  if (isCourseLoading) return <div className="p-8"><LoadingState message="Đang tải khóa học..." /></div>
  if (!courseData) return <div className="p-8 text-center text-gray-500">Không tìm thấy khóa học</div>

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li
                onClick={() => window.history.back()}
                className="hover:cursor-pointer hover:text-blue-600 transition-colors"
              >
                Khóa học
              </li>
              <li>›</li>
              <li className="text-blue-600 font-medium">{courseData.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-gray-900">
                {courseData.name}
              </h1>
              <p
                className="text-lg text-gray-600 mb-6 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: courseData.description }}
              />


              <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs">📚</span>
                  </div>
                  <span>{sectionsData?.length || 0} Học Phần</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs">⏱️</span>
                  </div>
                  <span>Thời lượng {Math.floor(courseData.totalDuration / 60)} phút</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs">🎯</span>
                  </div>
                  <span>{courseData?.levelText || 'Trình độ cơ bản'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  {courseData?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={courseData.imageUrl} alt={courseData.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow border">
                        <span className="text-2xl ml-1">▶️</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-blue-600">
                      {courseData?.price === 0
                        ? 'Miễn phí'
                        : formatPriceFn
                        ? formatPriceFn(courseData.price || 0)
                        : new Intl.NumberFormat('vi-VN').format(courseData.price) + 'đ'}
                    </span>
                  </div>
                  <Button
                    onClick={handleRegisterClick}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4"
                  >
                    {courseData?.price && courseData.price > 0 ? 'Mua khóa học' : 'Đăng ký khóa học'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Nội dung khóa học</h2>
              <button
                onClick={toggleAllSections}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                {expandedSections.length === sectionsData?.length ? 'Thu gọn tất cả' : 'Mở rộng tất cả'}
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              {sectionsData?.length || 0} Học Phần
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {isSectionsLoading && (
              <div className="p-6">
                <LoadingState message="Đang tải chương học..." />
              </div>
            )}

            {Boolean(sectionsError) && (
              <div className="p-6 text-center text-red-600">
                <p>Có lỗi xảy ra khi tải chương học</p>
              </div>
            )}

            {sectionsData && sectionsData.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <p>Chưa có chương học nào</p>
              </div>
            )}

            {sectionsData && sectionsData.length > 0 && sectionsData.map((section, index) => (
              <div key={section.id} className="border-b border-gray-200">
                <div
                  className="p-4 flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {index + 1}
                    </div>
                    <h3 className="text-gray-900 font-medium">{section.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{section.lessons?.length || 0} bài học</span>
                    <div className={`transform transition-transform ${expandedSections.includes(section.id) ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {expandedSections.includes(section.id) && (
                  <div className="bg-gray-50">
                    {Array.isArray(section.lessons) && section.lessons.length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        <p>Chưa có bài học nào trong chương này</p>
                      </div>
                    )}

                    {Array.isArray(section.lessons) && section.lessons.length > 0 && (
                      <ul className="divide-y divide-gray-200">
                        {section.lessons.map((lesson: Lesson, lessonIndex: number) => (
                          <li
                            key={lesson.id}
                            className="p-4 flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">
                                {lessonIndex + 1}
                              </div>
                              <div>
                                <h4 className="text-gray-900 font-medium">{lesson.title}</h4>
                                <p className="text-sm text-gray-500">{lesson.duration} phút</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H3m12 0l-6-6m6 6l-6 6" />
                              </svg>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận đăng ký</DialogTitle>
            </DialogHeader>

            <div>
              <p>Bạn có chắc chắn muốn đăng ký khóa học này?</p>
            </div>

            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)} className="bg-gray-300 hover:bg-gray-400" disabled={createMutation?.status === 'pending'}>
                Hủy
              </Button>
              <Button onClick={handleConfirmRegister} className="bg-blue-500 text-white hover:bg-blue-700" disabled={createMutation?.status === 'pending'}>
                {createMutation?.status === 'pending' ? 'Đang xử lý...' : 'Xác nhận'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
