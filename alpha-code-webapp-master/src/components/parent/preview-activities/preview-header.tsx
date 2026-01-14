'use client'

import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export function PreviewHeader() {
  const router = useRouter()
  
  return (
    <div className="mb-8">
      <Button
        onClick={() => router.back()}
        variant="outline"
        className="mb-6 border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay Lại Studio Âm Nhạc
      </Button>
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white backdrop-blur-sm border border-gray-200 text-gray-700 rounded-2xl text-sm font-semibold mb-6 shadow-lg">
          <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          Kế Hoạch Nhảy Đã Tạo
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          Xem Trước Hành Động
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Vũ đạo do AI tạo ra cho âm nhạc của bạn
        </p>
      </div>
    </div>
  )
}