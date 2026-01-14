"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ShoppingCart, 
  Package, 
  Sparkles, 
  TrendingUp,
  BookOpen,
  ArrowRight,
  Tag,
  Star,
  Award,
  CheckCircle2,
  Zap,
  Gift,
  Percent,
  Clock
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPagedBundles } from "@/features/bundle/api/bundle-api";
import { Bundle } from "@/types/bundle"; 
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/home/header";
import { Footer } from "@/components/home/footer";
import LoadingState from "@/components/loading-state";
import Image from "next/image";


const formatCurrency = (amount: number): string => {
  if (amount === 0) return "Miễn phí";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export default function BundleCatalogPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // 🔄 Sử dụng Hook và API của Bundle với paging
  const { data, isLoading, isError } = useQuery({
    queryKey: ["paged-bundles", page, searchTerm],
    queryFn: ({ signal }) => getPagedBundles(page, 10, searchTerm, signal),
  });

  const bundles: Bundle[] = (data?.data || []);
  const totalCount = data?.total_count || 0;

  const handleViewDetail = (bundle: Bundle) => {
    // Chuyển hướng đến trang chi tiết Bundle
    router.push(`/bundle/${bundle.id}`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section - Clean Design */}
        <div className="relative bg-white border-b border-gray-200">
          {/* Background Image Decoration */}
          <div className="absolute right-0 top-0 bottom-0 w-full hidden lg:block">
            <Image
              src="/img_reading.webp"
              alt="Background"
              fill
              className="object-fill"
              priority
            />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6 relative z-10">
                <Badge className="bg-blue-600 text-white px-4 py-2 font-semibold text-sm">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Ưu đãi đặc biệt
                </Badge>
                
                <div>
                  <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-4">
                    Gói Khóa Học
                    <br />
                    <span className="text-blue-600">Siêu Tiết Kiệm</span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Mua nhiều, học nhiều, tiết kiệm nhiều! Nhận ngay ưu đãi lên đến{" "}
                    <span className="font-bold text-blue-600">30%</span>{" "}
                    cho các gói combo được chọn lọc kỹ càng.
                  </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: <Award className="w-5 h-5" />, text: "Chất lượng cao" },
                    { icon: <Percent className="w-5 h-5" />, text: "Giá ưu đãi" },
                    { icon: <CheckCircle2 className="w-5 h-5" />, text: "Đã chọn lọc" },
                    { icon: <Zap className="w-5 h-5" />, text: "Học ngay" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                        {item.icon}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-wrap gap-3">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base font-semibold shadow-sm"
                    onClick={() => document.getElementById('bundles')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Package className="w-5 h-5 mr-2" />
                    Xem gói khóa học
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="px-8 py-6 text-base font-semibold border-gray-300 hover:bg-gray-50"
                  >
                    Tìm hiểu thêm
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div id="bundles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          {/* Section Header */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Danh Sách Gói Khóa Học
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Chọn gói phù hợp để bắt đầu hành trình học tập của bạn
            </p>
          </div>

          {/* Search & Filter */}
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm gói khóa học..."
                    className="pl-10 h-11 border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span>{totalCount} gói</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <LoadingState />
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="text-center py-20">
              <div className="text-red-500 text-lg font-semibold">Lỗi khi tải dữ liệu</div>
              <p className="text-gray-500 mt-2">Vui lòng thử lại sau</p>
            </div>
          )}

          {/* Bundle Grid */}
          {!isLoading && !isError && (
            <>
              {bundles.length === 0 ? (
                <Card className="border border-dashed border-gray-300 bg-white">
                  <CardContent className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Package className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy gói khóa học</h3>
                    <p className="text-gray-500 mb-4">Thử tìm kiếm với từ khóa khác</p>
                    <Button onClick={() => setSearchTerm("")} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Xem tất cả
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bundles.map((bundle) => {
                    const isAvailable = bundle.status === 1;
                    // Logic: price là giá gốc, discountPrice là giá sau giảm
                    // Ưu tiên hiển thị discountPrice nếu có, không thì hiển thị price
                    const hasValidDiscount = bundle.discountPrice > 0 && bundle.discountPrice < bundle.price;
                    const displayPrice = hasValidDiscount ? bundle.discountPrice : bundle.price;
                    const originalPrice = bundle.price;
                    const discountPercent = hasValidDiscount
                      ? Math.round(((bundle.price - bundle.discountPrice) / bundle.price) * 100)
                      : 0;
                    const savedAmount = hasValidDiscount ? (bundle.price - bundle.discountPrice) : 0;
                    
                    return (
                      <Card 
                        key={bundle.id} 
                        className="group hover:shadow-xl transition-all duration-300 border border-gray-200 bg-white overflow-hidden"
                        onClick={() => handleViewDetail(bundle)}
                      >
                        <CardContent className="p-0">
                          {/* Cover Image */}
                          {bundle.coverImage && (
                            <div className="relative h-48 w-full overflow-hidden">
                              <img
                                src={bundle.coverImage}
                                alt={bundle.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {!isAvailable ? (
                                <Badge variant="secondary" className="absolute top-4 right-4 bg-gray-200 text-gray-600 font-semibold shadow-md">
                                  Tạm hết
                                </Badge>
                              ) : hasValidDiscount && (
                                <Badge className="absolute top-4 right-4 bg-blue-600 text-white font-semibold shadow-md">
                                  -{discountPercent}%
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Header */}
                          <div className="relative bg-white p-6 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                              <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {bundle.name}
                            </h3>
                            
                            {bundle.description && (
                              <div 
                                className="text-sm text-gray-600 line-clamp-2"
                                dangerouslySetInnerHTML={{ __html: bundle.description }}
                              />
                            )}
                          </div>
                          
                          {/* Body */}
                          <div className="p-6 space-y-4">
                            {/* Features */}
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                <span className="font-medium">{bundle.courseIds?.length || 0} khóa học</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-medium">4.9</span>
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-100"></div>

                            {/* Price */}
                            <div className="space-y-2">
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-gray-900">
                                  {formatCurrency(displayPrice)}
                                </span>
                                {hasValidDiscount && (
                                  <span className="text-sm line-through text-gray-400">
                                    {formatCurrency(originalPrice)}
                                  </span>
                                )}
                              </div>
                              
                              {hasValidDiscount && (
                                <div className="text-sm text-green-600 font-medium">
                                  ✓ Tiết kiệm {formatCurrency(savedAmount)}
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="space-y-2 pt-2">
                              <Button 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11"
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  handleViewDetail(bundle); 
                                }} 
                                disabled={!isAvailable}
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" /> 
                                Mua ngay
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                className="w-full border-gray-300 hover:border-blue-600 hover:text-blue-600 font-semibold h-11"
                                asChild
                              >
                                <Link href={`/bundle/${bundle.id}`}>
                                  Xem chi tiết
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {data && data.total_pages > 1 && (
                <Card className="border border-gray-200 bg-white shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap justify-center items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="font-semibold border-gray-300 h-10 px-4"
                      >
                        <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
                        Trước
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, data.total_pages) }, (_, i) => {
                          const pageNum = i + 1;
                          const isActive = page === pageNum;
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={isActive ? "default" : "outline"}
                              className={`w-10 h-10 font-semibold transition-all ${
                                isActive 
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                  : 'border-gray-300 hover:border-blue-600'
                              }`}
                              onClick={() => setPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={() => setPage(page + 1)}
                        disabled={page === data.total_pages}
                        className="font-semibold border-gray-300 h-10 px-4"
                      >
                        Sau
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                    
                    <div className="text-center mt-3 text-sm text-gray-600">
                      Trang <span className="font-semibold text-gray-900">{page}</span> / <span className="font-semibold text-gray-900">{data.total_pages}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}