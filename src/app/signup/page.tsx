"use client";

import RegisterForm from "@/components/register-form";
import { AuthRedirect } from "@/components/auth-redirect";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const handleBack = () => {
    // If user has navigation history, go back. Otherwise fallback to home.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <AuthRedirect />
      <div className="bg-gray-100 flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative">
        {/* Back button to go to home */}
        <button
          aria-label="Quay lại"
          onClick={handleBack}
          className="absolute left-4 top-4 md:left-6 md:top-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3.5 py-1.5 text-sm font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300/40"
        >
          <span className="text-lg leading-none">←</span>
          <span>Quay về</span>
        </button>

        <div className="w-full max-w-sm md:max-w-3xl">
          <RegisterForm />
        </div>
      </div>
    </>
  );
}
