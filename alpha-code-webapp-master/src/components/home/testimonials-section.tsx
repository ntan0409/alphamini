"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote, Star, User, GraduationCap } from "lucide-react"
import { forwardRef } from "react"
import Image from "next/image"

interface TestimonialsSectionProps {
  currentSection?: number
}

export const TestimonialsSection = forwardRef<HTMLElement, TestimonialsSectionProps>(
  ({ }, ref) => {
    const testimonials = [
      {
        id: 1,
        name: "Nguyễn Minh Anh",
        role: "Học sinh lớp 5",
        age: 10,
        avatar: "/img_item_robot.webp",
        rating: 5,
        content: "Em rất thích học lập trình với robot Alpha Mini! Các bài học rất thú vị và dễ hiểu. Em đã tự làm được nhiều dự án hay.",
        category: "student"
      },
      {
        id: 2,
        name: "Trần Văn Hùng",
        role: "Phụ huynh",
        age: 38,
        avatar: "/img_item_robot.webp",
        rating: 5,
        content: "Con tôi học rất hào hứng với chương trình này. Tôi thấy con phát triển tư duy logic và sáng tạo rõ rệt. Cảm ơn Alpha Mini Code!",
        category: "parent"
      },
      {
        id: 3,
        name: "Cô Lê Thị Mai",
        role: "Giáo viên Tin học",
        age: 35,
        avatar: "/img_item_robot.webp",
        rating: 5,
        content: "Nền tảng này giúp tôi dạy lập trình hiệu quả hơn. Học sinh rất thích thú và tiếp thu nhanh. Tôi đã áp dụng vào lớp học của mình.",
        category: "teacher"
      },
      {
        id: 4,
        name: "Phạm Đức Thành",
        role: "Học sinh lớp 8",
        age: 13,
        avatar: "/img_item_robot.webp",
        rating: 5,
        content: "Khóa học AI & Machine Learning rất hay! Em đã làm được dự án nhận diện khuôn mặt với robot. Cảm ơn thầy cô đã hướng dẫn tận tình.",
        category: "student"
      },
      {
        id: 5,
        name: "Bà Nguyễn Thị Lan",
        role: "Phụ huynh",
        age: 45,
        avatar: "/img_item_robot.webp",
        rating: 5,
        content: "Cháu tôi học rất vui và tiến bộ nhanh. Tôi thấy cháu tự tin hơn khi trình bày dự án của mình. Đây là khoản đầu tư đáng giá cho tương lai của cháu.",
        category: "parent"
      },
      {
        id: 6,
        name: "Thầy Hoàng Văn Nam",
        role: "Giáo viên STEM",
        age: 40,
        avatar: "/img_item_robot.webp",
        rating: 5,
        content: "Alpha Mini Code là công cụ giáo dục tuyệt vời. Tôi đã sử dụng trong nhiều lớp học và học sinh rất hào hứng. Chương trình học rất phù hợp với chương trình giáo dục hiện đại.",
        category: "teacher"
      }
    ]

    const getCategoryColor = (category: string) => {
      const colors: Record<string, { bg: string; text: string; border: string }> = {
        student: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
        parent: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
        teacher: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" }
      }
      return colors[category] || colors.student
    }

    const getCategoryLabel = (category: string) => {
      const labels: Record<string, string> = {
        student: "Học sinh",
        parent: "Phụ huynh",
        teacher: "Giáo viên"
      }
      return labels[category] || "Người dùng"
    }

    return (
      <section
        ref={ref}
        id="testimonials"
        className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-purple-50 to-pink-50 relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.08)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div data-aos="fade-up" data-aos-delay="100" className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              <Quote className="w-3 h-3 sm:w-4 sm:h-4" />
              Phản hồi từ cộng đồng
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Những gì học sinh và phụ huynh nói
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent py-1 leading-relaxed">
                Về Alpha Mini Code
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Hơn 10,000 học sinh và phụ huynh đã tin tưởng và hài lòng với chương trình học của chúng tôi
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => {
              const colorClasses = getCategoryColor(testimonial.category)
              return (
                <div
                  key={testimonial.id}
                  data-aos="fade-up"
                  data-aos-delay={`${100 + index * 100}`}
                  className="group transition-all duration-500"
                >
                  <Card className={`bg-white border-2 ${colorClasses.border} rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden h-full flex flex-col`}>
                    <CardContent className="p-6 flex-grow flex flex-col">
                      {/* Quote Icon */}
                      <div className={`w-10 h-10 ${colorClasses.bg} rounded-full flex items-center justify-center mb-4`}>
                        <Quote className={`w-5 h-5 ${colorClasses.text}`} />
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                        ))}
                      </div>

                      {/* Content */}
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6 flex-grow italic">
                        "{testimonial.content}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="font-semibold text-gray-900 text-sm sm:text-base">
                            {testimonial.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${colorClasses.bg} ${colorClasses.text} font-medium`}>
                              {getCategoryLabel(testimonial.category)}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-600">{testimonial.role}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>

          {/* CTA Section */}
          <div data-aos="fade-up" data-aos-delay="700" className="mt-12 text-center">
            <p className="text-gray-600 mb-4 text-lg">
              Bạn cũng muốn trải nghiệm?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                <GraduationCap className="w-5 h-5" />
                Tham gia ngay hôm nay
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
)

TestimonialsSection.displayName = "TestimonialsSection"
