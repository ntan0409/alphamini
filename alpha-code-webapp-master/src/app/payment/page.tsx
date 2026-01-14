import { Suspense } from 'react'
import PaymentPageClient from "@/components/payment/payment-page-client"
import { AuthGuard } from '@/components/auth-guard'

export default function PaymentPage() {
  return (
    <Suspense fallback={null}>
      <AuthGuard allowedRoles={['Parent']}>
        <PaymentPageClient />
      </AuthGuard>
    </Suspense>
  )
}
