"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import Link from "next/link"
import { useCreateCategory } from "@/features/courses/hooks"
import { toast } from "sonner"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

export default function NewCategoryPage() {
  const router = useRouter()
  const createCategory = useCreateCategory()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!imageFile) {
      toast.error("Vui lòng chọn hình ảnh cho danh mục")
      return
    }

    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục")
      return
    }

    if (!formData.description.trim()) {
      toast.error("Vui lòng nhập mô tả danh mục")
      return
    }

    createCategory.mutate({
      name: formData.name,
      description: formData.description,
      image: imageFile,
    }, {
      onSuccess: () => {
        toast.success("Tạo danh mục thành công!")
      },
      onError: (error: unknown) => {
        const errorMessage = error && typeof error === 'object' && 'response' in error 
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
          : undefined;
        toast.error(errorMessage || "Có lỗi xảy ra khi tạo danh mục")
      }
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Vui lòng chọn file hình ảnh")
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 5MB")
        return
      }

      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/staff/categories">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tạo danh mục mới</h1>
          <p className="text-muted-foreground">
            Thêm danh mục khóa học mới vào hệ thống
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin danh mục</CardTitle>
            <CardDescription>
              Điền thông tin chi tiết cho danh mục mới
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Tên danh mục *</Label>
              <Input
                id="name"
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
              <Label htmlFor="description">Mô tả *</Label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => handleChange("description", value)}
                placeholder="Mô tả chi tiết về danh mục này..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Hình ảnh *</Label>
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="image"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent"
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click để tải lên hình ảnh
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, GIF (tối đa 5MB)
                      </p>
                    </div>
                  </Label>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link href="/staff/categories">
                <Button type="button" variant="outline">
                  Hủy
                </Button>
              </Link>
              <Button type="submit" disabled={createCategory.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {createCategory.isPending ? "Đang lưu..." : "Lưu danh mục"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
