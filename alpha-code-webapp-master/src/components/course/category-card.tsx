import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, FolderOpen, BookOpen } from "lucide-react"

interface CategoryCardProps {
  category: {
    id: string
    name: string
    description: string
    orderNumber: number
  }
  coursesCount: number
  isSelected?: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

export function CategoryCard({
  category,
  coursesCount,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete
}: CategoryCardProps) {
  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-primary shadow-md' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className="text-xs">
                #{category.orderNumber}
              </Badge>
              <CardTitle className="text-lg">{category.name}</CardTitle>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {category.description || 'Chưa có mô tả'}
            </p>
          </div>
          
          <div className="flex space-x-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              className="h-8 w-8 p-0"
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
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{coursesCount} khóa học</span>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onSelect}
        >
          <FolderOpen className="mr-2 h-4 w-4" />
          Xem Courses
        </Button>
      </CardContent>
    </Card>
  )
}