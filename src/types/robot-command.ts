export type RobotCommand = {
    id: string
    commandId: string
    commandName: string
    robotModelId: string
    robotModelName: string
    status: number
    statusText: string
    createdDate: string
    lastUpdate: string
}

export type RobotCommandResponse = {
    robotCommands: RobotCommand[]
    total_count: number
    page: number
    per_page: number
    total_pages: number
    has_next: boolean
    has_previous: boolean
}