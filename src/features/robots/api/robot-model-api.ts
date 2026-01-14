import { RobotModel, RobotModelResponse } from '@/types/robot-model';
import { robotsHttp } from '@/utils/http';

export const getAllRobotModels = async () => {
  try {
    const response = await robotsHttp.get<RobotModelResponse>('/robot-models');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRobotModelById = async (id: string) => {
  const response = await robotsHttp.get<RobotModel>(`/robot-models/${id}`);
  return response.data;
};

export const createRobotModel = async (robotModelData: Omit<RobotModel, 'id' | 'createdDate' | 'lastUpdated' | 'status' | 'statusText'>) => {
  try {
    const response = await robotsHttp.post('/robot-models', robotModelData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRobotModel = async (id: string, robotModelData: Partial<Omit<RobotModel, 'id' | 'createdDate' | 'lastUpdate'>>) => {
    try {
        const response = await robotsHttp.put(`/robot-models/${id}`, robotModelData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const patchRobotModel = async (id: string, robotModelData: Partial<Omit<RobotModel, 'id' | 'createdDate' | 'lastUpdate'>>) => {
    try {
        const response = await robotsHttp.patch(`/robot-models/${id}`, robotModelData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteRobotModel = async (id: string) => {
  try {
    const response = await robotsHttp.delete(`/robot-models/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changeRobotModelStatus = async (id: string, status: number) => {
  try {
    const response = await robotsHttp.patch(`/robot-models/${id}/change-status`, status );
    return response.data;
  } catch (error) {
    throw error;
  }
};
