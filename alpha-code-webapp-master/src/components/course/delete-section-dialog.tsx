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

interface DeleteSectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isDeleting: boolean
  sectionTitle: string
}

export function DeleteSectionDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
  sectionTitle,
}: DeleteSectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Xác nhận xóa chương</DialogTitle>
          </div>
          <DialogDescription className="space-y-2 pt-4">
            <p>
              Bạn có chắc chắn muốn xóa chương <strong>&quot;{sectionTitle}&quot;</strong>?
            </p>
            <p className="text-destructive font-medium">
              ⚠️ Tất cả bài học trong chương này cũng sẽ bị xóa và không thể khôi phục.
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
            Xóa chương
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
