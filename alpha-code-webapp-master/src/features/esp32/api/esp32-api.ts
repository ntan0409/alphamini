import { PagedResult } from '@/types/page-result'
import { Esp32, Esp32Device } from '@/types/esp32'
import { robotsHttp } from '@/utils/http'
import axios from 'axios'

export const getAllEsp32s = async (
  page: number = 1,
  size: number = 10,
  accountId?: string,
  macAddress?: string,
  name?: string,
  firmwareVersion?: number,
  topicPub?: string,
  topicSub?: string,
  status?: number,
  signal?: AbortSignal
) => {
  try {
    const response = await robotsHttp.get<PagedResult<Esp32>>('/api/v1/esp32s', {
      params: {
        page,
        size,
        accountId,
        macAddress,
        name,
        firmwareVersion,
        topicPub,
        topicSub,
        status,
      },
      signal,
    })
    return response.data
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled for getAllEsp32s')
      return null
    }
    console.error('API Error in getAllEsp32s:', error)
    throw error
  }
}

export const getEsp32ById = async (id: string) => {
  const response = await robotsHttp.get<Esp32>(`/esp32s/${id}`)
  return response.data
}

export const getEsp32ByAccountId = async (accountId: string) => {
  const response = await robotsHttp.get<Esp32>(`/esp32s/account/${accountId}`)
  return response.data
}

export const createEsp32 = async (data: Omit<Esp32, 'id' | 'createdAt' | 'lastUpdated'>) => {
  const response = await robotsHttp.post('/esp32s', data)
  return response.data
}

export const updateEsp32 = async (id: string, data: Partial<Omit<Esp32, 'id' | 'createdAt' | 'lastUpdated'>>) => {
  const response = await robotsHttp.put(`/esp32s/${id}`, data)
  return response.data
}

export const patchEsp32 = async (id: string, data: Partial<Omit<Esp32, 'id' | 'createdAt' | 'lastUpdated'>>) => {
  const response = await robotsHttp.patch(`/esp32s/${id}`, data)
  return response.data
}

export const deleteEsp32 = async (id: string) => {
  const response = await robotsHttp.delete(`/esp32s/${id}`)
  return response.data
}

export const changeEsp32Status = async (id: string, status: number) => {
  const response = await robotsHttp.patch(`/esp32s/${id}/change-status`, null, { params: { status } })
  return response.data
}

export const sendEsp32Message = async (id: string, name: string, message: string, language: string) => {
  const response = await robotsHttp.post(`/esp32s/${id}/send-message`, null, {
    params: { name, message, language },
  })
  return response.data
}

export const getEsp32Devices = async (id: string) => {
  const response = await robotsHttp.get<Esp32Device[]>(`/esp32s/devices/${id}`)
  return response.data
}

export const addEsp32Device = async (id: string, name: string, type: string) => {
  const response = await robotsHttp.post(`/esp32s/devices/${id}`, null, { params: { name, type } })
  return response.data
}

export const removeEsp32Device = async (id: string, name: string) => {
  const response = await robotsHttp.delete(`/esp32s/devices/${id}`, { params: { name } })
  return response.data
}

export const updateEsp32Device = async (id: string, name: string, newType: string) => {
  const response = await robotsHttp.patch(`/esp32s/devices/${id}`, null, { params: { name, newType } })
  return response.data
}
