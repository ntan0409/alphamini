"use client"

import { useState, useEffect } from "react"
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
import { useUpdateSection } from "@/features/courses/hooks"
import { toast } from "sonner"

interface EditSectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sectionId: string
  currentTitle: string
  currentOrderNumber: number
  onSuccess?: () => void
}

export function EditSectionModal({
  open,
  onOpenChange,
  sectionId,
  currentTitle,
  currentOrderNumber,
  onSuccess,
}: EditSectionModalProps) {
  const [title, setTitle] = useState(currentTitle)
  const [error, setError] = useState("")
  const updateSectionMutation = useUpdateSection(sectionId)

  // Update title when currentTitle changes
  useEffect(() => {
    if (open) {
      setTitle(currentTitle)
      setError("")
    }
  }, [open, currentTitle])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!title.trim()) {
      setError("Tiêu đề section không được để trống")
      return
    }

    try {
      await updateSectionMutation.mutateAsync({
        title: title.trim(),
        orderNumber: currentOrderNumber, // Use the current order number
      })
      
      // Reset form and close modal
      setTitle("")
      setError("")
      onOpenChange(false)
      onSuccess?.()
      toast.success("Đã cập nhật chương thành công")
    } catch (error: unknown) {
      console.error("Error updating section:", error)
      // Extract error message from API response
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Lỗi khi cập nhật chương"
        : error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : "Lỗi khi cập nhật chương"
      toast.error(errorMessage)
      setError(errorMessage)
    }
  }

  const handleClose = () => {
    if (!updateSectionMutation.isPending) {
      setTitle(currentTitle)
      setError("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa chương</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin chương. Nhấn lưu khi hoàn tất.
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
              disabled={updateSectionMutation.isPending}
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
              disabled={updateSectionMutation.isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={updateSectionMutation.isPending}>
              {updateSectionMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
