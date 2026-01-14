import { Color } from "./color"

export type Action = {
    id: string
    code: string
    name: string
    description: string
    duration: number
    status: number
    icon: string
    createdDate: string
    lastUpdate: string
    canInterrupt: boolean
    robotModelId: string
    robotModelName: string
    statusText?: string
    type: number
}

export type ActionModal = {
    robotModelId?: string
    name: string
    code: string
    description: string
    duration: number
    status: number
    canInterrupt: boolean
    icon: string
    type: number
}

export type ActionActivites = {
    action_id: string;
    start_time: number;
    duration: number;
    action_type: string;
    color: Color[];
}

