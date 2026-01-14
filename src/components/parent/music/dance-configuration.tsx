"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bot, Sparkles, Clock } from "lucide-react"

interface DanceConfigurationProps {
  startTime: string
  endTime: string
  onStartTimeChange: (time: string) => void
  onEndTimeChange: (time: string) => void
  onSetStartTime: () => void
  onSetEndTime: () => void
  currentTime: number
  duration: number
}

export default function DanceConfiguration({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  onSetStartTime,
  onSetEndTime,
  currentTime,
  duration
}: DanceConfigurationProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
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

  return (
    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-gray-600 rounded-xl shadow-lg">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-900">Cấu Hình Vũ Đạo</h4>
          <p className="text-sm text-gray-600">Tùy chỉnh thông số vũ đạo</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-8 p-4 bg-white/60 rounded-xl border border-gray-200">
        <Sparkles className="w-4 h-4 inline mr-2 text-gray-600" />
        Đặt khoảng thời gian để tạo vũ đạo tập trung. Bỏ trống để phân tích toàn bộ file.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-800">Thời Gian Bắt Đầu (ph:giây hoặc giây)</label>
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="0:00"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className="flex-1 h-12 bg-white/80 border-gray-200 focus:border-gray-400 focus:ring-gray-400/20 rounded-xl shadow-sm text-center font-medium"
            />
            <Button
              onClick={onSetStartTime}
              size="default"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 h-12 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap font-medium"
            >
              Đặt
            </Button>
          </div>
          {startTime && (
            <p className="text-xs text-gray-600 mt-2 text-center">
              ⏰ Bắt đầu tại: {startTime.includes(':') ? startTime : formatTime(parseFloat(startTime))}
            </p>
          )}
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-800">Thời Gian Kết Thúc (ph:giây hoặc giây)</label>
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="0:30"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              className="flex-1 h-12 bg-white/80 border-gray-200 focus:border-gray-400 focus:ring-gray-400/20 rounded-xl shadow-sm text-center font-medium"
            />
            <Button
              onClick={onSetEndTime}
              size="default"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 h-12 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap font-medium"
            >
              Đặt
            </Button>
          </div>
          {endTime && (
            <p className="text-xs text-gray-600 mt-2 text-center">
              ⏰ Kết thúc tại: {endTime.includes(':') ? endTime : formatTime(parseFloat(endTime))}
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-100/50 rounded-xl border border-gray-200">
        <div className="text-sm text-gray-700 flex items-center gap-3">
          <div className="p-1 bg-gray-600 rounded-full">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          Hệ thống sẽ phân tích nhịp điệu và tốc độ để tạo các động tác nhảy đồng bộ
        </div>
        
        {/* Show selected range */}
        {startTime && endTime && (
          <div className="mt-3 p-3 bg-white/70 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-800 mb-2">
              📍 Khoảng Thời Gian Đã Chọn:
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-gray-600">
                <Clock className="w-4 h-4" />
                {startTime.includes(':') ? startTime : formatTime(parseFloat(startTime))} - {endTime.includes(':') ? endTime : formatTime(parseFloat(endTime))}
              </span>
              <span className="text-gray-500">
                ({(parseTimeToSeconds(endTime) - parseTimeToSeconds(startTime)).toFixed(1)}s thời lượng)
              </span>
            </div>
            
            {/* Progress bar visualization */}
            {duration > 0 && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
                  {/* Full duration bar */}
                  <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                  
                  {/* Selected range */}
                  <div 
                    className="absolute top-0 h-full bg-gray-500 rounded-full transition-all duration-300"
                    style={{
                      left: `${(parseTimeToSeconds(startTime) / duration) * 100}%`,
                      width: `${((parseTimeToSeconds(endTime) - parseTimeToSeconds(startTime)) / duration) * 100}%`
                    }}
                  ></div>
                  
                  {/* Current time indicator */}
                  <div 
                    className="absolute top-0 w-1 h-full bg-gray-600 transition-all duration-100"
                    style={{
                      left: `${(currentTime / duration) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0:00</span>
                  <span className="text-red-500">Hiện tại: {formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}