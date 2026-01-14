import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { ActionActivites } from "@/types/activities"
import { Color } from "@/types/color"

interface ActionCardProps {
  action: ActionActivites
  index: number
}

export function ActionCard({ action, index }: ActionCardProps) {
  return (
    <Card className="border-0 bg-white/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 bg-gray-500 text-white rounded-xl flex items-center justify-center text-lg font-bold">
              {index + 1}
            </span>
            <div>
              <CardTitle className="text-xl text-gray-900">
                Activity {index + 1}
              </CardTitle>
              <p className="text-sm text-gray-600">Action ID: {action.action_id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {action.action_type && (
              <Badge className="bg-gray-100 text-gray-800 border border-gray-200">
                {action.action_type}
              </Badge>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-xl border border-gray-200">
              <Clock className="w-4 h-4" />
              {action.start_time}s - {action.start_time + action.duration}s
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Action Details */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Chi Tiết Hành Động</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian bắt đầu:</span>
                  <span className="font-medium">{action.start_time}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời lượng:</span>
                  <span className="font-medium">{action.duration}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian kết thúc:</span>
                  <span className="font-medium">{action.start_time + action.duration}s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Colors */}
          {action.color && Array.isArray(action.color) && action.color.length > 0 && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Màu Sắc LED</h4>
                <div className="grid grid-cols-2 gap-3">
                  {action.color.map((color: Color, colorIndex: number) => {
                    const hexColor = `#${[color.r, color.g, color.b].map(x => x.toString(16).padStart(2, '0')).join('')}`
                    return (
                      <div key={colorIndex} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                        <div 
                          className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm" 
                          style={{ backgroundColor: hexColor }}
                        />
                        <div>
                          <div className="text-xs font-medium text-gray-700">{hexColor.toUpperCase()}</div>
                          <div className="text-xs text-gray-500">
                            RGB({color.r}, {color.g}, {color.b})
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}