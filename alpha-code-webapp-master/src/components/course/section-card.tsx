import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, FileText, ChevronRight } from "lucide-react"

interface SectionCardProps {
  section: {
    id: string
    title: string
    orderNumber: number
  }
  lessonsCount: number
  isSelected?: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

export function SectionCard({
  section,
  lessonsCount,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete
}: SectionCardProps) {
  return (
    <Card className={`transition-all hover:shadow-md ${isSelected ? 'border-primary shadow-md' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="outline" className="text-xs">
                #{section.orderNumber}
              </Badge>
              <h3 className="font-semibold text-lg">{section.title}</h3>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {lessonsCount} bài học
            </p>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onSelect}
              className="flex items-center"
            >
              <FileText className="mr-2 h-4 w-4" />
              Xem Lessons
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            
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