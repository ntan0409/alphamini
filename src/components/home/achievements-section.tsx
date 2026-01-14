"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Award, Trophy, Star, TrendingUp, Users, BookOpen, Target } from "lucide-react"
import { forwardRef } from "react"

interface AchievementsSectionProps {
  currentSection?: number
}

export const AchievementsSection = forwardRef<HTMLElement, AchievementsSectionProps>(
  ({ }, ref) => {
    const stats = [
      {
        icon: Users,
        value: "10,000+",
        label: "Học sinh đang học",
        color: "blue",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-600"
      },
      {
        icon: BookOpen,
        value: "500+",
        label: "Khóa học",
        color: "purple",
        bgColor: "bg-purple-100",
        iconColor: "text-purple-600"
      },
      {
        icon: Award,
        value: "98%",
        label: "Hài lòng",
        color: "green",
        bgColor: "bg-green-100",
        iconColor: "text-green-600"
      },
      {
        icon: Trophy,
        value: "5,000+",
        label: "Chứng chỉ đã cấp",
        color: "orange",
        bgColor: "bg-orange-100",
        iconColor: "text-orange-600"
      }
    ]

    const achievements = [
      {
        title: "Hoàn thành khóa học đầu tiên",
        description: "Nhận badge khi hoàn thành khóa học đầu tiên",
        icon: Star,
        color: "yellow"
      },
      {
        title: "Học viên xuất sắc",
        description: "Top 10% học sinh có điểm số cao nhất",
        icon: Trophy,
        color: "gold"
      },
      {
        title: "Nhà lập trình trẻ",
        description: "Hoàn thành 10 dự án lập trình",
        icon: Target,
        color: "blue"
      },
      {
        title: "Thành viên cộng đồng",
        description: "Tham gia và đóng góp cho cộng đồng",
        icon: Users,
        color: "green"
      }
    ]

    return (
      <section
        ref={ref}
        id="achievements"
        className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-yellow-50 via-white to-orange-50 relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div data-aos="fade-up" data-aos-delay="100" className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
              Thành tích & Chứng chỉ
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Theo dõi tiến độ và thành tích
              <span className="block bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent py-1 leading-relaxed">
                Học tập có động lực
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Hệ thống thành tích và chứng chỉ giúp học sinh có động lực học tập và phát triển
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={`${100 + index * 100}`}
                  className="group"
                >
                  <Card className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              const getColorClasses = (color: string) => {
                const colors: Record<string, { bg: string; text: string; border: string }> = {
                  yellow: { bg: "bg-yellow-100", text: "text-yellow-600", border: "border-yellow-200" },
                  gold: { bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-200" },
                  blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
                  green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" }
                }
                return colors[color] || colors.yellow
              }
              const colorClasses = getColorClasses(achievement.color)

              return (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={`${200 + index * 100}`}
                  className="group"
                >
                  <Card className={`bg-white border-2 ${colorClasses.border} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 h-full`}>
                    <CardContent className="p-6 text-center h-full flex flex-col">
                      <div className={`w-16 h-16 ${colorClasses.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        <Icon className={`w-8 h-8 ${colorClasses.text}`} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 flex-grow">
                        {achievement.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div data-aos="fade-up" data-aos-delay="600" className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Xem bảng xếp hạng và thành tích của bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                <TrendingUp className="w-5 h-5" />
                Xem bảng xếp hạng
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
)

AchievementsSection.displayName = "AchievementsSection"
