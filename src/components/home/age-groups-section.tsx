"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Baby, School, GraduationCap, Rocket, ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { forwardRef } from "react"

interface AgeGroupsSectionProps {
  currentSection?: number
}

export const AgeGroupsSection = forwardRef<HTMLElement, AgeGroupsSectionProps>(
  ({ }, ref) => {
    const ageGroups = [
      {
        id: 1,
        ageRange: "6-9 tuổi",
        title: "Khởi đầu với lập trình",
        description: "Làm quen với tư duy lập trình qua các hoạt động vui chơi, sáng tạo",
        icon: Baby,
        color: "blue",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-600",
        borderColor: "border-blue-200",
        features: [
          "Lập trình kéo thả đơn giản",
          "Điều khiển robot cơ bản",
          "Vẽ tranh và sáng tạo",
          "Trò chơi giáo dục",
          "Phát triển tư duy logic"
        ],
        courses: "20+ khóa học",
        students: "3,000+ học sinh"
      },
      {
        id: 2,
        ageRange: "10-13 tuổi",
        title: "Xây dựng kỹ năng lập trình",
        description: "Phát triển kỹ năng lập trình nâng cao, xây dựng dự án thực tế",
        icon: School,
        color: "purple",
        bgColor: "bg-purple-100",
        iconColor: "text-purple-600",
        borderColor: "border-purple-200",
        features: [
          "Lập trình Blockly nâng cao",
          "Dự án thực tế",
          "AI & Machine Learning cơ bản",
          "Smart Home & IoT",
          "Game Development"
        ],
        courses: "30+ khóa học",
        students: "4,500+ học sinh"
      },
      {
        id: 3,
        ageRange: "14-18 tuổi",
        title: "Chuyên sâu & Sáng tạo",
        description: "Phát triển chuyên sâu về AI, Robotics và xây dựng dự án phức tạp",
        icon: Rocket,
        color: "orange",
        bgColor: "bg-orange-100",
        iconColor: "text-orange-600",
        borderColor: "border-orange-200",
        features: [
          "AI & Machine Learning nâng cao",
          "Robotics chuyên sâu",
          "IoT & Smart Systems",
          "Dự án thực tế phức tạp",
          "Chuẩn bị cho đại học"
        ],
        courses: "25+ khóa học",
        students: "2,500+ học sinh"
      }
    ]

    return (
      <section
        ref={ref}
        id="age-groups"
        className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-indigo-50 via-white to-blue-50 relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.08)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div data-aos="fade-up" data-aos-delay="100" className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
              Phù hợp mọi lứa tuổi
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Chương trình học theo độ tuổi
              <span className="block bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent py-1 leading-relaxed">
                Từ 6 đến 18 tuổi
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Mỗi độ tuổi có chương trình học phù hợp, giúp trẻ phát triển toàn diện kỹ năng lập trình và tư duy
            </p>
          </div>

          {/* Age Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {ageGroups.map((group, index) => {
              const Icon = group.icon
              return (
                <div
                  key={group.id}
                  data-aos="fade-up"
                  data-aos-delay={`${100 + index * 150}`}
                  className="group transition-all duration-500"
                >
                  <Card className={`bg-white border-2 ${group.borderColor} rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden h-full flex flex-col`}>
                    <CardHeader className="pb-4">
                      {/* Age Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${group.bgColor} ${group.iconColor}`}>
                          {group.ageRange}
                        </span>
                        <div className={`w-12 h-12 ${group.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-6 h-6 ${group.iconColor}`} />
                        </div>
                      </div>

                      <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {group.title}
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {group.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-grow flex flex-col">
                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          Nội dung học tập:
                        </h4>
                        <div className="space-y-2">
                          {group.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-start gap-2">
                              <CheckCircle2 className={`w-4 h-4 ${group.iconColor} flex-shrink-0 mt-0.5`} />
                              <span className="text-sm text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-200">
                        <div>
                          <div className="text-lg font-bold text-gray-900">{group.courses}</div>
                          <div className="text-xs text-gray-600">Khóa học</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">{group.students}</div>
                          <div className="text-xs text-gray-600">Học sinh</div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button
                        className={`w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white mt-auto group/btn`}
                      >
                        Xem chương trình
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>

          {/* Additional Info */}
          <div data-aos="fade-up" data-aos-delay="600" className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <School className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phương pháp học hiện đại</h3>
              <p className="text-sm text-gray-600">
                Học qua làm, thực hành trực tiếp với robot thật
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Giáo viên chuyên nghiệp</h3>
              <p className="text-sm text-gray-600">
                Đội ngũ giáo viên giàu kinh nghiệm, tận tâm
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Lộ trình rõ ràng</h3>
              <p className="text-sm text-gray-600">
                Từ cơ bản đến nâng cao, phù hợp từng độ tuổi
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }
)

AgeGroupsSection.displayName = "AgeGroupsSection"
