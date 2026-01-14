import { Button } from "@/components/ui/button"
import { ArrowRight, Play, ChevronDown, Sparkles, Zap, Star, Bot, Shield, Lightbulb, Users, BookOpen, Award, GraduationCap } from "lucide-react"
import { forwardRef, useEffect, useRef, useState } from "react"


interface HeroSectionProps {
  currentSection: number
  isVisible: boolean
}

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  ({  }, ref) => {
    const videoContainerRef = useRef<HTMLDivElement | null>(null)
    const videoElRef = useRef<HTMLVideoElement | null>(null)
    const [loadVideo, setLoadVideo] = useState(false)

    useEffect(() => {
      // Lazy-load the video only when the hero enters viewport to avoid heavy decoding during scroll
      if (!videoContainerRef.current) return

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setLoadVideo(true)
              io.disconnect()
            }
          })
        },
        { threshold: 0.25 }
      )

      io.observe(videoContainerRef.current)

      return () => io.disconnect()
    }, [])

    // Pause video when page is hidden (save CPU) and resume when visible
    useEffect(() => {
      const onVisibility = () => {
        const v = videoElRef.current
        if (!v) return
        if (document.visibilityState === 'hidden') {
          try { v.pause() } catch {};
        } else {
          try { v.play().catch(() => {}) } catch {};
        }
      }
      document.addEventListener('visibilitychange', onVisibility)
      return () => document.removeEventListener('visibilitychange', onVisibility)
    }, [loadVideo])



    return (
      <section ref={ref} className="relative min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        {/* Clean Background Pattern */}
        <div className="absolute inset-0">
          {/* Grid pattern - made more visible */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        {/* Main Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center min-h-screen py-12 sm:py-16 md:py-20">

            {/* Left Content */}
            <div data-aos="fade-right" data-aos-delay="100" className="space-y-6 sm:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm font-semibold border border-indigo-200">
                <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Nền tảng giáo dục STEM</span>
                <span className="sm:hidden">Giáo dục STEM</span>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>

              {/* Main Heading */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Học lập trình cùng Robot Alpha Mini
                  <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent py-1 leading-relaxed">
                    Nền tảng giáo dục STEM hàng đầu Việt Nam
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                Phát triển tư duy logic, sáng tạo và kỹ năng lập trình cho trẻ em từ 6-18 tuổi. 
                Hơn 10,000 học sinh đã tin tưởng và học tập cùng chúng tôi.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 sm:gap-6 pt-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">10,000+</div>
                    <div className="text-xs text-gray-600">Học sinh</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <BookOpen className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">500+</div>
                    <div className="text-xs text-gray-600">Khóa học</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <Award className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">98%</div>
                    <div className="text-xs text-gray-600">Hài lòng</div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">An toàn cho trẻ em</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">500+ khóa học</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Chứng chỉ được công nhận</span>
                </div>
              </div>

              {/* Recognition Badge */}
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full w-fit">
                <Award className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-green-700">
                  Được Bộ GD&ĐT công nhận
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/course'
                    }
                  }}
                >
                  <GraduationCap className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                  Xem chương trình học
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  className="border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold group transition-all duration-300 w-full sm:w-auto"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/login'
                    }
                  }}
                >
                  <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Học thử miễn phí</span>
                  <span className="sm:hidden">Học thử</span>
                </Button>
              </div>
            </div>

            {/* Right Content - Robot Image/Video */}
            <div data-aos="fade-left" data-aos-delay="300" className="relative mt-8 lg:mt-0">
              <div className="relative">
                {/* Robot Video/Image Container - Clean without overlays */}
                <div ref={videoContainerRef} className="relative z-10 bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200" style={{transform: 'translateZ(0)'}}>
                    <div className="aspect-video">
                      {loadVideo ? (
                        <video
                          ref={videoElRef}
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                        >
                          <source src="/alpha-mini-home.mp4" type="video/mp4" />
                        </video>
                      ) : (
                        // Lightweight poster image until video is needed
                        <img src="/alpha-mini-home-poster.jpg" alt="Alpha Mini preview" className="w-full h-full object-cover" />
                      )}
                    </div>
                  </div>

                {/* Simple Alpha Mini info card below video */}
                <div className="mt-6 bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Alpha Mini</div>
                      <div className="text-sm text-gray-600">Robot giáo dục thông minh cho mọi lứa tuổi</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-gray-500 text-sm">Cuộn xuống để xem thêm</span>
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </section>
    )
  }
)

HeroSection.displayName = "HeroSection"
