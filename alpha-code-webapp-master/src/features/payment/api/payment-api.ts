import { CreatePayment, PayOSEmbeddedResponse } from '../../../types/payment'
import { paymentsHttp } from '@/utils/http'

export async function createPayOSEmbeddedLink(payload: CreatePayment): Promise<PayOSEmbeddedResponse> {
  const response = await paymentsHttp.post<PayOSEmbeddedResponse>('/payments/payos/get-embedded-link', payload)
  return response.data
}
