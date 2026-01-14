"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Play,
  Code,
  CheckCircle2,
  Clock,
  Layers,
  Video,
  FileJson,
  BookOpen,
  Calendar,
  RefreshCcw,
  Loader2,
  LucideIcon
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RichTextViewer } from "@/components/ui/rich-text-editor"
import { useLessonBySlug, useDeleteLesson } from "@/features/courses/hooks/use-lesson"
import { DeleteLessonDialog } from "@/components/course/delete-lesson-dialog"

const lessonTypeMap: Record<number, { text: string; icon: LucideIcon; color: string; bgColor: string }> = {
  1: {
    text: "Bài học",
    icon: Code,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  2: {
    text: "Video",
    icon: Video,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  3: {
    text: "Bài kiểm tra",
    icon: CheckCircle2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
}

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lessonSlug = params.slug as string
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null)

  const { data: lesson, isLoading, refetch } = useLessonBySlug(lessonSlug)
  const deleteLessonMutation = useDeleteLesson("")

  useEffect(() => {
      refetch && refetch();
    }, [lessonSlug]);


  const handleDelete = () => {
    if (!lesson) return
    setDeletingLessonId(lesson.id)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingLessonId) return
    try {
      await deleteLessonMutation.mutateAsync(deletingLessonId)
      setDeletingLessonId(null)
      toast.success("Đã xóa bài học")
      router.back()
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Lỗi khi xóa bài học'
        : error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Lỗi khi xóa bài học'
      toast.error(errorMessage)
    }
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

  const typeInfo = lessonTypeMap[lesson.type] || lessonTypeMap[1]
  const TypeIcon = typeInfo.icon

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} phút ${remainingSeconds} giây`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${typeInfo.bgColor}`}>
                <TypeIcon className={`h-4 w-4 ${typeInfo.color}`} />
                <span className={`font-medium ${typeInfo.color}`}>{typeInfo.text}</span>
              </div>
              {lesson.requireRobot && <Badge variant="secondary">Yêu cầu Robot</Badge>}
              <Badge variant="outline">Bài {lesson.orderNumber}</Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {lesson.type === 3 && (
            <Button variant="default">
              <Play className="mr-2 h-4 w-4" />
              Thử kiểm tra
            </Button>
          )}
          <Link href={`/staff/lessons/${lessonSlug}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            disabled={deleteLessonMutation.isPending}
          >
            {deleteLessonMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Video (for lesson.type = 2) */}
          {lesson.type === 2 && lesson.videoUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video bài học
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  {lesson.videoUrl ? (
                    <video
                      src={lesson.videoUrl}
                      controls
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Play className="h-16 w-16 mb-4 opacity-50" />
                      <p className="font-medium">Chưa có video</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rich Text Content */}
          <Card>
            <CardHeader>
              <CardTitle>Nội dung bài học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <RichTextViewer content={lesson.content} />
              </div>
            </CardContent>
          </Card>

          {/* Solution (3) */}
          {(lesson.type === 3) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileJson className="h-5 w-5" />
                  Câu hỏi & Đáp án
                </CardTitle>
                <CardDescription>Dữ liệu lưu dạng JSON (type, code)</CardDescription>
              </CardHeader>
              <CardContent>
                {lesson.solution ? (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{JSON.stringify(lesson.solution, null, 2)}</code>
                  </pre>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileJson className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Chưa có dữ liệu lời giải</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Thời lượng</p>
                  <p className="font-medium">{formatDuration(lesson.duration)}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Thứ tự</p>
                  <p className="font-medium">Bài {lesson.orderNumber}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium">
                    {new Date(lesson.createdDate).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <RefreshCcw className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Cập nhật lần cuối</p>
                  <p className="font-medium">
                    {lesson.lastUpdated
                      ? new Date(lesson.lastUpdated).toLocaleString("vi-VN")
                      : "—"}
                  </p>
                </div>
              </div>

              {lesson.requireRobot && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Yêu cầu đặc biệt</p>
                      <Badge variant="secondary">Robot Alpha</Badge>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteLessonDialog
        open={!!deletingLessonId}
        lessonTitle={lesson?.title || ""}
        onOpenChange={(open) => !open && setDeletingLessonId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteLessonMutation.isPending}
      />
    </div>
  )
}
