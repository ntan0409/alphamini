// src/hooks/use-dance.ts
"use client"

import { useRobotStore } from "@/hooks/use-robot-store"
import { getPagedDances, createDance, updateDance, deleteDance } from "@/features/activities/api/dance-api"
import { DanceModal } from "@/types/dance"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useDance = () => {
  const queryClient = useQueryClient()
  const { selectedRobot } = useRobotStore()

  const useGetPagedDances = (page: number, limit: number, search?: string, ) => {
    
    const model = selectedRobot?.robotModelId || "default"

    return useQuery({
      queryKey: ["dances", model, page, limit, search || ""],
      queryFn: () => getPagedDances(page, limit, search, model),
      enabled: !!model,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    })
  }

  const useCreateDance = () =>
    useMutation({
      mutationFn: createDance,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dances"] }),
    })

  const useUpdateDance = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: DanceModal }) => updateDance(id, data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dances"] }),
    })

  const useDeleteDance = () =>
    useMutation({
      mutationFn: deleteDance,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dances"] }),
    })

  return {
    useGetPagedDances,
    useCreateDance,
    useUpdateDance,
    useDeleteDance,
  }
}
