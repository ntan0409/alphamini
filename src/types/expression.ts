export type Expression = {
    id: string
    code: string
    name: string
    imageUrl: string
    status: number
    createdDate: string
    lastUpdate: string
    robotModelId: string
    robotModelName: string
    statusText: string
}

export type ExpressionModal = {
    robotModelId?: string
    code: string
    name: string
    imageUrl: string
    status: number
}