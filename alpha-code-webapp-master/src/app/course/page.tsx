"use client"
import { useCourse } from '@/features/courses/hooks/use-course';
import { useGetAllCategories } from '@/features/courses/hooks/use-category';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setPage, setSearch } from '@/store/user-course-slice';
import { PublicCourseGrid } from '@/components/home/public-course-grid';
import React, { useState, useMemo } from 'react'
import { CourseList } from '@/components/course/course-list'
import { Header } from '@/components/home/header';
import { Footer } from '@/components/home/footer';

export default function CourseHomePage() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { pagination, filters } = useSelector((state: RootState) => state.userCourse);
  const { useGetCourses } = useCourse();

  // Fetch courses
  const { data: coursesData, isLoading: loadingCourses } = useGetCourses(
    pagination.page,
    pagination.size,
    filters.search,
  );
  const courses = coursesData?.data ?? [];
  const total = coursesData?.total_count ?? 0;
  const totalPages = Math.ceil(total / pagination.size);

  // Fetch categories
  const { data: categoriesData, isLoading: loadingCategories } = useGetAllCategories({ page: 0, size: 20 });
  const categories = categoriesData?.data ?? [];

  // Filter courses by selected category
  const filteredCourses = useMemo(() => {
    if (!selectedCategory) {
      return courses;
    }
    return courses.filter((course) => course.categoryId === selectedCategory);
  }, [courses, selectedCategory]);

  // Separate free and paid courses
  const freeCourses = useMemo(() => {
    return courses.filter((course) => course.price === 0);
  }, [courses]);

  const paidCourses = useMemo(() => {
    return courses.filter((course) => course.price > 0);
  }, [courses]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearch(searchInput));
  };

  return (
    <>
    <Header />
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
    <Footer />
    </>
  );
}