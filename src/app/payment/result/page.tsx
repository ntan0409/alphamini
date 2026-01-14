import LoadingState from "@/components/loading-state";
import PaymentResultPage from "@/components/payment/payment-result-page";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
        >
          <LoadingState />
        </div>
      }
    >
      <PaymentResultPage />
    </Suspense>
  );
}
