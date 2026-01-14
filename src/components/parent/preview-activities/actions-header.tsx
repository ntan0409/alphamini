import { Button } from "@/components/ui/button"
import { Music, Save } from "lucide-react"

interface ActionsHeaderProps {
  actionsCount: number
  onSaveActivity: () => void
}

export function ActionsHeader({ 
  actionsCount, 
  onSaveActivity
}: ActionsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
          <Music className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hành Động Nhảy Múa</h2>
          <p className="text-sm text-gray-600">{actionsCount} chuỗi vũ đạo</p>
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button 
          onClick={onSaveActivity}
          className="bg-gray-600 hover:bg-gray-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Lưu Hành Động
        </Button>
      </div>
    </div>
  )
}