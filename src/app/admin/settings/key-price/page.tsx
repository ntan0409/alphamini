"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Key, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import LoadingGif from '@/components/ui/loading-gif'
import { useCreateKeyPrice, useGetKeyPrice, useUpdateKeyPrice } from '@/features/config/hooks/use-key-price'
import ErrorState from '@/components/error-state'

export default function KeyPricePage() {
  const { data: keyPrice, isLoading, error , refetch} = useGetKeyPrice()
  const updateMutation = useUpdateKeyPrice()
  const createMutation = useCreateKeyPrice()

  const [formData, setFormData] = useState({
    value: keyPrice?.price?.toString() || '',
    note: ''
  })

  // sync form when keyPrice loads or changes (handles case when there's no key)
  useEffect(() => {
    setFormData(prev => ({ ...prev, value: keyPrice?.price?.toString() || '' }))
  }, [keyPrice])

  const isSaving = updateMutation.isPending || createMutation.isPending

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.value) {
      toast.error('Vui lòng nhập giá key')
      return
    }

    const value = parseInt(formData.value)
    if (isNaN(value) || value <= 0) {
      toast.error('Giá key phải là số nguyên dương')
      return
    }

    try {
      if (keyPrice?.id) {
        await updateMutation.mutateAsync({ id: keyPrice.id, price: value })
      } else {
        await createMutation.mutateAsync(value)
      }

      toast.success('Cập nhật giá key thành công!')
    } catch {
      toast.error('Có lỗi xảy ra khi lưu giá key')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingGif size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <ErrorState onRetry={refetch} error={error}/>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-5">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cấu hình giá Key</h1>
        <p className="text-muted-foreground">
          Thiết lập giá trị Key trong hệ thống
        </p>
      </div>

      {/* Current Value Display */}
      {keyPrice && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Giá Key hiện tại</CardTitle>
              <CardDescription>Giá trị đang được sử dụng trong hệ thống</CardDescription>
            </div>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(keyPrice.price)}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Cập nhật lần cuối: {new Date(keyPrice.lastUpdated).toLocaleString('vi-VN')}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle>Cập nhật giá Key</CardTitle>
          <CardDescription>
            Thay đổi giá Key và ghi chú nếu cần
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="value">Giá Key (VND) *</Label>
              <Input
                id="value"
                type="number"
                min="1"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                placeholder="VD: 99000"
                required
                disabled={isSaving}
              />
              <p className="text-sm text-muted-foreground">
                Giá trị này sẽ được áp dụng cho tất cả Key trong hệ thống
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu cấu hình
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin Key</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-2">
              <li>• 1 Key = {formData.value ? formatCurrency(parseInt(formData.value) || 0) : '0 VND'}</li>
              <li>• Key cung cấp quyền truy cập đầy đủ</li>
              <li>• Thay đổi có hiệu lực ngay lập tức</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lưu ý quan trọng</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-2">
              <li>• Kiểm tra kỹ trước khi thay đổi giá</li>
              <li>• Thông báo cho người dùng trước khi điều chỉnh</li>
              <li>• Key không thể hoàn lại sau khi bán</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
