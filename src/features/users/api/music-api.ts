import { 
    AudioConvertRequest, 
    AudioConvertResponse, 
    DancePlanReposnse,
    AsyncUploadMusicRequest,
    AsyncUploadMusicResponse,
    GenerateDancePlanSyncRequest,
    GenerateDancePlanSyncResponse,
    TaskProgress
} from '@/types/music';
import { pythonHttp, usersHttp } from '@/utils/http';

// Audio conversion API
export const convertAudioToWav = async (params: AudioConvertRequest): Promise<AudioConvertResponse> => {
    try {
        const formData = new FormData();
        formData.append('file', params.file);
        
        if (params.start_time !== undefined) {
            formData.append('start_time', params.start_time.toString());
        }
        
        if (params.end_time !== undefined) {
            formData.append('end_time', params.end_time.toString());
        }

        const response = await usersHttp.post<AudioConvertResponse>('/audio/convert/to-wav', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 300000, // 5 minutes timeout for file conversion
        });
        
        return response.data;
    } catch (error) {
        console.error('Error converting audio:', error);
        throw error;
    }
};  

export const getDancePlan = async (
    file: File, 
    robot_model_id: string,
    start_time?: number, 
    end_time?: number
): Promise<DancePlanReposnse> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Add optional start_time and end_time to form data
        if (start_time !== undefined && start_time !== null) {
            formData.append('start_time', start_time.toString());
        }
        
        if (end_time !== undefined && end_time !== null) {
            formData.append('end_time', end_time.toString());
        }

        formData.append('robot_model_id', robot_model_id);
        
        const response = await pythonHttp.post('/music/upload-music-and-generate-plan', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 300000, // 5 minutes timeout for dance plan generation 
        });
        return response.data;
    } catch (error) {
        console.error('Error generating dance plan:', error);
        throw error;
    }
};

// Upload music and generate dance plan asynchronously (returns task_id for progress tracking)
export const uploadMusicAsync = async (
    file: File, 
    robot_model_id: string,
    start_time?: number, 
    end_time?: number
): Promise<AsyncUploadMusicResponse> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Add optional start_time and end_time to form data
        if (start_time !== undefined && start_time !== null) {
            formData.append('start_time', start_time.toString());
        }
        
        if (end_time !== undefined && end_time !== null) {
            formData.append('end_time', end_time.toString());
        }

        formData.append('robot_model_id', robot_model_id);
        formData.append('async_mode', 'true'); // Enable async mode for progress tracking
        
        const response = await pythonHttp.post<AsyncUploadMusicResponse>(
            '/music/upload-music-and-generate-plan', 
            formData, 
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000, // 1 minute timeout (async returns quickly with task_id)
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error uploading music async:', error);
        throw error;
    }
};

// Generate dance plan synchronously from existing music URL (blocks until complete)
export const generateDancePlanSync = async (
    params: GenerateDancePlanSyncRequest
): Promise<GenerateDancePlanSyncResponse> => {
    try {
        const response = await pythonHttp.post<GenerateDancePlanSyncResponse>(
            '/music/generate-dance-plan-sync',
            {
                music_name: params.music_name,
                music_url: params.music_url,
                duration: params.duration,
                robot_model_id: params.robot_model_id
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 300000, // 5 minutes timeout for dance plan generation
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error generating dance plan sync:', error);
        throw error;
    }
};

// Get task status and progress by task_id
export const getTaskStatus = async (taskId: string): Promise<TaskProgress> => {
    try {
        const response = await pythonHttp.get<TaskProgress>(
            `/music/task/${taskId}`,
            {
                timeout: 10000, // 10 seconds timeout
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error getting task status:', error);
        throw error;
    }
};

// Delete a task from tracking
export const deleteTask = async (taskId: string): Promise<{ message: string }> => {
    try {
        const response = await pythonHttp.delete<{ message: string }>(
            `/music/task/${taskId}`,
            {
                timeout: 10000, // 10 seconds timeout
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};