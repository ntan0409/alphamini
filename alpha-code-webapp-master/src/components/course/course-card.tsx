import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, BookOpen, Users, Clock, DollarSign } from "lucide-react"

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    price: number
    duration: number
    level: string
    status: string
    imageUrl?: string
  }
  sectionsCount: number
  isSelected?: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

export function CourseCard({
  course,
  sectionsCount,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete
}: CourseCardProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'archived': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-primary shadow-md' : ''}`}>
      {course.imageUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img 
            src={course.imageUrl} 
            alt={course.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {course.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className={getLevelColor(course.level)}>
                {course.level === 'beginner' ? 'Cơ bản' : 
                 course.level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
              </Badge>
              <Badge className={getStatusColor(course.status)}>
                {course.status === 'published' ? 'Đã xuất bản' : 
                 course.status === 'draft' ? 'Nháp' : 'Lưu trữ'}
              </Badge>
            </div>
          </div>
          
          <div className="flex space-x-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              <span>{course.price.toLocaleString()} VND</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{course.duration}h</span>
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onSelect}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Xem Sections ({sectionsCount})
        </Button>
      </CardContent>
    </Card>
  )
}