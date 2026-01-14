import { pythonHttp } from '@/utils/http';
import { WebSocketCommand } from '@/types/websocket';

// POST /websocket/command/{serial} - Send Command to Robot
export const sendRobotCommand = async (serial: string, command: WebSocketCommand): Promise<{ message: string }> => {
  try {
    console.log('API Request:', {
      url: `/websocket/command/${serial}`,
      method: 'POST',
      data: command
    });
    
    const response = await pythonHttp.post<{ message: string }>(`/websocket/command/${serial}`, command);
    
    console.log('API Response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Error sending robot command:', error);
    
    // Type guard for Axios error
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown; status?: number; headers?: unknown } };
      console.error('Error response data:', axiosError.response?.data);
      console.error('Error response status:', axiosError.response?.status);
      console.error('Error response headers:', axiosError.response?.headers);
    }
    
    throw error;
  }
};