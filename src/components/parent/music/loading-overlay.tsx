"use client"

import UpLoadingState from "@/components/uploading-state"

interface LoadingOverlayProps {
  isGeneratingPlan: boolean
  progress?: number
  message?: string
}

export default function LoadingOverlay({ 
  isGeneratingPlan, 
  progress = 0,
  message = "Đang tạo vũ đạo. Vui lòng chờ..."
}: LoadingOverlayProps) {
  if (!isGeneratingPlan) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
        <UpLoadingState message={message} />
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Tiến trình</span>
            <span className="text-sm font-semibold text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}