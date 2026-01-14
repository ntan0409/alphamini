export type ExtendedAction = {
    id: string
    code: string
    icon: string
    name: string
    robotModelId: string
    robotModelName?: string
    status: number
    statusText: string
    createdDate: string
    lastUpdate: string
}

export type ExtendedActionModal = {
    code: string
    name: string
    icon: string
    status: number
    robotModelId: string
}

export type ExtendedActionResponse = {
  data: ExtendedAction[]
  has_next: boolean
  has_previous: boolean
  page: number
  per_page: number
  total_count: number
  total_pages: number
}