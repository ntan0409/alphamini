export type RobotModel = {
  id: string
  name: string
  firmwareVersion: string
  ctrlVersion: string
  robotPrompt: string
  createdDate: string
  lastUpdated: string | null
  status: number
  statusText: string
}

export type RobotModelResponse = {
  data: RobotModel[]
  page: number
  total_count: number
  per_page: number
  total_pages: number
  has_next: boolean
  has_previous: boolean
}