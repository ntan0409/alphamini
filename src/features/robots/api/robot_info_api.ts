import { pythonHttp } from '@/utils/http';
import { RobotInfoResponse } from '@/types/robot-info';

/**
 * Get robot info by serial number
 * @param serial - Robot serial number
 * @param timeout - Timeout in seconds for robot response (default: 10)
 * @returns Robot info including battery level, firmware version, etc.
 */
export const getRobotInfo = async (serial: string, timeout: number = 10): Promise<RobotInfoResponse> => {
  try {
    const response = await pythonHttp.get<RobotInfoResponse>(
      `/robot/info/${serial}`, 
      { 
        params: { timeout },
        headers: { 
          Accept: "application/json" 
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
