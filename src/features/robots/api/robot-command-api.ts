import { RobotCommand, RobotCommandResponse } from '@/types/robot-command';
import { robotsHttp } from '@/utils/http';

export const getAllRobotCommands = async () => {
  try {
    const response = await robotsHttp.get<RobotCommandResponse>('/robot-commands');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createRobotCommand = async (robotCommandData: Omit<RobotCommand, 'id' | 'createdDate' | 'lastUpdate' | 'status' | 'statusText'>) => {
  try {
    const response = await robotsHttp.post('/robot-commands', robotCommandData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRobotCommandsByName = async (name: string) => {
  try {
    const response = await robotsHttp.get<RobotCommandResponse>(`/robot-commands/name`, { params: { name } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRobotCommand = async (id: string) => {
  try {
    const response = await robotsHttp.delete(`/robot-commands/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRobotCommandById = async (id: string) => {
  const response = await robotsHttp.get<RobotCommand>(`/robot-commands/${id}`);
  return response.data;
};

export const patchRobotCommand = async (id: string, robotCommandData: Partial<Omit<RobotCommand, 'id' | 'createdDate' | 'lastUpdate'>>) => {
    try {
        const response = await robotsHttp.patch(`/robot-commands/${id}`, robotCommandData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateRobotCommand = async (id: string, robotCommandData: Partial<Omit<RobotCommand, 'id' | 'createdDate' | 'lastUpdate'>>) => {
    try {
        const response = await robotsHttp.put(`/robot-commands/${id}`, robotCommandData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const changeRobotCommandStatus = async (id: string, status: number) => {
  try {
    const response = await robotsHttp.patch(`/robot-commands/${id}/change-status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};
