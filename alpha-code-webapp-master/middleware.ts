import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes yêu cầu license key
const LICENSE_PROTECTED_ROUTES = [
  '/parent/music',
  '/children/music',
  '/parent/joystick',
  '/children/joystick',
]

// Routes yêu cầu addon key với category tương ứng
const ADDON_PROTECTED_ROUTES: Record<string, number> = {
  '/parent/osmo': 1,          // OSMO category
  '/children/osmo': 1,        // OSMO category
  '/parent/qr-codes': 2,      // QRCODE category
  '/children/qr-codes': 2,    // QRCODE category
  '/parent/smart-home': 3,    // SMART_HOME category
  '/children/smart-home': 3,  // SMART_HOME category
  '/parent/blockly-coding': 4,     // BLOCKLY category
  '/children/blockly-coding': 4,   // BLOCKLY category
}

// API endpoints để validate
const PAYMENT_SERVICE_URL = 'https://payment-service.alpha-code.site/api/v1'

async function validateLicenseKey(accountId: string, licenseKey: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${PAYMENT_SERVICE_URL}/license-keys/validate-key?accountId=${accountId}&key=${licenseKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )
    
    if (!response.ok) return false
    const result = await response.json()
    return result === true
  } catch (error) {
    console.error('Error validating license key:', error)
    return false
  }
}

async function validateAddonKey(payload: { key?: string; accountId?: string; category?: number }): Promise<boolean> {
  try {
    const response = await fetch(
      `${PAYMENT_SERVICE_URL}/license-key-addons/validate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      }
    )
    
    if (!response.ok) return false
    const result = await response.json()
    
    // Support both response shapes: plain boolean `true` or `{ allowed: boolean }`
    if (typeof result === 'boolean') return result
    return !!result?.allowed
  } catch (error) {
    console.error('Error validating addon key:', error)
    return false
  }
}

function getUserIdFromToken(token: string): string | null {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString())
    return decoded.sub || decoded.userId || decoded.id || null
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Get accessToken and key from cookies
  const accessToken = request.cookies.get('accessToken')?.value
  const licenseKey = request.cookies.get('licenseKey')?.value
  const addonKey = request.cookies.get('addonKey')?.value

  // Get accountId from token
  const accountId = accessToken ? getUserIdFromToken(accessToken) : null

  // Check if this is a license-protected route
  const isLicenseProtected = LICENSE_PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  
  if (isLicenseProtected) {
    // Cần có accountId và licenseKey
    if (!accountId || !licenseKey) {
      return NextResponse.redirect(new URL('/license-key', request.url))
    }

    // Validate license key ở server
    const isValid = await validateLicenseKey(accountId, licenseKey)
    if (!isValid) {
      return NextResponse.redirect(new URL('/license-key', request.url))
    }
  }

  // Check if this is an addon-protected route
  const addonCategory = ADDON_PROTECTED_ROUTES[pathname]
  if (addonCategory !== undefined) {
    // Cần có accountId và addonKey
    if (!accountId || !addonKey) {
      return NextResponse.redirect(new URL('/payment', request.url))
    }

    // Validate addon key ở server
    const isValid = await validateAddonKey({
      key: addonKey,
      accountId,
      category: addonCategory,
    })
    
    if (!isValid) {
      return NextResponse.redirect(new URL('/payment', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // License protected routes
    '/parent/music/:path*',
    '/children/music/:path*',
    '/parent/joystick/:path*',
    '/children/joystick/:path*',
    // Addon protected routes
    '/parent/osmo/:path*',
    '/children/osmo/:path*',
    '/parent/qr-codes/:path*',
    '/children/qr-codes/:path*',
    '/parent/smart-home/:path*',
    '/children/smart-home/:path*',
    '/parent/blockly-coding/:path*',
    '/children/blockly-coding/:path*',
  ],
}
