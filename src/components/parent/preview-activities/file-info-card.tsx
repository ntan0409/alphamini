import { Card, CardContent } from "@/components/ui/card"
import { FileAudio } from "lucide-react"

interface FileInfoCardProps {
  fileName?: string
  timeRange?: string
}

export function FileInfoCard({ fileName, timeRange }: FileInfoCardProps) {
  if (!fileName) return null

  return (
    <Card className="mb-8 border-0 bg-white/80 backdrop-blur-xl shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gray-600 rounded-xl">
            <FileAudio className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{fileName}</h3>
            {timeRange && (
              <p className="text-sm text-gray-600">
                Khoảng Thời Gian: {timeRange}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}