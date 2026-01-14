"use client"
import React, { useState, useMemo } from 'react'
import { useCourse } from '@/features/courses/hooks/use-course'
import { useGetAllCategories } from '@/features/courses/hooks/use-category'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { setPage, setSearch } from '@/store/user-course-slice'
import { CourseList } from '@/components/course/course-list'
import { PublicCourseGrid } from '@/components/home/public-course-grid'

export default function ChildrenCoursesPage() {
  const [searchInput, setSearchInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const { pagination, filters } = useSelector((state: RootState) => state.userCourse)
  const { useGetCourses } = useCourse()

  const { data: coursesData, isLoading: loadingCourses } = useGetCourses(
    pagination.page,
    pagination.size,
    filters.search,
  )
  const courses = coursesData?.data ?? []
  const total = coursesData?.total_count ?? 0
  const totalPages = Math.ceil(total / pagination.size)

  const { data: categoriesData, isLoading: loadingCategories } = useGetAllCategories({ page: 0, size: 20 })
  const categories = categoriesData?.data ?? []

  const filteredCourses = useMemo(() => {
    if (!selectedCategory) return courses
    return courses.filter((c) => c.categoryId === selectedCategory)
  }, [courses, selectedCategory])

  const freeCourses = useMemo(() => courses.filter((c) => c.price === 0), [courses])
  const paidCourses = useMemo(() => courses.filter((c) => c.price > 0), [courses])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setSearch(searchInput))
  }

  return (
    <CourseList
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      loadingCourses={loadingCourses}
      loadingCategories={loadingCategories}
      freeCourses={freeCourses}
      paidCourses={paidCourses}
      categories={categories}
      pagination={pagination}
      totalPages={totalPages}
      onPageChange={(p) => dispatch(setPage(p))}
      handleSearchSubmit={handleSearchSubmit}
      CourseGridComponent={PublicCourseGrid}
    />
  )
}
