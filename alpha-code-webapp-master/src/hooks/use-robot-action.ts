"use client"

import { useQuery } from "@tanstack/react-query"
import { activitiesHttp } from "@/utils/http"
import type { RobotActionResponse } from "@/types/robot"

export function useRobotActions(
  page: number,
  size: number,
  search = "",
  robotModelId?: string
) {
  return useQuery<RobotActionResponse, Error>({
    queryKey: ["robotActions", page, size, search, robotModelId],
    queryFn: async ({ queryKey }) => {
      const [, currentPage, currentSize, currentSearch, currentRobotModelId] = queryKey
      const res = await activitiesHttp.get<RobotActionResponse>(
        `/actions?page=${currentPage}&size=${currentSize}&search=${currentSearch}${
          currentRobotModelId ? `&robotModelId=${currentRobotModelId}` : ""
        }`,
        { headers: { accept: "*/*" } }
      )
      return res.data
    },
    enabled: !!robotModelId, // chỉ fetch khi có modelId
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: 1000,
    placeholderData: (prev) => prev,
  })
}
