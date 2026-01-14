'use client'
import { CourseError } from '@/components/parent/course/detail/course-error'
import { CourseSkeleton } from '@/components/parent/course/detail/course-skeleton'
import LoadingState from '@/components/loading-state'
import { useCourse } from '@/features/courses/hooks/use-course'
import { useSections } from '@/features/courses/hooks/use-section'
import { AppDispatch } from '@/store/store'
import { setCurrentCourse } from '@/store/user-course-slice'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation';
import { getUserIdFromToken } from '@/utils/tokenUtils'
import { useCreateAccountCourse } from '@/features/courses/hooks/use-account-course'
import { AccountCourse } from '@/types/account-course'
import { CourseDetail } from '@/components/course/course-detail'

export default function CoursePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter(); // Add router for navigation
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: courseData, isLoading: isCourseLoading } = useCourse().useGetCourseBySlug(slug);

  const { data: sectionsData, isLoading: isSectionsLoading, error: sectionsError } = useSections(
    courseData?.id || ''
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleAllSections = () => {
    if (!sectionsData) return;

    if (expandedSections.length === sectionsData.length) {
      setExpandedSections([]);
    } else {
      setExpandedSections(sectionsData.map((section) => section.id));
    }
  };

  const handleLessonClick = (lessonId: string) => {
    router.push(`/parent/courses/learning/${slug}/lesson/${lessonId}`); // Navigate to lesson detail page
  };

  const handleRegisterClick = () => {
    // If the course is paid, go to payment page instead of enrolling directly
    if (courseData?.price && courseData.price > 0) {
      // Use payment page with query params expected by PaymentPageClient
      router.push(`/payment?category=course&id=${encodeURIComponent(courseData.id)}`)
      return
    }

    setIsDialogOpen(true);
  };

  const createMutation = useCreateAccountCourse();

  const handleConfirmRegister = async () => {
    // Use mutation hook to create account-course for the logged-in account
    const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') || '' : '';
    const accountId = accessToken ? getUserIdFromToken(accessToken) : null;

    if (!accountId) {
      // Not authenticated or no account id found
      console.error('No account id found. Please login.');
      setIsDialogOpen(false);
      return;
    }
    try {
      // Some React Query versions/types may not expose mutateAsync on the typed object.
      // Use a safe wrapper that falls back to mutate+callbacks when mutateAsync is not present.
      type MutateFn = (data: Partial<AccountCourse>) => Promise<unknown>

      const maybeMutateAsync = (createMutation as unknown as { mutateAsync?: MutateFn }).mutateAsync

      const mutateAsyncFn: MutateFn = maybeMutateAsync
        ? (maybeMutateAsync.bind(createMutation) as MutateFn)
        : (data: Partial<AccountCourse>) =>
            new Promise<unknown>((resolve, reject) =>
              createMutation.mutate(data, { onSuccess: (res) => resolve(res), onError: (err) => reject(err) })
            )

      await mutateAsyncFn({ accountId, courseId: courseData!.id });
      setIsDialogOpen(false);
      // Use replace to avoid keeping the dialog route in history
      router.replace(`/parent/courses/learning/${courseData!.slug}`);
    } catch (err) {
      console.error('Failed to assign course to account', err);
      setIsDialogOpen(false);
    }
  };



  useEffect(() => {
    if (courseData) {
      dispatch(setCurrentCourse({ name: courseData.name, slug: courseData.slug }));
    }
    return () => {
      dispatch(setCurrentCourse(null));
    };
  }, [courseData, dispatch]);

  if (isCourseLoading) return <CourseSkeleton />;
  if (!courseData) return <CourseError />;

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
      breadcrumbBase="/parent/courses"
    />
  )
}