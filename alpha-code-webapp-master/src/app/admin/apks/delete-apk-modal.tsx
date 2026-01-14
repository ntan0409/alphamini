"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RobotApk } from "@/types/robot-apk"
import { useDeleteRobotApk } from "@/features/apks/hooks/use-robot-apk"

interface DeleteApkModalProps {
  isOpen: boolean
  onClose: () => void
  apk: RobotApk | null
  onSuccess: () => void
}

export function DeleteApkModal({ isOpen, onClose, apk, onSuccess }: DeleteApkModalProps) {
  const deleteMutation = useDeleteRobotApk()

  const handleDelete = async () => {
    if (!apk) return
    await deleteMutation.mutateAsync(apk.id)
    onSuccess()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Xóa APK</DialogTitle>
        </DialogHeader>
        <p>Bạn có chắc muốn xóa APK phiên bản <b>{apk?.version}</b> cho model <b>{apk?.robotModelName}</b>?</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


