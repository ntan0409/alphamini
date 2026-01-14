"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"
import { useUpdateCategory } from "@/features/courses/hooks"
import { toast } from "sonner"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import Image from "next/image"

interface EditCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: {
    id: string
    name: string
    description: string
    imageUrl?: string
    status: number
  }
}

export function EditCategoryModal({
  open,
  onOpenChange,
  category,
}: EditCategoryModalProps) {
  const updateCategory = useUpdateCategory(category.id)
  const [formData, setFormData] = useState({
    name: category.name,
    description: category.description,
    status: category.status,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(category.imageUrl || "")

  // Update form when category changes
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        status: category.status,
      })
      setImagePreview(category.imageUrl || "")
      setImageFile(null)
    }
  }, [category])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(category.imageUrl || "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục")
      return
    }

    if (!formData.description.trim()) {
      toast.error("Vui lòng nhập mô tả danh mục")
      return
    }

    try {
      const submitData = new FormData()
      submitData.append('id', category.id)
      submitData.append('name', formData.name)
      submitData.append('description', formData.description)
      submitData.append('status', formData.status.toString())

      // If new image is selected, add it to FormData
      if (imageFile) {
        submitData.append('image', imageFile)
      } else if (category.imageUrl) {
        // Keep existing image URL if no new image
        submitData.append('imageUrl', category.imageUrl)
      }

      await updateCategory.mutateAsync(submitData)
      toast.success("Cập nhật danh mục thành công!")
      onOpenChange(false)
    } catch (error) {
      toast.error("Lỗi khi cập nhật danh mục")
      console.error("Error updating category:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cho danh mục &quot;{category.name}&quot;
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                Tên danh mục <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-name"
                placeholder="VD: Lập trình cơ bản"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Đường dẫn (slug) sẽ được tự động tạo từ tên danh mục
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">
                Mô tả <span className="text-destructive">*</span>
              </Label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => handleChange("description", value)}
                placeholder="Mô tả chi tiết về danh mục này..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Hình ảnh</Label>
              {imagePreview ? (
                <div className="space-y-2">
                  <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => document.getElementById('edit-image')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Đổi ảnh khác
                    </Button>
                  </div>
                  <input
                    id="edit-image"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="edit-image-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-10 w-10 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click để tải ảnh lên</span> hoặc kéo thả
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG (MAX. 5MB)
                      </p>
                    </div>
                    <input
                      id="edit-image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {imageFile ? "Ảnh mới đã được chọn" : "Giữ nguyên ảnh hiện tại hoặc chọn ảnh mới"}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateCategory.isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={updateCategory.isPending}>
              {updateCategory.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Cập nhật
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
