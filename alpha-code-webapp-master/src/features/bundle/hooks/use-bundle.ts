import {
  getPagedBundles,
  getNoneDeletedBundles, // sửa import
  getActiveBundleById,
  createBundle,
  updateBundle,
  patchBundle,
  deleteBundle,
} from "../api/bundle-api"
import { BundleModal } from "@/types/bundle"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const useBundle = () => {
  const queryClient = useQueryClient()

  // 📦 Lấy danh sách bundle có phân trang
  const useGetPagedBundles = (page: number, size: number, search?: string) =>
    useQuery({
      queryKey: ["bundles-paged", page, size, search],
      queryFn: async ({ queryKey }) => {
        const controller = new AbortController()
        setTimeout(() => controller.abort(), 10000)

        const [, currentPage, currentSize, searchValue] = queryKey
        return await getPagedBundles(
          currentPage as number,
          currentSize as number,
          searchValue as string,
          controller.signal
        )
      },
      retry: 2,
      retryDelay: 1000,
    })

  // 🧩 Lấy bundle chưa bị xóa (none deleted)
  const useGetNoneDeletedBundles = (page: number, size: number, search?: string) =>
    useQuery({
      queryKey: ["bundles-none-deleted", page, size, search],
      queryFn: () => getNoneDeletedBundles(page, size, search),
    })

  // ⚡ Lấy bundle đang hoạt động theo id
  const useGetActiveBundleById = (id: string) =>
    useQuery({
      queryKey: ["bundle-active", id],
      queryFn: () => getActiveBundleById(id),
      enabled: !!id,
    })

  // ➕ Tạo bundle mới
  const useCreateBundle = () =>
    useMutation({
      mutationFn: createBundle,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bundles-paged"] })
        queryClient.invalidateQueries({ queryKey: ["bundles-none-deleted"] }) // thêm invalidate
      },
    })

  // ✏️ Cập nhật bundle
  const useUpdateBundle = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: BundleModal }) => updateBundle(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bundles-paged"] })
        queryClient.invalidateQueries({ queryKey: ["bundles-none-deleted"] })
      },
    })

  // 🔧 Patch bundle
  const usePatchBundle = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<BundleModal> }) =>
        patchBundle(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bundles-paged"] })
        queryClient.invalidateQueries({ queryKey: ["bundles-none-deleted"] })
      },
    })

  // 🗑️ Xóa bundle
  const useDeleteBundle = () =>
    useMutation({
      mutationFn: deleteBundle,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bundles-paged"] })
        queryClient.invalidateQueries({ queryKey: ["bundles-none-deleted"] })
      },
    })

  return {
    useGetPagedBundles,
    useGetNoneDeletedBundles,
    useGetActiveBundleById,
    useCreateBundle,
    useUpdateBundle,
    usePatchBundle,
    useDeleteBundle,
  }
}
