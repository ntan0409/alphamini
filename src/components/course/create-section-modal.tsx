"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useCreateSection } from "@/features/courses/hooks"
import { toast } from "sonner"

interface CreateSectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: string
  courseSlug?: string
  onSuccess?: () => void
}

export function CreateSectionModal({
  open,
  onOpenChange,
  courseId,
  courseSlug,
  onSuccess,
}: CreateSectionModalProps) {
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")
  const createSectionMutation = useCreateSection(courseId, courseSlug)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!title.trim()) {
      setError("Tiêu đề section không được để trống")
      return
    }

    try {
      await createSectionMutation.mutateAsync({
        title: title.trim()
      })
      
      // Reset form and close modal
      setTitle("")
      setError("")
      onOpenChange(false)
      toast.success("Đã tạo chương thành công")
      onSuccess?.()
    } catch (error: unknown) {
      console.error("Error creating section:", error)
      // Extract error message from API response
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Lỗi khi tạo chương"
        : error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : "Lỗi khi tạo chương"
      toast.error(errorMessage)
      setError(errorMessage)
    }
  }

  const handleClose = () => {
    if (!createSectionMutation.isPending) {
      setTitle("")
      setError("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm chương mới</DialogTitle>
          <DialogDescription>
            Tạo chương mới cho khóa học. Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề chương</Label>
            <Input
              id="title"
              placeholder="Nhập tiêu đề chương..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setError("")
              }}
              disabled={createSectionMutation.isPending}
              className={error ? "border-red-500" : ""}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createSectionMutation.isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={createSectionMutation.isPending}>
              {createSectionMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Tạo chương
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
