import { getDashboardStats, getOnlineUsersCount, getUserStats } from "@/features/users/api/dashboard-api";
import { ApiResponse } from "@/types/api-error";
import { DashboardStats, DashboardUserStats } from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useDashboard = (roleName: string) => {
    const queryKey = ['dashboard-stats', roleName];

    const useGetDashboardStats = () => {
        return useQuery<DashboardStats>({
            queryKey,
            staleTime: 5 * 60 * 1000, // Cache for 5 minutes
            gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
            queryFn: () => getDashboardStats(roleName),
            enabled: !!roleName,
            retry: (failureCount, error: unknown) => {
                // Don't retry for 429 errors after 2 attempts
                const apiError = error as ApiResponse;
                if (apiError?.status === 429 && failureCount >= 2) {
                    return false;
                }
                return failureCount < 3;
            },
            retryDelay: (attemptIndex, error: unknown) => {
                // Longer delays for 429 errors
                const apiError = error as ApiResponse;
                if (apiError?.status === 429) {
                    return Math.min(5000 * 2 ** attemptIndex, 60000); // 5s, 10s, 20s...
                }
                return Math.min(1000 * 2 ** attemptIndex, 30000);
            },
            refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
            refetchIntervalInBackground: false,
        });
    };

    const useGetOnlineUsersCount = () => {
        return useQuery<number>({
            queryKey: ['online-users-count'],
            staleTime: 1 * 60 * 1000, // Cache for 1 minute (online count changes more frequently)
            gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
            queryFn: getOnlineUsersCount,
            retry: (failureCount, error: unknown) => {
                const apiError = error as ApiResponse;
                if (apiError?.status === 429 && failureCount >= 2) {
                    return false;
                }
                return failureCount < 3;
            },
            retryDelay: (attemptIndex, error: unknown) => {
                const apiError = error as ApiResponse;
                if (apiError?.status === 429) {
                    return Math.min(5000 * 2 ** attemptIndex, 60000);
                }
                return Math.min(1000 * 2 ** attemptIndex, 30000);
            },
            refetchInterval: 30 * 1000, // Refetch every 30 seconds for online count
            refetchIntervalInBackground: false,
        });
    };

    const useGetUserStats = () => {
        return useQuery<DashboardUserStats>({
            queryKey: ['user-stats'],
            staleTime: 5 * 60 * 1000, // Cache for 5 minutes
            gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
            queryFn: getUserStats,
            retry: (failureCount, error: unknown) => {
                const apiError = error as ApiResponse;
                if (apiError?.status === 429 && failureCount >= 2) {
                    return false;
                }
                return failureCount < 3;
            },
            retryDelay: (attemptIndex, error: unknown) => {
                const apiError = error as ApiResponse;
                if (apiError?.status === 429) {
                    return Math.min(5000 * 2 ** attemptIndex, 60000);
                }
                return Math.min(1000 * 2 ** attemptIndex, 30000);
            },
            refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
            refetchIntervalInBackground: false,
        });
    };

    return { useGetDashboardStats, useGetOnlineUsersCount, useGetUserStats };
}
  