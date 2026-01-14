"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { useLessonBySlug, useUpdateLesson } from "@/features/courses/hooks/use-lesson"
import { presignLessonUpload, uploadFileToPresignedUrl } from "@/features/courses/api/lesson-api"
import { toast } from "sonner"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { SolutionBuilder, SolutionItem } from "@/components/course/solution-builder"
import UploadingModal from "@/components/uploading-modal";
import axios from "axios"

interface LessonUpdatePayload {
  id: string;
  title: string;
  content: string;
  duration: number;
  requireRobot: boolean;
  orderNumber: number;
  sectionId: string;
  videoUrl?: string;
  type: number;
  solution?: object | null;
  status: number;
}

export default function EditLessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonSlug = params.slug as string

  const { data: lesson, isLoading, refetch } = useLessonBySlug(lessonSlug)

  // Force refetch on mount and when lessonSlug changes
  useEffect(() => {
    refetch && refetch();
  }, [lessonSlug]);


  const [formData, setFormData] = useState<{
    id: string;
    sectionId: string;
    title: string;
    content: string;
    videoUrl: string;
    duration: string;
    requireRobot: boolean;
    type: number;
    solution: unknown;
    status: number;
  }>({
    id: "",
    sectionId: "",
    title: "",
    content: "",
    videoUrl: "",
    duration: "",
    requireRobot: false,
    type: 1,
    solution: [],
    status: 1,
  });

  // New state for video file
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  const [uploadController, setUploadController] = useState<AbortController | null>(null);

  // Update form when lesson data is loaded
  useEffect(() => {
    if (lesson) {
      // Only Quiz (type 3) has solution
      // Keep solution as structured data (array/object) for SolutionBuilder
      let solutionValue: unknown = []
      if (lesson.type === 3 && lesson.solution) {
        solutionValue = lesson.solution
      }

      setFormData({
        id: lesson.id,
        sectionId: lesson.sectionId,
        title: lesson.title,
        content: lesson.content,
        videoUrl: lesson.videoUrl || "",
        duration: lesson.duration.toString(),
        requireRobot: lesson.requireRobot,
        type: lesson.type,
        solution: solutionValue,
        status: lesson.status,
      });
      setVideoFile(null); // Reset video file on lesson change
    }
  }, [lesson])

  const updateLessonMutation = useUpdateLesson(
    lesson?.sectionId || '',
    lesson?.id || '',
    lesson?.sectionId
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!lesson) return

    try {
      setIsSubmitting(true)
      // Only Quiz (type 3) has solution
      let solutionObject: object | null | undefined = undefined
      if (formData.type === 3) {
        // Quiz: solution may be structured (from SolutionBuilder) or a JSON string (fallback)
        if (Array.isArray(formData.solution)) {
          solutionObject = formData.solution as object
        } else if (typeof formData.solution === 'string' && formData.solution.trim()) {
          try {
            solutionObject = JSON.parse(formData.solution as string)
          } catch (err) {
            toast.error("Solution JSON không hợp lệ")
            return
          }
        } else {
          // default to empty array
          solutionObject = []
        }
      }

      // Prepare payload for updateLesson
      const payload: LessonUpdatePayload = {
        id: formData.id,
        title: formData.title,
        content: formData.content,
        duration: parseInt(formData.duration),
        requireRobot: formData.requireRobot,
        type: formData.type,
        orderNumber: lesson.orderNumber,
        sectionId: formData.sectionId,
        solution: solutionObject as object | null,
        status: formData.status
      };
      // For type 2 (video), handle direct S3 upload via presign
      if (formData.type === 2) {
        if (videoFile) {
          const presign = await presignLessonUpload({
            filename: videoFile.name,
            contentType: videoFile.type || "video/mp4",
            folder: "lessons",
            expiresInSeconds: 900,
          });
          const controller = new AbortController();
          setUploadController(controller);
          await uploadFileToPresignedUrl(
            presign.uploadUrl,
            videoFile,
            videoFile.type || "video/mp4",
            (p) => setUploadPercent(p),
            controller.signal
          );
          payload.videoUrl = presign.publicUrl;
        } else {
          payload.videoUrl = formData.videoUrl || undefined;
        }
      } else if (formData.type === 1) {
        // Coding lesson: no video
        payload.videoUrl = undefined;
      }

      console.log("Update Lesson Payload:", payload);
      //console.log("Video File:", payload.videoFile);
      await updateLessonMutation.mutateAsync(payload);

      toast.success('Đã cập nhật bài học')
      router.push(`/staff/lessons/${lessonSlug}`)
    } catch (error: unknown) {
      console.error("Error creating lesson:", error)
      // If upload was cancelled by user (axios abort) or AbortSignal triggered, skip showing another toast
      if (axios.isCancel(error) || (error instanceof DOMException && error.name === 'AbortError')) {
        console.info('Upload cancelled by user')
      } else {
        // Extract error message from API response
        const errorMessage = error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Lỗi khi cập nhật bài học'
          : error && typeof error === 'object' && 'message' in error
            ? (error as { message: string }).message
            : 'Lỗi khi cập nhật bài học'
        toast.error(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
      setUploadPercent(0)
      setUploadController(null)
    }
  }

  const handleTypeChange = (newType: number) => {
    // Reset type-specific fields when type changes
    let newSolution: unknown = []
    let newVideoUrl = formData.videoUrl

    if (newType === 1) {
      // Lesson (Coding): no solution, no video
      newSolution = []
      newVideoUrl = ""
    } else if (newType === 2) {
      // Video: no solution, keep videoUrl
      newSolution = []
    } else if (newType === 3) {
      // Quiz: has solution (structured array/object)
      newSolution = []
      newVideoUrl = ""
    }

    setFormData({ ...formData, type: newType, solution: newSolution, videoUrl: newVideoUrl })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Không tìm thấy bài học</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overlay Modal Uploading */}
      <UploadingModal
        open={isSubmitting && uploadPercent > 0}
        progress={uploadPercent}
        message="Đang tải lên video, vui lòng chờ..."
        onClose={() => {
          if (uploadController) {
            uploadController.abort();
            setUploadController(null);
          }
          setIsSubmitting(false);
          setUploadPercent(0);
        }}
      />
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa bài học</h1>
          <p className="text-muted-foreground">{lesson.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>
                  Thông tin chính của bài học
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tên bài học *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nhập tên bài học"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Thời lượng (giây) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="600"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.duration && `${Math.floor(Number(formData.duration) / 60)} phút ${Number(formData.duration) % 60} giây`}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Nội dung *</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    placeholder="Nhập nội dung bài học"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái *</Label>
                  <RadioGroup
                    value={String(formData.status)}
                    onValueChange={(value) => setFormData({ ...formData, status: Number(value) })}
                    className="space-y-3"
                  >
                    <div className="flex items-start space-x-3 rounded-md border p-3 hover:bg-accent transition">
                      <RadioGroupItem value="1" id="status-active" />
                      <Label htmlFor="status-active" className="font-medium cursor-pointer">
                        Hoạt động
                        <p className="text-sm font-normal text-muted-foreground">
                          Bài học hiển thị và khả dụng cho học sinh.
                        </p>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 rounded-md border p-3 hover:bg-accent transition">
                      <RadioGroupItem value="2" id="status-hidden" />
                      <Label htmlFor="status-hidden" className="font-medium cursor-pointer">
                        Ẩn
                        <p className="text-sm font-normal text-muted-foreground">
                          Bài học tạm thời bị ẩn khỏi danh sách học sinh.
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Type 2: Video URL Field */}
            {formData.type === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Video</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="videoFile">Tải lên video mới</Label>
                    <Input
                      id="videoFile"
                      type="file"
                      accept="video/*"
                      onChange={e => {
                        const file = e.target.files?.[0] || null;
                        setVideoFile(file);
                        // If a file is selected, clear videoUrl
                        if (file) setFormData({ ...formData, videoUrl: "" });
                      }}
                    />
                    {videoFile && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Đã chọn: {videoFile.name}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          </div>



          {/* Sidebar Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Loại bài học</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={String(formData.type)} onValueChange={(value) => handleTypeChange(Number(value))}>
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="1" id="type-lesson" />
                    <Label htmlFor="type-lesson" className="font-normal cursor-pointer">
                      Bài học
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="2" id="type-video" />
                    <Label htmlFor="type-video" className="font-normal cursor-pointer">
                      Bài học Video
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="type-quiz" />
                    <Label htmlFor="type-quiz" className="font-normal cursor-pointer">
                      Bài Kiểm tra
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cài đặt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireRobot">Yêu cầu Robot</Label>
                    <p className="text-sm text-muted-foreground">
                      Bài học cần robot Alpha
                    </p>
                  </div>
                  <Switch
                    id="requireRobot"
                    checked={formData.requireRobot}
                    onCheckedChange={(checked) => setFormData({ ...formData, requireRobot: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thao tác</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={updateLessonMutation.isPending || isSubmitting}
                >
                  {updateLessonMutation.isPending || isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {uploadPercent > 0 ? `Đang tải video ${uploadPercent}%` : "Đang lưu..."}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
                <Link href={`/staff/lessons/${lessonSlug}`} className="block">
                  <Button type="button" variant="outline" className="w-full">
                    Hủy
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-5">
          {/* Type 3: Quiz JSON */}
          {formData.type === 3 && (
            <SolutionBuilder value={formData.solution as SolutionItem[]} onChange={(value) => setFormData({ ...formData, solution: value })} />
          )}
        </div>
      </form>
    </div>
  )
}
