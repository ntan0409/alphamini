import { Card, CardContent } from "@/components/ui/card"
import { Zap, Brain, Heart, Sparkles } from "lucide-react"
import { forwardRef } from "react"


interface FeaturesSectionProps {
  currentSection: number
}

export const FeaturesSection = forwardRef<HTMLElement, FeaturesSectionProps>(
  ({  }, ref) => {


    const features = [
      {
        icon: Brain,
        title: "Trí tuệ nhân tạo",
        description: "Tích hợp AI giúp robot học hỏi và tương tác thông minh với người dùng.",
        color: "blue",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-600",
        hoverColor: "hover:bg-blue-200"
      },
      {
        icon: Zap,
        title: "Tốc độ xử lý",
        description: "Phản hồi nhanh, xử lý mượt mà mọi thao tác lập trình và điều khiển.",
        color: "purple",
        bgColor: "bg-purple-100",
        iconColor: "text-purple-600",
        hoverColor: "hover:bg-purple-200"
      },
      {
        icon: Heart,
        title: "Giao diện thân thiện",
        description: "Thiết kế trực quan, dễ sử dụng cho mọi lứa tuổi và trình độ.",
        color: "green",
        bgColor: "bg-green-100",
        iconColor: "text-green-600",
        hoverColor: "hover:bg-green-200"
      },
    ]

    return (
      <section
        ref={ref}
        id="features"
        className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-blue-50 relative overflow-hidden min-h-screen flex items-center"
      >
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div data-aos="fade-up" data-aos-delay="100" className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              Nổi bật
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Tính năng vượt trội
              <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent py-1 leading-relaxed">
                Khám phá Alpha Mini Code
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Hệ sinh thái lập trình và điều khiển robot toàn diện, sáng tạo và an toàn cho giáo dục.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={`${100 + index * 150}`} className="group transition-all duration-1000 ease-out">
                <Card className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden h-full">
                  <CardContent className="p-4 sm:p-6 md:p-8 text-center h-full flex flex-col">
                    {/* Icon */}
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl ${feature.bgColor} ${feature.hoverColor} flex items-center justify-center transition-all duration-300 group-hover:scale-110 shrink-0`}>
                      <feature.icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${feature.iconColor}`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-grow">
                      {feature.description}
                    </p>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
)

FeaturesSection.displayName = "FeaturesSection"
