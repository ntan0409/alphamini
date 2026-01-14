export type DashboardStats = {
    total: number;
    role: string;
    growthRate: number;
    newThisMonth: number;
};

export type DashboardSummary = {
    totalOrganizations: number;
    totalAccounts: number;
    totalRobots: number;
    totalActivities: number;
}

export type DashboardUserStats = {
    newUsersLastMonth: number;
    newUsersThisMonth: number;
    growthRate: number;
    totalAccounts: number;
}

export interface EnrolledCourse {
  id: string;
  name: string;
  imageUrl?: string;
  progressPercent: number;
  completedLesson: number;
  totalLesson: number;
  lastAccessed?: string;
  slug: string;
}

export interface AvailableCourse {
  id: string;
  name: string;
  imageUrl?: string;
  totalLesson: number;
  slug: string;
  price?: number;
  description?: string;
}

export interface RecentActivity {
  courseName: string;
  lessonName: string;
  completedAt: string;
}

export interface ChildCourse {
  id: string;
  name: string;
  imageUrl?: string;
  progressPercent: number;
  completedLesson: number;
  totalLesson: number;
  slug: string;
  emoji?: string; // Emoji cho từng khóa học để vui nhộn hơn
}

export interface Achievement {
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress?: number; // Tiến độ để unlock (optional)
  total?: number; // Tổng để unlock (optional)
}