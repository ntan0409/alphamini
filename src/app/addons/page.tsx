"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, CheckCircle, Zap, Puzzle, QrCode, Keyboard, Home, Info } from "lucide-react";
import { useAddon } from "@/features/addon/hooks/use-addon";
import { Addon } from "@/types/addon";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/home/footer";
import { Header } from "@/components/home/header";

const formatCurrency = (amount: number): string => {
  if (amount === 0) return "Miễn phí";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export default function AddonsStore() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const { useGetPagedAddons } = useAddon();
  const { data, isLoading, isError } = useGetPagedAddons(page, 10, searchTerm);

  // Category mapping
  const CATEGORY_TEXT_FALLBACK: Record<number, string> = {
    1: "OSMO",
    2: "QR CODE",
    3: "NHÀ THÔNG MINH",
    4: "LẬP TRÌNH BLOCKLY",
  };

  const getCategoryBadge = (category: number): { label: string; className: string; Icon: React.ComponentType } => {
    switch (category) {
      case 1: return { label: "OSMO", className: "bg-rose-50 text-rose-700 border-rose-200", Icon: Puzzle }
      case 2: return { label: "QR CODE", className: "bg-amber-50 text-amber-700 border-amber-200", Icon: QrCode }
      case 3: return { label: "NHÀ THÔNG MINH", className: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: Home }
      case 4: return { label: "LẬP TRÌNH BLOCKLY", className: "bg-indigo-50 text-indigo-700 border-indigo-200", Icon: Keyboard }
      default: return { label: "ADDON", className: "bg-gray-50 text-gray-700 border-gray-200", Icon: Zap }
    }
  }

  const BENEFITS_MAP: Record<number, string[]> = {
    1: ["Bài học OSMO mở rộng", "Hoạt động tương tác với thẻ OSMO"],
    2: ["Quét QR code để kích hoạt kịch bản", "Quản lý danh mục QR"],
    3: ["Kết nối thiết bị nhà thông minh", "Điều khiển đèn/quạt/cảm biến"],
    4: ["Lập trình khối vật lý trực quan", "Chia sẻ project cho lớp học"],
  }

  const addons: Addon[] = (data?.data || []).map(a => ({
    ...a,
    categoryText: a.categoryText || CATEGORY_TEXT_FALLBACK[a.category] || "KHÁC",
  }));

  const handlePurchase = (addon: Addon) => {
    const target = `/payment?category=addon&id=${encodeURIComponent(addon.id)}`
    const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null
    if (!accessToken) {
      // Show toast informing the user to login and don't navigate
      toast.error("Vui lòng đăng nhập để mua Addon.")
      return
    }
    router.push(target)
  }

  return (
    <>
      <Header />
      <div className="space-y-8 p-10" suppressHydrationWarning>
        {/* Header */}
        <div className="rounded-3xl border bg-gradient-to-br from-white to-sky-50 p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Add-ons cao cấp cho Robot 🤖</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Mở rộng khả năng: nhảy theo nhạc, chat VN/EN, joystick ảo, điều khiển giọng nói, QR/OSMO, nhà thông minh...
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 px-3 py-2 rounded-md">
              <Info className="w-4 h-4" /> Cần sở hữu License Key trước khi mua Add-on
            </div>
          </div>
        </div>

        {/* Tìm kiếm */}
        <div className="flex items-center space-x-4">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm Addon theo tên hoặc danh mục..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Trạng thái tải */}
        {isLoading && (
          <div className="flex justify-center items-center py-10 text-muted-foreground">
            Đang tải dữ liệu...
          </div>
        )}

        {isError && (
          <div className="flex justify-center items-center py-10 text-red-500">
            Lỗi khi tải dữ liệu Addons.
          </div>
        )}

        {/* Grid hiển thị Addons */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {addons.map((addon) => {
              const isSubscribed = false;
              const meta = getCategoryBadge(addon.category);
              const Icon = meta.Icon;

              return (
                <Card key={addon.id} className={`flex flex-col h-full rounded-2xl ${isSubscribed ? "border-green-500/60 shadow-lg" : ""}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-medium ${meta.className}`}>
                          {/* @ts-expect-error className is allowed on Icon */}
                          {Icon && <Icon className="w-4 h-4" />} {meta.label}
                        </span>
                      </div>
                      <Zap className="h-5 w-5 text-primary/70" />
                    </div>
                    <CardTitle className="text-xl font-semibold mt-3">{addon.name}</CardTitle>
                    <CardDescription className="mt-1 text-sm">{formatCurrency(addon.price)}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pt-0">
                    <div className="text-sm text-muted-foreground mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: addon.description }} />
                    <div className="grid grid-cols-2 gap-2">
                      <Link href={`/addons/${addon.id}`} className="inline-block">
                        <Button variant="outline" className="w-full">Chi tiết</Button>
                      </Link>
                      {isSubscribed ? (
                        <Button disabled className="bg-green-600 hover:bg-green-600 text-white">
                          <CheckCircle className="mr-2 h-4 w-4" /> Đã sở hữu
                        </Button>
                      ) : (
                        <Button onClick={() => handlePurchase(addon)}>
                          <ShoppingCart className="mr-2 h-4 w-4" /> Mua ngay
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Phân trang đơn giản */}
        {!isLoading && data?.total_pages && data.total_pages > 1 && (
          <div className="flex justify-center items-center space-x-2 pt-6">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Trang trước
            </Button>
            <span className="text-sm text-muted-foreground">
              Trang {page} / {data?.total_pages}
            </span>
            <Button
              variant="outline"
              disabled={!data?.has_next}
              onClick={() => setPage((p) => p + 1)}
            >
              Trang sau
            </Button>
          </div>
        )}

        <div className="flex items-center justify-center text-sm text-muted-foreground pt-4">
          <p>Tổng cộng {data?.total_count || 0} Addon</p>
        </div>
      </div>
      <Footer />
    </>
  );
}
