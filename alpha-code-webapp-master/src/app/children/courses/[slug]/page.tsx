"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCourse } from '@/features/courses/hooks/use-course'
import { useSections } from '@/features/courses/hooks/use-section'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { setCurrentCourse } from '@/store/user-course-slice'
import { useCreateAccountCourse, useGetAccountCourseByCourseAndAccount } from '@/features/courses/hooks/use-account-course'
import { CourseSkeleton } from '@/components/parent/course/detail/course-skeleton'
import { CourseError } from '@/components/parent/course/detail/course-error'
import { CourseDetail } from '@/components/course/course-detail'
import { toast } from 'sonner'
import { getUserIdFromToken } from '@/utils/tokenUtils'

export default function ChildrenCourseDetailPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: courseData, isLoading: isCourseLoading } = useCourse().useGetCourseBySlug(slug)
  const { data: sectionsData, isLoading: isSectionsLoading, error: sectionsError } = useSections(courseData?.id || '')

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => (prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]))
  }

  const toggleAllSections = () => {
    if (!sectionsData) return
    if (expandedSections.length === sectionsData.length) setExpandedSections([])
    else setExpandedSections(sectionsData.map((s) => s.id))
  }

  const handleRegisterClick = () => {
    // For children - paid course should not redirect to payment. Show toast asking to ask parent to pay.
    if (courseData?.price && courseData.price > 0) {
      toast('Hãy nhờ ba mẹ thanh toán học phần này.');
      return
    }
    setIsDialogOpen(true)
  }

  const createMutation = useCreateAccountCourse()

  // If the current user already has this course (AccountCourse), redirect to learning
  const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') || '' : ''
  const accountId = accessToken ? getUserIdFromToken(accessToken) : null
  const { data: existingAccountCourse, isLoading: isAccountCourseLoading } = useGetAccountCourseByCourseAndAccount(courseData?.id || '', accountId || '')

  useEffect(() => {
    // If we have determined the user is enrolled, redirect to learning immediately
    if (!isAccountCourseLoading && existingAccountCourse) {
      router.replace(`/children/courses/learning/${courseData!.slug}`)
    }
  }, [isAccountCourseLoading, existingAccountCourse, courseData, router])

  const handleConfirmRegister = async () => {
    const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') || '' : ''
    const accountId = accessToken ? getUserIdFromToken(accessToken) : null
    if (!accountId) {
      toast('Vui lòng đăng nhập để đăng ký khóa học')
      setIsDialogOpen(false)
      return
    }
    try {
      // Use mutate with callbacks wrapped in a Promise to support environments where mutateAsync is not available
      await new Promise<void>((resolve, reject) => {
        createMutation.mutate({ accountId, courseId: courseData!.id }, {
          onSuccess: () => resolve(),
          onError: (e) => reject(e),
        })
      })

      setIsDialogOpen(false)
      router.replace(`/children/courses/learning/${courseData!.slug}`)
    } catch (err) {
      console.error(err)
      toast('Đăng ký không thành công, thử lại sau')
      setIsDialogOpen(false)
    }
  }

  useEffect(() => {
    if (courseData) {
      dispatch(setCurrentCourse({ name: courseData.name, slug: courseData.slug }))
    }
    return () => { dispatch(setCurrentCourse(null)) }
  }, [courseData, dispatch])

  if (isCourseLoading) return <CourseSkeleton />
  if (!courseData) return <CourseError />

  return (
    <CourseDetail
      courseData={courseData}
      sectionsData={sectionsData}
      isCourseLoading={isCourseLoading}
      isSectionsLoading={isSectionsLoading}
      sectionsError={sectionsError}
      expandedSections={expandedSections}
      toggleSection={toggleSection}
      toggleAllSections={toggleAllSections}
      handleRegisterClick={handleRegisterClick}
      isDialogOpen={isDialogOpen}
      setIsDialogOpen={setIsDialogOpen}
      createMutation={createMutation}
      handleConfirmRegister={handleConfirmRegister}
      breadcrumbBase="/children/courses"
    />
  )
}
