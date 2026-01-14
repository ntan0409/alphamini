"use client"
import { useGetAccountLessonById, useMarkAccountLessonComplete, useCreateAccountLesson } from '@/features/courses/hooks/use-account-lessons'
import { useGetSectionByAccountIdAndCourseSlug } from '@/features/courses/hooks/use-section'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, useMemo } from 'react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Clock, BookOpen, FileText, CheckCircle, ArrowLeft, AlertCircle, Trophy, Target, Play, List, ChevronDown, ChevronUp, Video, Lock } from 'lucide-react'
import { SubmissionPanel } from '@/components/course/submission-panel'
import { getUserIdFromToken } from '@/utils/tokenUtils'

export default function QuizPageLearning() {
  const router = useRouter()
  const { slug, accountLessonId } = useParams<{ slug: string; accountLessonId: string }>()
  
  // State for quiz
  const [isStarted, setIsStarted] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // Sidebar states
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [processingLessonId, setProcessingLessonId] = useState<string | null>(null)
  
  // Get account lesson detail by account lesson ID
  const { data: accountLessonData, isLoading, error } = useGetAccountLessonById(accountLessonId || '')
  const markComplete = useMarkAccountLessonComplete()
  const createAccountLesson = useCreateAccountLesson()
  
  // Extract lesson data from account lesson
  const lessonData = accountLessonData?.lesson
  
  // Get user ID from token
  const accountId = useMemo(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('accessToken')
      return token ? getUserIdFromToken(token) : null
    }
    return null
  }, [])
  
  // Get sections and lessons for sidebar
  const { data: sections } = useGetSectionByAccountIdAndCourseSlug(accountId || '', slug || '')

  // Auto-expand section containing current lesson
  useEffect(() => {
    if (sections && accountLessonId) {
      const currentSection = sections.find(section => 
        section.accountLessons?.some(lesson => lesson.id === accountLessonId)
      )
      if (currentSection) {
        setExpandedSections(prev => new Set([...prev, currentSection.id]))
      }
    }
  }, [sections, accountLessonId])

  // Toggle section expand/collapse
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  // Handle lesson click from sidebar
  const handleLessonClick = async (lessonId: string, targetAccountLessonId: string | null, lessonType: number) => {
    if (!accountId) return

    try {
      setProcessingLessonId(lessonId)

      // If account lesson doesn't exist (id is null), create it first
      if (!targetAccountLessonId) {
        const newAccountLesson = await createAccountLesson.mutateAsync({
          accountId: accountId,
          lessonId: lessonId,
          status: 1, // Set status to "In Progress"
        })
        
        // Navigate based on lesson type
        const route = lessonType === 3 
          ? `/parent/courses/learning/${slug}/quiz/${newAccountLesson.id}`
          : `/parent/courses/learning/${slug}/lesson/${newAccountLesson.id}`
        
        router.push(route)
      } else {
        // Account lesson already exists, navigate with existing id based on type
        const route = lessonType === 3 
          ? `/parent/courses/learning/${slug}/quiz/${targetAccountLessonId}`
          : `/parent/courses/learning/${slug}/lesson/${targetAccountLessonId}`
        
        router.push(route)
      }
    } catch (error) {
      console.error('Error handling lesson click:', error)
      // Still navigate even if creation fails
      const route = lessonType === 3 
        ? `/parent/courses/learning/${slug}/quiz/${targetAccountLessonId || lessonId}`
        : `/parent/courses/learning/${slug}/lesson/${targetAccountLessonId || lessonId}`
      router.push(route)
    } finally {
      setProcessingLessonId(null)
    }
  }

  useEffect(() => {
    // Check if already completed
    if (accountLessonData?.status === 2) {
      setIsSubmitted(true)
    }
  }, [accountLessonData?.status])

  const handleStartQuiz = () => {
    setIsStarted(true)
  }

  const handleSubmitQuiz = () => {
    setIsSubmitted(true)
    
    // if (accountLessonId) {
    //   markComplete.mutate(accountLessonId)
    // }
  }

  const handleRetryQuiz = () => {
    setIsStarted(false)
    setIsSubmitted(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse">
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !lessonData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="text-red-500 text-6xl mb-4">😕</div>
            <CardTitle className="text-2xl">Không tìm thấy bài kiểm tra</CardTitle>
            <CardDescription>
              Bài kiểm tra này có thể đã bị xóa hoặc không tồn tại.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.back()} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại khóa học
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getStatusVariant = (status: number) => {
    switch (status) {
      case 1:
        return 'default'
      case 2:
        return 'secondary'
      case 0:
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => router.push('/parent/courses')}
                  className="cursor-pointer"
                >
                  Khóa học
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => router.push(`/parent/courses/learning/${slug}`)}
                  className="cursor-pointer"
                >
                  Khóa học
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{lessonData.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => router.push(`/parent/courses/learning/${slug}`)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại khóa học
          </Button>

          {/* Lesson Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              {lessonData.title}
            </h1>
            
            {/* Quiz Meta */}
            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                {formatDuration(lessonData.duration)}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <BookOpen className="w-3 h-3" />
                Bài {lessonData.orderNumber}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <FileText className="w-3 h-3" />
                Bài kiểm tra
              </Badge>
              <Badge variant={getStatusVariant(lessonData.status)}>
                {lessonData.statusText}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quiz Content Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quiz Introduction / Instructions */}
            {!isStarted && !isSubmitted && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Hướng dẫn làm bài
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div 
                      className="text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: lessonData.content }}
                    />
                  </div>

                  <div className="flex justify-center pt-6">
                    <Button 
                      size="lg"
                      onClick={handleStartQuiz}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Bắt đầu làm bài
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quiz Questions (when started) */}
            {isStarted && !isSubmitted && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Nội dung bài kiểm tra
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <div 
                        className="text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: lessonData.content }}
                      />
                    </div>

                    {/* Solution/Answer Area */}
                    {lessonData.solution && (
                      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-950/20 rounded-lg border border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Khu vực trả lời
                        </h3>
                        <textarea 
                          className="w-full min-h-[200px] p-4 border border-input bg-background rounded-lg focus:border-ring focus:ring-2 focus:ring-ring focus:outline-none transition-all"
                          placeholder="Nhập câu trả lời của bạn vào đây..."
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Submission Panel */}
                <SubmissionPanel 
                  accountLessonId={accountLessonId}
                  onSubmissionSuccess={handleSubmitQuiz}
                />

                <div className="flex justify-end gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => setIsStarted(false)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                  </Button>
                </div>
              </>
            )}

            {/* Quiz Results (when submitted) */}
            {isSubmitted && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Đã nộp bài thành công
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground">
                        Bài làm đã được nộp! ✅
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Giáo viên sẽ chấm điểm và phản hồi sớm nhất có thể.
                      </p>
                    </div>

                    <div className="bg-muted border rounded-lg p-4 max-w-md mx-auto">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="text-left text-sm">
                          <p className="font-semibold text-foreground mb-1">Lưu ý quan trọng</p>
                          <p className="text-muted-foreground">
                            Bạn có thể kiểm tra kết quả và nhận xét của giáo viên trong phần lịch sử nộp bài.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pt-4">
                    <Button 
                      onClick={() => router.push(`/parent/courses/learning/${slug}`)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Quay lại khóa học
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Course Content Tracking Sidebar */}
            <Card className="sticky top-4">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <List className="w-5 h-5" />
                  Nội dung khóa học
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto scrollbar-hide">
                  {sections?.map((section, sectionIndex) => {
                    // Check if previous section is fully completed (for cross-section locking)
                    const isPreviousSectionCompleted = sectionIndex === 0 || (() => {
                      const prevSection = sections[sectionIndex - 1]
                      const prevTotal = prevSection.accountLessons?.length || 0
                      const prevCompleted = prevSection.accountLessons?.filter(al => al.status === 2)?.length || 0
                      return prevTotal > 0 && prevCompleted === prevTotal
                    })()
                    const isSectionLocked = !isPreviousSectionCompleted
                    
                    return (
                      <div key={section.id} className="border-b last:border-b-0">
                        {/* Section Header */}
                        <button
                          onClick={() => toggleSection(section.id)}
                          className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                            isSectionLocked ? 'opacity-60' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold text-sm ${isSectionLocked ? 'text-gray-500' : 'text-gray-900'}`}>
                              {sectionIndex + 1}. {section.title}
                            </span>
                            {isSectionLocked && (
                              <Lock className="w-3 h-3 text-gray-400" />
                            )}
                          </div>
                          {expandedSections.has(section.id) ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          )}
                        </button>

                        {/* Lessons List */}
                        {expandedSections.has(section.id) && (
                          <div className="bg-gray-50">
                            {section.accountLessons?.map((lesson, lessonIndex) => {
                              const isCurrentLesson = lesson.id === accountLessonId
                              const isLessonCompleted = lesson.status === 2
                              const isProcessing = processingLessonId === lesson.lesson?.id
                              
                              // Check if previous lesson is completed
                              const isPreviousCompleted = lessonIndex === 0 || (section.accountLessons && section.accountLessons[lessonIndex - 1].status === 2)
                              // Also check if section is locked
                              const isLocked = isSectionLocked || !isPreviousCompleted
                            
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => {
                                  if (isLocked || isProcessing) return
                                  handleLessonClick(lesson.lesson?.id || '', lesson.id, lesson.lesson?.type || 1)
                                }}
                                className={`w-full px-4 py-3 flex items-start gap-3 transition-all text-left relative ${
                                  isLocked 
                                    ? 'opacity-50 cursor-not-allowed bg-gray-100'
                                    : isProcessing
                                    ? 'opacity-60 cursor-wait bg-gray-100'
                                    : isLessonCompleted
                                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-l-4 border-green-500'
                                    : 'hover:bg-gray-100'
                                } ${isCurrentLesson && !isLessonCompleted ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                                disabled={isLocked || isProcessing}
                              >
                                {/* Completed Badge Overlay */}
                                {isLessonCompleted && (
                                  <div className="absolute top-2 right-2">
                                    <div className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3" />
                                      Hoàn thành
                                    </div>
                                  </div>
                                )}

                                {/* Status Icon */}
                                <div className="flex-shrink-0 mt-0.5">
                                  {isLocked ? (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                      <Lock className="w-4 h-4 text-gray-400" />
                                    </div>
                                  ) : isLessonCompleted ? (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                                      <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-400 transition-colors">
                                      <span className="text-sm font-semibold text-gray-600">{lessonIndex + 1}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Lesson Info */}
                                <div className="flex-1 min-w-0">
                                  <div className={`text-sm font-semibold mb-1.5 ${
                                    isLocked 
                                      ? 'text-gray-400' 
                                      : isLessonCompleted
                                      ? 'text-green-800'
                                      : isCurrentLesson 
                                      ? 'text-blue-700' 
                                      : 'text-gray-900'
                                  }`}>
                                    {lesson.lesson?.title}
                                    {isLocked && (
                                      <Badge variant="secondary" className="ml-2 text-xs bg-gray-300">
                                        Khóa
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {lesson.lesson?.type === 3 ? (
                                      <Badge variant="secondary" className={`text-xs px-2 py-0.5 ${
                                        isLessonCompleted ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                                      }`}>
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Quiz
                                      </Badge>
                                    ) : lesson.lesson?.type === 2 ? (
                                      <Badge variant="secondary" className={`text-xs px-2 py-0.5 flex items-center gap-1 ${
                                        isLessonCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                      }`}>
                                        <Video className="w-3 h-3" />
                                        {Math.floor((lesson.lesson?.duration || 0) / 60)}m
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary" className={`text-xs px-2 py-0.5 flex items-center gap-1 ${
                                        isLessonCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                      }`}>
                                        <BookOpen className="w-3 h-3" />
                                        {Math.floor((lesson.lesson?.duration || 0) / 60)}m
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
