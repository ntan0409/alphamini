"use client"

import { useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, FolderOpen, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useNoneDeleteCategories, useDeleteCategory } from "@/features/courses/hooks"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"
import { DeleteCategoryDialog } from "@/components/course/delete-category-dialog"
import { EditCategoryModal } from "@/components/course/edit-category-modal"
import { Category } from "@/types/courses"

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1) // UI uses 1-based pages
  const pageSize = 20
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)
  const [deletingCategoryName, setDeletingCategoryName] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  
  const { data, isLoading, error } = useNoneDeleteCategories({
    page: page, // API uses 0-based pages
    size: pageSize,
    search: searchQuery || undefined
  })
  
  const deleteCategory = useDeleteCategory()

  const handleDelete = (id: string, name: string) => {
    setDeletingCategoryId(id)
    setDeletingCategoryName(name)
  }

  const handleDeleteConfirm = () => {
    if (!deletingCategoryId) return

    deleteCategory.mutate(deletingCategoryId, {
      onSuccess: () => {
        setDeletingCategoryId(null)
        setDeletingCategoryName("")
        toast.success("Xóa danh mục thành công!")
      },
      onError: (error: unknown) => {
        const errorMessage = error && typeof error === 'object' && 'response' in error 
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
          : undefined;
        toast.error(errorMessage || "Có lỗi xảy ra khi xóa danh mục")
      }
    })
  }

  const categories = data?.data || []
  const totalCount = data?.total_count || 0
  const totalPages = data?.total_pages || 0
  const hasNext = data?.has_next || false
  const hasPrevious = data?.has_previous || false

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Danh mục</h1>
          <p className="text-muted-foreground">
            Quản lý các danh mục khóa học
          </p>
        </div>
        <Link href="/staff/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo danh mục mới
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục</CardTitle>
          <CardDescription>
            {isLoading ? "Đang tải..." : `Tổng cộng ${totalCount} danh mục`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm danh mục..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Hình ảnh</TableHead>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-destructive">
                      Có lỗi xảy ra khi tải danh mục
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy danh mục nào
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                          {category.imageUrl ? (
                            <Image
                              src={category.imageUrl}
                              alt={category.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FolderOpen className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="max-w-md">
                        <div 
                          className="truncate"
                          dangerouslySetInnerHTML={{ __html: category.description }}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant={category.status === 1 ? "default" : "secondary"}>
                          {category.status === 1 ? "Hoạt động" : "Ẩn"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(category.createdDate).toLocaleDateString('vi-VN')}
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
                              <Link href={`/staff/categories/${category.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(category.id, category.name)}
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

          {!isLoading && totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                totalCount={totalCount}
                perPage={pageSize}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteCategoryDialog
        open={!!deletingCategoryId}
        categoryName={deletingCategoryName}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingCategoryId(null)
            setDeletingCategoryName("")
          }
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteCategory.isPending}
      />

      {editingCategory && (
        <EditCategoryModal
          open={!!editingCategory}
          onOpenChange={(open) => {
            if (!open) {
              setEditingCategory(null)
            }
          }}
          category={editingCategory}
        />
      )}
    </div>
  )
}
