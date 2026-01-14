import { ValidateAddon } from "@/types/addon"
import { paymentsHttp } from "@/utils/http"

export const validateAddonApi = async (payload: ValidateAddon): Promise<boolean> => {
  const res = await paymentsHttp.post('/license-key-addons/validate', payload)
  const d = res.data
  // Support both response shapes: plain boolean `true` or `{ allowed: boolean }`.
  if (typeof d === 'boolean') return d
  return !!d?.allowed
}