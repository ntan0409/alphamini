/**
 * Cookie utilities for server-side validation
 * Các functions để set/get cookies cho license key và addon key
 */

export const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null
  
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  
  return null
}

export const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

export const setLicenseKeyCookie = (licenseKey: string) => {
  setCookie('licenseKey', licenseKey, 7)
}

export const setAddonKeyCookie = (addonKey: string) => {
  setCookie('addonKey', addonKey, 7)
}

export const setAccessTokenCookie = (accessToken: string) => {
  setCookie('accessToken', accessToken, 7)
}

export const clearAuthCookies = () => {
  deleteCookie('accessToken')
  deleteCookie('licenseKey')
  deleteCookie('addonKey')
}
