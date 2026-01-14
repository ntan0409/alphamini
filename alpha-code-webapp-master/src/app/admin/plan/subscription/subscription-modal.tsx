"use client"

import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useSubscription } from "@/features/subscription/hooks/use-subscription"
import { SubscriptionPlan, SubscriptionPlanModal } from "@/types/subscription"
import { toast } from "sonner"
import "react-quill-new/dist/quill.snow.css"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

interface CreateSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  editSubscription?: SubscriptionPlan | null
  mode?: "create" | "edit"
}

export function CreateSubscriptionModal({
  isOpen,
  onClose,
  editSubscription = null,
  mode = "create",
}: CreateSubscriptionModalProps) {
  const { useCreateSubscription, useUpdateSubscription } = useSubscription()
  const createSubscriptionMutation = useCreateSubscription()
  const updateSubscriptionMutation = useUpdateSubscription()

  const isEditMode = mode === "edit" && !!editSubscription
  const [isQuillReady, setIsQuillReady] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionPlanModal & { id?: string }>({
    defaultValues: {
      id: "",
      name: "",
      description: "",
      price: 0,
      billingCycle: 1,
      isRecommended : false,
    },
  })

  useEffect(() => {
    if (isEditMode && editSubscription) {
      reset({
        id: editSubscription.id,
        name: editSubscription.name,
        description: editSubscription.description,
        price: editSubscription.price,
        billingCycle: editSubscription.billingCycle,
        isRecommended : editSubscription.isRecommended  ?? false,
      })
    } else {
      reset({
        id: "",
        name: "",
        description: "",
        price: 0,
        billingCycle: 1,
        isRecommended : false,
      })
    }
  }, [isEditMode, editSubscription, reset])

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsQuillReady(true), 50)
      return () => clearTimeout(timer)
    } else {
      setIsQuillReady(false)
    }
  }, [isOpen])

  const billingCycle = watch("billingCycle")
  const isRecommended  = watch("isRecommended")

  const onSubmit = async (data: SubscriptionPlanModal & { id?: string }) => {
    try {
      let response
      if (isEditMode && editSubscription) {
        response = await updateSubscriptionMutation.mutateAsync({
          id: editSubscription.id,
          data,
        })
      } else {
        response = await createSubscriptionMutation.mutateAsync(data)
      }

      toast.success(
        response?.message ||
          (isEditMode
            ? "Cập nhật gói đăng ký thành công!"
            : "Tạo gói đăng ký mới thành công!")
      )

      reset()
      onClose()
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      toast.error(isEditMode ? errorMessage || "Lỗi khi cập nhật gói đăng ký" : errorMessage || "Lỗi khi tạo gói đăng ký")
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Chỉnh sửa gói đăng ký" : "Tạo gói đăng ký mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Cập nhật thông tin gói đăng ký hiện tại."
              : "Nhập thông tin để tạo gói đăng ký mới."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ✅ ID (readonly khi edit) */}
          {isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="id">Mã gói</Label>
              <Input
                id="id"
                {...register("id")}
                disabled
                className="bg-gray-100 text-gray-600"
              />
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên gói *</Label>
            <Input
              id="name"
              {...register("name", {
                required: "Vui lòng nhập tên gói",
                minLength: { value: 2, message: "Tên gói phải có ít nhất 2 ký tự" },
              })}
              placeholder="Nhập tên gói đăng ký"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            {isQuillReady && (
              <ReactQuill
                theme="snow"
                value={watch("description") || ""}
                onChange={(value) => setValue("description", value)}
                placeholder="Nhập mô tả cho gói đăng ký..."
                className="bg-white rounded-md"
              />
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Giá (VNĐ) *</Label>
            <Input
              id="price"
              type="number"
              {...register("price", {
                required: "Vui lòng nhập giá",
                min: { value: 0, message: "Giá không được âm" },
                valueAsNumber: true,
              })}
              placeholder="Nhập giá gói"
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
          </div>

          {/* Billing Cycle */}
          <div className="space-y-2">
            <Label htmlFor="billingCycle">Chu kỳ thanh toán *</Label>
            <Select
              value={billingCycle.toString()}
              onValueChange={(v) => setValue("billingCycle", parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn chu kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 tháng</SelectItem>
                <SelectItem value="3">3 tháng</SelectItem>
                <SelectItem value="9">9 tháng</SelectItem>
                <SelectItem value="12">1 năm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recommended Switch */}
          <div className="flex items-center space-x-3 pt-2">
            <Switch
              id="isRecommended"
              checked={isRecommended}
              onCheckedChange={(checked) => setValue("isRecommended", checked)}
              disabled={isSubmitting}
            />
            <Label htmlFor="isRecommended " className="text-sm font-medium cursor-pointer">
              Gói được đề xuất
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Đóng
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? "Đang cập nhật..."
                  : "Đang tạo..."
                : isEditMode
                ? "Cập nhật"
                : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
