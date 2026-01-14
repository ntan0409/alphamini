"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import {
  Search,
  Trash2,
  GripVertical,
  Zap,
  Move,
  Music,
  Smile,
  Target
} from "lucide-react"
import { getPagedActions } from "@/features/activities/api/action-api"
import { getPagedDances } from "@/features/activities/api/dance-api"
import { getPagedExpressions } from "@/features/activities/api/expression-api"
import { getPagedExtendedActions } from "@/features/activities/api/extended-action-api"
import { getAllSkills } from "@/features/activities/api/skill-api"
import { Action } from "@/types/action"
import { Dance } from "@/types/dance"
import { Expression } from "@/types/expression"
import { ExtendedAction } from "@/types/extended-action"
import { Skill } from "@/types/skill"

export interface SolutionItem {
  type: "action" | "extended_action" | "skill" | "expression" | "dance"
  code: string
}

interface ActivityItem {
  id: string
  code: string
  name: string
  type: "action" | "extended_action" | "skill" | "expression" | "dance"
}

interface SolutionBuilderProps {
  value: SolutionItem[]
  onChange: (value: SolutionItem[]) => void
}

export function SolutionBuilder({ value, onChange }: SolutionBuilderProps) {
  const [solution, setSolution] = useState<SolutionItem[]>(value || [])
  const [draggedItem, setDraggedItem] = useState<ActivityItem | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("action")

  // Activity lists
  const [actions, setActions] = useState<ActivityItem[]>([])
  const [dances, setDances] = useState<ActivityItem[]>([])
  const [expressions, setExpressions] = useState<ActivityItem[]>([])
  const [extendedActions, setExtendedActions] = useState<ActivityItem[]>([])
  const [skills, setSkills] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch data
  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    setLoading(true)
    try {
      const [actionsData, dancesData, expressionsData, extendedActionsData, skillsData] = await Promise.all([
        getPagedActions(1, 100, undefined, undefined, undefined),
        getPagedDances(1, 100),
        getPagedExpressions(1, 100),
        getPagedExtendedActions(1, 100),
        getAllSkills({ page: 1, size: 100 })
      ])

      // Map actions and dances to type "action"
      setActions(actionsData.data.map((a: Action) => ({
        id: a.id,
        code: a.code,
        name: a.name,
        type: "action" as const
      })))

      setDances(dancesData.data.map((d: Dance) => ({
        id: d.id,
        code: d.code,
        name: d.name,
        type: "action" as const // Dance uses "action" type
      })))

      // Map others to their respective types
      setExpressions(expressionsData.data.map((e: Expression) => ({
        id: e.id,
        code: e.code,
        name: e.name,
        type: "expression" as const
      })))

      setExtendedActions(extendedActionsData.data.map((ea: ExtendedAction) => ({
        id: ea.id,
        code: ea.code,
        name: ea.name,
        type: "extended_action" as const // Extended action uses "extended_action" type
      })))

      setSkills(skillsData.data.map((s: Skill) => ({
        id: s.id,
        code: s.code,
        name: s.name,
        type: "skill" as const
      })))
    } catch (error) {
      console.error("Error fetching activities:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentList = () => {
    switch (activeTab) {
      case "action":
        return actions
      case "dance":
        return dances
      case "expression":
        return expressions
      case "extended_action":
        return extendedActions
      case "skill":
        return skills
      default:
        return []
    }
  }

  const filteredList = getCurrentList().filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Drag from library
  const handleDragStartFromLibrary = (item: ActivityItem) => {
    setDraggedItem(item)
  }

  // Drag within solution
  const handleDragStartFromSolution = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropOnSolution = (e: React.DragEvent, targetIndex?: number) => {
    e.preventDefault()

    if (draggedItem) {
      // Adding from library
      const newItem: SolutionItem = {
        type: draggedItem.type,
        code: draggedItem.code
      }

      const newSolution = [...solution]
      if (targetIndex !== undefined) {
        newSolution.splice(targetIndex, 0, newItem)
      } else {
        newSolution.push(newItem)
      }

      setSolution(newSolution)
      onChange(newSolution)
      setDraggedItem(null)
    } else if (draggedIndex !== null && targetIndex !== undefined) {
      // Reordering within solution
      const newSolution = [...solution]
      const [movedItem] = newSolution.splice(draggedIndex, 1)
      newSolution.splice(targetIndex, 0, movedItem)

      setSolution(newSolution)
      onChange(newSolution)
      setDraggedIndex(null)
    }
  }

  const handleRemoveItem = (index: number) => {
    const newSolution = solution.filter((_, i) => i !== index)
    setSolution(newSolution)
    onChange(newSolution)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "action":
        return <Move className="h-4 w-4" />
      case "dance":
        return <Music className="h-4 w-4" />
      case "expression":
        return <Smile className="h-4 w-4" />
      case "extended_action":
        return <Zap className="h-4 w-4" />
      case "skill":
        return <Target className="h-4 w-4" />
      default:
        return <Move className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "action":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "expression":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "extended_action":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "skill":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Activity Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Thư viện hành động
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="action">Hành động</TabsTrigger>
              <TabsTrigger value="dance">Nhảy múa</TabsTrigger>
              <TabsTrigger value="expression">Biểu cảm</TabsTrigger>
              <TabsTrigger value="extended_action">Mở rộng</TabsTrigger>
              <TabsTrigger value="skill">Kỹ năng</TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm hành động..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Đang tải...
                  </div>
                ) : filteredList.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Không tìm thấy hành động nào
                  </div>
                ) : (
                  filteredList.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStartFromLibrary(item)}
                      className="flex items-center gap-2 p-3 border rounded-lg cursor-move hover:bg-accent transition-colors"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      {getTypeIcon(item.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm break-words">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.code}</p>
                      </div>
                      <Badge variant="outline" className={getTypeColor(item.type)}>
                        {item.type}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Solution Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Solution ({solution.length} hành động)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropOnSolution(e)}
            className="min-h-[500px] max-h-[550px] overflow-y-auto space-y-2 p-4 border-2 border-dashed rounded-lg bg-muted/20"
          >
            {solution.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Move className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Kéo và thả hành động từ thư viện vào đây
                </p>
              </div>
            ) : (
              solution.map((item, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleDragStartFromSolution(index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnSolution(e, index)}
                  className="flex items-center gap-2 p-3 bg-background border rounded-lg cursor-move hover:shadow-md transition-shadow"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {index + 1}
                  </span>
                  {getTypeIcon(item.type)}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.code}</p>
                  </div>
                  <Badge variant="outline" className={getTypeColor(item.type)}>
                    {item.type}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {solution.length > 0 && (
            <div className="mt-4">
              <details className="group">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Xem JSON
                </summary>
                <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                  {JSON.stringify(solution, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
