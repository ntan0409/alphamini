"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DeleteCourseDialog } from "@/components/course/delete-course-dialog"
import { Pagination } from "@/components/ui/pagination"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, Layers, BookOpen, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useStaffCourses, useDeleteCourse, useCourse } from "@/features/courses/hooks"
import { toast } from "sonner"

const levelMap: { [key: number]: { text: string; color: string } } = {
  1: { text: "Cơ bản", color: "bg-blue-500/10 text-blue-500" },
  2: { text: "Trung bình", color: "bg-green-500/10 text-green-500" },
  3: { text: "Nâng cao", color: "bg-yellow-500/10 text-yellow-500" }
}

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [page, setPage] = useState(1)
  const [size] = useState(10)
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null)
  const [deletingCourseName, setDeletingCourseName] = useState("")
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1) // Reset to first page when search changes
    }, 500)
    
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset to first page when category changes
  useEffect(() => {
    setPage(1)
  }, [selectedCategory])
  
  const { data: coursesData, isLoading: coursesLoading, refetch } = useStaffCourses({ 
    page, 
    size, 
    search: debouncedSearch 
  })
  const { useGetCategories } = useCourse()
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategories(1, 100)
  const deleteCourse = useDeleteCourse()

  const courses = coursesData?.data || []
  const categories = categoriesData?.data || []
  const totalPages = coursesData?.total_pages || 0
  const totalCount = coursesData?.total_count || 0
  const hasNext = coursesData?.has_next || false
  const hasPrevious = coursesData?.has_previous || false

  // Filter by category on client side (since API might not support category filter)
  const filteredCourses = useMemo(() => {
    if (selectedCategory === "all") {
      return courses
    }
    return courses.filter(course => course.categoryId === selectedCategory)
  }, [courses, selectedCategory])

  const handleDeleteCourse = (courseId: string, courseName: string) => {
    setDeletingCourseId(courseId)
    setDeletingCourseName(courseName)
  }

  const handleDeleteCourseConfirm = async () => {
    if (!deletingCourseId) return

    try {
      console.log('🗑️ Deleting course:', deletingCourseId)
      await deleteCourse.mutateAsync(deletingCourseId)
      console.log('✅ Course deleted, cache should be invalidated')
      setDeletingCourseId(null)
      setDeletingCourseName("")
      toast.success('Đã xóa khóa học thành công')
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Lỗi khi xóa khóa học'
        : error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Lỗi khi xóa khóa học'
      toast.error(errorMessage)
      console.error('Error deleting course:', error)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isLoading = coursesLoading || categoriesLoading

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Khóa học</h1>
          <p className="text-muted-foreground">
            Quản lý tất cả các khóa học trong hệ thống
          </p>
        </div>
        <Link href="/staff/courses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo khóa học mới
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách khóa học</CardTitle>
          <CardDescription>
            Tổng cộng {totalCount} khóa học
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm khóa học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Ảnh</TableHead>
                  <TableHead className="min-w-[200px]">Tên khóa học</TableHead>
                  <TableHead className="min-w-[120px]">Danh mục</TableHead>
                  <TableHead className="min-w-[180px]">Thông tin</TableHead>
                  <TableHead className="min-w-[100px]">Giá</TableHead>
                  <TableHead className="min-w-[100px]">Trạng thái</TableHead>
                  <TableHead className="text-right min-w-[80px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy khóa học nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="relative w-12 h-12 rounded overflow-hidden bg-muted">
                          {course.imageUrl ? (
                            <Image
                              src={course.imageUrl}
                              alt={course.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="max-w-[250px]">
                          <p className="font-medium truncate">{course.name}</p>
                          <div 
                            className="text-sm text-muted-foreground line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: course.description }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="break-words whitespace-normal max-w-[150px]">{course.categoryName|| 'N/A'}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={levelMap[course.level]?.color}>
                              {levelMap[course.level]?.text}
                            </Badge>
                            {course.requireLicense && (
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/20">
                                License
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                            <span>{course.sectionCount || 0} phần</span>
                            <span>•</span>
                            <span>{course.totalLessons} bài</span>
                            <span>•</span>
                            <span>{formatDuration(course.totalDuration)}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        {formatPrice(course.price)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={course.status === 1 ? "default" : "secondary"}
                          className={`whitespace-nowrap ${course.status === 1 ? "bg-green-500/10 text-green-700 border-green-500/20" : "bg-gray-500/10 text-gray-700 border-gray-500/20"}`}
                        >
                          {course.statusText  }
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Mở menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/staff/courses/${course.slug}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/staff/courses/${course.slug}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/staff/courses/${course.slug}/sections`}>
                                <Layers className="mr-2 h-4 w-4" />
                                Quản lý phần
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteCourse(course.id, course.name)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                totalCount={totalCount}
                perPage={size}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteCourseDialog
        open={!!deletingCourseId}
        courseName={deletingCourseName}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingCourseId(null)
            setDeletingCourseName("")
          }
        }}
        onConfirm={handleDeleteCourseConfirm}
        isDeleting={deleteCourse.isPending}
      />
    </div>
  )
}
