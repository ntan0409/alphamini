"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SubscriptionPlan } from "@/types/subscription"
import {
  Calendar,
  FileText,
  Hash,
  DollarSign,
  RefreshCcw,
  Settings,
} from "lucide-react"

interface ViewSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  subscription: SubscriptionPlan | null
}

export function ViewSubscriptionModal({
  isOpen,
  onClose,
  subscription,
}: ViewSubscriptionModalProps) {
  if (!subscription) return null

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  const getBillingCycleText = (cycle: number) => {
    switch (cycle) {
      case 1:
        return "Hàng tháng"
      case 2:
        return "Hàng năm"
      default:
        return "Không xác định"
    }
  }

  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
          Kích hoạt
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
          Không kích hoạt
        </Badge>
      )
    }
  }

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <FileText className="h-5 w-5" />
            Xem chi tiết gói đăng ký
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về gói đăng ký này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Thông tin cơ bản
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <Hash className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">ID</label>
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded border break-all">
                    {subscription.id}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Tên gói
                  </label>
                  <p className="text-sm text-gray-900 bg-purple-50 p-2 rounded border">
                    {subscription.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Mô tả
                  </label>
                  <p className="text-sm text-gray-900 bg-yellow-50 p-2 rounded border min-h-[40px]">
                    {subscription.description || "Không có mô tả"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Cấu hình
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <DollarSign className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Giá
                  </label>
                  <p className="text-sm text-green-700 bg-green-50 p-2 rounded border font-medium">
                    {formatPrice(subscription.price)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RefreshCcw className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Chu kỳ thanh toán
                  </label>
                  <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded border font-medium">
                    {getBillingCycleText(subscription.billingCycle)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Settings className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Trạng thái
                  </label>
                  <div className="mt-1">{getStatusBadge(subscription.status)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Thời gian
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Ngày tạo
                  </label>
                  <p className="text-sm text-gray-900 bg-blue-50 p-2 rounded border font-mono">
                    {formatDate(subscription.createdDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Cập nhật lần cuối
                  </label>
                  <p className="text-sm text-gray-900 bg-orange-50 p-2 rounded border font-mono">
                    {formatDate(subscription.lastUpdated)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
