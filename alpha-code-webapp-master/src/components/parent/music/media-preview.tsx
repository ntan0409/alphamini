"use client"

import React, { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Play, Pause, Volume2, FileAudio, FileVideo, Music, Video } from "lucide-react"
import AudioPreview from "./audio-preview"
import VideoPreview from "./video-preview"

interface MediaPreviewProps {
  fileUrl: string
  fileType: string
  fileName: string
  fileSize: number
  isPlaying: boolean
  onTogglePlayPause: () => void
  onRemovePreview: () => void
  onGenerateDancePlan: () => void
  isGeneratingPlan: boolean
  startTime: string
  endTime: string
  onStartTimeChange: (time: string) => void
  onEndTimeChange: (time: string) => void
  onSetStartTime: () => void
  onSetEndTime: () => void
  currentTime: number
  duration: number
  onTimeUpdate: () => void
  onLoadedMetadata: () => void
  audioRef: React.RefObject<HTMLAudioElement | null>
  videoRef: React.RefObject<HTMLVideoElement | null>
}

export default function MediaPreview({
  fileUrl,
  fileType,
  fileName,
  fileSize,
  isPlaying,
  onTogglePlayPause,
  onRemovePreview,
  onGenerateDancePlan,
  isGeneratingPlan,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  onSetStartTime,
  onSetEndTime,
  currentTime,
  duration,
  onTimeUpdate,
  onLoadedMetadata,
  audioRef,
  videoRef
}: MediaPreviewProps) {
  const isAudio = fileType.startsWith("audio/")
  const isVideo = fileType.startsWith("video/")

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', onTimeUpdate)
      audioRef.current.addEventListener('loadedmetadata', onLoadedMetadata)
    }
    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', onTimeUpdate)
      videoRef.current.addEventListener('loadedmetadata', onLoadedMetadata)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', onTimeUpdate)
        audioRef.current.removeEventListener('loadedmetadata', onLoadedMetadata)
      }
      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', onTimeUpdate)
        videoRef.current.removeEventListener('loadedmetadata', onLoadedMetadata)
      }
    }
  }, [onTimeUpdate, onLoadedMetadata])

  return (
    <Card className="overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-xl mb-12 group hover:shadow-3xl transition-all duration-700">
      {/* Enhanced Header with Gradient */}
      <CardHeader className="bg-gray-600 text-white relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] animate-pulse"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-2 right-2 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-2 left-2 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-500"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Enhanced File Icon */}
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg">
              {isAudio ? (
                <FileAudio className="w-8 h-8" />
              ) : (
                <FileVideo className="w-8 h-8" />
              )}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold mb-1">{fileName}</CardTitle>
              <div className="flex items-center gap-3 text-white/80 text-sm">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  {formatFileSize(fileSize)}
                </span>
                <span>•</span>
                <span className="px-2 py-1 bg-white/20 rounded-md font-medium">
                  {fileType}
                </span>
              </div>
            </div>
          </div>
          <Button
            onClick={onRemovePreview}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-xl p-2 transition-all duration-200 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        {/* Audio Preview */}
        {isAudio && (
          <AudioPreview
            fileUrl={fileUrl}
            audioRef={audioRef}
            startTime={startTime}
            endTime={endTime}
            onStartTimeChange={onStartTimeChange}
            onEndTimeChange={onEndTimeChange}
            onSetStartTime={onSetStartTime}
            onSetEndTime={onSetEndTime}
            currentTime={currentTime}
            duration={duration}
          />
        )}

        {/* Video Preview */}
        {isVideo && (
          <VideoPreview
            fileUrl={fileUrl}
            videoRef={videoRef}
            startTime={startTime}
            endTime={endTime}
            onStartTimeChange={onStartTimeChange}
            onEndTimeChange={onEndTimeChange}
            onSetStartTime={onSetStartTime}
            onSetEndTime={onSetEndTime}
            currentTime={currentTime}
            duration={duration}
          />
        )}

        {/* Enhanced Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200/50">
          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={onTogglePlayPause}
              size="lg"
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 mr-2" />
              ) : (
                <Play className="w-5 h-5 mr-2" />
              )}
              {isPlaying ? "Tạm dừng" : "Phát"}
            </Button>
            
            {(isAudio || isVideo) && (
              <Button
                onClick={onGenerateDancePlan}
                disabled={isGeneratingPlan}
                size="lg"
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                <Music className="w-5 h-5 mr-2" />
                {isGeneratingPlan ? "Đang tạo..." : "Tạo Kế Hoạch Nhảy"}
              </Button>
            )}
            
            <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
              <Volume2 className="w-4 h-4 mr-2" />
              <span>Sẵn sàng phát</span>
            </div>
          </div>

          <Button
            onClick={onRemovePreview}
            variant="outline"
            size="lg"
            className="border-red-200 text-red-600 hover:bg-red-50 px-8 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200"
          >
            <X className="w-5 h-5 mr-2" />
            Xóa Tệp
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}