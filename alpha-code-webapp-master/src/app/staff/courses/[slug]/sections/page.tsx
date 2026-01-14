"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
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
import { 
  ArrowLeft, 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Eye, 
  GripVertical,
  FileText,
  MoveUp,
  MoveDown,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { useStaffCourse } from "@/features/courses/hooks/use-course"
import { useSections, useDeleteSection, useUpdateSectionOrder } from "@/features/courses/hooks/use-section"
import { toast } from "sonner"
import { Section } from "@/types/courses"
import { DeleteSectionDialog } from "@/components/course/delete-section-dialog"
import { CreateSectionModal } from "@/components/course/create-section-modal"
import { EditSectionModal } from "@/components/course/edit-section-modal"

export default function CourseSectionsPage() {
  const params = useParams()
  const courseSlug = params.slug as string
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null)
  const [deletingSectionName, setDeletingSectionName] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [editingSectionTitle, setEditingSectionTitle] = useState("")
  const [editingSectionOrderNumber, setEditingSectionOrderNumber] = useState(0)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  
  const { data: course, isLoading: courseLoading } = useStaffCourse(courseSlug)
  const courseId = course?.id ?? ''
  
  const { data: sections = [], isLoading: sectionsLoading, refetch: refetchSections } = useSections(courseId)
  const deleteSectionMutation = useDeleteSection(courseId)
  const updateSectionOrderMutation = useUpdateSectionOrder(courseId)
  
  const isLoading = courseLoading || sectionsLoading

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) {
      // Delay clearing state to let animation finish
      setTimeout(() => {
        setDraggedIndex(null)
        setDragOverIndex(null)
      }, 200)
      return
    }

    // Clear drag over immediately for smooth transition
    setDragOverIndex(null)

    const newSections = [...sections]
    const [draggedSection] = newSections.splice(draggedIndex, 1)
    newSections.splice(dropIndex, 0, draggedSection)

    // Update order numbers
    const updatedSections = newSections.map((section, idx) => ({
      ...section,
      orderNumber: idx + 1
    }))

    try {
      await updateSectionOrderMutation.mutateAsync(
        updatedSections.map(s => ({
          id: s.id,
          orderNumber: s.orderNumber
        }))
      )
      toast.success('Đã cập nhật thứ tự phần')
      
      // Delay clearing dragged state to let animation finish
      setTimeout(() => {
        setDraggedIndex(null)
        refetchSections()
      }, 200)
    } catch (error) {
      toast.error('Lỗi khi cập nhật thứ tự phần')
      console.error('Error updating section order:', error)
      setDraggedIndex(null)
    }
  }

  const handleDragEnd = () => {
    // Delay clearing state to let animation finish
    setTimeout(() => {
      setDraggedIndex(null)
      setDragOverIndex(null)
    }, 200)
  }

  const moveSection = async (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newSections.length) return
    
    // Swap sections
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]
    
    // Update order numbers
    newSections[index].orderNumber = index + 1
    newSections[targetIndex].orderNumber = targetIndex + 1
    
    try {
      await updateSectionOrderMutation.mutateAsync(
        newSections.map(s => ({
          id: s.id,
          orderNumber: s.orderNumber
        }))
      )
      toast.success('Đã cập nhật thứ tự phần')
      refetchSections()
    } catch (error) {
      toast.error('Lỗi khi cập nhật thứ tự phần')
      console.error('Error updating section order:', error)
    }
  }

  const handleEditSection = (section: Section) => {
    setEditingSectionId(section.id)
    setEditingSectionTitle(section.title)
    setEditingSectionOrderNumber(section.orderNumber)
  }

  const handleDeleteSection = (sectionId: string, sectionName: string) => {
    setDeletingSectionId(sectionId)
    setDeletingSectionName(sectionName)
  }

  const handleDeleteSectionConfirm = async () => {
    if (!deletingSectionId) return
    
    try {
      await deleteSectionMutation.mutateAsync(deletingSectionId)
      setDeletingSectionId(null)
      setDeletingSectionName("")
      toast.success('Đã xóa phần thành công')
      // No need to manually refetch - the mutation already invalidates queries
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Lỗi khi xóa phần'
        : error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Lỗi khi xóa phần'
      toast.error(errorMessage)
      console.error('Error deleting section:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/staff/courses/${courseSlug}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{course?.name}</h1>
          <p className="text-muted-foreground">
            Quản lý các phần học
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm phần mới
        </Button>
      </div>

      {/* Course Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin khóa học</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Danh mục</p>
              <p className="font-medium">{course?.categoryName || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng số phần</p>
              <p className="font-medium">{sections.length} phần</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng số bài học</p>
              <p className="font-medium">{course?.totalLessons || 0} bài</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Thời lượng</p>
              <p className="font-medium">{course?.totalDuration ? formatDuration(course.totalDuration) : '0h 0m'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách phần</CardTitle>
          <CardDescription>
            {sections.length} phần trong khóa học này
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">STT</TableHead>
                  <TableHead>Tên phần</TableHead>
                  <TableHead>Số bài học</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Chưa có phần nào. Hãy tạo phần đầu tiên!
                    </TableCell>
                  </TableRow>
                ) : (
                  sections.map((section, index) => {
                    const isDragging = draggedIndex === index
                    const isDragOverBefore = dragOverIndex === index && draggedIndex !== null && draggedIndex > index
                    const isDragOverAfter = dragOverIndex === index && draggedIndex !== null && draggedIndex < index
                    
                    return (
                    <TableRow 
                      key={section.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`
                        transition-all duration-300 ease-out
                        ${isDragging ? 'scale-95 shadow-lg bg-muted/50' : ''}
                        ${isDragOverBefore ? 'translate-y-3' : ''}
                        ${isDragOverAfter ? '-translate-y-3' : ''}
                      `}
                      style={{
                        marginTop: isDragOverBefore ? '24px' : '4px',
                        marginBottom: isDragOverAfter ? '24px' : '4px',
                        willChange: draggedIndex !== null ? 'transform, margin' : 'auto',
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                          <span className="font-medium">{section.orderNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{section.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {section.lessons?.length || 0} bài
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => moveSection(index, 'up')}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => moveSection(index, 'down')}
                            disabled={index === sections.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
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
                              <DropdownMenuItem onClick={() => handleEditSection(section)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/staff/courses/${courseSlug}`}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Quản lý bài học
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteSection(section.id, section.title)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <DeleteSectionDialog
        open={!!deletingSectionId}
        sectionTitle={deletingSectionName}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingSectionId(null)
            setDeletingSectionName("")
          }
        }}
        onConfirm={handleDeleteSectionConfirm}
        isDeleting={deleteSectionMutation.isPending}
      />

      <CreateSectionModal
        courseId={courseId}
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => {
          refetchSections()
          toast.success('Đã tạo phần mới thành công')
        }}
      />

      <EditSectionModal
        sectionId={editingSectionId || ''}
        currentTitle={editingSectionTitle}
        currentOrderNumber={editingSectionOrderNumber}
        open={!!editingSectionId}
        onOpenChange={(open) => {
          if (!open) {
            setEditingSectionId(null)
            setEditingSectionTitle("")
            setEditingSectionOrderNumber(0)
          }
        }}
        onSuccess={() => {
          refetchSections()
          toast.success('Đã cập nhật phần thành công')
        }}
      />
    </div>
  )
}
