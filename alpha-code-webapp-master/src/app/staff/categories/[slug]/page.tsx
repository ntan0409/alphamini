"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { ArrowLeft, Plus, MoreHorizontal, Pencil, Trash2, Eye, Layers, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Image from "next/image"
import { RichTextViewer } from "@/components/ui/rich-text-editor"
import { useCategory } from "@/features/courses/hooks"
import { useCourse } from "@/features/courses/hooks/use-course"

export default function CategoryDetailPage() {
  const params = useParams()
  // Note: Despite folder name [slug], we're actually receiving category ID from the route
  const categoryId = params.slug as string
  
  const { data: category, isLoading, error } = useCategory(categoryId)
  const { useGetCoursesByCategory } = useCourse()
  const { data: coursesData, isLoading: isLoadingCourses } = useGetCoursesByCategory(categoryId, 1, 10)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Không tìm thấy danh mục</p>
          <Link href="/staff/categories">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/staff/categories">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
          <p className="text-muted-foreground">
            Chi tiết danh mục và danh sách khóa học
          </p>
        </div>
        <Link href={`/staff/categories/${categoryId}/edit`}>
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Thông tin danh mục</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {category.imageUrl && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tên danh mục</p>
                <p className="text-base">{category.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Slug</p>
                <p className="text-sm font-mono">{category.slug}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Mô tả</p>
                <div className="prose prose-sm max-w-none">
                  <RichTextViewer content={category.description} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                <Badge variant={category.status === 1 ? "default" : "secondary"}>
                  {category.status === 1 ? "Hoạt động" : "Ẩn"}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                <p className="text-base">
                  {new Date(category.createdDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                <p className="text-base">
                  {new Date(category.lastUpdated!).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Danh sách khóa học</CardTitle>
                <CardDescription>
                  {isLoadingCourses ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Đang tải...
                    </span>
                  ) : (
                    `${coursesData?.data?.length || 0} khóa học trong danh mục này`
                  )}
                </CardDescription>
              </div>
              {/* <Link href={`/staff/courses/new?categoryId=${categoryId}`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm khóa học
                </Button>
              </Link> */}
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên khóa học</TableHead>
                    <TableHead>Cấp độ</TableHead>
                    <TableHead>Số bài học</TableHead>
                    <TableHead>Số phần</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingCourses ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : !coursesData?.data || coursesData.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Chưa có khóa học nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    coursesData.data.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            Cấp {course.level}
                          </Badge>
                        </TableCell>
                        <TableCell>{course.totalLessons} bài</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {course.sectionCount} phần
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={course.status === 1 ? "default" : "secondary"}>
                            {course.status === 1 ? "Hoạt động" : "Ẩn"}
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
                                <Link href={`/staff/courses/${course.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/staff/courses/${course.id}/edit`}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/staff/courses/${course.id}/sections`}>
                                  <Layers className="mr-2 h-4 w-4" />
                                  Quản lý phần
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
