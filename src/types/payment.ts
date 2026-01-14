export type CreatePayment = {
  accountId: string
  addonId?: string | null
  bundleId?: string | null
  courseId?: string | null
  planId?: string | null
  keyId?: string | null
}

export type PayOSEmbeddedResponse = {
  bin: string
  accountNumber: string
  accountName: string
  amount: number
  description: string
  orderCode: number
  currency: string
  paymentLinkId: string
  status: string
  checkoutUrl: string
  qrCode?: string
}
