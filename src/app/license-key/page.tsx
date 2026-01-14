"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Check } from "lucide-react"
import { getKeyPrice } from "@/features/config/api/key-price-api"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { getUserIdFromToken } from "@/utils/tokenUtils"
import { Footer } from "@/components/home/footer"
import { Header } from "@/components/home/header"

type KeyPriceShape = {
    id: string
    price: number
    currency?: string
    note?: string
}

export default function LicenseKeyPage() {
    const [keyPrice, setKeyPrice] = useState<KeyPriceShape | null>(null)
    const [loading, setLoading] = useState(false)
    const [buying, setBuying] = useState(false)

    const router = useRouter()

    useEffect(() => {
        let mounted = true
        setLoading(true)
        getKeyPrice()
            .then((res) => {
                if (!mounted) return
                setKeyPrice(res || null)
            })
            .catch(() => {
                toast.error("Không thể lấy thông tin giá license. Vui lòng thử lại sau.")
            })
            .finally(() => mounted && setLoading(false))

        return () => { mounted = false }
    }, [])

    const handlePurchase = async () => {
        try {
            setBuying(true)
            const accessToken = typeof window !== "undefined" ? sessionStorage.getItem("accessToken") || "" : ""
            const accountId = getUserIdFromToken(accessToken || "")
            if (!accountId) {
                toast.error("Vui lòng đăng nhập để tiếp tục mua license.")
                setBuying(false)
                return
            }

            if (!keyPrice) {
                toast.error("Không có gói license để mua.")
                setBuying(false)
                return
            }

            router.push(`/payment?category=key&id=${encodeURIComponent(keyPrice.id)}`)
        } catch {
            toast.error("Không thể chuyển tới trang thanh toán. Vui lòng thử lại sau.")
        } finally { setBuying(false) }
    }

    return (
        <>
            <Header />

            <div className="relative bg-gradient-to-b from-blue-50 to-white min-h-screen py-16 px-6 md:px-12">
                {/* Hero Section */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="space-y-6 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                            License Key — Mở khóa toàn bộ tính năng cao cấp
                        </h1>
                        <p className="text-gray-700 text-lg md:text-xl">
                            Kích hoạt để robot thông minh hơn, tương tác tự nhiên hơn và điều khiển linh hoạt hơn.
                        </p>

                        <ul className="text-gray-800 grid gap-2 text-sm md:text-base">
                            <li className="flex items-center gap-2 justify-center md:justify-start"><Check className="w-5 h-5 text-blue-600" /> Nhảy theo nhạc (Music Dance)</li>
                            <li className="flex items-center gap-2 justify-center md:justify-start"><Check className="w-5 h-5 text-blue-600" /> Trò chuyện tiếng Việt và tiếng Anh tự nhiên</li>
                            <li className="flex items-center gap-2 justify-center md:justify-start"><Check className="w-5 h-5 text-blue-600" /> Điều khiển robot bằng Joystick ảo</li>
                            <li className="flex items-center gap-2 justify-center md:justify-start"><Check className="w-5 h-5 text-blue-600" /> APK cao cấp: điều khiển bằng giọng nói</li>
                            <li className="flex items-center gap-2 justify-center md:justify-start"><Check className="w-5 h-5 text-blue-600" /> Nhận diện khuôn mặt & vật thể để tương tác</li>
                        </ul>

                        <Button
                            onClick={handlePurchase}
                            disabled={buying || !keyPrice}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg transition-all"
                        >
                            {buying ? "Đang chuyển tới thanh toán..." : "Mua License Key"}
                        </Button>
                    </div>

                    <div className="flex justify-center">
                        <Image
                            src="/img_action_default.webp"
                            alt="Alpha robot action preview"
                            width={560}
                            height={420}
                            priority={false}
                        />
                    </div>
                </div>

                {/* Feature Section */}
                <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
                        <h3 className="text-lg font-semibold mb-2">Nhảy theo nhạc</h3>
                        <p className="text-gray-600 text-sm">Robot bắt nhịp và thể hiện các điệu nhảy sinh động theo bài hát bạn chọn.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
                        <h3 className="text-lg font-semibold mb-2">Chat song ngữ VN/EN</h3>
                        <p className="text-gray-600 text-sm">Giao tiếp tự nhiên bằng tiếng Việt và tiếng Anh, phản hồi nhanh và mượt.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
                        <h3 className="text-lg font-semibold mb-2">Joystick ảo</h3>
                        <p className="text-gray-600 text-sm">Điều khiển chuyển động trực quan bằng joystick trên điện thoại hoặc web.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
                        <h3 className="text-lg font-semibold mb-2">APK điều khiển bằng giọng nói</h3>
                        <p className="text-gray-600 text-sm">Truy cập các APK cao cấp để điều khiển robot bằng giọng nói.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
                        <h3 className="text-lg font-semibold mb-2">Nhận diện khuôn mặt</h3>
                        <p className="text-gray-600 text-sm">Robot nhận diện và phản hồi theo người dùng đã đăng ký.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
                        <h3 className="text-lg font-semibold mb-2">Nhận diện vật thể</h3>
                        <p className="text-gray-600 text-sm">Tương tác thông minh dựa trên các vật thể robot nhìn thấy.</p>
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="mt-20 max-w-3xl mx-auto bg-gradient-to-r from-blue-100 to-white border border-blue-200 rounded-3xl shadow-xl p-10 text-center">
                    {loading ? (
                        <div className="text-gray-500 text-lg">Đang tải thông tin giá...</div>
                    ) : keyPrice ? (
                        <>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Gói License Multi-Robot</h2>
                            <div className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: keyPrice.currency || "VND" }).format(keyPrice.price)}
                            </div>
                            {keyPrice.note && <p className="text-gray-700 mb-6">{keyPrice.note}</p>}
                            <Button
                                onClick={handlePurchase}
                                disabled={buying}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg transition-all"
                            >
                                {buying ? "Đang chuyển tới thanh toán..." : "Trải nghiệm ngay"}
                            </Button>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-700 mb-4">Hiện chưa có cấu hình giá cho license key.</p>
                            <Button onClick={() => window.open("/contact", "_blank")} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl">
                                Liên hệ
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}
