import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getLicenseKey, validateLicenseKey, getUserLicenseInfo } from '@/features/license-key/api/license-key-api'
import { getUserIdFromToken } from '@/utils/tokenUtils'

/**
 * useLicenseKey
 * - Fetches license key string for an account using `getAccountCourses` API.
 * - If `accountId` is not provided, it will attempt to infer it from
 *   `sessionStorage.accessToken` via `getUserIdFromToken`.
 * - By default it will persist the fetched key into `sessionStorage.key` so
 *   other parts of the app (toggles, guards) can read it immediately.
 */
export const useLicenseKey = (accountId?: string, persistToSession = true) => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null
  const inferredAccountId = accountId ?? (token ? getUserIdFromToken(token) ?? undefined : undefined)

  const query = useQuery({
    queryKey: ['licenseKey', inferredAccountId],
    queryFn: async () => {
      if (!inferredAccountId) throw new Error('accountId is required to fetch license key')
      return await getLicenseKey(inferredAccountId)
    },
    enabled: !!inferredAccountId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  })

  useEffect(() => {
    if (!persistToSession) return
    if (typeof window === 'undefined') return
    if (query.data) {
      try {
        sessionStorage.setItem('key', String(query.data))
      } catch (e) {
        // ignore sessionStorage errors
      }
    }
  }, [query.data, persistToSession])

  return query
}

export const useValidateLicenseKey = (accountId?: string, licenseKey?: string) => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null
  const inferredAccountId = accountId ?? (token ? getUserIdFromToken(token) ?? undefined : undefined)
  const inferredLicenseKey = licenseKey ?? (typeof window !== 'undefined' ? sessionStorage.getItem('key') || undefined : undefined)

  const query = useQuery({
    queryKey: ['validateLicenseKey', inferredAccountId, inferredLicenseKey],
    queryFn: async () => {
      if (!inferredAccountId) throw new Error('AccountId là bắt buộc để xác thực license key')
      if (!inferredLicenseKey) throw new Error('LicenseKey là bắt buộc để xác thực license key')
      return await validateLicenseKey(inferredAccountId, inferredLicenseKey)
    },
    enabled: !!inferredAccountId && !!inferredLicenseKey,
    staleTime: 0,
    retry: 1,
  })
  return query

}

export const useGetUserLicenseInfo = (accountId: string) => {
  return useQuery({
    queryKey: ['user-license-info', accountId],
    queryFn: ({ signal }) => getUserLicenseInfo(accountId, signal),
    enabled: !!accountId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  })
}

