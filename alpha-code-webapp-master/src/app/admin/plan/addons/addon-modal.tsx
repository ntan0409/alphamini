'use client'

import { useEffect } from "react"
import { useForm } from "react-hook-form"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAddon } from "@/features/addon/hooks/use-addon"
import { Addon, AddonModal } from "@/types/addon"
import { toast } from "sonner"
import "react-quill-new/dist/quill.snow.css"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

interface CreateAddonModalProps {
  isOpen: boolean
  onClose: () => void
  editAddon?: Addon | null
  mode?: "create" | "edit"
  onSuccess?: () => void
}

// ✅ Updated CATEGORY_MAP with Magic Sketch (Category 5)
const CATEGORY_MAP = [
  { value: 1, label: "OSMO" },
  { value: 2, label: "QR CODE" },
  { value: 3, label: "NHÀ THÔNG MINH" },
  { value: 4, label: "LẬP TRÌNH BLOCKLY" },
  { value: 5, label: "PHÉP THUẬT TRANH VẼ" } // New Category
]

const STATUS_MAP = [
  { value: 1, label: "Đang hoạt động" },
  { value: 2, label: "Không hoạt động" },
]

export function CreateAddonModal({
  isOpen,
  onClose,
  editAddon = null,
  mode = "create",
  onSuccess,
}: CreateAddonModalProps) {
  const { useCreateAddon, useUpdateAddon } = useAddon()
  const createAddonMutation = useCreateAddon()
  const updateAddonMutation = useUpdateAddon()

  const isEditMode = mode === "edit" && !!editAddon

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddonModal>({
    defaultValues: {
      id: "",
      name: "",
      description: "",
      price: 0,
      category: 1,
      status: 1,
    },
  })

  useEffect(() => {
    if (isEditMode && editAddon) {
      reset({
        id: editAddon.id,
        name: editAddon.name,
        description: editAddon.description,
        price: editAddon.price,
        category: editAddon.category,
        status: editAddon.status,
      })
    } else {
      reset({
        id: "",
        name: "",
        description: "",
        price: 0,
        category: 1,
        status: 1,
      })
    }
  }, [isEditMode, editAddon, reset])

  const category = watch("category")
  const status = watch("status")

  const onSubmit = async (data: AddonModal) => {
    try {
      if (isEditMode && editAddon) {
        await updateAddonMutation.mutateAsync({ id: editAddon.id, data })
        toast.success("Cập nhật Addon thành công!")
      } else {
        await createAddonMutation.mutateAsync(data)
        toast.success("Tạo Addon mới thành công!")
      }

      reset()
      onClose()
      onSuccess?.()
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      toast.error(isEditMode ? errorMessage || "Lỗi khi cập nhật addon" : errorMessage || "Lỗi khi tạo addon")
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Chỉnh sửa Addon" : "Tạo Addon mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Cập nhật thông tin addon hiện tại."
              : "Nhập thông tin để tạo addon mới."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên Addon *</Label>
            <Input
              id="name"
              {...register("name", {
                required: "Vui lòng nhập tên addon",
                minLength: { value: 2, message: "Tên phải có ít nhất 2 ký tự" },
              })}
              placeholder="Nhập tên addon"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            {isOpen && (
              <ReactQuill
                theme="snow"
                value={watch("description") || ""}
                onChange={(value) => setValue("description", value)}
                placeholder="Nhập mô tả cho addon..."
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
              placeholder="Nhập giá addon"
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Danh mục *</Label>
            <Select
              value={category?.toString()}
              onValueChange={(v) => setValue("category", parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_MAP.map((c) => (
                  <SelectItem key={c.value} value={c.value.toString()}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái *</Label>
            <Select
              value={status?.toString()}
              onValueChange={(v) => setValue("status", parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_MAP.map((s) => (
                  <SelectItem key={s.value} value={s.value.toString()}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
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