import { 
  createJoystick,
  getJoystickByAccountRobot,
  deleteJoystick,
  patchJoystick,
  updateJoystick
} from "@/features/activities/api/joystick-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Joystick, JoystickResponse } from "@/types/joystick";

export const useJoystick = () => {
    const queryClient = useQueryClient();

    const useGetJoystickByAccountRobot = (accountId: string, robotId: string) => {
        return useQuery<JoystickResponse>({
            queryKey: ["joysticks", "by-account-robot", accountId, robotId],
            queryFn: () => {
                return getJoystickByAccountRobot(accountId, robotId);
            },
            enabled: !!accountId && !!robotId,
            staleTime: 1000 * 60, // Reduced to 1 minute for debugging
            gcTime: 1000 * 60 * 5, // Reduced to 5 minutes
            refetchOnWindowFocus: false,
            refetchOnMount: true, // Changed to true for debugging
            refetchOnReconnect: false,
            retry: (failureCount, error: unknown) => {
                const apiError = error as { response?: { status?: number } };
                if (apiError?.response?.status === 429) {
                    return false;
                }
                // Retry other errors max 2 times
                return failureCount < 2;
            },
            retryDelay: (attemptIndex) => {
                // Exponential backoff: 1s, 2s, 4s
                return Math.min(1000 * 2 ** attemptIndex, 10000);
            },
        });
    };

    // Create joystick mutation
    const useCreateJoystick = () => {
        return useMutation({
            mutationFn: createJoystick,
            onSuccess: () => {
                console.log('✅ Create joystick success - invalidating queries');
                // Invalidate all joystick queries
                queryClient.invalidateQueries({ queryKey: ["joysticks"] });
                // Force refetch specific account-robot queries
                queryClient.invalidateQueries({ 
                    queryKey: ["joysticks", "by-account-robot"], 
                    exact: false 
                });
            },
        });
    };

    // Update joystick mutation (PUT - full update)
    const useUpdateJoystick = () => {
        return useMutation({
            mutationFn: ({ id, joystickData }: { 
                id: string; 
                joystickData: Omit<Joystick, 'id' | 'createdDate' | 'lastUpdate'> 
            }) => updateJoystick(id, joystickData),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["joysticks"] });
                queryClient.invalidateQueries({ 
                    queryKey: ["joysticks", "by-account-robot"], 
                    exact: false 
                });
            },
        });
    };

    // Patch joystick mutation (PATCH - partial update)
    const usePatchJoystick = () => {
        return useMutation({
            mutationFn: ({ id, joystickData }: { 
                id: string; 
                joystickData: Partial<Omit<Joystick, 'id' | 'createdDate' | 'lastUpdate'>> 
            }) => patchJoystick(id, joystickData),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["joysticks"] });
            },
        });
    };

    // Delete joystick mutation (soft delete)
    const useDeleteJoystick = () => {
        return useMutation({
            mutationFn: deleteJoystick,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["joysticks"] });
            },
        });
    };

    return {
        useGetJoystickByAccountRobot,
        useCreateJoystick,
        useUpdateJoystick,
        usePatchJoystick,
        useDeleteJoystick,
    };
};
