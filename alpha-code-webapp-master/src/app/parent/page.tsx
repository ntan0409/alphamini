"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  GraduationCap,
  Clock,
  TrendingUp,
  Key,
  Calendar,
  Download,
  PlayCircle,
  CheckCircle2,
  ArrowRight,
  Package
} from 'lucide-react';
import Link from 'next/link';
import { useGetLearningDashboard } from '@/features/courses/hooks/use-account-course';
import { getUserInfoFromToken } from '@/utils/tokenUtils';
import LoadingState from '@/components/loading-state';
import { useSubscription } from '@/features/subscription/hooks/use-subscription';
import { useGetUserLicenseInfo } from '@/features/license-key/hooks/use-license-key';
import { AvailableCourse, EnrolledCourse, RecentActivity } from '@/types/dashboard';
import CourseCard from '@/components/parent/course/course-card';



export default function ParentDashboard() {
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      const userInfo = getUserInfoFromToken(accessToken);
      setAccountId(userInfo?.id || null);
    }
  }, []);

  const { data: dashboardData, isLoading: isLoadingDashboard, error: dashboardError } = useGetLearningDashboard(accountId || '');
  const { useGetUserSubscriptionDashboard } = useSubscription();
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useGetUserSubscriptionDashboard(accountId || '');
  const { data: licenseData, isLoading: isLoadingLicense } = useGetUserLicenseInfo(accountId || '');

  // Extract data from API responses
  const enrolledCourses = dashboardData?.enrolledCourses || [];
  const availableCourses = dashboardData?.availableCourses || [];
  const stats = dashboardData?.stats || { totalCourses: 0, completedCourses: 0, inProgressCourses: 0, totalLessonsCompleted: 0, learningHoursThisWeek: 0 };
  const recentActivities = dashboardData?.recentActivities || [];

  // Subscription data
  const subscription = subscriptionData || { planName: '', endDate: '', status: 0 };

  // License data
  const license = licenseData || { hasPurchased: false, purchaseDate: null };

  // Tính số ngày còn lại của subscription
  const daysRemaining = subscription.endDate
    ? Math.ceil((new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const isLoading = isLoadingDashboard || isLoadingSubscription || isLoadingLicense;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState />
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Không thể tải dữ liệu dashboard</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-10 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trang chủ</h1>
          <p className="text-gray-500 mt-1">Chào mừng bạn trở lại! Hãy tiếp tục hành trình học tập của bạn.</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/parent/courses">
            <BookOpen className="w-4 h-4 mr-2" />
            Xem tất cả khóa học
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tổng khóa học
            </CardTitle>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.inProgressCourses} đang học
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Bài học hoàn thành
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLessonsCompleted}</div>
            <p className="text-xs text-gray-500 mt-1">
              Tất cả các khóa học
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Thời gian học
            </CardTitle>
            <Clock className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.learningHoursThisWeek}h</div>
            <p className="text-xs text-gray-500 mt-1">
              Tuần này
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Trạng thái License
            </CardTitle>
            <Key className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {license.hasPurchased ? (
                <span className="text-green-600">Đã mua</span>
              ) : (
                <span className="text-gray-400">Chưa mua</span>
              )}
            </div>
            {license.hasPurchased ? (
              <p className="text-xs text-gray-500 mt-1">
                Sử dụng trọn đời
              </p>
            ) : (
              <Button size="sm" className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link href="/license-key">
                  Mua license ngay
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Courses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tiếp tục học</CardTitle>
                  <CardDescription>Các khóa học bạn đang theo học</CardDescription>
                </div>

                <Button variant="ghost" size="sm" asChild>
                  <Link href="/parent/courses/my-course">
                    Xem tất cả
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrolledCourses.map((course: EnrolledCourse) => (
                <div key={course.id} className="border rounded-lg p-0 hover:shadow-md transition-shadow">
                  <CourseCard course={course} variant="compact" />
                </div>
              ))}

              {enrolledCourses.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Bạn chưa có khóa học nào</p>
                  <Button size="sm" className="mt-3" asChild>
                    <Link href="/parent/courses">Khám phá khóa học</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Courses (Chưa mua) */}
          {availableCourses.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Khóa học có sẵn</CardTitle>
                    <CardDescription>Khám phá thêm các khóa học mới</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/parent/courses">
                      Xem tất cả
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableCourses.slice(0, 3).map((course: AvailableCourse) => (
                  <div key={course.id} className="border rounded-lg p-0 hover:shadow-md transition-shadow">
                    <CourseCard course={course} variant="compact" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
              <CardDescription>Lịch sử học tập của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity: RecentActivity, index: number) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.lessonName}</p>
                      <p className="text-xs text-gray-500">{activity.courseName}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.completedAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subscription Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gói đăng ký</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription.status === 0 ? (
                // Chưa có subscription
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-3">Bạn chưa có gói đăng ký</p>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
                    <Link href="/subscription-plan">
                      Đăng ký ngay
                    </Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{subscription.planName}</p>
                      <Badge variant={subscription.status === 1 ? 'default' : 'secondary'} className="mt-1">
                        {subscription.status === 1 ? 'Đang hoạt động' : 'Đã hết hạn'}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-3 border-t space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Hết hạn
                      </span>
                      <span className="font-medium">
                        {new Date(subscription.endDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    {subscription.status === 1 && (
                      <p className="text-xs text-gray-500">
                        Còn {daysRemaining} ngày
                      </p>
                    )}
                  </div>

                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/subscription-plan">
                      {subscription.status === 1 ? 'Gia hạn hoặc nâng cấp' : 'Gia hạn ngay'}
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Truy cập nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/apks">
                  <Download className="w-4 h-4 mr-2" />
                  Tải APK mới nhất
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/license-key">
                  <Key className="w-4 h-4 mr-2" />
                  Mua License Key
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/addons">
                  <Package className="w-4 h-4 mr-2" />
                  Xem Addons
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/resources">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Tài nguyên học tập
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Learning Progress Summary */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Thống kê học tập
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Khóa học hoàn thành</span>
                <span className="font-bold text-gray-900">{stats.completedCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Đang học</span>
                <span className="font-bold text-gray-900">{stats.inProgressCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Tổng bài học</span>
                <span className="font-bold text-gray-900">{stats.totalLessonsCompleted}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
