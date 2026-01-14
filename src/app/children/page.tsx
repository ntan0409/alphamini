'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { 
  Code, 
  BookOpen, 
  Trophy, 
  Bot, 
  Target, 
  Star,
  Sparkles,
  Zap,
  Heart,
  PlayCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import Image from 'next/image'
import { useGetLearningDashboard } from '@/features/courses/hooks/use-account-course'
import { getUserInfoFromToken } from '@/utils/tokenUtils'
import LoadingState from '@/components/loading-state'
import { Achievement, ChildCourse, RecentActivity } from '@/types/dashboard'

export default function ChildrenDashboard() {
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      const userInfo = getUserInfoFromToken(accessToken);
      setAccountId(userInfo?.id || null);
    }
  }, []);

  const { data: dashboardData, isLoading } = useGetLearningDashboard(accountId || '');

  // Extract data từ API
  const enrolledCourses = dashboardData?.enrolledCourses || [];
  const stats = dashboardData?.stats || {
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalLessonsCompleted: 0,
    learningHoursThisWeek: 0
  };
  const recentActivities = dashboardData?.recentActivities || [];

  // Tính toán achievements dựa trên stats thực tế
  const achievements: Achievement[] = [
    { 
      icon: '🎉', 
      title: 'Khởi Đầu Tuyệt Vời!', 
      description: 'Hoàn thành bài học đầu tiên',
      unlocked: stats.totalLessonsCompleted >= 1,
      progress: Math.min(stats.totalLessonsCompleted, 1),
      total: 1
    },
    { 
      icon: '⭐', 
      title: 'Học Sinh Siêng Năng', 
      description: 'Hoàn thành 5 bài học',
      unlocked: stats.totalLessonsCompleted >= 5,
      progress: Math.min(stats.totalLessonsCompleted, 5),
      total: 5
    },
    { 
      icon: '🏆', 
      title: 'Bậc Thầy Nhỏ', 
      description: 'Hoàn thành 10 bài học',
      unlocked: stats.totalLessonsCompleted >= 10,
      progress: Math.min(stats.totalLessonsCompleted, 10),
      total: 10
    },
    { 
      icon: '🌟', 
      title: 'Siêu Sao Lập Trình', 
      description: 'Hoàn thành 20 bài học',
      unlocked: stats.totalLessonsCompleted >= 20,
      progress: Math.min(stats.totalLessonsCompleted, 20),
      total: 20
    },
    { 
      icon: '💎', 
      title: 'Chuyên Gia Robot', 
      description: 'Hoàn thành 1 khóa học',
      unlocked: stats.completedCourses >= 1,
      progress: Math.min(stats.completedCourses, 1),
      total: 1
    },
    { 
      icon: '🚀', 
      title: 'Thần Đồng Công Nghệ', 
      description: 'Học 10 giờ',
      unlocked: stats.learningHoursThisWeek >= 10,
      progress: Math.min(stats.learningHoursThisWeek, 10),
      total: 10
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="p-4 mt-5 md:p-10 space-y-6" suppressHydrationWarning>
      {/* Hero Section - Vui nhộn hơn cho trẻ em */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 border-2 border-purple-300 shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl animate-bounce">⭐</div>
          <div className="absolute top-20 right-20 text-4xl animate-pulse">🚀</div>
          <div className="absolute bottom-10 left-20 text-5xl animate-bounce delay-100">✨</div>
          <div className="absolute bottom-20 right-10 text-4xl animate-pulse delay-200">🎨</div>
        </div>
        <div className="grid lg:grid-cols-2 gap-6 items-center p-2">
          <div className="p-6 lg:p-10 text-gray-900 space-y-4 relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-sm font-bold">
                🎯 Dành cho bạn nhỏ
              </Badge>
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 text-sm font-bold">
                🎉 Vui học - Vui chơi
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Chào bạn nhỏ! Cùng học lập trình nhé! 🤖
            </h1>
            <p className="text-gray-700 text-lg font-medium">
              Kéo thả khối lệnh thật đơn giản. Robot sẽ làm theo lệnh của bạn! 🎮
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl px-6 py-6 font-bold shadow-lg hover:shadow-xl transition-all">
                <Link href="/children/blockly-coding">
                  <Sparkles className="w-5 h-5 mr-2" /> Bắt đầu học
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-2xl px-6 py-6 font-bold border-2 border-purple-300 hover:bg-purple-50">
                <Link href="/children/robot">
                  <Bot className="w-5 h-5 mr-2" /> Xem Robot
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 lg:h-full min-h-[280px]">
            <Image
              src="/img_noenjoy.webp"
              alt="Alpha Kids"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Stats Row - Thống kê vui nhộn */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            icon: <BookOpen className="w-8 h-8" />, 
            label: 'Bài học hoàn thành', 
            value: stats.totalLessonsCompleted,
            emoji: '📚',
            gradient: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-50'
          },
          { 
            icon: <Star className="w-8 h-8" />, 
            label: 'Khóa học đang học', 
            value: stats.inProgressCourses,
            emoji: '⭐',
            gradient: 'from-yellow-500 to-orange-500',
            bg: 'bg-yellow-50'
          },
          { 
            icon: <Trophy className="w-8 h-8" />, 
            label: 'Thành tích đạt được', 
            value: unlockedCount,
            emoji: '🏆',
            gradient: 'from-purple-500 to-pink-500',
            bg: 'bg-purple-50'
          },
          { 
            icon: <Zap className="w-8 h-8" />, 
            label: 'Giờ học tuần này', 
            value: stats.learningHoursThisWeek,
            emoji: '⚡',
            gradient: 'from-green-500 to-emerald-500',
            bg: 'bg-green-50'
          },
        ].map((item, index) => (
          <Card key={index} className={`${item.bg} border-2 shadow-md hover:shadow-xl transition-all hover:scale-105 cursor-pointer`}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center text-white shadow-md`}>
                  {item.icon}
                </div>
                <span className="text-3xl">{item.emoji}</span>
              </div>
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent mb-1">
                {item.value}
              </div>
              <p className="text-xs md:text-sm text-gray-600 font-semibold">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Khóa học đang học - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Học tiếp nào! */}
          <Card className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-black flex items-center gap-2 text-gray-900">
                  <Heart className="w-7 h-7 text-red-500 animate-pulse" />
                  Học tiếp nào!
                </CardTitle>
                <Button variant="ghost" size="sm" asChild className="font-bold">
                  <Link href="/parent/courses">
                    Xem tất cả
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map((course: ChildCourse) => (
                  <div key={course.id} className="bg-white border-2 border-purple-200 rounded-2xl p-4 hover:shadow-xl transition-all hover:scale-[1.02]">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        {course.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          <BookOpen className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-gray-900 mb-2 text-lg">{course.name}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-semibold">
                              ✅ {course.completedLesson}/{course.totalLesson} bài học
                            </span>
                            <span className="font-black text-purple-600 text-lg">
                              {course.progressPercent}%
                            </span>
                          </div>
                          <Progress value={course.progressPercent} className="h-3 bg-purple-100" />
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button size="sm" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-md">
                            <Link href={`/parent/courses/${course.slug}`}>
                              <PlayCircle className="w-4 h-4 mr-1" />
                              Học tiếp!
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-dashed border-yellow-300">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-gray-700 font-bold text-lg mb-4">Chưa có khóa học nào!</p>
                  <p className="text-gray-600 mb-4">Bạn nhỏ hãy chọn khóa học để bắt đầu nhé!</p>
                  <Button size="lg" asChild className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-2xl font-bold">
                    <Link href="/parent/courses">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Khám phá khóa học
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hoạt động gần đây */}
          {recentActivities.length > 0 && (
            <Card className="bg-white border-2 border-green-200 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-black flex items-center gap-2 text-gray-900">
                  <Target className="w-7 h-7 text-green-600" />
                  Bạn vừa làm gì? 📝
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivities.map((activity: RecentActivity, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm">{activity.lessonName}</p>
                      <p className="text-xs text-gray-600 font-medium">{activity.courseName}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.completedAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <span className="text-2xl">🎉</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Thành tích */}
        <div className="space-y-6">
          {/* Huy chương & Thành tích */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-black flex items-center gap-2 text-gray-900">
                <Trophy className="w-6 h-6 text-yellow-600" />
                Huy chương của bạn! 🏆
              </CardTitle>
              <p className="text-sm text-gray-600 font-semibold mt-1">
                Đã mở khóa: {unlockedCount}/{achievements.length} huy chương
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    achievement.unlocked 
                      ? 'bg-white border-yellow-300 shadow-md' 
                      : 'bg-gray-100 border-gray-300 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`text-3xl ${achievement.unlocked ? 'animate-bounce' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm">{achievement.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                      {!achievement.unlocked && achievement.progress !== undefined && achievement.total && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500 font-semibold">Tiến độ</span>
                            <span className="font-bold text-gray-700">{achievement.progress}/{achievement.total}</span>
                          </div>
                          <Progress value={(achievement.progress / achievement.total) * 100} className="h-2 bg-gray-200" />
                        </div>
                      )}
                    </div>
                    {achievement.unlocked && (
                      <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Truy cập nhanh */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-black flex items-center gap-2 text-gray-900">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Làm gì tiếp nhỉ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start font-bold border-2 hover:bg-purple-100 hover:border-purple-400 rounded-xl" asChild>
                <Link href="/children/blockly-coding">
                  <Code className="w-5 h-5 mr-2 text-purple-600" />
                  Lập trình Blockly
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start font-bold border-2 hover:bg-blue-100 hover:border-blue-400 rounded-xl" asChild>
                <Link href="/children/robot">
                  <Bot className="w-5 h-5 mr-2 text-blue-600" />
                  Điều khiển Robot
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start font-bold border-2 hover:bg-green-100 hover:border-green-400 rounded-xl" asChild>
                <Link href="/children/activities">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Hoạt động vui
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start font-bold border-2 hover:bg-pink-100 hover:border-pink-400 rounded-xl" asChild>
                <Link href="/parent/courses">
                  <BookOpen className="w-5 h-5 mr-2 text-pink-600" />
                  Khóa học mới
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
