import { 
  getAllRobotModels, 
  getRobotModelById, 
  createRobotModel, 
  updateRobotModel,
  patchRobotModel, 
  deleteRobotModel, 
  changeRobotModelStatus 
} from "@/features/robots/api/robot-model-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RobotModel, RobotModelResponse } from "@/types/robot-model";

export const useRobotModel = () => {
    const queryClient = useQueryClient();

    const useGetAllRobotModels = () => {
        return useQuery<RobotModelResponse>({
            queryKey: ["robot-models"],
            queryFn: getAllRobotModels
        });
    };

    const useGetRobotModelById = (id: string) => {
        return useQuery<RobotModel>({
            queryKey: ["robot-models", id],
            queryFn: () => getRobotModelById(id)
        });
    };

    const useCreateRobotModel = () => {
        return useMutation<RobotModel, Error, Omit<RobotModel, 'id' | 'createdDate' | 'lastUpdated' | 'status' | 'statusText'>>({
            mutationFn: createRobotModel,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["robot-models"] });
            }
        });
    };

    const useUpdateRobotModel = () => {
        return useMutation<RobotModel, Error, { id: string; data: Partial<Omit<RobotModel, 'id' | 'createdDate' | 'lastUpdate'>> }>({
            mutationFn: ({ id, data }) => updateRobotModel(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["robot-models"] });
            }
        });
    };

    const usePatchRobotModel = () => {
        return useMutation<RobotModel, Error, { id: string; data: Partial<Omit<RobotModel, 'id' | 'createdDate' | 'lastUpdate'>> }>({
            mutationFn: ({ id, data }) => patchRobotModel(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["robot-models"] });
            }
        });
    };

    const useDeleteRobotModel = () => {
        return useMutation<void, Error, string>({
            mutationFn: deleteRobotModel,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["robot-models"] });
            }
        });
    };

    const useChangeRobotModelStatus = () => {
        return useMutation<RobotModel, Error, { id: string; status: number }>({
            mutationFn: ({ id, status }) => changeRobotModelStatus(id, status),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["robot-models"] });
            }
        });
    };

    return {
        useGetAllRobotModels,
        useGetRobotModelById,
        useCreateRobotModel,
        useUpdateRobotModel,
        usePatchRobotModel,
        useDeleteRobotModel,
        useChangeRobotModelStatus
    };
};
