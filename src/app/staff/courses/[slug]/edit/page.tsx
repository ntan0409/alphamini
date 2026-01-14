"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
import { ArrowLeft, Loader2, Upload } from "lucide-react"
import Link from "next/link"
import { useStaffCourse, useUpdateCourse, useCourse } from "@/features/courses/hooks"
import { toast } from "sonner"
import { Course, Category } from "@/types/courses"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

const levelOptions = [
  { value: "1", label: "Cơ bản" },
  { value: "2", label: "Trung bình" },
  { value: "3", label: "Nâng cao" },
]

const statusOptions = [
  { value: "1", label: "Đang hoạt động" },
  { value: "2", label: "Không hoạt động" },
  { value: "0", label: "Đã xóa" },
]

export default function EditCoursePage() {
  const params = useParams()
  const courseSlug = params.slug as string

  const { data: course, isLoading: courseLoading } = useStaffCourse(courseSlug)
  const { useGetCategories } = useCourse()
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategories(1, 100)
  
  const categories = categoriesData?.data || []

  // Wait for course to load before rendering the form
  if (courseLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Không tìm thấy khóa học</p>
      </div>
    )
  }

  return <EditCourseForm course={course} categories={categories} categoriesLoading={categoriesLoading} />
}

function EditCourseForm({ 
  course, 
  categories, 
  categoriesLoading 
}: { 
  course: Course
  categories: Category[]
  categoriesLoading: boolean
}) {
  const router = useRouter()
  const updateCourse = useUpdateCourse(course.id, course.slug)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    level: "1", // Default to "Cơ bản"
    price: "",
    image: "",
    status: "1",
    requireLicense: false,
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load course data into form when course is loaded (only once)
  useEffect(() => {
    if (course && course.id && !isInitialized) {
      setFormData({
        name: course.name || "",
        description: course.description || "",
        categoryId: course.categoryId || "",
        level: course.level?.toString() || "1",
        price: course.price?.toString() || "",
        image: course.imageUrl || "",
        status: course.status?.toString() || "1",
        requireLicense: course.requireLicense || false,
      })
      // Set preview from existing image
      if (course.imageUrl) {
        setImagePreview(course.imageUrl)
      }
      setIsInitialized(true)
    }
  }, [course, isInitialized, categories.length])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB')
        return
      }
      
      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      // Clear URL input when file is selected
      setFormData(prev => ({ ...prev, image: '' }))
    }
  }

  const handleImageUrlChange = (url: string) => {
    handleInputChange("image", url)
    if (url) {
      setImagePreview(url)
      setImageFile(null) // Clear file when URL is entered
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên khóa học")
      return
    }
    
    if (!formData.description.trim()) {
      toast.error("Vui lòng nhập mô tả khóa học")
      return
    }
    
    if (!formData.categoryId) {
      toast.error("Vui lòng chọn danh mục")
      return
    }
    
    if (!formData.price || parseInt(formData.price) < 0) {
      toast.error("Vui lòng nhập giá hợp lệ")
      return
    }

    setIsSubmitting(true)

    try {
      await updateCourse.mutateAsync({
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        level: parseInt(formData.level),
        price: parseInt(formData.price),
        image: imageFile || formData.image || undefined,
        status: parseInt(formData.status),
        requireLicense: formData.requireLicense,
      })
      
      toast.success("Cập nhật khóa học thành công!")
      // Router will be handled by the mutation's onSuccess
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : undefined;
      toast.error(errorMessage || "Lỗi khi cập nhật khóa học")
      console.error("Error updating course:", error)
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
          <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa khóa học</h1>
          <p className="text-muted-foreground">
            Cập nhật thông tin khóa học: {course.name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin khóa học</CardTitle>
            <CardDescription>
              Chỉnh sửa thông tin về khóa học
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
                onValueChange={(value) => {
                  if (value) {
                    handleInputChange("categoryId", value)
                  }
                }}
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
                  onValueChange={(value) => {
                    if (value) {
                      handleInputChange("level", value)
                    }
                  }}
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

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Ảnh khóa học</Label>
              <div className="flex gap-2">
                <Input
                  id="image"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  disabled={!!imageFile}
                />
                <input
                  type="file"
                  ref={(input) => {
                    if (input) {
                      input.onclick = () => {
                        input.value = ''
                      }
                    }
                  }}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  id="image-file-input"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => document.getElementById('image-file-input')?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Nhập URL ảnh hoặc tải lên từ máy tính (tối đa 5MB)
              </p>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative w-full max-w-md">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  {imageFile && (
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        File: {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setImageFile(null)
                          setImagePreview(course?.imageUrl || "")
                          setFormData(prev => ({ ...prev, image: course?.imageUrl || "" }))
                        }}
                      >
                        Xóa
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => {
                  if (value) {
                    handleInputChange("status", value)
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || updateCourse.isPending}
                className="min-w-[120px]"
              >
                {(isSubmitting || updateCourse.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Lưu thay đổi
              </Button>
              <Link href="/staff/courses">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting || updateCourse.isPending}
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
