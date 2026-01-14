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
import { SubscriptionPlan } from "@/types/subscription"
import { AlertTriangle } from "lucide-react"

interface DeleteSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  subscription: SubscriptionPlan | null
  isDeleting?: boolean
}

export function DeleteSubscriptionModal({
  isOpen,
  onClose,
  onConfirm,
  subscription,
  isDeleting = false,
}: DeleteSubscriptionModalProps) {
  if (!subscription) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Xóa gói đăng ký
          </DialogTitle>
          <DialogDescription className="text-left">
            Bạn có chắc chắn muốn xóa gói đăng ký này không?
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 p-4 rounded-md space-y-2">
          <div className="text-sm">
            <span className="font-medium text-gray-700">ID:</span>
            <span className="ml-2 text-gray-900">{subscription.id}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Tên gói:</span>
            <span className="ml-2 text-gray-900">{subscription.name}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Mô tả:</span>
            <span className="ml-2 text-gray-900">
              {subscription.description || "Không có mô tả"}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Giá:</span>
            <span className="ml-2 text-gray-900">{subscription.price?.toLocaleString()} VNĐ</span>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Đang xóa..." : "Xóa gói đăng ký"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
