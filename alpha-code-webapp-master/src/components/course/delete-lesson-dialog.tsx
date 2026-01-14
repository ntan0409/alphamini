"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"

interface DeleteLessonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isDeleting: boolean
  lessonTitle: string
}

export function DeleteLessonDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
  lessonTitle,
}: DeleteLessonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Xác nhận xóa bài học</DialogTitle>
          </div>
          <DialogDescription className="space-y-2 pt-4">
            <p>
              Bạn có chắc chắn muốn xóa bài học <strong>&quot;{lessonTitle}&quot;</strong>?
            </p>
            <p className="text-destructive font-medium">
              ⚠️ Hành động này không thể hoàn tác.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Xóa bài học
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
