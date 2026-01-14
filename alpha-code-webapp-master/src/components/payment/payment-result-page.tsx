"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLicenseKey } from "@/features/license-key/hooks/use-license-key";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();

  const success =
    String(searchParams.get("success") ?? "").toLowerCase() === "true";
  const category = searchParams.get("category") || undefined;
  const id = searchParams.get("id") || undefined;

  // prepare license hook and a local flag so we only show toasts when
  // we triggered the fetch from this success redirect.
  const licenseQuery = useLicenseKey();
  const [requestedFetch, setRequestedFetch] = useState(false);

  useEffect(() => {
    if (!success || category !== "key") return;
    setRequestedFetch(true);
    void licenseQuery.refetch();
  }, [success, category]);

  useEffect(() => {
    if (!requestedFetch) return;
    if (licenseQuery.isSuccess && licenseQuery.data) {
      toast.success("Khóa bản quyền đã được lưu vào phiên.");
    } else if (licenseQuery.isError) {
      toast.error("Không thể tải khóa bản quyền ngay bây giờ. Vui lòng thử lại sau.");
    }
  }, [requestedFetch, licenseQuery.isSuccess, licenseQuery.isError]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden
      ${
        success
          ? "bg-gradient-to-b from-white via-gray-50 to-green-50"
          : "bg-gradient-to-b from-white via-gray-50 to-red-50"
      }`}
    >
      {/* Grid pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      {/* Card */}
      <div className="max-w-md w-full p-10 bg-white rounded-3xl shadow-xl border border-neutral-200 text-center space-y-6 relative z-10 animate-fadeIn">
        {success ? (
          <>
            <div className="flex justify-center relative">
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-24 h-24 rounded-full bg-emerald-100 opacity-40 blur-2xl animate-pulse" />
              </div>
              <CheckCircle2 className="w-24 h-24 text-emerald-500 relative animate-scaleIn" />
            </div>

            <h1 className="text-2xl font-semibold text-neutral-900">
              Thanh toán thành công
            </h1>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Cảm ơn bạn! Giao dịch đã được ghi nhận và sẽ sớm được xử lý.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-sm transition"
              >
                Về trang chủ
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center relative">
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-24 h-24 rounded-full bg-red-100 opacity-40 blur-2xl animate-pulse" />
              </div>
              <XCircle className="w-24 h-24 text-red-500 relative animate-scaleIn" />
            </div>

            <h1 className="text-2xl font-semibold text-neutral-900">
              Thanh toán thất bại
            </h1>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Giao dịch bị hủy hoặc xảy ra lỗi. Vui lòng thử lại hoặc liên hệ hỗ trợ.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/payment?category=${category}&id=${id}`}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-sm transition"
              >
                Thử lại
              </Link>
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-sm transition"
              >
                Về trang chủ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
