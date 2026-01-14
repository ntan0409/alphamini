"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TokenRule } from "@/types/pricing"

interface ViewTokenRuleModalProps {
  isOpen: boolean
  onClose: () => void
  tokenRule: TokenRule | null
}

export default function ViewTokenRuleModal({
  isOpen,
  onClose,
  tokenRule
}: ViewTokenRuleModalProps) {
  if (!tokenRule) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chi tiết token rule</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Mã luật</label>
              <div className="font-semibold">{tokenRule.code}</div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Chi phí</label>
              <div className="font-semibold text-green-600">
                {formatCurrency(tokenRule.cost)}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">Ghi chú</label>
            <div className="p-3 bg-gray-50 rounded-md min-h-[60px]">
              {tokenRule.note || "Không có ghi chú"}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
              <div className="text-sm">
                {new Date(tokenRule.createdDate).toLocaleString('vi-VN')}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Cập nhật cuối</label>
              <div className="text-sm">
                {new Date(tokenRule.lastUpdated).toLocaleString('vi-VN')}
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">ID</span>
              <span className="text-xs text-gray-400 font-mono">{tokenRule.id}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}