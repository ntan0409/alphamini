import { Bundle, BundleModal } from "@/types/bundle"
import { PagedResult } from "@/types/page-result"
import { coursesHttp } from "@/utils/http"

// 🧭 Lấy danh sách bundle có phân trang
export const getPagedBundles = async (
  page: number,
  size: number,
  search?: string,
  signal?: AbortSignal
): Promise<PagedResult<Bundle>> => {
  const response = await coursesHttp.get<PagedResult<Bundle>>("/bundles", {
    params: { page, size, search },
    signal,
  })
  return response.data
}

// 🧩 Lấy bundle chưa bị xóa theo trang
export const getNoneDeletedBundles = async (
  page: number,
  size: number,
  search?: string
): Promise<PagedResult<Bundle>> => {
  const params: Record<string, unknown> = { page, size }
  if (search) params.search = search

  const response = await coursesHttp.get<PagedResult<Bundle>>(
    "/bundles/get-none-delete",
    { params }
  )
  return response.data
}

// ⚡ Lấy bundle đang hoạt động theo id
export const getActiveBundleById = async (id: string): Promise<Bundle> => {
  const response = await coursesHttp.get<Bundle>(`/bundles/active/${id}`)
  return response.data
}

// ✨ Tạo bundle mới
export const createBundle = async (bundleData: BundleModal): Promise<Bundle> => {
  const formData = new FormData()
  formData.append("name", bundleData.name)
  formData.append("description", bundleData.description)
  formData.append("price", bundleData.price.toString())
  if (bundleData.discountPrice !== undefined)
    formData.append("discountPrice", bundleData.discountPrice.toString())
  if (bundleData.image) formData.append("coverImage", bundleData.image)

  const response = await coursesHttp.post<Bundle>("/bundles", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

// 🛠️ Cập nhật bundle
export const updateBundle = async (id: string, bundleData: BundleModal): Promise<Bundle> => {
  const formData = new FormData()
  formData.append("id", id)
  formData.append("name", bundleData.name)
  formData.append("description", bundleData.description)
  formData.append("price", bundleData.price.toString())
  if (bundleData.discountPrice !== undefined)
    formData.append("discountPrice", bundleData.discountPrice.toString())
  if (bundleData.status !== undefined)
    formData.append("status", bundleData.status.toString())
  if (bundleData.coverImage) formData.append("coverImage", bundleData.coverImage)
  if (bundleData.image) formData.append("image", bundleData.image)

  const response = await coursesHttp.put<Bundle>(`/bundles/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

// 🔧 Cập nhật một phần bundle
export const patchBundle = async (
  id: string,
  partialData: Partial<BundleModal>
): Promise<Bundle> => {
  const response = await coursesHttp.patch<Bundle>(`/bundles/${id}`, partialData)
  return response.data
}

// 🗑️ Xóa bundle
export const deleteBundle = async (id: string): Promise<void> => {
  await coursesHttp.delete(`/bundles/${id}`)
}
