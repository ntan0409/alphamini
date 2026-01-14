"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGetSectionByAccountIdAndCourseSlug } from '@/features/courses/hooks/use-section'
import { useCreateAccountLesson } from '@/features/courses/hooks/use-account-lessons'
import { getUserIdFromToken } from '@/utils/tokenUtils'
import LoadingState from '@/components/loading-state'
import { BookOpen, Pencil, FileText, GraduationCap, BookMarked, Calculator, Star, Trophy, Check, Clock, Video, Bot, Play, ArrowLeft, Lock } from 'lucide-react'

export default function LearningPageClient() {
  const params = useParams() as { slug?: string }
  const router = useRouter()
  const slug = params.slug || ''
  const [processingLessonId, setProcessingLessonId] = useState<string | null>(null)

  // Try to infer logged-in account id from access token
  const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') || '' : ''
  const accountId = accessToken ? getUserIdFromToken(accessToken) : null

  // Fetch sections with account lessons by slug (includes enrollment check + progress info)
  // The hook already has enabled: !!accountId && !!slug inside
  const { data: sectionsData, isLoading: isSectionsLoading, error: sectionsError } = useGetSectionByAccountIdAndCourseSlug(
    accountId || '',
    slug || ''
  )

  // Hook to create account lesson
  const createAccountLesson = useCreateAccountLesson()

  // Determine whether account has this course based on sectionsData
  const isEnrolled = useMemo(() => {
    // If we got sections data back, user is enrolled
    return !!sectionsData && sectionsData.length >= 0
  }, [sectionsData])

  // Calculate total lessons - MUST be before any return statements
  const totalLessons = useMemo(() => {
    return sectionsData?.reduce((total, section) => total + (section.accountLessons?.length || 0), 0) || 0
  }, [sectionsData])

  // Calculate completed lessons - MUST be before any return statements
  const completedLessons = useMemo(() => {
    return sectionsData?.reduce((total, section) => {
      const completed = section.accountLessons?.filter(al => al.status === 2)?.length || 0
      return total + completed
    }, 0) || 0
  }, [sectionsData])

  // Handle lesson click - Check if account lesson exists, create if not, then navigate
  const handleLessonClick = async (lessonId: string, accountLessonId: string | null, lessonType: number) => {
    if (!accountId) return

    try {
      setProcessingLessonId(lessonId)

      // If account lesson doesn't exist (id is null), create it first
      if (!accountLessonId) {
        const newAccountLesson = await createAccountLesson.mutateAsync({
          accountId: accountId,
          lessonId: lessonId,
          status: 1, // Set status to "In Progress"
        })
        
        // Navigate based on lesson type
        // Type 1: Bài học (lesson) -> /lesson/[accountLessonId]
        // Type 2: Video (video) -> /lesson/[accountLessonId]
        // Type 3: Bài kiểm tra (quiz/test) -> /quiz/[accountLessonId]
        const route = lessonType === 3 
          ? `/parent/courses/learning/${slug}/quiz/${newAccountLesson.id}`
          : `/parent/courses/learning/${slug}/lesson/${newAccountLesson.id}`
        
        router.push(route)
      } else {
        // Account lesson already exists, navigate with existing id based on type
        const route = lessonType === 3 
          ? `/parent/courses/learning/${slug}/quiz/${accountLessonId}`
          : `/parent/courses/learning/${slug}/lesson/${accountLessonId}`
        
        router.push(route)
      }
    } catch (error) {
      console.error('Error handling lesson click:', error)
      // Still navigate even if creation fails - try with accountLessonId or lessonId
      const route = lessonType === 3 
        ? `/parent/courses/learning/${slug}/quiz/${accountLessonId || lessonId}`
        : `/parent/courses/learning/${slug}/lesson/${accountLessonId || lessonId}`
      router.push(route)
    } finally {
      setProcessingLessonId(null)
    }
  }

  // Redirect logic: if not logged in or got error (not enrolled) -> go to course detail
  useEffect(() => {
    // If we don't have accountId (not logged in), redirect to course detail
    if (!accountId && slug) {
      router.replace(`/parent/courses/${slug}`)
      return
    }

    // If finished loading and got error (likely not enrolled), redirect to detail
    if (!isSectionsLoading && sectionsError) {
      router.replace(`/parent/courses/${slug}`)
    }
  }, [accountId, isSectionsLoading, sectionsError, slug, router])

  if (isSectionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-6">
          <LoadingState message="Đang tải nội dung khóa học..." />
        </div>
      </div>
    )
  }

  if (sectionsError) {
    // While redirecting, render nothing
    return null
  }

  if (!isEnrolled) {
    // While redirecting, render nothing
    return null
  }

  // Calculate progress percentage
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/parent/courses/my-course')}
            className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại khóa học của tôi
          </button>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Nội dung khóa học</h1>
                <p className="text-sm text-gray-600">Theo dõi tiến độ học tập của bạn</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    Đã hoàn thành {completedLessons}/{totalLessons} bài học
                  </span>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  {progressPercent}%
                </span>
              </div>
              
              <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-6">
          {Array.isArray(sectionsData) && sectionsData.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có bài học nào</h3>
              <p className="text-gray-600">Nội dung khóa học đang được cập nhật</p>
            </div>
          )}

          {Array.isArray(sectionsData) && sectionsData.map((section, sIndex) => {
            const sectionCompleted = section.accountLessons?.filter(al => al.status === 2)?.length || 0
            const sectionTotal = section.accountLessons?.length || 0
            
            // Check if previous section is fully completed (for cross-section locking)
            const isPreviousSectionCompleted = sIndex === 0 || (() => {
              const prevSection = sectionsData[sIndex - 1]
              const prevTotal = prevSection.accountLessons?.length || 0
              const prevCompleted = prevSection.accountLessons?.filter(al => al.status === 2)?.length || 0
              return prevTotal > 0 && prevCompleted === prevTotal
            })()
            const isSectionLocked = !isPreviousSectionCompleted

            return (
              <div key={section.id} className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${isSectionLocked ? 'opacity-60' : ''}`}>
                {/* Section Header */}
                <div className={`px-6 py-4 border-b border-gray-200 ${isSectionLocked ? 'bg-gray-50' : 'bg-blue-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSectionLocked ? 'bg-gray-300' : 'bg-blue-600'
                      }`}>
                        {isSectionLocked ? (
                          <Lock className="w-5 h-5 text-gray-600" />
                        ) : (
                          <span className="text-lg font-bold text-white">{sIndex + 1}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-lg font-bold ${isSectionLocked ? 'text-gray-500' : 'text-gray-900'}`}>
                            {section.title}
                          </h3>
                          {isSectionLocked && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-md font-medium">
                              <Lock className="w-3 h-3" />
                              Hoàn thành section trước
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${isSectionLocked ? 'text-gray-500' : 'text-gray-600'}`}>
                          {sectionTotal} bài học • {sectionCompleted} đã hoàn thành
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lessons List */}
                {Array.isArray(section.accountLessons) && section.accountLessons.length > 0 && (
                  <div className="divide-y divide-gray-100">
                    {section.accountLessons.map((accountLesson, lIndex) => {
                      const lesson = accountLesson.lesson
                      const isCompleted = accountLesson.status === 2
                      const isInProgress = accountLesson.status === 1
                      const isProcessing = processingLessonId === lesson.id
                      
                      // Check if previous lesson is completed (for locking logic within section)
                      const isPreviousLessonCompleted = lIndex === 0 || (section.accountLessons && section.accountLessons[lIndex - 1].status === 2)
                      // Lesson is locked if: section is locked OR previous lesson in same section not completed
                      const isLocked = isSectionLocked || !isPreviousLessonCompleted
                      
                      return (
                        <div 
                          key={lesson.id} 
                          className={`px-6 py-4 transition-all ${
                            isLocked 
                              ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                              : isProcessing 
                              ? 'opacity-60 cursor-wait' 
                              : 'hover:bg-gray-50 cursor-pointer'
                          }`}
                          onClick={() => !isProcessing && !isLocked && handleLessonClick(lesson.id, accountLesson.id, lesson.type)}
                        >
                          <div className="flex items-center gap-4">
                            {/* Status Icon */}
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isLocked
                                ? 'bg-gray-200 text-gray-400'
                                : isCompleted 
                                ? 'bg-green-100 text-green-600' 
                                : isInProgress 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {isLocked ? (
                                <Lock className="w-5 h-5" />
                              ) : isCompleted ? (
                                <Check className="w-6 h-6" />
                              ) : (
                                <span className="text-lg font-bold">{lIndex + 1}</span>
                              )}
                            </div>

                            {/* Lesson Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`text-base font-semibold truncate ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                                  {lesson.title}
                                </h4>
                                {isLocked && (
                                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-gray-300 text-gray-600 rounded-md font-medium flex-shrink-0">
                                    <Lock className="w-3 h-3" />
                                    Khóa
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 flex-wrap">
                                {/* Lesson Type Badge */}
                                {lesson.type === 3 ? (
                                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md font-medium ${
                                    isLocked ? 'bg-gray-200 text-gray-500' : 'bg-purple-100 text-purple-700'
                                  }`}>
                                    <FileText className="w-3 h-3" />
                                    Bài kiểm tra
                                  </span>
                                ) : lesson.type === 2 ? (
                                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md font-medium ${
                                    isLocked ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    <Video className="w-3 h-3" />
                                    Video
                                  </span>
                                ) : (
                                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md font-medium ${
                                    isLocked ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-700'
                                  }`}>
                                    <BookOpen className="w-3 h-3" />
                                    Bài học
                                  </span>
                                )}
                                
                                {/* Submission Status Badge (for quizzes) */}
                                {accountLesson.submissionStatusText && !isLocked && (
                                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md font-medium ${
                                    accountLesson.submissionStatusText.includes('ĐẠT') && !accountLesson.submissionStatusText.includes('KHÔNG')
                                      ? 'bg-green-100 text-green-700' 
                                      : accountLesson.submissionStatusText.includes('KHÔNG ĐẠT')
                                      ? 'bg-red-100 text-red-700'
                                      : accountLesson.submissionStatusText.includes('THỦ CÔNG')
                                      ? 'bg-orange-100 text-orange-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {accountLesson.submissionStatusText.includes('ĐẠT') && !accountLesson.submissionStatusText.includes('KHÔNG') && (
                                      <Check className="w-3 h-3" />
                                    )}
                                    {accountLesson.submissionStatusText}
                                  </span>
                                )}
                                
                                {lesson.videoUrl && lesson.type !== 2 && (
                                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md font-medium ${
                                    isLocked ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    <Video className="w-3 h-3" />
                                    Video
                                  </span>
                                )}
                                {lesson.requireRobot && (
                                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md font-medium ${
                                    isLocked ? 'bg-gray-200 text-gray-500' : 'bg-purple-100 text-purple-700'
                                  }`}>
                                    <Bot className="w-3 h-3" />
                                    Robot
                                  </span>
                                )}
                                <span className={`text-xs flex items-center gap-1 ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
                                  <Clock className="w-3 h-3" />
                                  {Math.floor(lesson.duration / 60)} phút
                                </span>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex-shrink-0">
                              <button 
                                disabled={isProcessing || isLocked}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                                  isLocked
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : isProcessing
                                    ? 'bg-gray-300 text-gray-600 cursor-wait'
                                    : isCompleted 
                                    ? 'bg-green-500 text-white hover:bg-green-600' 
                                    : isInProgress 
                                    ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                              >
                                {isLocked ? (
                                  <>
                                    <Lock className="w-4 h-4" />
                                    Bắt đầu
                                  </>
                                ) : isProcessing ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                                    Đang tải...
                                  </>
                                ) : isCompleted ? (
                                  <>
                                    <Check className="w-4 h-4" />
                                    Học lại
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-4 h-4" />
                                    {isInProgress ? 'Tiếp tục' : 'Bắt đầu'}
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
