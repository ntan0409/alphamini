"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Users, Star, ArrowRight, PlayCircle, CheckCircle2 } from "lucide-react"
import { forwardRef } from "react"

interface CurriculumSectionProps {
  currentSection?: number
}

export const CurriculumSection = forwardRef<HTMLElement, CurriculumSectionProps>(
  ({ }, ref) => {
    const courses = [
      {
        id: 1,
        title: "Lập trình Blockly cơ bản",
        description: "Học lập trình kéo thả, điều khiển robot Alpha Mini qua các bài tập thực hành",
        category: "Lập trình",
        level: "Cơ bản",
        duration: "4 tuần",
        lessons: 16,
        students: 8500,
        rating: 4.8,
        image: "/img_programming_free.png",
        features: ["Blockly cơ bản", "Điều khiển robot", "Dự án thực tế"],
        color: "blue"
      },
      {
        id: 2,
        title: "AI & Machine Learning cho trẻ em",
        description: "Khám phá trí tuệ nhân tạo qua các dự án thú vị với robot Alpha Mini",
        category: "AI & ML",
        level: "Trung bình",
        duration: "6 tuần",
        lessons: 24,
        students: 4200,
        rating: 4.9,
        image: "/img_prompt.webp",
        features: ["AI cơ bản", "Machine Learning", "Dự án AI"],
        color: "purple"
      },
      {
        id: 3,
        title: "Robotics & IoT nâng cao",
        description: "Xây dựng hệ thống IoT, điều khiển robot từ xa, tích hợp cảm biến",
        category: "Robotics",
        level: "Nâng cao",
        duration: "8 tuần",
        lessons: 32,
        students: 2100,
        rating: 4.7,
        image: "/img_work_programming.png",
        features: ["IoT", "Robotics nâng cao", "Dự án thực tế"],
        color: "orange"
      },
      {
        id: 4,
        title: "Sáng tạo với Magic Sketch",
        description: "Vẽ tranh, tạo hình ảnh và điều khiển robot qua nghệ thuật",
        category: "Sáng tạo",
        level: "Cơ bản",
        duration: "3 tuần",
        lessons: 12,
        students: 6800,
        rating: 4.6,
        image: "/img_action_introduction.png",
        features: ["Vẽ tranh", "Nghệ thuật số", "Sáng tạo"],
        color: "green"
      },
      {
        id: 5,
        title: "Smart Home với Alpha Mini",
        description: "Xây dựng hệ thống nhà thông minh với robot Alpha Mini",
        category: "Smart Home",
        level: "Trung bình",
        duration: "5 tuần",
        lessons: 20,
        students: 3500,
        rating: 4.8,
        image: "/img_work_action.png",
        features: ["Smart Home", "IoT", "Tự động hóa"],
        color: "indigo"
      },
      {
        id: 6,
        title: "Game Development với Robot",
        description: "Tạo game tương tác với robot Alpha Mini, lập trình logic game",
        category: "Game Dev",
        level: "Trung bình",
        duration: "6 tuần",
        lessons: 24,
        students: 5100,
        rating: 4.9,
        image: "/img_reading.webp",
        features: ["Game Development", "Lập trình game", "Tương tác"],
        color: "pink"
      }
    ]

    const getColorClasses = (color: string) => {
      const colors: Record<string, { bg: string; text: string; border: string }> = {
        blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
        purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
        orange: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" },
        green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
        indigo: { bg: "bg-indigo-100", text: "text-indigo-600", border: "border-indigo-200" },
        pink: { bg: "bg-pink-100", text: "text-pink-600", border: "border-pink-200" }
      }
      return colors[color] || colors.blue
    }

    return (
      <section
        ref={ref}
        id="curriculum"
        className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-blue-50 to-indigo-50 relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.08)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div data-aos="fade-up" data-aos-delay="100" className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              Chương trình học
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Khóa học đa dạng, phong phú
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent py-1 leading-relaxed">
                Học theo sở thích và mục tiêu
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Hơn 50+ khóa học từ cơ bản đến nâng cao, phù hợp với mọi lứa tuổi và trình độ
            </p>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {courses.map((course, index) => {
              const colorClasses = getColorClasses(course.color)
              return (
                <div
                  key={course.id}
                  data-aos="fade-up"
                  data-aos-delay={`${100 + index * 100}`}
                  className="group transition-all duration-500"
                >
                  <Card className={`bg-white border-2 ${colorClasses.border} rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden h-full flex flex-col`}>
                    {/* Course Image */}
                    <div className="relative h-48 overflow-hidden">
                      <div className={`absolute inset-0 ${colorClasses.bg} opacity-20`}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className={`w-16 h-16 ${colorClasses.text} opacity-50`} />
                      </div>
                      {/* Level Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClasses.bg} ${colorClasses.text}`}>
                          {course.level}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-6 flex-grow flex flex-col">
                      {/* Category */}
                      <div className="mb-3">
                        <span className={`text-xs font-semibold ${colorClasses.text} uppercase tracking-wide`}>
                          {course.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                        {course.description}
                      </p>

                      {/* Features */}
                      <div className="mb-4 space-y-1">
                        {course.features.slice(0, 2).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span className="text-xs text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{course.lessons} bài</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{course.students.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{course.rating}</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button
                        className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white group/btn`}
                      >
                        <PlayCircle className="mr-2 w-4 h-4" />
                        Xem khóa học
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>

          {/* CTA Section */}
          <div data-aos="fade-up" data-aos-delay="700" className="mt-12 text-center">
            <Button variant="outline" size="lg" className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
              Xem tất cả khóa học
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    )
  }
)

CurriculumSection.displayName = "CurriculumSection"
