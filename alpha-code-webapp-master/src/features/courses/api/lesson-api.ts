import { Lesson } from "@/types/courses";
import { PagedResult } from "@/types/page-result";
import { coursesHttp } from "@/utils/http";
import axios from "axios";

// Get lessons with solution by course ID
export const getLessonsSolutionByCourseId = async (courseId: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<PagedResult<Lesson>>(`/lessons/all-with-solution-by-course/${courseId}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getLessonsSolutionByCourseId:", error);
        throw error;
    }
};

// Get lessons with solution by section ID
export const getLessonsSolutionBySectionId = async (courseId: string, sectionId: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Lesson[]>(`/lessons/all-with-solution-by-section/${sectionId}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getLessonsSolutionBySectionId:", error);
        throw error;
    }
};
//GET LESSONS BY SECTION ID
export const getLessonsBySectionId = async (
  sectionId: string,
  params?: { page?: number; size?: number },
  signal?: AbortSignal
) => {
  try {
    const response = await coursesHttp.get<PagedResult<Lesson>>(
      `/lessons/get-by-section/${sectionId}`,
      {
        params,
        signal,
      }
    );
    return response.data;
  } catch (error) {
    console.error("API Error in getLessonsBySectionId:", error);
    throw error;
  }
};
// Get all lessons with filters
export const getAllLessons = async (params?: {
    page?: number;
    size?: number;
    search?: string;
    courseId?: string;
    sectionId?: string;
    type?: number;
    requireRobot?: boolean;
}, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<PagedResult<Lesson>>('/lessons', {
            params,
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getAllLessons:", error);
        throw error;
    }
};

// Get lesson by ID
export const getLessonById = async (lessonId: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Lesson>(`/lessons/${lessonId}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getLessonById:", error);
        throw error;
    }
};

// Get lesson with solution by slug (for staff/admin)
export const getLessonBySlug = async (slug: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Lesson>(`/lessons/with-solution/slug/${slug}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getLessonBySlug:", error);
        throw error;
    }
};

// Presign upload for S3 (Admin/Staff)
export const presignLessonUpload = async (params: {
  filename: string;
  contentType?: string;
  folder?: string;
  expiresInSeconds?: number;
}, signal?: AbortSignal) => {
  try {
    const response = await coursesHttp.get<{
      key: string;
      uploadUrl: string;
      publicUrl: string;
      expiresInSeconds: number;
    }>(`/lessons/presign`, {
      params: {
        filename: params.filename,
        contentType: params.contentType || "video/mp4",
        folder: params.folder || "lessons",
        expiresInSeconds: params.expiresInSeconds || 900,
      },
      signal,
    });
    return response.data;
  } catch (error) {
    console.error("API Error in presignLessonUpload:", error);
    throw error;
  }
};

// Upload file to presigned URL (direct to S3)
export const uploadFileToPresignedUrl = async (
  uploadUrl: string,
  file: File,
  contentType?: string,
  onProgress?: (percent: number) => void,
  signal?: AbortSignal
) => {
  try {
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": contentType || file.type || "application/octet-stream",
      },
      onUploadProgress: (evt) => {
        if (!onProgress || !evt.total) return;
        const percent = Math.round((evt.loaded * 100) / evt.total);
        onProgress(percent);
      },
      signal,
    });
  } catch (error) {
    console.error("Upload error in uploadFileToPresignedUrl:", error);
    throw error;
  }
};

// Create new lesson (JSON body; video uploaded separately via presign)
export const createLesson = async (sectionId: string, data: {
    title: string;
    content: string;
    duration: number;
    requireRobot: boolean;
    type: number;
    solution?: object | null;
    videoUrl?: string | null;
}) => {
    try {
        const body = {
            title: data.title,
            content: data.content,
            duration: data.duration,
            requireRobot: data.requireRobot,
            sectionId: sectionId,
            type: data.type,
            solution: data.solution ?? null,
            videoUrl: data.videoUrl ?? null,
        };
        const response = await coursesHttp.post<Lesson>('/lessons', body);
        return response.data;
    } catch (error) {
        console.error("API Error in createLesson:", error);
        throw error;
    }
};

// Update lesson
// Update lesson (multipart/form-data)
export const updateLesson = async (
  lessonId: string,
  data: {
    id: string;
    title: string;
    content: string;
    videoUrl?: string | null;
    duration: number;
    requireRobot: boolean;
    type: number;
    orderNumber: number;
    sectionId?: string;
    solution?: object | null;
    status: number;
  }
) => {
  try {
    const body = {
      id: data.id,
      title: data.title,
      content: data.content,
      duration: data.duration,
      requireRobot: data.requireRobot,
      type: data.type,
      orderNumber: data.orderNumber,
      sectionId: data.sectionId || null,
      solution: data.solution ?? null,
      status: data.status,
      videoUrl: data.videoUrl ?? null,
    };
    const response = await coursesHttp.put<Lesson>(`/lessons/${lessonId}`, body);

    return response.data;
  } catch (error) {
    console.error("API Error in updateLesson:", error);
    throw error;
  }
};


// Delete lesson
export const deleteLesson = async (lessonId: string) => {
    try {
        const response = await coursesHttp.delete(`/lessons/${lessonId}`);
        return response.data;
    } catch (error) {
        console.error("API Error in deleteLesson:", error);
        throw error;
    }
};

// Update lesson order (reorder lessons within section or move between sections)
export const updateLessonOrder = async (
    sectionId: string, 
    lessons: Array<{ id: string; orderNumber: number; sectionId: string }>
) => {
    try {
        const response = await coursesHttp.put(`/lessons/${sectionId}/lessons/reorder`, { lessons });
        return response.data;
    } catch (error) {
        console.error("API Error in updateLessonOrder:", error);
        throw error;
    }
};
