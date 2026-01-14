"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { uploadMusicAsync } from "@/features/users/api/music-api"
import { toast } from "sonner"
import MusicHeader from "@/components/parent/music/music-header"
import FileUploadArea from "@/components/parent/music/file-upload-area"
import BackgroundDecorations from "@/components/parent/music/background-decorations"
import LoadingOverlay from "@/components/parent/music/loading-overlay"
import MediaPreview from "@/components/parent/music/media-preview"
import ProTips from "@/components/parent/music/pro-tips"
import { navigateToPreviewActivities, cleanupOldPreviewData } from "@/utils/preview-navigation"
import ProtectLicense from "@/components/protect-license"
import { useRobotStore } from "@/hooks/use-robot-store"
import { useTaskProgress } from "@/hooks/use-task-progress"
import { DancePlanReposnse } from "@/types/music"

export default function MusicPage() {
  const router = useRouter()
  const [fileUrl, setFileUrl] = useState<string>("")
  const [fileType, setFileType] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const [fileSize, setFileSize] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [taskId, setTaskId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { selectedRobot } = useRobotStore();

  const robotModelId = selectedRobot?.robotModelId || "";

  // Cleanup old preview data on mount
  useEffect(() => {
    cleanupOldPreviewData()
  }, [])

  // Memoize callbacks to prevent recreating on every render
  const handleTaskComplete = useCallback((result: DancePlanReposnse) => {
    toast.success("Tạo vũ đạo thành công!")

    // Prepare time range text
    let timeRangeText = ""
    if (startTime && endTime) {
      timeRangeText = `${startTime.includes(':') ? startTime : formatTime(parseFloat(startTime))} - ${endTime.includes(':') ? endTime : formatTime(parseFloat(endTime))} (${(parseTimeToSeconds(endTime) - parseTimeToSeconds(startTime)).toFixed(1)}s)`
    }

    // Use sessionStorage navigation
    setTimeout(() => {
      navigateToPreviewActivities(router, {
        dancePlan: result,
        fileName: currentFile?.name || "music",
        timeRange: timeRangeText,
      }, "parent")
      setIsGeneratingPlan(false)
      setTaskId(null)
      resetProgress()
    }, 1000)
  }, [startTime, endTime, currentFile, router])

  const handleTaskError = useCallback((error: string) => {
    toast.error(error)
    setIsGeneratingPlan(false)
    setTaskId(null)
    resetProgress()
  }, [])

  // Progress tracking hook
  const { progress, message: progressMessage, startPolling, reset: resetProgress } = useTaskProgress({
    taskId,
    onComplete: handleTaskComplete,
    onError: handleTaskError,
    pollingInterval: 2000, // Poll every 2 seconds
  });

  const handleFileChange = (file: File) => {
    if (file) {
      const url = URL.createObjectURL(file)
      setFileUrl(url)
      setFileType(file.type)
      setFileName(file.name)
      setFileSize(file.size)
      setIsPlaying(false)
      setCurrentFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith("audio/") || file.type.startsWith("video/")) {
        handleFileChange(file)
      }
    }
  }

  const removePreview = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl)
    }
    setFileUrl("")
    setFileType("")
    setFileName("")
    setFileSize(0)
    setIsPlaying(false)
    setCurrentFile(null)
    setStartTime("")
    setEndTime("")
    setCurrentTime(0)
    setDuration(0)
  }

  const togglePlayPause = () => {
    const isAudio = fileType.startsWith("audio/")
    const isVideo = fileType.startsWith("video/")

    if (isAudio && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    } else if (isVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const parseTimeToSeconds = (timeString: string): number => {
    if (!timeString) return 0

    // If it's already a number, return as is
    if (!isNaN(parseFloat(timeString)) && !timeString.includes(':')) {
      return parseFloat(timeString)
    }

    // If it's in mm:ss format, convert to seconds
    const parts = timeString.split(':')
    if (parts.length === 2) {
      const minutes = parseInt(parts[0]) || 0
      const seconds = parseInt(parts[1]) || 0
      return minutes * 60 + seconds
    }

    return 0
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleSetStartTime = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime
      setStartTime(formatTime(time))
      toast.success(`Thời gian bắt đầu: ${formatTime(time)}`)
    } else if (videoRef.current) {
      const time = videoRef.current.currentTime
      setStartTime(formatTime(time))
      toast.success(`Thời gian bắt đầu: ${formatTime(time)}`)
    }
  }

  const handleSetEndTime = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime
      setEndTime(formatTime(time))
      toast.success(`Thời gian kết thúc: ${formatTime(time)}`)
    } else if (videoRef.current) {
      const time = videoRef.current.currentTime
      setEndTime(formatTime(time))
      toast.success(`Thời gian kết thúc: ${formatTime(time)}`)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    } else if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    } else if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleGenerateDancePlan = async () => {
    if (!currentFile) {
      toast.error("Vui lòng tải lên file trước!")
      return
    }

    const isAudio = fileType.startsWith("audio/")
    const isVideo = fileType.startsWith("video/")

    if (!isAudio && !isVideo) {
      toast.error("Vui lòng tải lên file audio hoặc video!")
      return
    }

    const startTimeNum = startTime ? parseTimeToSeconds(startTime) : undefined
    const endTimeNum = endTime ? parseTimeToSeconds(endTime) : undefined

    if (startTime && endTime) {
      if (isNaN(startTimeNum!) || isNaN(endTimeNum!)) {
        toast.error("Định dạng thời gian không hợp lệ!")
        return
      }
      if (startTimeNum! >= endTimeNum!) {
        toast.error("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!")
        return
      }
      if (startTimeNum! < 0) {
        toast.error("Thời gian bắt đầu không được âm!")
        return
      }
    }

    setIsGeneratingPlan(true)
    resetProgress()

    console.log("Uploading music async with params:", {
      fileName: currentFile.name,
      robotModelId,
      startTime: startTimeNum,
      endTime: endTimeNum
    });

    try {
      // Upload music asynchronously and get task_id
      const result = await uploadMusicAsync(currentFile, robotModelId, startTimeNum, endTimeNum)
      
      console.log("Received task_id:", result.task_id)
      
      // Set task ID and start polling for progress
      setTaskId(result.task_id)
      startPolling()
      
      toast.success("Đã bắt đầu xử lý! Đang theo dõi tiến trình...")
    } catch (error: unknown) {
      let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại!'

      if (error && typeof error === 'object' && 'response' in error) {
        const httpError = error as { response: { status: number } }
        const status = httpError.response.status
        switch (status) {
          case 413:
            errorMessage = 'File quá lớn! Vui lòng chọn file nhỏ hơn.'
            break
          case 400:
            errorMessage = 'Dữ liệu không hợp lệ.'
            break
          case 401:
            errorMessage = 'Bạn cần đăng nhập lại.'
            break
          case 403:
            errorMessage = 'Bạn không có quyền thực hiện chức năng này.'
            break
          case 500:
            errorMessage = 'Lỗi server. Vui lòng thử lại sau.'
            break
        }
      } else if (error && typeof error === 'object' && 'request' in error) {
        errorMessage = 'Không thể kết nối đến server.'
      }

      toast.error(errorMessage)
      setIsGeneratingPlan(false)
    }
  }

  return (
    <ProtectLicense>
      <div className="min-h-screen bg-white relative overflow-hidden p-10" suppressHydrationWarning>
        {/* Loading Overlay */}
        <LoadingOverlay 
          isGeneratingPlan={isGeneratingPlan} 
          progress={progress}
          message={progressMessage || "Đang tạo vũ đạo. Vui lòng chờ..."}
        />

        {/* Background Decorations */}
        <BackgroundDecorations />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <MusicHeader />

          {/* Upload Area */}
          <FileUploadArea
            isDragOver={isDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileChange={handleFileChange}
          />

          {/* Media Preview */}
          {fileUrl && (
            <MediaPreview
              fileUrl={fileUrl}
              fileType={fileType}
              fileName={fileName}
              fileSize={fileSize}
              isPlaying={isPlaying}
              onTogglePlayPause={togglePlayPause}
              onRemovePreview={removePreview}
              onGenerateDancePlan={handleGenerateDancePlan}
              isGeneratingPlan={isGeneratingPlan}
              startTime={startTime}
              endTime={endTime}
              onStartTimeChange={setStartTime}
              onEndTimeChange={setEndTime}
              onSetStartTime={handleSetStartTime}
              onSetEndTime={handleSetEndTime}
              currentTime={currentTime}
              duration={duration}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              audioRef={audioRef}
              videoRef={videoRef}
            />
          )}

          {/* Pro Tips */}
          {!fileUrl && <ProTips />}
        </div>
      </div>
    </ProtectLicense>
  )
}