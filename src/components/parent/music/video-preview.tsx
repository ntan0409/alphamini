"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Video } from "lucide-react"
import DanceConfiguration from "./dance-configuration"

interface VideoPreviewProps {
  fileUrl: string
  videoRef: React.RefObject<HTMLVideoElement | null>
  startTime: string
  endTime: string
  onStartTimeChange: (time: string) => void
  onEndTimeChange: (time: string) => void
  onSetStartTime: () => void
  onSetEndTime: () => void
  currentTime: number
  duration: number
}

export default function VideoPreview({
  fileUrl,
  videoRef,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  onSetStartTime,
  onSetEndTime,
  currentTime,
  duration
}: VideoPreviewProps) {
  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl">
        <video
          ref={videoRef}
          controls
          src={fileUrl}
          className="w-full max-h-96 object-contain"
          preload="metadata"
        >
          Trình duyệt của bạn không hỗ trợ phát video.
        </video>
      </div>
      
      <div className="flex items-center justify-center">
        <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-4 py-2 font-semibold border border-gray-300 shadow-sm">
          <Video className="w-4 h-4 mr-2" />
          Tệp Video
        </Badge>
      </div>

      {/* Dance Configuration for Video */}
      <DanceConfiguration
        startTime={startTime}
        endTime={endTime}
        onStartTimeChange={onStartTimeChange}
        onEndTimeChange={onEndTimeChange}
        onSetStartTime={onSetStartTime}
        onSetEndTime={onSetEndTime}
        currentTime={currentTime}
        duration={duration}
      />
    </div>
  )
}