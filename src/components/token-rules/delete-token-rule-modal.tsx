"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { TokenRule } from "@/types/pricing"
import { useDeleteTokenRule } from "@/features/config/hooks/use-token-rule"
import { Loader2, AlertTriangle } from "lucide-react"

interface DeleteTokenRuleModalProps {
  isOpen: boolean
  onClose: () => void
  tokenRule: TokenRule | null
}

export default function DeleteTokenRuleModal({
  isOpen,
  onClose,
  tokenRule
}: DeleteTokenRuleModalProps) {
  const deleteMutation = useDeleteTokenRule()

  const handleDelete = async () => {
    if (!tokenRule) return

    try {
      await deleteMutation.mutateAsync(tokenRule.id)
      onClose()
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleClose = () => {
    if (!deleteMutation.isPending) {
      onClose()
    }
  }

  if (!tokenRule) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Xác nhận xóa
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Hành động này không thể hoàn tác. Token rule sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Mã luật:</span>
                <span className="font-semibold">{tokenRule.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Chi phí:</span>
                <span className="font-semibold text-green-600">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(tokenRule.cost)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={deleteMutation.isPending}
          >
            Hủy
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              "Xóa token rule"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}