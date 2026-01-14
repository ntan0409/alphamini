import { createSubscription, getPagedSubscriptions, deleteSubscription, updateSubscription, getSubscriptionById, getUserSubscriptionDashboard } from "../api/subscription-api";
import { SubscriptionPlanModal } from "@/types/subscription";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSubscription = () => {
    const queryClient = useQueryClient();


    const useGetPagedSubscriptions = (page: number, limit: number, search?: string) => {
        return useQuery({
            queryKey: ['subscription-plans', page, limit, search],
            queryFn: () => getPagedSubscriptions(page, limit, search)
        });
    }


    const useCreateSubscription = () => {
        return useMutation({
            mutationFn: createSubscription,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
            },
        });
    };

    const useUpdateSubscription = () => {
        return useMutation({
            mutationFn: ({ id, data }: { id: string, data: SubscriptionPlanModal }) => updateSubscription(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
            },
        });
    };

    const useDeleteSubscription = () => {
        return useMutation({
            mutationFn: deleteSubscription,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
            },
        });
    };

    const useGetSubscriptionById = (id: string) => {
        return useQuery({
            queryKey: ['subscription-plan', id],
            queryFn: () => getSubscriptionById(id),
            enabled: !!id,
        })
    }

    const useGetUserSubscriptionDashboard = (accountId: string) => {
        return useQuery({
            queryKey: ['user-subscription-dashboard', accountId],
            queryFn: ({ signal }) => getUserSubscriptionDashboard(accountId, signal),
            enabled: !!accountId,
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: true,
        })
    }

    return {
        useGetPagedSubscriptions,
        useCreateSubscription,
        useUpdateSubscription,
        useDeleteSubscription,
        useGetSubscriptionById,
        useGetUserSubscriptionDashboard
    }
};
