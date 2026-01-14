export type Dance = {
    id: string
    code: string
    name: string
    description: string
    status: number
    icon: string
    createdDate: string
    lastUpdate: string
    duration: number
    robotModelId: string
    robotModelName: string
    statusText: string
    type: number
}

export type DanceModal = {
    code: string
    name: string
    description: string
    robotModelId: string
    duration: number
    status: number
    icon: string
    type: number
}