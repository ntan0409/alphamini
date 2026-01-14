"use client"

import { Suspense } from "react";
import ResetPasswordForm from "@/components/reset-password-form";
import { Spinner } from "@/components/ui/spinner";


export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <div className="flex flex-col items-center justify-center gap-6 bg-background relative">
        <div className="w-full max-w-sm">
          <ResetPasswordForm />
        </div>
      </div>
    </Suspense>
  )
}