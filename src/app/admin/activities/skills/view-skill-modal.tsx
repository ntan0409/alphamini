"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Skill } from "@/types/skill"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Hash, Settings, Image as ImageIcon } from "lucide-react"
import Image from "next/image"


interface ViewSkillModalProps { // Đã đổi tên props interface
  isOpen: boolean
  onClose: () => void
  skill: Skill | null // Đã đổi tên prop
}

export function ViewSkillModal({ // Đã đổi tên component
  isOpen, 
  onClose, 
  skill // Đã đổi tên prop
}: ViewSkillModalProps) {

  if (!skill) return null // Đã đổi tên prop

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
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
          Hoạt động
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
          Không hoạt động
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
            Xem chi tiết kỹ năng {/* Đã đổi tên tiêu đề */}
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về kỹ năng này. {/* Đã đổi tên mô tả */}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông tin cơ bản</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <Hash className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">ID</label>
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded border break-all">
                    {skill.id} {/* Đã đổi tên prop */}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Hash className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Mã kỹ năng</label> {/* Đã đổi tên label */}
                  <p className="text-sm text-blue-900 font-mono bg-blue-50 p-2 rounded border">
                    {skill.code} {/* Đã đổi tên prop */}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Tên kỹ năng</label> {/* Đã đổi tên label */}
                  <p className="text-sm text-gray-900 bg-purple-50 p-2 rounded border">
                    {skill.name} {/* Đã đổi tên prop */}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cấu hình */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Cấu hình</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <ImageIcon className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Hình ảnh</label>
                  <div className="mt-1">
                    {skill.icon ? ( // Đã đổi tên prop
                      <div className="space-y-2">
                        <Image 
                          src={skill.icon} // Đã đổi tên prop
                          alt="Skill" // Đã đổi alt text
                          width={96}
                          height={96}
                          className="w-24 h-24 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded border break-all">
                          {skill.icon} {/* Đã đổi tên prop */}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 bg-gray-50 p-2 rounded border">
                        Không có hình ảnh
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Settings className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                  <div className="mt-1">
                    {getStatusBadge(skill.status)} {/* Đã đổi tên prop */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thời gian */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Thời gian</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Ngày tạo</label>
                  <p className="text-sm text-gray-900 bg-blue-50 p-2 rounded border font-mono">
                    {formatDate(skill.createdDate)} {/* Đã đổi tên prop */}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Cập nhật lần cuối</label>
                  <p className="text-sm text-gray-900 bg-orange-50 p-2 rounded border font-mono">
                    {formatDate(skill.lastUpdated)} {/* Đã đổi tên prop */}
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