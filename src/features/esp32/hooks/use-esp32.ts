import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PagedResult } from '@/types/page-result'
import { Esp32, Esp32Device } from '@/types/esp32'
import * as esp32Api from '@/features/esp32/api/esp32-api'

const STALE_TIME = 5 * 60 * 1000 // 5 minutes

export const useEsp32 = () => {
  const queryClient = useQueryClient()

  const useGetAllEsp32s = (
    page = 1,
    size = 10,
    accountId?: string,
    macAddress?: string,
    name?: string,
    firmwareVersion?: number,
    topicPub?: string,
    topicSub?: string,
    status?: number
  ) => {
    return useQuery<PagedResult<Esp32> | null>({
      queryKey: ['esp32s', page, size, accountId, macAddress, name, firmwareVersion, topicPub, topicSub, status],
      queryFn: ({ signal }) => esp32Api.getAllEsp32s(page, size, accountId, macAddress, name, firmwareVersion, topicPub, topicSub, status, signal),
      staleTime: STALE_TIME,
      refetchOnWindowFocus: false,
    })
  }

  const useGetEsp32ById = (id?: string) => {
    return useQuery<Esp32 | undefined>({
      queryKey: ['esp32', id],
      queryFn: () => esp32Api.getEsp32ById(id || ''),
      enabled: !!id,
      staleTime: STALE_TIME,
      refetchOnWindowFocus: false,
    })
  }

  const useGetEsp32ByAccountId = (accountId?: string) => {
    return useQuery<Esp32 | undefined>({
      queryKey: ['esp32', 'account', accountId],
      queryFn: () => esp32Api.getEsp32ByAccountId(accountId || ''),
      enabled: !!accountId,
      staleTime: STALE_TIME,
      refetchOnWindowFocus: false,
    })
  }

  const useCreateEsp32 = () => {
    return useMutation({
      mutationFn: (data: Omit<Esp32, 'id' | 'createdAt' | 'lastUpdated'>) => esp32Api.createEsp32(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['esp32s'] })
      },
    })
  }

  const useUpdateEsp32 = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<Esp32> }) => esp32Api.updateEsp32(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['esp32s'] })
        queryClient.invalidateQueries({ queryKey: ['esp32'] })
      },
    })
  }

  const usePatchEsp32 = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<Esp32> }) => esp32Api.patchEsp32(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['esp32s'] })
        queryClient.invalidateQueries({ queryKey: ['esp32'] })
      },
    })
  }

  const useDeleteEsp32 = () => {
    return useMutation({
      mutationFn: (id: string) => esp32Api.deleteEsp32(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['esp32s'] })
        queryClient.invalidateQueries({ queryKey: ['esp32'] })
      },
    })
  }

  const useChangeEsp32Status = () => {
    return useMutation({
      mutationFn: ({ id, status }: { id: string; status: number }) => esp32Api.changeEsp32Status(id, status),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['esp32s'] })
        queryClient.invalidateQueries({ queryKey: ['esp32'] })
      },
    })
  }

  const useSendEsp32Message = () => {
    return useMutation({
      mutationFn: ({ id, name, message, language }: { id: string; name: string; message: string; language: string }) =>
        esp32Api.sendEsp32Message(id, name, message, language),
    })
  }

  const useGetEsp32Devices = (id?: string) => {
    return useQuery<Esp32Device[] | undefined>({
      queryKey: ['esp32', 'devices', id],
      queryFn: () => (id ? esp32Api.getEsp32Devices(id) : Promise.resolve([])),
      enabled: !!id,
      staleTime: STALE_TIME,
      refetchOnWindowFocus: false,
    })
  }

  const useAddEsp32Device = () => {
    return useMutation({
      mutationFn: ({ id, name, type }: { id: string; name: string; type: string }) => esp32Api.addEsp32Device(id, name, type),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['esp32', 'devices', variables.id] })
      },
    })
  }

  const useRemoveEsp32Device = () => {
    return useMutation({
      mutationFn: ({ id, name }: { id: string; name: string }) => esp32Api.removeEsp32Device(id, name),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['esp32', 'devices', variables.id] })
      },
    })
  }

  const useUpdateEsp32Device = () => {
    return useMutation({
      mutationFn: ({ id, name, newType }: { id: string; name: string; newType: string }) => esp32Api.updateEsp32Device(id, name, newType),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['esp32', 'devices', variables.id] })
      },
    })
  }

  return {
    useGetAllEsp32s,
    useGetEsp32ById,
    useGetEsp32ByAccountId,
    useCreateEsp32,
    useUpdateEsp32,
    usePatchEsp32,
    useDeleteEsp32,
    useChangeEsp32Status,
    useSendEsp32Message,
    useGetEsp32Devices,
    useAddEsp32Device,
    useRemoveEsp32Device,
    useUpdateEsp32Device,
  }
}
