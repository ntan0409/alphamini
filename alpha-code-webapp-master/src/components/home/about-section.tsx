import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowRight, Zap, Brain, Sparkles, Shield, Heart } from "lucide-react"
import { forwardRef } from "react"


interface AboutSectionProps {
  currentSection: number
}

export const AboutSection = forwardRef<HTMLElement, AboutSectionProps>(
  ({  }, ref) => {


    const aboutFeatures = [
      {
        icon: Brain,
        title: "Hỗ trợ thông minh",
        description: "Alpha Mini Code luôn sẵn sàng hỗ trợ bạn trong quá trình học tập và sáng tạo."
      },
      {
        icon: Zap,
        title: "Tốc độ vượt trội", 
        description: "Xử lý nhanh chóng, mượt mà mọi thao tác lập trình và điều khiển robot."
      },
      {
        icon: Shield,
        title: "Bảo mật an toàn",
        description: "Dữ liệu và thông tin của bạn luôn được bảo vệ tối đa."
      }
    ]

    return (
      <section
        ref={ref}
        id="about"
        className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-blue-50 relative overflow-hidden min-h-screen flex items-center"
      >
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            {/* Left Content */}
            <div data-aos="fade-right" data-aos-delay="150" className="transition-all duration-1000 ease-out">
              {/* Badge */}

              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                Nền tảng giáo dục sáng tạo
              </div>

              {/* Title */}

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Khám phá
                <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent py-1 leading-relaxed">
                  Alpha Mini Code
                </span>
              </h2>

              {/* Description */}

              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed px-0 sm:px-0">
                Nền tảng giúp học sinh, giáo viên và nhà phát triển dễ dàng lập trình, điều khiển và sáng tạo với robot Alpha Mini.
              </p>

              {/* Features */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {aboutFeatures.map((feature, index) => (
                  <div key={index} data-aos="fade-up" data-aos-delay={`${200 + index * 150}`} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors duration-300">
                      <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{feature.title}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}

              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto">
                Bắt đầu ngay
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Right Content - Logo */}
            <div data-aos="fade-left" data-aos-delay="300" className="flex justify-center mt-8 lg:mt-0 transition-all duration-1000 ease-out delay-300">
              <div className="relative">
                {/* Main logo container */}
                <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-gradient-to-br from-blue-50 to-white rounded-2xl sm:rounded-3xl shadow-xl flex items-center justify-center border border-gray-200 group hover:shadow-2xl transition-all duration-500">
                  <Image 
                    src="/logo2.png" 
                    alt="Alpha Mini Code Logo" 
                    width={120}
                    height={120}
                    className="sm:w-[135px] sm:h-[135px] md:w-[150px] md:h-[150px] opacity-90 group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>

                {/* Floating elements */}
                <div className="absolute -top-3 sm:-top-4 -right-3 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div 
                  className="absolute -bottom-3 sm:-bottom-4 -left-3 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg animate-bounce"
                  style={{ animationDelay: "1s" }}
                >
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div 
                  className="absolute top-1/2 -left-4 sm:-left-6 w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce"
                  style={{ animationDelay: "2s" }}
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
)

AboutSection.displayName = "AboutSection"
