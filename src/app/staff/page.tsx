"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Folder, Layers, FileText, Loader2 } from "lucide-react"
import Link from "next/link"
import { useStaffDashboardStats } from "@/features/courses/hooks"

export default function StaffPage() {
  const { data: stats, isLoading, error } = useStaffDashboardStats()

  if (error) {
    console.error('Failed to load dashboard stats:', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trang quản lý Nhân viên</h1>
        <p className="text-muted-foreground">
          Quản lý danh mục, khóa học, phần và bài học
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Danh mục
            </CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats?.totalCategories || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng số danh mục
            </p>
            <Link href="/staff/categories">
              <Button variant="link" className="px-0 mt-2">
                Xem tất cả →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Khóa học
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats?.totalCourses || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng số khóa học
            </p>
            <Link href="/staff/courses">
              <Button variant="link" className="px-0 mt-2">
                Xem tất cả →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chương
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats?.totalSections || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng số phần
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bài học
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats?.totalLessons || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng số bài học
            </p>
            <Link href="/staff/lessons">
              <Button variant="link" className="px-0 mt-2">
                Xem tất cả →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bắt đầu nhanh</CardTitle>
            <CardDescription>
              Các tác vụ phổ biến để quản lý nội dung
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/staff/categories/new">
              <Button className="w-full justify-start" variant="outline">
                <Folder className="mr-2 h-4 w-4" />
                Tạo danh mục mới
              </Button>
            </Link>
            <Link href="/staff/courses/new">
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Tạo khóa học mới
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hướng dẫn</CardTitle>
            <CardDescription>
              Cách sử dụng hệ thống quản lý
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              1. Tạo danh mục để phân loại các khóa học
            </p>
            <p className="text-sm text-muted-foreground">
              2. Thêm khóa học vào danh mục
            </p>
            <p className="text-sm text-muted-foreground">
              3. Tổ chức nội dung thành các phần
            </p>
            <p className="text-sm text-muted-foreground">
              4. Thêm bài học vào từng phần
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
