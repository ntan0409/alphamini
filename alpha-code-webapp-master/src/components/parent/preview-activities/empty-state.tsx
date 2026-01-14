import { Card, CardContent } from "@/components/ui/card"
import { Music } from "lucide-react"
import { DancePlanReposnse } from "@/types/music"

interface EmptyStateProps {
  dancePlan?: DancePlanReposnse | null
}

export function EmptyState({ dancePlan }: EmptyStateProps) {
  return (
    <Card className="border-0 bg-white/90 backdrop-blur-xl shadow-lg">
      <CardContent className="p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Music className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Không Tìm Thấy Hành Động</h3>
        <p className="text-gray-600 mb-6">
          Không có Hành động nhảy nào được tạo ra cho file âm nhạc này.
        </p>
        <details className="mt-6 p-4 bg-gray-50 rounded-lg text-left border">
          <summary className="text-sm font-medium text-gray-700 cursor-pointer">Xem dữ liệu thô</summary>
          <pre className="mt-3 text-xs text-gray-600 whitespace-pre-wrap max-h-32 overflow-y-auto">
            {JSON.stringify(dancePlan, null, 2)}
          </pre>
        </details>
      </CardContent>
    </Card>
  )
}