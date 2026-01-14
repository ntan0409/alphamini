"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Music } from "lucide-react"
import DanceConfiguration from "./dance-configuration"

interface AudioPreviewProps {
  fileUrl: string
  audioRef: React.RefObject<HTMLAudioElement | null>
  startTime: string
  endTime: string
  onStartTimeChange: (time: string) => void
  onEndTimeChange: (time: string) => void
  onSetStartTime: () => void
  onSetEndTime: () => void
  currentTime: number
  duration: number
}

export default function AudioPreview({
  fileUrl,
  audioRef,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  onSetStartTime,
  onSetEndTime,
  currentTime,
  duration
}: AudioPreviewProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-8">
      {/* Audio Visualization Area */}
      <div className="relative overflow-hidden rounded-3xl bg-gray-50 border border-gray-200 shadow-inner">
        <div className="absolute inset-0 bg-gray-100/30"></div>
        
        <div className="relative flex items-center justify-center p-16">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-4 border-gray-200 rounded-full animate-pulse"></div>
            <div className="absolute w-36 h-36 border-2 border-gray-300 rounded-full animate-ping"></div>
            <div className="absolute w-24 h-24 border border-gray-400 rounded-full animate-pulse delay-500"></div>
          </div>
          
          {/* Central Music Icon */}
          <div className="relative z-10 text-center">
            <div className="w-28 h-28 bg-gray-600 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-500 group-hover:rotate-3">
              <Music className="w-14 h-14 text-white" />
            </div>
            
            <div className="space-y-3">
              <Badge className="bg-gray-100 text-gray-800 px-4 py-2 font-semibold border border-gray-200 shadow-sm">
                <Music className="w-4 h-4 mr-2" />
                Sẵn Sàng
              </Badge>
              <p className="text-base text-gray-700 font-medium">
                Alpha Mini Dance Studio
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Audio Controls */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm">
        <audio
          ref={audioRef}
          controls
          src={fileUrl}
          className="w-full h-14 rounded-xl shadow-md"
          preload="metadata"
        >
          Trình duyệt của bạn không hỗ trợ phát âm thanh.
        </audio>
        
        {/* Current Time Display */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Thời gian hiện tại: {formatTime(currentTime)}</span>
          <span>Tổng thời lượng: {formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Dance Configuration */}
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