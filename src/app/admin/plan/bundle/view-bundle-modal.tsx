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
import { Bundle } from "@/types/bundle"
import {
  Calendar,
  FileText,
  Hash,
  DollarSign,
  Percent,
  Settings,
  ImageIcon,
  ShoppingBag,
} from "lucide-react"

interface ViewBundleModalProps {
  isOpen: boolean
  onClose: () => void
  bundle: Bundle | null
}

export function ViewBundleModal({ isOpen, onClose, bundle }: ViewBundleModalProps) {
  if (!bundle) return null

  // 🕒 Định dạng thời gian
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Không có dữ liệu"
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

  // 💰 Format giá
  const formatPrice = (price?: number) =>
    price !== undefined
      ? price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      : "0 ₫"

  // ⚙️ Badge trạng thái
  const getStatusBadge = (status: number) =>
    status === 1 ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-1" />
        Kích hoạt
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        <span className="w-2 h-2 bg-red-500 rounded-full mr-1" />
        Không kích hoạt
      </Badge>
    )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <ShoppingBag className="h-5 w-5" />
            Chi tiết gói Bundle
          </DialogTitle>
          <DialogDescription>Xem thông tin chi tiết của gói dịch vụ</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 🧱 Thông tin cơ bản */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Thông tin cơ bản
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <InfoRow icon={<Hash />} label="ID" value={bundle.id} mono />
              <InfoRow icon={<FileText />} label="Tên gói" value={bundle.name} highlight="purple" />
              <InfoRow
                icon={<FileText />}
                label="Mô tả"
                value={
                  <div
                    dangerouslySetInnerHTML={{
                      __html: bundle.description || "Không có mô tả",
                    }}
                  />
                }
                highlight="yellow"
              />
            </div>
          </section>

          {/* 🖼️ Hình ảnh */}
          {bundle.coverImage && (
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Hình ảnh
              </h3>
              <div className="flex items-center justify-center">
                <img
                  src={bundle.coverImage}
                  alt="Cover Image"
                  className="rounded-lg border w-full max-h-[280px] object-cover shadow"
                />
              </div>
            </section>
          )}

          {/* 💵 Giá */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Giá & Khuyến mãi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow
                icon={<DollarSign />}
                label="Giá gốc"
                value={formatPrice(bundle.price)}
                highlight="green"
              />
              <InfoRow
                icon={<Percent />}
                label="Giá giảm"
                value={bundle.discountPrice ? formatPrice(bundle.discountPrice) : "Không có"}
                highlight="orange"
              />
            </div>
          </section>

          {/* ⚙️ Trạng thái */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Trạng thái
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow
                icon={<Settings />}
                label="Trạng thái"
                value={getStatusBadge(bundle.status)}
              />
            </div>
          </section>

          {/* 🕓 Thời gian */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Thời gian
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow
                icon={<Calendar />}
                label="Ngày tạo"
                value={formatDate(bundle.createdDate)}
                highlight="blue"
                mono
              />
              <InfoRow
                icon={<Calendar />}
                label="Cập nhật lần cuối"
                value={formatDate(bundle.lastUpdated)}
                highlight="yellow"
                mono
              />
            </div>
          </section>
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

/* 🔧 Component con để hiển thị các dòng thông tin gọn gàng */
function InfoRow({
  icon,
  label,
  value,
  highlight,
  mono,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  highlight?: "blue" | "green" | "purple" | "yellow" | "orange"
  mono?: boolean
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
  }

  const colorClass = highlight ? colorMap[highlight] : "bg-gray-50 text-gray-900"

  return (
    <div className="flex items-start gap-3">
      <div className="h-4 w-4 mt-1 text-gray-500 flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div
          className={`text-sm p-2 rounded border mt-1 ${
            mono ? "font-mono" : "font-normal"
          } ${colorClass}`}
        >
          {value}
        </div>
      </div>
    </div>
  )
}
