"use client"

import { useMemo, useState, useEffect, useRef, type ComponentType, type SVGProps } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGetKeyPrice } from '@/features/config/hooks/use-key-price'
import { usePayOS } from '@payos/payos-checkout'
import { useCourse } from '@/features/courses/hooks/use-course'
import { useAddon } from '@/features/addon/hooks/use-addon'
import { useSubscription } from '@/features/subscription/hooks/use-subscription'
import { useBundle } from '@/features/bundle/hooks/use-bundle'
import { Loader2, Check, BookOpen, Package, Zap, Key, Gift, ArrowLeft, CreditCard, Smartphone } from "lucide-react"
import visa from '../../../public/visa.jpg'
import payos from '../../../public/payos.jpg'
import vnpay from '../../../public/vnpay.jpg'
import momo from '../../../public/momo.png'
import miniGif from '../../../public/pulling_down_1.gif'
import LoadingState from "../loading-state"
import ErrorState from "../error-state"
import { getUserIdFromToken } from '@/utils/tokenUtils'
import { useCreatePayOSEmbedded } from '@/features/payment/hooks/use-payments'
import type { CreatePayment } from '@/types/payment'
import { webURL } from "@/app/constants/constants"
import { toast } from "sonner"

function formatCurrency(v: number) {
  try {
    return v.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
  } catch (e) {
    return `${v} VND`
  }
}

function formatCurrencyParts(v: number) {
  try {
    const nf = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }) as Intl.NumberFormat & { formatToParts?: (n: number) => Array<{ type: string; value: string }> }
    // formatToParts is supported in modern runtimes
    // example parts: [{type: 'integer', value: '100.000'}, {type: 'literal', value: ' '}, {type: 'currency', value: '₫'}]
    // fallback to full string if parts not available
    if (typeof nf.formatToParts === 'function') {
      const parts = nf.formatToParts!(v)
      const currencyPart = parts.find(p => p.type === 'currency')?.value || ''
      const amountPart = parts.filter(p => p.type !== 'currency').map(p => p.value).join('')
      return { amount: amountPart.trim(), currency: currencyPart }
    }
    const full = nf.format(v)
    // try to split last char(s)
    const m = full.match(/(.*)\s?(\p{Sc}|[\u0110\u00A2\u20AB\w]+)$/u)
    if (m) return { amount: m[1].trim(), currency: m[2] }
    return { amount: full, currency: '' }
  } catch (e) {
    return { amount: String(v), currency: 'đ' }
  }
}

/**
 * Lightweight client-side sanitizer to remove script/style/iframe elements and
 * strip event handler attributes and dangerous protocols from href/src.
 * This is intentionally simple; for stronger guarantees use a vetted library
 * like DOMPurify (recommended).
 */
function sanitizeHtml(input: string) {
  if (!input) return ''
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(input, 'text/html')

    // remove potentially dangerous elements
    doc.querySelectorAll('script, style, iframe, object, embed').forEach((n) => n.remove())

    // remove event handler attributes and javascript/data: URIs
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT, null)
    let node = walker.nextNode()
    while (node) {
      const el = node as Element
      // copy attributes to avoid modifying while iterating
      const attrs = Array.from(el.attributes)
      attrs.forEach((a) => {
        const name = a.name.toLowerCase()
        const val = a.value || ''
        if (name.startsWith('on')) {
          el.removeAttribute(a.name)
        }
        if ((name === 'href' || name === 'src') && /^(javascript|data):/i.test(val.trim())) {
          el.removeAttribute(a.name)
        }
      })
      node = walker.nextNode()
    }

    return doc.body.innerHTML || ''
  } catch (e) {
    return ''
  }
}

type PaymentCategory = "course" | "plan" | "addon" | "key" | "bundle"
type PaymentMethod = "payos" | "credit_card" | "bank_transfer" | "momo" | "vnpay"

