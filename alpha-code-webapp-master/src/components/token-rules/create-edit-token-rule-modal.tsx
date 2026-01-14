"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { TokenRule } from "@/types/pricing"
import { useCreateTokenRule, useUpdateTokenRule } from "@/features/config/hooks/use-token-rule"
import { Loader2 } from "lucide-react"

interface CreateEditTokenRuleModalProps {
  isOpen: boolean
  onClose: () => void
  tokenRule?: TokenRule | null
  mode: "create" | "edit"
}

export default function CreateEditTokenRuleModal({
  isOpen,
  onClose,
  tokenRule,
  mode
}: CreateEditTokenRuleModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    cost: "",
    note: ""
  })

  const createMutation = useCreateTokenRule()
  const updateMutation = useUpdateTokenRule()

  const isLoading = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && tokenRule) {
        setFormData({
          code: tokenRule.code || "",
          cost: tokenRule.cost?.toString() || "",
          note: tokenRule.note || ""
        })
      } else {
        setFormData({
          code: "",
          cost: "100",
          note: ""
        })
      }
    }
  }, [isOpen, mode, tokenRule])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.code.trim()) {
      return
    }

    const cost = parseInt(formData.cost)
    if (isNaN(cost) || cost < 0) {
      return
    }

    try {
      if (mode === "create") {
        await createMutation.mutateAsync({
          code: formData.code.trim(),
          cost: cost,
          note: formData.note.trim() || undefined
        })
      } else if (mode === "edit" && tokenRule) {
        await updateMutation.mutateAsync({
          id: tokenRule.id,
          code: formData.code.trim(),
          cost: cost,
          note: formData.note.trim() || undefined
        })
      }
      
      onClose()
    } catch (error) {
      // Error handling is done in the hooks
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tạo token rule mới" : "Chỉnh sửa token rule"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="code">Mã luật *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              placeholder="VD: NLP_TOKEN, AI_SERVICE, API_CALL"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="cost">Chi phí (VND) *</Label>
            <Input
              id="cost"
              type="number"
              min="0"
              value={formData.cost}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
              placeholder="VD: 100"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              placeholder="Mô tả về token rule này..."
              rows={3}
              disabled={isLoading}
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "create" ? "Đang tạo..." : "Đang cập nhật..."}
                </>
              ) : (
                mode === "create" ? "Tạo mới" : "Cập nhật"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}