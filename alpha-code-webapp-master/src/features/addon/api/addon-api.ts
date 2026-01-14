import { Addon, AddonModal } from "@/types/addon"
import { PagedResult } from "@/types/page-result"
import { paymentsHttp } from "@/utils/http"

// 🧭 Lấy danh sách addon có phân trang
export const getPagedAddons = async (
  page: number,
  size: number,
  search?: string,
  signal?: AbortSignal
): Promise<PagedResult<Addon>> => {
  const response = await paymentsHttp.get<PagedResult<Addon>>("/addons", {
    params: { page, size, search },
    signal,
  })
  return response.data
}

export const getNoneDeletedAddons = async (
  page: number,
  size: number,
  search?: string,
  signal?: AbortSignal
): Promise<PagedResult<Addon>> => {
  const response = await paymentsHttp.get<PagedResult<Addon>>("/addons/none-deleted", {
    params: { page, size, search },
    signal,
  })
  return response.data
}

// 🧩 Lấy 1 addon chưa bị xóa theo id
export const getNoneDeletedAddonById = async (id: string): Promise<Addon> => {
  const response = await paymentsHttp.get<Addon>(`/addons/none-deleted/${id}`)
  return response.data
}

// ⚡ Lấy addon đang hoạt động theo id
export const getActiveAddonById = async (id: string): Promise<Addon> => {
  const response = await paymentsHttp.get<Addon>(`/addons/active/${id}`)
  return response.data
}

// ✨ Tạo addon mới
export const createAddon = async (addonData: AddonModal): Promise<Addon> => {
  const response = await paymentsHttp.post<Addon>("/addons", addonData)
  return response.data
}

// 🛠️ Cập nhật toàn bộ addon
export const updateAddon = async (id: string, addonData: AddonModal): Promise<Addon> => {
  const response = await paymentsHttp.put<Addon>(`/addons/${id}`, addonData)
  return response.data
}

// 🔧 Cập nhật một phần addon
export const patchAddon = async (
  id: string,
  partialData: Partial<AddonModal>
): Promise<Addon> => {
  const response = await paymentsHttp.patch<Addon>(`/addons/${id}`, partialData)
  return response.data
}

// 🗑️ Xóa addon (set status = 0 hoặc xóa cứng tùy backend)
export const deleteAddon = async (id: string): Promise<void> => {
  await paymentsHttp.delete(`/addons/${id}`)
}
