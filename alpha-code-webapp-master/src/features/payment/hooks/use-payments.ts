import { useMutation } from '@tanstack/react-query'
import { createPayOSEmbeddedLink } from '../api/payment-api'
import { CreatePayment, PayOSEmbeddedResponse } from '../../../types/payment'

export const useCreatePayOSEmbedded = () => {
  return useMutation<PayOSEmbeddedResponse, Error, CreatePayment>({
    mutationFn: (payload: CreatePayment) => createPayOSEmbeddedLink(payload),
  })
}

export default useCreatePayOSEmbedded
