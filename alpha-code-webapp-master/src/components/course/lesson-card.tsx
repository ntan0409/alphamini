import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, FileText, Clock, Bot } from "lucide-react"

interface LessonCardProps {
  lesson: {
    id: string
    title: string
    content: string
    duration: number
    requireRobot: boolean
    type: number
    orderNumber: number
    videoUrl?: string
  }
  onEdit: () => void
  onDelete: () => void
}

export function LessonCard({ lesson, onEdit, onDelete }: LessonCardProps) {
  const getTypeLabel = (type: number) => {
    switch (type) {
      case 1: return 'Video'
      case 2: return 'Tương tác'
      case 3: return 'Thực hành'
      default: return `Loại ${type}`
    }
  }

  const getTypeColor = (type: number) => {
    switch (type) {
      case 1: return 'bg-blue-100 text-blue-800'
      case 2: return 'bg-green-100 text-green-800'
      case 3: return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    }
    return `${seconds}s`
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-medium text-muted-foreground">#{lesson.orderNumber}</span>
              <h3 className="font-semibold text-lg">{lesson.title}</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {lesson.content}
            </p>
            
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={getTypeColor(lesson.type)}>
                <FileText className="h-3 w-3 mr-1" />
                {getTypeLabel(lesson.type)}
              </Badge>
              
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {formatDuration(lesson.duration)}
              </Badge>
              
              {lesson.requireRobot && (
                <Badge className="bg-orange-100 text-orange-800">
                  <Bot className="h-3 w-3 mr-1" />
                  Robot
                </Badge>
              )}
              
              {lesson.videoUrl && (
                <Badge className="bg-indigo-100 text-indigo-800">
                  Video
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}