import { ActionActivites } from "./action";

// Audio conversion API types
export type AudioConvertRequest = {
    file: File;
    start_time?: number;
    end_time?: number;
}

export type AudioConvertResponse = {
    message: string;
    file_name: string;
    url: string;
    duration: number;
    trimming_applied?: {
        start_time: number;
        end_time: number;
    };
}

export type MusicInfor ={
    name: string;
    music_file_url: string;
    duration: number;
    start_time: number;
    end_time: number;   
}

export type DancePlanReposnse = {
    music_info: MusicInfor;
    activity : {
        actions: ActionActivites[]; // Add the action
    }
}

// Async upload music and generate plan (returns task_id for progress tracking)
export type AsyncUploadMusicRequest = {
    file: File;
    start_time?: number;
    end_time?: number;
    robot_model_id: string;
    async_mode: boolean;
}

export type AsyncUploadMusicResponse = {
    task_id: string;
    message: string;
}

// Sync generate dance plan from existing music
export type GenerateDancePlanSyncRequest = {
    music_name: string;
    music_url: string;
    duration: number;
    robot_model_id: string;
}

export type GenerateDancePlanSyncResponse = {
    music_info: MusicInfor;
    activity: {
        actions: ActionActivites[];
    }
}

// Task progress tracking
export type TaskProgress = {
    task_id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number; // 0-100
    message?: string;
    result?: DancePlanReposnse; // Available when status is 'completed'
    error?: string; // Available when status is 'failed'
}