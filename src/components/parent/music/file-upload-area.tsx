"use client"

import React, { useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Music, Bot, Zap } from "lucide-react"

interface FileUploadAreaProps {
  isDragOver: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onFileChange: (file: File) => void
}

export default function FileUploadArea({
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange
}: FileUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileChange(file)
    }
  }

  return (
    <Card className="mb-12 overflow-hidden border-0 bg-white/80 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-700 group relative">
      {/* Animated Border */}
      <div className="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
      <div className="relative bg-white rounded-xl m-0.5">
        <CardContent className="p-0">
          <div
            className={`relative transition-all duration-700 ${
              isDragOver 
                ? "bg-gray-50 border-2 border-gray-300 border-dashed scale-[1.02]" 
                : "hover:bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-300"
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Floating Music Notes */}
              <div className="absolute top-12 left-12 opacity-20">
                <Music className="w-6 h-6 text-gray-400 animate-bounce" />
              </div>
              <div className="absolute top-20 right-20 opacity-15">
                <Music className="w-4 h-4 text-gray-400 animate-bounce delay-500" />
              </div>
              <div className="absolute bottom-16 left-24 opacity-25">
                <Music className="w-5 h-5 text-gray-400 animate-bounce delay-1000" />
              </div>
              
              {/* Animated Circles */}
              <div className="absolute top-16 right-32 w-3 h-3 bg-gray-200 rounded-full opacity-30 animate-ping"></div>
              <div className="absolute bottom-24 right-16 w-4 h-4 bg-gray-200 rounded-full opacity-25 animate-ping delay-700"></div>
              <div className="absolute top-32 left-32 w-2 h-2 bg-gray-200 rounded-full opacity-35 animate-ping delay-300"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center space-y-8 py-20 px-8">
              {/* Enhanced Icon with Animation */}
              <div className="relative">
                <div className="absolute inset-0 bg-gray-500 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative p-8 bg-gray-600 rounded-3xl shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500">
                  <Upload className="w-16 h-16 text-white" />
                </div>
              </div>
              
              {/* Enhanced Text Content */}
              <div className="space-y-6 text-center max-w-2xl">
                <h3 className="text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                  Thả Nhạc Của Bạn Ở Đây
                </h3>
                <div className="space-y-3">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Kéo & thả file âm thanh của bạn hoặc nhấp để duyệt máy tính
                  </p>
                  <p className="text-sm text-gray-500">
                    Hỗ trợ MP3, WAV, M4A và các định dạng âm thanh phổ biến khác lên đến 100MB
                  </p>
                </div>
                
                {/* Enhanced Feature Tags */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                    <Music className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Phân Tích Âm Thanh</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                    <Bot className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Vũ Đạo Tự Động</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                    <Zap className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Xem Trước Ngay Lập Tức</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Upload Button */}
              <div className="pt-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="lg"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Upload className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Chọn Nhạc Của Bạn
                </Button>
              </div>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept="audio/*,video/*"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>
        </CardContent>
      </div>
    </Card>
  )
}