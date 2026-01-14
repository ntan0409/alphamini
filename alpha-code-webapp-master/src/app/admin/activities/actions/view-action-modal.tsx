"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Action } from "@/types/action"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, FileText, Hash, Settings, ToggleLeft, ToggleRight } from "lucide-react"


interface ViewActionModalProps {
  isOpen: boolean
  onClose: () => void
  action: Action | null
}

export function ViewActionModal({ 
  isOpen, 
  onClose, 
  action
}: ViewActionModalProps) {
  if (!action) return null

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return dateString
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

  const getTypeBadge = (type: number) => {
    if (type === 1) {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
          Yếu
        </Badge>
      )
    } else if (type === 2) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
          Trung bình
        </Badge>
      )
    } else if (type === 3) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
          Mạnh
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          Không xác định
        </Badge>
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <FileText className="h-5 w-5" />
            Xem chi tiết hành động
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về hành động này
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông tin cơ bản</h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <Hash className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">ID</label>
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded border break-all">
                    {action.id}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Hash className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Mã hành động</label>
                  <p className="text-sm text-blue-900 font-mono bg-blue-50 p-2 rounded border">
                    {action.code}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Tên hành động</label>
                  <p className="text-sm text-gray-900 bg-purple-50 p-2 rounded border">
                    {action.name}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Mô tả</label>
                  <p className="text-sm text-gray-900 bg-yellow-50 p-2 rounded border min-h-[40px]">
                    {action.description || 'Không có mô tả'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Icon</label>
                  <p className="text-sm text-gray-900 bg-red-50 p-2 rounded border">
                    {action.icon || 'Không có icon'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Cấu hình</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Thời lượng</label>
                  <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded border font-medium">
                    {action.duration} giây
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Settings className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                  <div className="mt-1">
                    {getStatusBadge(action.status)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                {action.canInterrupt ? (
                  <ToggleRight className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                ) : (
                  <ToggleLeft className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Có thể ngắt giữa chừng</label>
                  <p className={`text-sm p-2 rounded border font-medium ${
                    action.canInterrupt 
                      ? 'text-green-700 bg-green-50' 
                      : 'text-red-700 bg-red-50'
                  }`}>
                    {action.canInterrupt ? 'Có' : 'Không'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Settings className="h-4 w-4 text-indigo-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Cường độ</label>
                  <div className="mt-1">
                    {getTypeBadge(action.type)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Thời gian</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Ngày tạo</label>
                  <p className="text-sm text-gray-900 bg-blue-50 p-2 rounded border font-mono">
                    {formatDate(action.createdDate)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Cập nhật lần cuối</label>
                  <p className="text-sm text-gray-900 bg-orange-50 p-2 rounded border font-mono">
                    {formatDate(action.lastUpdate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
