"use client"

import { Bot, Sparkles } from "lucide-react"

export default function MusicHeader() {
  return (
    <div className="text-center mb-16">
      {/* Alpha Mini Badge */}
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-white backdrop-blur-sm border border-gray-200 text-gray-700 rounded-2xl text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        Alpha Mini Studio
        <Sparkles className="w-5 h-5 text-gray-600" />
      </div>
      
      {/* Main Title */}
      <div className="space-y-6">
        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
          Âm Nhạc & Nhảy Múa 
          <span className="block text-gray-700 py-2">
            Studio Sáng Tạo
          </span>
        </h1>
        
        {/* Enhanced Description */}
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-medium">
            Tạo vũ đạo cho robot Alpha Mini
          </p>
          <p className="text-lg text-gray-500 leading-relaxed">
            Tải lên nhạc và tạo ra những động tác nhảy đồng bộ
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Smart Support</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></div>
            <span className="text-sm font-medium text-gray-700">Real-time Analysis</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-500"></div>
            <span className="text-sm font-medium text-gray-700">Custom Dance</span>
          </div>
        </div>
      </div>
    </div>
  )
}