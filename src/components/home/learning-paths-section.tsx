"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, BookOpen, Award, ArrowRight, CheckCircle2, Clock, Users } from "lucide-react"
import { forwardRef } from "react"

interface LearningPathsSectionProps {
  currentSection?: number
}

export const LearningPathsSection = forwardRef<HTMLElement, LearningPathsSectionProps>(
  ({ }, ref) => {
    const learningPaths = [
      {
        level: "Cơ bản",
        title: "Lập trình cho người mới bắt đầu",
        description: "Làm quen với lập trình qua Blockly, điều khiển robot đơn giản",
        duration: "4 tuần",
        lessons: 12,
        students: 5000,
        icon: BookOpen,
        color: "blue",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-600",
        skills: ["Blockly cơ bản", "Điều khiển robot", "Tư duy logic"],
        progress: 0
      },
      {
        level: "Trung bình",
        title: "Lập trình nâng cao & Dự án",
        description: "Xây dựng dự án thực tế, tích hợp AI và cảm biến",
        duration: "8 tuần",
        lessons: 24,
        students: 3200,
        icon: GraduationCap,
        color: "purple",
        bgColor: "bg-purple-100",
        iconColor: "text-purple-600",
        skills: ["Lập trình nâng cao", "Dự án thực tế", "AI cơ bản"],
        progress: 0
      },
      {
        level: "Nâng cao",
        title: "Chuyên sâu AI & Robotics",
        description: "Phát triển ứng dụng AI, điều khiển robot phức tạp, IoT",
        duration: "12 tuần",
        lessons: 36,
        students: 1500,
        icon: Award,
        color: "orange",
        bgColor: "bg-orange-100",
        iconColor: "text-orange-600",
        skills: ["AI & Machine Learning", "Robotics nâng cao", "IoT"],
        progress: 0
      }
    ]

    return (
      <section
        ref={ref}
        id="learning-paths"
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
              Lộ trình học tập
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Chọn lộ trình phù hợp với bạn
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent py-1 leading-relaxed">
                Từ cơ bản đến chuyên sâu
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Lộ trình học tập được thiết kế khoa học, phù hợp với mọi độ tuổi và trình độ
            </p>
          </div>

          {/* Learning Paths Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {learningPaths.map((path, index) => {
              const Icon = path.icon
              return (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={`${100 + index * 150}`}
                  className="group transition-all duration-500"
                >
                  <Card className="bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden h-full flex flex-col">
                    <CardHeader className="pb-4">
                      {/* Level Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${path.bgColor} ${path.iconColor}`}>
                          {path.level}
                        </span>
                        <div className={`w-12 h-12 ${path.bgColor} rounded-xl flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${path.iconColor}`} />
                        </div>
                      </div>

                      <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {path.title}
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {path.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-grow flex flex-col">
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{path.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{path.lessons} bài học</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{path.students.toLocaleString()}+ học sinh</span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Kỹ năng đạt được:</h4>
                        <div className="space-y-2">
                          {path.skills.map((skill, skillIndex) => (
                            <div key={skillIndex} className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button
                        className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white mt-auto group/btn`}
                      >
                        Bắt đầu học
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>

          {/* CTA Section */}
          <div data-aos="fade-up" data-aos-delay="600" className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Không chắc nên bắt đầu từ đâu?</p>
            <Button variant="outline" className="border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50">
              Làm bài kiểm tra trình độ miễn phí
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    )
  }
)

LearningPathsSection.displayName = "LearningPathsSection"
