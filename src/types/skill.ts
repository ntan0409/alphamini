export type Skill = {
  id: string
  name: string
  code: string
  icon: string
  createdDate: string
  lastUpdated: string | null
  robotModelId?: string
  robotModelName?: string
  status: number
  statusText: string
}

export type SkillResponse = {
  data: Skill[]
  page: number
  total_count: number
  per_page: number
  total_pages: number
  has_next: boolean
  has_previous: boolean
}

export type SkillModal = {
    robotModelId?: string
    name: string
    code: string
    description: string
    duration: number
    status: number
    canInterrupt: boolean
    icon: string
}