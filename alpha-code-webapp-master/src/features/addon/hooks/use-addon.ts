import {
  getPagedAddons,
  createAddon,
  updateAddon,
  deleteAddon,
  getNoneDeletedAddons,
  getActiveAddonById,
  patchAddon,
} from "../api/addon-api"
import { AddonModal } from "@/types/addon"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const useAddon = () => {
  const queryClient = useQueryClient()

  // 📦 Lấy danh sách addon có phân trang
  const useGetPagedAddons = (page: number, size: number, search?: string) =>
    useQuery({
      queryKey: ["addons-paged", page, size, search],
      queryFn: async ({ queryKey }) => {
        const controller = new AbortController()
        setTimeout(() => controller.abort(), 10000)

        const [, currentPage, currentSize, searchValue] = queryKey
        return await getPagedAddons(
          currentPage as number,
          currentSize as number,
          searchValue as string,
          controller.signal
        )
      },
      retry: 2,
      retryDelay: 1000,
    })

  // 🧩 Lấy tất cả addon chưa bị xóa
  const useGetNoneDeletedAddons = (page: number, size: number, search?: string) =>
    useQuery({
      queryKey: ["addons-none-deleted", page, size, search],
      queryFn: async ({ queryKey }) => {
        const controller = new AbortController()
        setTimeout(() => controller.abort(), 10000)

        const [, currentPage, currentSize, searchValue] = queryKey
        return await getNoneDeletedAddons(
          currentPage as number,
          currentSize as number,
          searchValue as string,
          controller.signal
        )
      },
      retry: 2,
      retryDelay: 1000,
    })

  // ⚡ Lấy addon đang hoạt động theo id
  const useGetActiveAddonById = (id: string) =>
    useQuery({
      queryKey: ["addon-active", id],
      queryFn: () => getActiveAddonById(id),
      enabled: !!id,
    })

  // ➕ Tạo addon mới
  const useCreateAddon = () =>
    useMutation({
      mutationFn: createAddon,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["addons-paged"] })
        queryClient.invalidateQueries({ queryKey: ["addons-none-deleted"] })
      },
    })

  // ✏️ Cập nhật addon
  const useUpdateAddon = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: AddonModal }) => updateAddon(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["addons-paged"] })
        queryClient.invalidateQueries({ queryKey: ["addons-none-deleted"] })
      },
    })

  // 🔧 Patch addon
  const usePatchAddon = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<AddonModal> }) => patchAddon(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["addons-paged"] })
      },
    })

  // 🗑️ Xóa addon
  const useDeleteAddon = () =>
    useMutation({
      mutationFn: deleteAddon,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["addons-paged"] })
        queryClient.invalidateQueries({ queryKey: ["addons-none-deleted"] })
      },
    })

  return {
    useGetPagedAddons,
    useGetNoneDeletedAddons,
    useGetActiveAddonById,
    useCreateAddon,
    useUpdateAddon,
    usePatchAddon,
    useDeleteAddon,
  }
}
