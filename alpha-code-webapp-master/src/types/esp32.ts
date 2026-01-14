export type Esp32 = {
  id?: string
  accountId: string
  macAddress: string
  name: string
  lastSeen?: string | null
  firmwareVersion: number
  metadata?: string | null
  topicPub: string
  topicSub: string
  message?: string | null
  createdAt?: string
  lastUpdated?: string
  status?: number
  statusText?: string
}

export type Esp32Device = {
  name: string
  type: string
}

