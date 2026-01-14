import { createAction, getPagedActions, updateAction, deleteAction } from "@/features/activities/api/action-api";
import { ActionModal } from "@/types/action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAction = () => {
    const queryClient = useQueryClient();


    const useGetPagedActions = (page: number, limit: number, search?: string) => {
        return useQuery({
            queryKey: ['actions', page, limit, search],
            queryFn: () => getPagedActions(page, limit, search)
        });
    }

    // Create action mutation
    const useCreateAction = () => {
        return useMutation({
            mutationFn: createAction,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['actions'] });
            },
        });
    };

    // Update action mutation
    const useUpdateAction = () => {
        return useMutation({
            mutationFn: ({ id, data }: { id: string, data: ActionModal }) => updateAction(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['actions'] });
            },
        });
    };

    // Delete action mutation
    const useDeleteAction = () => {
        return useMutation({
            mutationFn: deleteAction,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['actions'] });
            },
        });
    };

    return {
        useGetPagedActions,
        useCreateAction,
        useUpdateAction,
        useDeleteAction
    }
};
