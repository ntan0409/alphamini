"use client"
import React from 'react'
import { CourseGrid } from '@/components/parent/course/course-grid'
import type { Course, Category } from '@/types/courses'
import LoadingState from '@/components/loading-state'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Pagination } from '@/components/parent/course/pagination'

interface Props {
  searchInput: string
  setSearchInput: (s: string) => void
  selectedCategory: string | null
  setSelectedCategory: (s: string | null) => void
  loadingCourses: boolean
  loadingCategories: boolean
  freeCourses: Course[]
  paidCourses: Course[]
  categories: Category[]
  pagination: { page: number; size: number }
  totalPages: number
  onPageChange: (p: number) => void
  handleSearchSubmit: (e: React.FormEvent) => void
  CourseGridComponent?: React.ComponentType<{ courses: Course[] }>
}

export function CourseList({
  searchInput,
  setSearchInput,
  selectedCategory,
  setSelectedCategory,
  loadingCourses,
  loadingCategories,
  freeCourses,
  paidCourses,
  categories,
  pagination,
  totalPages,
  onPageChange,
  handleSearchSubmit,
  CourseGridComponent,
}: Props) {
  const GridComponent = CourseGridComponent ?? CourseGrid
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Khóa học <span className="text-orange-500">Alpha Code</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Học lập trình robot từ cơ bản đến nâng cao với những khóa học chất lượng
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm khóa học, bài viết, video, ..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
              />
            </form>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loadingCategories ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-8">
              <LoadingState message="Đang tải danh mục..." />
            </div>
          ) : (
            <div className="relative overflow-hidden">
              <div className="flex gap-4 animate-scroll-horizontal hover:pause-animation pb-2">
                {/* First set of categories */}
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )}
                    className={`flex-shrink-0 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
                      selectedCategory === category.id
                        ? 'bg-orange-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
                {/* Duplicate set for seamless loop */}
                {categories.map((category) => (
                  <button
                    key={`${category.id}-duplicate`}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )}
                    className={`flex-shrink-0 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
                      selectedCategory === category.id
                        ? 'bg-orange-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              
              {/* Gradient overlays for scroll indication */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
            </div>
          )}
        </div>
      </div>

      {/* Courses Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingCourses ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-12">
            <LoadingState message="Đang tải các khóa học..." />
          </div>
        ) : (
          <>
            {/* Filter by category if selected */}
            {selectedCategory ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {categories.find(c => c.id === selectedCategory)?.name || 'Khóa học'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {freeCourses.filter(c => c.categoryId === selectedCategory).length + 
                     paidCourses.filter(c => c.categoryId === selectedCategory).length} khóa học
                  </p>
                </div>
                <GridComponent 
                  courses={[
                    ...freeCourses.filter(c => c.categoryId === selectedCategory),
                    ...paidCourses.filter(c => c.categoryId === selectedCategory)
                  ]} 
                />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Khóa học miễn phí</h2>
                <GridComponent courses={freeCourses} />

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Khóa học trả phí</h2>
                <GridComponent courses={paidCourses} />
              </>
            )}

            {totalPages > 1 && (
              <Pagination page={pagination.page} totalPages={totalPages} onPageChange={onPageChange} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
