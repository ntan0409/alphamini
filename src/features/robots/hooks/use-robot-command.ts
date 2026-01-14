import { 
  getAllRobotCommands, 
  createRobotCommand,
  getRobotCommandsByName,
  deleteRobotCommand,
  getRobotCommandById, 
  patchRobotCommand,
  updateRobotCommand, 
  changeRobotCommandStatus 
} from "@/features/robots/api/robot-command-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RobotCommand, RobotCommandResponse } from "@/types/robot-command";

export const useRobotCommand = () => {
    const queryClient = useQueryClient();

    const useGetAllRobotCommands = () => {
        return useQuery<RobotCommandResponse>({
            queryKey: ["robot-commands"],
            queryFn: getAllRobotCommands
        });
    };

    const useGetRobotCommandById = (id: string) => {
        return useQuery<RobotCommand>({
            queryKey: ["robot-commands", id],
            queryFn: () => getRobotCommandById(id)
        });
    };

    const useGetRobotCommandsByName = (name: string) => {
        return useQuery<RobotCommandResponse>({
            queryKey: ["robot-commands", "name", name],
            queryFn: () => getRobotCommandsByName(name)
        });
    };

    const useCreateRobotCommand = () => {
        return useMutation<RobotCommand, Error, Omit<RobotCommand, 'id' | 'createdDate' | 'lastUpdate' | 'status' | 'statusText'>>({
            mutationFn: createRobotCommand,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["robot-commands"] });
            }
        });
    };

    const useUpdateRobotCommand = () => {
        return useMutation<RobotCommand, Error, { id: string; data: Partial<Omit<RobotCommand, 'id' | 'createdDate' | 'lastUpdate'>> }>({
            mutationFn: ({ id, data }) => updateRobotCommand(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["robot-commands"] });
            }
        });
    };

    const usePatchRobotCommand = () => {
        return useMutation<RobotCommand, Error, { id: string; data: Partial<Omit<RobotCommand, 'id' | 'createdDate' | 'lastUpdate'>> }>({
            mutationFn: ({ id, data }) => patchRobotCommand(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["robot-commands"] });
            }
        });
    };

    const useDeleteRobotCommand = () => {
        return useMutation<void, Error, string>({
            mutationFn: deleteRobotCommand,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["robot-commands"] });
            }
        });
    };

    const useChangeRobotCommandStatus = () => {
        return useMutation<RobotCommand, Error, { id: string; status: number }>({
            mutationFn: ({ id, status }) => changeRobotCommandStatus(id, status),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["robot-commands"] });
            }
        });
    };

    return {
        useGetAllRobotCommands,
        useGetRobotCommandById,
        useGetRobotCommandsByName,
        useCreateRobotCommand,
        useUpdateRobotCommand,
        usePatchRobotCommand,
        useDeleteRobotCommand,
        useChangeRobotCommandStatus
    };
};
