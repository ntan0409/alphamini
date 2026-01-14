"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, Upload, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCreateCourse, useCourse } from "@/features/courses/hooks"
import { toast } from "sonner"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

const levelOptions = [
  { value: "1", label: "Cơ bản" },
  { value: "2", label: "Trung bình" },
  { value: "3", label: "Nâng cao" },
]

export default function NewCoursePage() {
  const createCourse = useCreateCourse()
  const { useGetCategories } = useCourse()
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategories(1, 100)
  
  const categories = categoriesData?.data || []

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    level: "1",
    price: "",
    requireLicense: false,
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Vui lòng chọn file ảnh")
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Tên khóa học là bắt buộc")
      return
    }

    if (formData.name.length > 255) {
      toast.error("Tên khóa học không được vượt quá 255 ký tự")
      return
    }
    
    if (!formData.description.trim()) {
      toast.error("Mô tả khóa học là bắt buộc")
      return
    }
    
    if (!formData.categoryId) {
      toast.error("Danh mục là bắt buộc")
      return
    }
    
    if (!formData.price || parseInt(formData.price) < 0) {
      toast.error("Giá khóa học là bắt buộc và phải lớn hơn hoặc bằng 0")
      return
    }

    if (!imageFile) {
      toast.error("Ảnh danh mục là bắt buộc")
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData for multipart/form-data
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('description', formData.description)
      submitData.append('categoryId', formData.categoryId)
      submitData.append('level', formData.level)
      submitData.append('price', formData.price)
      submitData.append('requireLicense', formData.requireLicense.toString())
      submitData.append('image', imageFile)

      await createCourse.mutateAsync(submitData)
      
      toast.success("Tạo khóa học thành công!")
      // Router will be handled by the mutation's onSuccess
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : undefined;
      toast.error(errorMessage || "Lỗi khi tạo khóa học")
      console.error("Error creating course:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/staff/courses">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tạo khóa học mới</h1>
          <p className="text-muted-foreground">
            Điền thông tin để tạo khóa học mới
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin khóa học</CardTitle>
            <CardDescription>
              Nhập đầy đủ thông tin về khóa học
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên khóa học <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên khóa học..."
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Mô tả <span className="text-destructive">*</span>
              </Label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => handleInputChange("description", value)}
                placeholder="Nhập mô tả khóa học..."
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Danh mục <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => handleInputChange("categoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesLoading ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Level */}
              <div className="space-y-2">
                <Label htmlFor="level">
                  Cấp độ <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => handleInputChange("level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cấp độ" />
                  </SelectTrigger>
                  <SelectContent>
                    {levelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  Giá (VNĐ) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Require License */}
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="requireLicense">Yêu cầu giấy phép</Label>
                <p className="text-sm text-muted-foreground">
                  Khóa học này có yêu cầu giấy phép để tham gia không?
                </p>
              </div>
              <Switch
                id="requireLicense"
                checked={formData.requireLicense}
                onCheckedChange={(checked) => handleInputChange("requireLicense", checked)}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">
                Ảnh khóa học <span className="text-destructive">*</span>
              </Label>
              
              {imagePreview ? (
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
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-10 w-10 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click để tải ảnh lên</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF (MAX. 5MB)
                      </p>
                    </div>
                    <Input
                      id="image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Tải lên ảnh đại diện cho khóa học (bắt buộc)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || createCourse.isPending}
                className="min-w-[120px]"
              >
                {(isSubmitting || createCourse.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Tạo khóa học
              </Button>
              <Link href="/staff/courses">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting || createCourse.isPending}
                >
                  Hủy
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