const normalizeType = (raw?: string): PaymentCategory => {
  if (!raw) return "course"
  const s = raw.toLowerCase()
  if (s.includes("course") || s.includes("1") || s.includes("khóa")) return "course"
  if (s.includes("bundle") || s.includes("2") || s.includes("gói")) return "bundle"
  if (s.includes("add") || s.includes("3") || s.includes("dịch vụ")) return "addon"
  if (s.includes("subscription") || s.includes("plan") || s.includes("4") || s.includes("đăng ký")) return "plan"
  if (s.includes("key") || s.includes("license") || s.includes("5") || s.includes("bản quyền")) return "key"
  return "course"
}

const categoryConfig = {
  course: { label: "Khóa học", icon: BookOpen, color: "bg-blue-500" },
  bundle: { label: "Gói khóa học", icon: Package, color: "bg-blue-600" },
  addon: { label: "Dịch vụ bổ sung", icon: Zap, color: "bg-blue-400" },
  plan: { label: "Gói đăng ký", icon: Gift, color: "bg-blue-700" },
  key: { label: "Bản quyền", icon: Key, color: "bg-blue-800" },
}

const paymentMethods: Array<{ key: PaymentMethod; label: string; description?: string; icon?: ComponentType<SVGProps<SVGSVGElement>>; disabled?: boolean; imgUrl?: string }> = [
  { key: "payos", label: "PayOS", description: "Thanh toán qua PayOS", icon: Check, disabled: false, imgUrl: payos.src },
  { key: "credit_card", label: "Thẻ tín dụng", description: "Visa, Mastercard", icon: CreditCard, disabled: true, imgUrl: visa.src },
  { key: "momo", label: "MoMo", description: "Ví điện tử MoMo", icon: Smartphone, disabled: true, imgUrl: momo.src },
  { key: "vnpay", label: "VNPay", description: "Cổng VNPay", icon: Smartphone, disabled: true, imgUrl: vnpay.src },
]

type PaymentPageClientProps = {
  title?: string | null
  price?: number | null
  description?: string | null
  image?: string | null
  loading?: boolean | null
  error?: string | null
  onConfirm?: (opts: { method: PaymentMethod | null; id?: string; category?: PaymentCategory; title?: string | null; price?: number | null }) => Promise<void> | void
}

