"use client"

import { useParams, useRouter } from "next/navigation"
import { useAddon } from "@/features/addon/hooks/use-addon"
import { Button } from "@/components/ui/button"
import {
  ShoppingCart,
  ArrowLeft,
  CheckCircle,
  Puzzle,
  QrCode,
  Keyboard,
  Home,
  Zap,
} from "lucide-react"
import Link from "next/link"
import LoadingGif from "@/components/ui/loading-gif"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"

export default function AddonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const { useGetActiveAddonById } = useAddon()
  const { data: addon, isLoading, error } = useGetActiveAddonById(id)

  const CATEGORY_TEXT_FALLBACK: Record<number, string> = {
    1: "OSMO",
    2: "QR CODE",
    3: "NHÀ THÔNG MINH",
    4: "LẬP TRÌNH BLOCKLY",
  }

  const BENEFITS_MAP: Record<number, string[]> = {
    1: ["Bài học OSMO mở rộng", "Hoạt động tương tác với thẻ OSMO"],
    2: ["Quét QR code để kích hoạt kịch bản", "Quản lý danh mục QR"],
    3: ["Kết nối thiết bị nhà thông minh", "Điều khiển đèn/quạt/cảm biến"],
    4: ["Lập trình khối vật lý trực quan", "Chia sẻ project cho lớp học"],
  }

  const getCategoryBadge = (category: number): { label: string; className: string; Icon: React.ComponentType } => {
    switch (category) {
      case 1: return { label: "OSMO", className: "bg-rose-50 text-rose-700 border-rose-200", Icon: Puzzle }
      case 2: return { label: "QR CODE", className: "bg-amber-50 text-amber-700 border-amber-200", Icon: QrCode }
      case 3: return { label: "NHÀ THÔNG MINH", className: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: Home }
      case 4: return { label: "LẬP TRÌNH BLOCKLY", className: "bg-indigo-50 text-indigo-700 border-indigo-200", Icon: Keyboard }
      default: return { label: "ADDON", className: "bg-gray-50 text-gray-700 border-gray-200", Icon: Zap }
    }
  }

  const formatCurrency = (amount: number): string => {
    if (amount === 0) return "Miễn phí"
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingGif size="xl" />
      </div>
    )
  }

  if (error || !addon) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-lg text-red-600 mb-4">Không tìm thấy Addon</div>
            <Button onClick={() => router.push("/addons")} variant="outline">
              Quay lại danh sách
            </Button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const meta = getCategoryBadge(addon.category)
  const Icon = meta.Icon
  const benefits = BENEFITS_MAP[addon.category] || ["Kích hoạt tính năng nâng cao tương ứng"]

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/addons")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-8 bg-gradient-to-br from-white to-sky-50 border-b">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl border border-gray-200">
                <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-medium ${meta.className}`}>
                  {/* @ts-expect-error Icon accepts className */}
                  {Icon && <Icon className="w-4 h-4" />} {meta.label}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{addon.name}</h1>
                <p className="text-2xl font-semibold text-blue-600 mt-2">{formatCurrency(addon.price)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Về Addon này</h2>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: addon.description }} />
          </div>

          {/* Benefits */}
          <div className="p-8 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bạn nhận được gì?</h2>
            <ul className="grid gap-3">
              {benefits.map((b, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="p-8 border-t bg-white">
            <div className="flex gap-4">
              <Link
                href={`/payment?category=addon&id=${encodeURIComponent(addon.id)}`}
                className="flex-1"
              >
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Mua Addon ngay
                </Button>
              </Link>
              <Button variant="outline" onClick={() => router.push("/addons")} className="h-12">
                Quay lại
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

