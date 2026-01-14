// /app/bundles/[id]/page.tsx
"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  ArrowLeft,
  CheckCircle,
  Package,
  Tag,
  Info,
  BookOpen,
  Clock,
  Award,
  Star,
  Users,
  PlayCircle,
  ChevronRight,
} from "lucide-react"
import LoadingGif from "@/components/ui/loading-gif"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { useBundle } from "@/features/bundle/hooks/use-bundle"
import { useCoursesByBundle } from "@/features/bundle/hooks/use-course-bundle"
import { Course } from "@/types/courses"
import { Bundle } from "@/types/bundle"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { getUserInfoFromToken, getUserIdFromToken, getUserRoleFromToken } from "@/utils/tokenUtils"
import { getAccountCourseByCourseAndAccount } from "@/features/courses/api/account-course-api"
import { useEffect } from "react"

const formatCurrency = (amount: number): string => {
  if (amount === 0) return "Miễn phí"
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

// Component hiển thị danh sách Course
type BundleCourseListProps = {
  courses: Course[]
  isLoading: boolean
  onCourseClick: (course: Course) => void
}

const BundleCourseList = ({ courses, isLoading, onCourseClick }: BundleCourseListProps) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold text-gray-900">
        Nội dung khóa học
      </h3>
      <Badge className="bg-blue-600 text-white px-3 py-1">
        {courses.length} khóa học
      </Badge>
    </div>

    {isLoading ? (
      <div className="flex justify-center py-12">
        <LoadingGif size="md" />
      </div>
    ) : courses.length === 0 ? (
      <Card className="border border-gray-200">
        <CardContent className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Chưa có khóa học nào trong gói này</p>
        </CardContent>
      </Card>
    ) : (
      <div className="grid gap-3">
        {courses.map((course: Course, index: number) => (
          <div key={course.id} onClick={() => onCourseClick(course)}>
            <Card className="group border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-white overflow-hidden cursor-pointer">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-5">
                  {/* Number */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <BookOpen className="w-7 h-7 text-blue-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {course.name}
                    </h4>
                    
                    {course.description && (
                      <div 
                        className="text-sm text-gray-600 line-clamp-1 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: course.description }}
                      />
                    )}
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    )}
  </div>
)

export default function BundleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const { useGetActiveBundleById } = useBundle()

  // 1. Lấy thông tin chi tiết Bundle
  const {
    data: bundle,
    isLoading: isBundleLoading,
    error: bundleError,
  } = useGetActiveBundleById(id)

  // 2. Lấy danh sách Course
  const { data: courses = [], isLoading: coursesLoading } =
    useCoursesByBundle(id, !!bundle)

  // Trạng thái Loading chung
  if (isBundleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingGif size="xl" />
      </div>
    )
  }

  // Xử lý lỗi hoặc không tìm thấy Bundle
  if (bundleError || !bundle) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-xl font-semibold text-red-600 mb-4">
              Không tìm thấy Gói khóa học đang hoạt động
            </div>
            <Button onClick={() => router.push("/bundles")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách
            </Button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const activeBundle = bundle as Bundle

  // Handler khi click vào course
  const handleCourseClick = async (course: Course) => {
    const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') || '' : ''
    const accountId = accessToken ? getUserIdFromToken(accessToken) : null
    const roleName = accessToken ? (getUserRoleFromToken(accessToken) || '').toLowerCase() : ''
    const roleBasePath = roleName === 'children' || roleName.includes('child') ? '/children/courses' : '/parent/courses'

    // Nếu chưa đăng nhập, chuyển đến trang detail
    if (!accountId) {
      router.push(`${roleBasePath}/${course.slug}`)
      return
    }

    try {
      // Kiểm tra xem user đã enroll course này chưa
      const accountCourse = await getAccountCourseByCourseAndAccount(course.id, accountId)
      
      if (accountCourse) {
        // Đã enroll -> chuyển sang trang learning
        router.push(`${roleBasePath}/learning/${course.slug}`)
      } else {
        // Chưa enroll -> chuyển sang trang detail
        router.push(`${roleBasePath}/${course.slug}`)
      }
    } catch (error) {
      console.error('Error checking enrollment:', error)
      // Nếu có lỗi, vẫn cho phép xem detail
      router.push(`${roleBasePath}/${course.slug}`)
    }
  }

  // Tính toán giá trị
  const totalCoursePrice = courses.reduce(
    (sum, course) => sum + course.price,
    0
  )
  const savingAmount =
    totalCoursePrice > activeBundle.price
      ? totalCoursePrice - activeBundle.price
      : 0
  const isAvailable = activeBundle.statusText === "Available"

  // Tính discount
  const hasValidDiscount = activeBundle.discountPrice > 0 && activeBundle.discountPrice < activeBundle.price;
  const displayPrice = hasValidDiscount ? activeBundle.discountPrice : activeBundle.price;
  const originalPrice = activeBundle.price;
  const discountPercent = hasValidDiscount
    ? Math.round(((activeBundle.price - activeBundle.discountPrice) / activeBundle.price) * 100)
    : 0;

  return (
    <>
      <Header />
      
      {/* Hero Section - Clean Design like Bundle Page */}
      <div className="relative bg-white border-b border-gray-200">
        {/* Background Image Decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-full hidden lg:block opacity-10">
          <Image
            src="/img_mingxingjiangtang.webp"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 relative z-10">
              <Button 
                variant="ghost" 
                onClick={() => router.push("/bundle")}
                className="mb-2 hover:bg-gray-100 -ml-4 mr-5"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách
              </Button>

              <Badge className="bg-blue-600 text-white px-4 py-2 font-semibold text-sm">
                <Package className="w-4 h-4 inline" />
                Gói đặc biệt
              </Badge>
              
              <div>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-4">
                  {activeBundle.name}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Trọn bộ {courses.length} khóa học chất lượng cao với giá ưu đãi đặc biệt
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
                    <div className="text-sm text-gray-600">Khóa học</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">4.9</div>
                    <div className="text-sm text-gray-600">Đánh giá</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">1K+</div>
                    <div className="text-sm text-gray-600">Học viên</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-0 shadow-lg bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                    <Tag className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">
                    {hasValidDiscount && `${discountPercent}%`}
                  </div>
                  <div className="text-sm text-gray-600">
                    {hasValidDiscount ? "Giảm giá" : "Ưu đãi"}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">100%</div>
                  <div className="text-sm text-gray-600">Chất lượng</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">∞</div>
                  <div className="text-sm text-gray-600">Truy cập</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4">
                    <PlayCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">24/7</div>
                  <div className="text-sm text-gray-600">Hỗ trợ</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content - 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bundle Image Card */}
              <Card className="overflow-hidden border-0 shadow-xl rounded-2xl">
                <div className="relative h-[300px] md:h-[400px]">
                  <img
                    src={activeBundle.coverImage}
                    alt={activeBundle.name}
                    className="w-full h-full object-cover"
                  />
                  {hasValidDiscount && (
                    <div className="absolute top-6 right-6 bg-red-600 text-white rounded-2xl font-bold shadow-2xl">
                      <div className="max-w-[160px] px-3 py-2 text-sm truncate text-center whitespace-nowrap">
                        Giảm {discountPercent}%
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Description */}
              <Card className="border-0 shadow-xl rounded-2xl">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Giới thiệu gói khóa học
                  </h2>
                  <div
                    className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html:
                        activeBundle.description ||
                        "<p>Gói khóa học được thiết kế đặc biệt để mang lại trải nghiệm học tập toàn diện và hiệu quả nhất.</p>",
                    }}
                  />
                </CardContent>
              </Card>

              {/* Course List */}
              <BundleCourseList courses={courses} isLoading={coursesLoading} onCourseClick={handleCourseClick} />
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-2xl overflow-hidden rounded-3xl">
                {/* Price Header */}
                <div className="relative z-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8">
                  <div className="text-xs font-bold mb-3 opacity-90 tracking-wide uppercase">Giá gói bundle</div>
                  <div className="flex flex-col items-start gap-2">
                    {hasValidDiscount && (
                      <span className="text-sm line-through opacity-60">
                        {formatCurrency(originalPrice)}
                      </span>
                    )}
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-black">
                        {formatCurrency(displayPrice)}
                      </span>
                    </div>
                  </div>
                  {hasValidDiscount && (
                    <Badge className="mt-4 bg-white text-blue-600 font-bold px-4 py-2 rounded-full text-sm">
                      💰 Tiết kiệm {formatCurrency(originalPrice - displayPrice)}
                    </Badge>
                  )}
                </div>

                <CardContent className="p-8 space-y-6">
                  {/* CTA Button */}
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-16 text-lg font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    onClick={() => {
                      const accessToken = sessionStorage.getItem("accessToken");
                      if (!accessToken) {
                        toast.error("Vui lòng đăng nhập để mua", {
                          description: "Bạn cần đăng nhập để tiếp tục thanh toán",
                        });
                        return;
                      }

                      const userInfo = getUserInfoFromToken(accessToken);
                      if (!userInfo) {
                        toast.error("Phiên đăng nhập đã hết hạn", {
                          description: "Vui lòng đăng nhập lại",
                        });
                        router.push("/login");
                        return;
                      }

                      router.push(`/payment?category=bundle&id=${activeBundle.id}`);
                    }}
                  >
                    <ShoppingCart className="mr-2 h-6 w-6" />
                    Mua ngay
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 bg-gray-50 py-3 px-4 rounded-2xl">
                      💳 Thanh toán một lần • Học mãi mãi
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 text-gray-500 font-medium">Quyền lợi</span>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3">
                    {[
                      { icon: CheckCircle, text: "Truy cập trọn đời", color: "text-green-600", bg: "bg-green-50" },
                      { icon: Users, text: "Hỗ trợ 24/7", color: "text-blue-600", bg: "bg-blue-50" },
                      { icon: Award, text: "Chứng chỉ hoàn thành", color: "text-purple-600", bg: "bg-purple-50" },
                      { icon: PlayCircle, text: "Học không giới hạn", color: "text-red-600", bg: "bg-red-50" },
                    ].map((benefit, i) => (
                      <div key={i} className={`flex items-center gap-3 p-3 ${benefit.bg} rounded-xl transition-all hover:shadow-md`}>
                        <div className="flex-shrink-0">
                          <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
                        </div>
                        <span className="text-sm text-gray-800 font-medium">{benefit.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto shadow-sm">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-2xl font-black text-gray-900">{courses.length}</div>
                        <div className="text-xs text-gray-600 font-medium">Khóa học</div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto shadow-sm">
                          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                        </div>
                        <div className="text-2xl font-black text-gray-900">4.9</div>
                        <div className="text-xs text-gray-600 font-medium">Đánh giá</div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto shadow-sm">
                          <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="text-2xl font-black text-gray-900">1K+</div>
                        <div className="text-xs text-gray-600 font-medium">Học viên</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}