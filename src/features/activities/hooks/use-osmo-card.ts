import { getAllOsmoCards, getOsmoCardById, createOsmoCard, updateOsmoCard, deleteOsmoCard } from "@/features/activities/api/osmo-card-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OsmoCard } from "@/types/osmo-card";
import { PagedResult } from "@/types/page-result";

export const useOsmoCard = () => {
    const queryClient = useQueryClient();

    // Get all osmo cards
    const useGetAllOsmoCards = () => {
        return useQuery<PagedResult<OsmoCard>>({
            queryKey: ['osmo-cards'],
            staleTime: 0,
            queryFn: getAllOsmoCards,
        });
    };

    // Get osmo card by ID
    const useGetOsmoCardById = (id: string) => {
        return useQuery<OsmoCard>({
            queryKey: ['osmo-card', id],
            staleTime: 0,
            queryFn: () => getOsmoCardById(id),
            enabled: !!id,
        });
    };

    // Create osmo card mutation
    const useCreateOsmoCard = () => {
        return useMutation({
            mutationFn: createOsmoCard,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['osmo-cards'] });
            },
        });
    };

    // Update osmo card mutation (PATCH - partial update)
    const useUpdateOsmoCard = () => {
        return useMutation({
            mutationFn: ({ id, osmoCardData }: { id: string; osmoCardData: Partial<Omit<OsmoCard, 'id' | 'createdDate'>> }) => 
                updateOsmoCard(id, osmoCardData),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['osmo-cards'] });
            },
        });
    };

    // Delete osmo card mutation
    const useDeleteOsmoCard = () => {
        return useMutation({
            mutationFn: deleteOsmoCard,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['osmo-cards'] });
            },
        });
    };

    return {
        useGetAllOsmoCards,
        useGetOsmoCardById,
        useCreateOsmoCard,
        useUpdateOsmoCard,
        useDeleteOsmoCard,
    };
};