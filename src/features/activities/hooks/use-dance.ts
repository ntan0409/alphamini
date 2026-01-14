import { createDance, getPagedDances, updateDance, deleteDance } from "@/features/activities/api/dance-api";
import { DanceModal } from "@/types/dance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDance = () => {
    const queryClient = useQueryClient();

    const useGetPagedDances = (page: number, limit: number, search?: string) => {
        return useQuery({
            queryKey: ['dances', page, limit, search],
            queryFn: () => getPagedDances(page, limit, search)
        });
    }

    // Create dance mutation
    const useCreateDance = () => {
        return useMutation({
            mutationFn: createDance,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['dances'] });
            },
        });
    };

    // Update dance mutation
    const useUpdateDance = () => {
        return useMutation({
            mutationFn: ({ id, data }: { id: string, data: DanceModal }) => updateDance(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['dances'] });
            },
        });
    };

    // Delete dance mutation
    const useDeleteDance = () => {
        return useMutation({
            mutationFn: deleteDance,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['dances'] });
            },
        });
    };

    return {
        useGetPagedDances,
        useCreateDance,
        useUpdateDance,
        useDeleteDance
    }
};