export default function PaymentPageClient(props: PaymentPageClientProps = {}) {
  const { title: propTitle, price: propPrice, description: propDescription, image: propImage, loading: propLoading, error: propError, onConfirm: propOnConfirm } = props
  const router = useRouter()
  const searchParams = useSearchParams()

  const categoryFromParams = (searchParams?.get("category") || "course") as string
  const idFromParams = (searchParams?.get("id") || "") as string

  const [method, setMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const [fetchedTitle, setFetchedTitle] = useState<string | null>(propTitle ?? null)
  const [fetchedPrice, setFetchedPrice] = useState<number | null>(propPrice ?? null)
  const [fetchedDescription, setFetchedDescription] = useState<string | null>(propDescription ?? null)
  const [fetchedImage, setFetchedImage] = useState<string | null>(propImage ?? null)
  const [isFetchingResource, setIsFetchingResource] = useState(false)

  const paymentCategory = normalizeType(categoryFromParams)
  const price = useMemo(() => fetchedPrice || 0, [fetchedPrice])

  const onConfirm = async () => {
    if (!method) return alert("Vui lòng chọn phương thức thanh toán")
    if (!fetchedTitle && !idFromParams) return alert("Không có tài nguyên để thanh toán")

    setIsProcessing(true)
    try {
      // If a custom onConfirm handler is provided by parent, call it instead of default navigation
      if (propOnConfirm) {
        await propOnConfirm({ method, id: idFromParams || undefined, category: paymentCategory, title: fetchedTitle, price: fetchedPrice })
      } else {
        const resourceIdForUrl = encodeURIComponent(idFromParams || "")
        if (method === "payos") {
          // Build CreatePayment payload required by backend (accountId required)
          const token = sessionStorage.getItem('accessToken') || ''
          const accountId = getUserIdFromToken(token)
          if (!accountId) throw new Error('Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.')

          // Map category -> appropriate id field expected by server
          const basePayload: CreatePayment = { accountId }
          switch (paymentCategory) {
            case 'course':
              basePayload.courseId = idFromParams || undefined
              break
            case 'addon':
              basePayload.addonId = idFromParams || undefined
              break
            case 'plan':
              basePayload.planId = idFromParams || undefined
              break
            case 'key':
              basePayload.keyId = idFromParams || undefined
              break
            case 'bundle':
              basePayload.bundleId = idFromParams || undefined
              break
          }

          const resp = await createPayOS.mutateAsync(basePayload)
          if (resp && resp.checkoutUrl) {
            setPayosUrl(resp.checkoutUrl)
            try {
              payosOriginRef.current = new URL(resp.checkoutUrl).origin
            } catch (e) {
              payosOriginRef.current = null
            }
            setPayosOpen(true)
          } else {
            throw new Error('Invalid PayOS response')
          }
        } else {
          router.push(`/payment/success?method=${method}&id=${resourceIdForUrl}`)
        }
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      toast.error(errorMessage || "Lỗi khi tạo thanh toán")
      setError(errorMessage || "Lỗi khi tạo thanh toán")
      console.error("Error creating payment:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  // PayOS embedded flow: use react-query hook
  const createPayOS = useCreatePayOSEmbedded()
  const [payosUrl, setPayosUrl] = useState<string | null>(null)
  const [payosOpen, setPayosOpen] = useState(false)
  const paymentOpenedRef = useRef(false)
  const payosOriginRef = useRef<string | null>(null)
  const [isEmbeddedProcessing, setIsEmbeddedProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function closePayOS() {
    try {
      exit?.()
    } catch (e) {
      // ignore
    }
    // reset guards and states
    paymentOpenedRef.current = false
    payosOriginRef.current = null
    setPayosOpen(false)
    setPayosUrl(null)
    setIsEmbeddedProcessing(false)
  }

  // PayOS embedded integration: call usePayOS with a config object and open when URL is set
  const { open, exit } = usePayOS({
    RETURN_URL: `${webURL}/payment/result?success=true`,
    ELEMENT_ID: 'embedded-payment-container',
    CHECKOUT_URL: payosUrl ?? '',
    embedded: true,
    onSuccess: () => {
      // Show a brief processing state so server-side postback can complete
      setIsEmbeddedProcessing(true)
      setTimeout(() => {
        closePayOS()
        window.location.href = `/payment/result?success=true&category=${paymentCategory}&id=${encodeURIComponent(idFromParams)}`
      }, 1500)
    },
    onCancel: () => {
      closePayOS()
      window.location.href = `/payment/result?success=false&category=${paymentCategory}&id=${encodeURIComponent(idFromParams)}`
    },
  })

  useEffect(() => {
    // Only try to open the PayOS SDK when we both have a checkout URL and
    // the modal/container is actually shown in the DOM (payosOpen). This
    // avoids the SDK attempting to render into a missing element.
    if (payosUrl && payosOpen && !paymentOpenedRef.current) {
      try {
        open()
        paymentOpenedRef.current = true
      } catch (e) {
        console.error('Failed to open PayOS embedded', e)
        setError('Không thể mở giao diện thanh toán PayOS. Vui lòng thử lại sau.')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payosUrl, open, payosOpen])

  // postMessage fallback: listen for PayOS messages if they post back
  useEffect(() => {
    const handler = (ev: MessageEvent) => {
      // If we know the PayOS origin, only accept messages from it
      if (payosOriginRef.current && ev.origin !== payosOriginRef.current) return
      const data = ev.data ?? {}
      if (data?.type === 'payos.checkout') {
        if (data?.status === 'success') {
          // show processing state briefly to ensure server-side postback completes
          setIsEmbeddedProcessing(true)
          setTimeout(() => {
            closePayOS()
            window.location.href = `/payment/result?success=true&category=${paymentCategory}&id=${encodeURIComponent(idFromParams)}`
          }, 1500)
        } else if (data?.status === 'cancel') {
          closePayOS()
        }
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idFromParams])

  // Close modal on Escape for convenience
  useEffect(() => {
    if (!payosOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePayOS()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payosOpen])

  // Prevent page scrolling while modal is open to avoid background shift
  useEffect(() => {
    const prev = typeof document !== 'undefined' ? document.body.style.overflow : ''
    if (payosOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      if (typeof document !== 'undefined') document.body.style.overflow = prev || ''
    }
  }, [payosOpen])

  // Use hooks where available
  const { useGetCourseById } = useCourse()
  const { useGetActiveAddonById } = useAddon()
  const { useGetSubscriptionById } = useSubscription()
  const { useGetActiveBundleById } = useBundle()
  const { data: keyPriceData } = useGetKeyPrice()

  // Only pass id to the hook that matches the current payment category.
  // Passing an empty string keeps other hooks from running (they use `enabled: !!id`).
  const courseId = paymentCategory === 'course' ? idFromParams : ''
  const addonId = paymentCategory === 'addon' ? idFromParams : ''
  const planId = paymentCategory === 'plan' ? idFromParams : ''
  const bundleId = paymentCategory === 'bundle' ? idFromParams : ''

  const courseQuery = useGetCourseById(courseId)
  const addonQuery = useGetActiveAddonById(addonId)
  const planQuery = useGetSubscriptionById(planId)
  const bundleQuery = useGetActiveBundleById(bundleId)

  // Combine query states
  useEffect(() => {
    // If parent passed data via props, prefer that and skip fetching
    if (propTitle !== undefined) {
      setFetchedTitle(propTitle ?? null)
      setFetchedPrice(propPrice ?? null)
      setFetchedDescription(propDescription ?? null)
      setFetchedImage(propImage ?? null)
      return
    }
    if (!idFromParams) {
      setFetchedTitle(null)
      return
    }

    setIsFetchingResource(true)
    try {
      switch (paymentCategory) {
        case 'course': {
          if (courseQuery.data) {
            const c = courseQuery.data as { name?: string; price?: number; description?: string; image?: string };
            setFetchedTitle(c.name ?? null)
            setFetchedPrice(c.price ?? 0)
            setFetchedDescription(c.description ?? null)
            setFetchedImage(c.image ?? null)
          }
          break
        }
        case 'addon': {
          if (addonQuery.data) {
            const a = addonQuery.data as { name?: string; price?: number; description?: string }
            setFetchedTitle(a.name ?? null)
            setFetchedPrice(a.price ?? 0)
            setFetchedDescription(a.description ?? null)
          }
          break
        }
        case 'plan': {
          if (planQuery.data) {
            const p = planQuery.data as { name?: string; title?: string; price?: number; amount?: number; description?: string }
            setFetchedTitle(p.name ?? p.title ?? null)
            setFetchedPrice(p.price ?? p.amount ?? 0)
            setFetchedDescription(p.description ?? null)
          }
          break
        }
        case 'key': {
          // key price hook already used earlier via useGetKeyPrice in parent component if needed
          if (keyPriceData) {
            const k = keyPriceData as { price?: number; description?: string }
            setFetchedTitle('License Key')
            setFetchedPrice(k.price ?? 0)
            setFetchedDescription(k.description ?? null)
          }
          break
        }
        case 'bundle': {
          if (bundleQuery.data) {
            const b = bundleQuery.data as { name?: string; title?: string; price?: number; amount?: number; discountPrice?: number; description?: string; image?: string }
            setFetchedTitle(b.name ?? b.title ?? null)
            // Prefer discountPrice when it's present and less than price
            const basePrice = b.price ?? b.amount ?? 0
            const hasValidDiscount = typeof b.discountPrice === 'number' && b.discountPrice > 0 && b.discountPrice < basePrice
            setFetchedPrice(hasValidDiscount ? b.discountPrice! : basePrice)
            setFetchedDescription(b.description ?? null)
            setFetchedImage(b.image ?? null)
          }
          break
        }
        default:
          setFetchedTitle(null)
          break
      }
    } catch (err) {
      console.error('Error resolving query data', err)
      setFetchedTitle(null)
    } finally {
      setIsFetchingResource(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idFromParams, paymentCategory, courseQuery.data, addonQuery.data, planQuery.data, bundleQuery.data, keyPriceData])

  // Respect parent-provided states first
  if (propLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4F4F4' }}>
        <LoadingState message="Đang tải thông tin thanh toán..." />
      </div>
    )
  }

  if (propError) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4F4F4' }}>
        <ErrorState error={propError} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  // If we are actively fetching resource, show loading
  if (isFetchingResource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Đang tải thông tin thanh toán..." />
      </div>
    )
  }

  // If there's an id param and we don't yet have the title, show loading (fetch will start in effect)
  if (idFromParams && !fetchedTitle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Đang tải thông tin thanh toán..." />
      </div>
    )
  }

  // No id and no resource -> show not found error
  if (!idFromParams && !fetchedTitle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState error={`Không tìm thấy tài nguyên để thanh toán. Vui lòng kiểm tra lại liên kết hoặc quay lại trang trước đó.`} />
      </div>
    )
  }

  const config = categoryConfig[paymentCategory]
  const IconComponent = config.icon

  return (
    <div className="min-h-screen flex items-start lg:items-center justify-center" style={{ backgroundColor: '#F4F4F4' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4 relative">
          <button
            onClick={() => router.back()}
            aria-label="Quay lại"
            className="p-2 rounded-lg transition transform hover:scale-105 hover:shadow-md hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group"
          >
            <ArrowLeft className="w-5 h-5 text-foreground transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">Thanh toán</h1>
            <p className="text-sm text-muted-foreground">Hoàn tất thanh toán một cách an toàn và nhanh chóng</p>
          </div>
          {/* Decorative mini GIF: centered inside the header row (absolute center of this row) */}
          <div className="pointer-events-none hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={miniGif.src} alt="" aria-hidden="true" className="w-16 h-16 md:w-30 md:h-30 object-contain" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Info Card */}
            <Card className="relative p-6 border border-border bg-white shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden">


              <div className="flex flex-col sm:flex-row gap-4 items-center mb-3">
                <div className="flex-shrink-0">
                  <div className={`w-24 h-24 rounded-lg overflow-hidden flex items-center justify-center ${config.color} shadow-inner`}>
                    {fetchedImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={fetchedImage ?? undefined} alt={fetchedTitle || 'product'} className="object-cover w-full h-full" loading="lazy" />
                    ) : (
                      <IconComponent className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl font-semibold text-foreground truncate">{fetchedTitle}</h2>
                  <div
                    className="text-sm text-muted-foreground mt-1 line-clamp-3"
                    // sanitize before inserting HTML to reduce XSS risk
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(fetchedDescription ?? '') }}
                  />


                  <div className="mt-3 flex items-center justify-between md:justify-start gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Giá</div>
                      {(() => {
                        const parts = formatCurrencyParts(price)
                        return (
                          <div className="text-2xl md:text-3xl font-extrabold flex items-baseline gap-2 whitespace-nowrap">
                            <span className="leading-none">{parts.amount}</span>
                            <span className="text-sm text-muted-foreground">{parts.currency}</span>
                          </div>
                        )
                      })()}
                    </div>

                    <div className="ml-2">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/10 border border-border text-sm text-foreground">
                        <IconComponent className="w-4 h-4" />
                        {config.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Methods */}
            <Card className="p-6 border border-border bg-white shadow-lg hover:shadow-xl transition-shadow rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Phương thức thanh toán</h3>
                <p className="text-sm text-muted-foreground">Chọn phương thức bạn muốn sử dụng</p>
              </div>

              <div role="radiogroup" aria-label="Phương thức thanh toán" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentMethods.map((m) => {
                  const Icon = m.icon
                  const paramKey = `img_${m.key}`
                  const paramUrl = (searchParams?.get(paramKey) as string) || undefined
                  const imgSvg = paramUrl || m.imgUrl || `/payments/${m.key}.svg`
                  const selected = method === m.key

                  return (
                    <div key={m.key} className="relative">
                      <button
                        role="radio"
                        aria-checked={selected}
                        aria-disabled={m.disabled}
                        onClick={() => !m.disabled && setMethod(m.key)}
                        disabled={m.disabled}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-shadow duration-150 ease-in-out text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${m.disabled
                          ? 'opacity-60 cursor-not-allowed border-border bg-muted/10'
                          : selected
                            ? 'border-primary bg-primary/5 shadow'
                            : 'border-border bg-muted/30 hover:shadow-md'
                          }`}
                      >
                        <div className="w-12 h-10 flex items-center justify-center rounded-md bg-white/90 flex-shrink-0 shadow-inner">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgSvg}
                            alt={m.label}
                            className="max-h-7 object-contain"
                            loading="lazy"
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement
                              if (img.dataset['tried'] !== 'true') {
                                img.dataset['tried'] = 'true'
                                img.src = img.src.replace('.svg', '.png')
                              } else {
                                img.style.display = 'none'
                              }
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground truncate">{m.label}</div>
                          {m.description ? <div className="text-sm text-muted-foreground truncate">{m.description}</div> : <div className="text-sm text-muted-foreground">&nbsp;</div>}
                        </div>

                        <div className="flex items-center">
                          {!m.disabled && selected && <Check className="w-5 h-5" />}
                          {m.disabled && <div className="text-xs text-muted-foreground">Tạm dừng</div>}
                        </div>
                      </button>

                      {/* small hint for disabled methods */}
                      {m.disabled && (
                        <div className="mt-1 text-xs text-muted-foreground">Phương thức này tạm thời không khả dụng.</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <Card className="p-6 border border-border bg-white shadow-lg hover:shadow-xl transition-shadow rounded-lg sticky top-8">
              <h4 className="text-lg font-semibold text-foreground mb-4">Tóm tắt đơn hàng</h4>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sản phẩm</span>
                  <span className="text-foreground font-medium text-right truncate max-w-[160px]">{fetchedTitle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Loại</span>
                  <span className="text-foreground font-medium">{config.label}</span>
                </div>
              </div>

              <div className="mb-6 border-t border-border pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground text-sm">Tổng cộng</span>
                  <span className="text-2xl font-bold">{formatCurrency(price)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Đã bao gồm VAT khi áp dụng</p>
              </div>

              <Button
                onClick={onConfirm}
                disabled={isProcessing || !method}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Thanh toán ngay
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">Thanh toán được bảo vệ bằng SSL</p>
            </Card>
          </div>
        </div>

        {/* Mobile sticky checkout bar */}
        <div className="fixed inset-x-0 bottom-0 bg-white border-t border-border p-3 lg:hidden shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Tổng</div>
              <div className="text-lg font-semibold">{formatCurrency(price)}</div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={onConfirm}
                disabled={isProcessing || !method}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Thanh toán
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {payosOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative max-w-lg w-full rounded-xl shadow-2xl bg-white flex flex-col overflow-hidden border border-gray-200">

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-base font-semibold text-gray-900">Thanh toán qua PayOS</h3>
                <button
                  onClick={closePayOS}
                  aria-label="Đóng"
                  className="p-2 rounded-md hover:bg-gray-100 transition"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="relative flex-1 flex items-center justify-center p-4 bg-white">
                {/* Loading state */}
                {createPayOS.isPending && payosUrl && (
                  <div className="flex items-center justify-center w-full h-[400px]">
                    <LoadingState message="Đang khởi tạo PayOS..." />
                  </div>
                )}

                {/* Error state */}
                {createPayOS.error && (
                  <div className="flex items-center justify-center w-full h-[400px] p-5 bg-white">
                    <ErrorState error={error || String(createPayOS.error)} />
                  </div>
                )}

                {/* Embedded SDK area (căn giữa) */}
                <div
                  id="embedded-payment-container"
                  className="w-full max-w-full h-[350px] flex items-center justify-center overflow-auto"
                />

                {/* Overlay khi đang xử lý */}
                {isEmbeddedProcessing && (
                  <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <p className="mt-3 text-base font-medium text-gray-900">Đang xử lý thanh toán...</p>
                    <p className="text-xs text-gray-500">Vui lòng chờ trong giây lát...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div >
  )
}
