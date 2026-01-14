import { Course } from "@/types/courses";
import { PagedResult } from "@/types/page-result";
import { coursesHttp } from "@/utils/http";
import axios from "axios";

// Get courses by category
export const getCoursesByCategory = async (categoryId: string, page: number = 1, size: number = 10, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<PagedResult<Course>>(`/courses/none-delete/by-category/${categoryId}`, {
            params: {
                page,
                size
            },
            signal
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled for getCoursesByCategory");
            return null;
        }
        console.error("API Error in getCoursesByCategory:", error);
        throw error;
    }
}

// Get none delete courses with pagination
export const getNoneDeleteCourses = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<PagedResult<Course>>('/courses/none-delete', {
            params: {
                page,
                size,
                search
            },
            signal // Add AbortSignal support
        });
        // Handle different response structures
        return response.data;

    } catch (error) {
        // Ignore canceled errors - this is expected when component unmounts or navigation occurs
        if (axios.isCancel(error)) {
            console.log("Request canceled for getNoneDeleteCourses");
            return null;
        }
        console.error("API Error in getNoneDeleteCourses:", error);
        throw error;
    }
}

export const getCourses = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<PagedResult<Course>>('/courses', {
            params: {
                page,
                size,
                search
            },
            signal // Add AbortSignal support
        });
        // Handle different response structures
        return response.data;

    } catch (error) {
        // Ignore canceled errors - this is expected when component unmounts or navigation occurs
        if (axios.isCancel(error)) {
            console.log("Request canceled for getCourses");
            return null;
        }
        console.error("API Error in getAllActiveCourses:", error);
        throw error;
    }
};

export const getCourseBySlug = async (slug: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Course>('/courses/get-by-slug/' + slug, {
            signal // Add AbortSignal support
        });
        // Handle different response structures
        return response.data;

    } catch (error) {
        // Ignore canceled errors - this is expected when component unmounts or navigation occurs
        if (axios.isCancel(error)) {
            console.log("Request canceled for slug:", slug);
            throw error; // Throw to let React Query handle retry
        }
        console.error("API Error in getActiveCourseBySlug:", error);
        throw error;
    }
}


// Create new course
export const createCourse = async (data: FormData) => {
    try {
        const response = await coursesHttp.post<Course>('/courses', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("API Error in createCourse:", error);
        throw error;
    }
};

// Update course
export const updateCourse = async (id: string, data: {
    name: string;
    description: string;
    categoryId: string;
    level: number;
    price: number;
    image?: string | File;
    status?: number;
    requireLicense: boolean;
}) => {
    try {
        // Always use FormData for update
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('categoryId', data.categoryId);
        formData.append('level', data.level.toString());
        formData.append('price', data.price.toString());
        formData.append('requireLicense', data.requireLicense.toString());
        
        // Handle image - either File or URL string
        if (data.image instanceof File) {
            formData.append('image', data.image);
        } else if (data.image && typeof data.image === 'string') {
            formData.append('imageUrl', data.image);
        }
        
        if (data.status !== undefined) {
            formData.append('status', data.status.toString());
        }
        
        const response = await coursesHttp.put<Course>(`/courses/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("API Error in updateCourse:", error);
        throw error;
    }
};

// Delete course
export const deleteCourse = async (id: string) => {
    try {
        const response = await coursesHttp.delete(`/courses/${id}`);
        return response.data;
    } catch (error) {
        console.error("API Error in deleteCourse:", error);
        throw error;
    }
};

// Get course by ID (for editing)
export const getCourseById = async (id: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Course>(`/courses/${id}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getCourseById:", error);
        throw error;
    }
};

// Get dashboard statistics for staff
export const getStaffDashboardStats = async (signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<{
            totalCategories: number;
            totalCourses: number;
            totalSections: number;
            totalLessons: number;
        }>('courses/dashboard/stats', {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getStaffDashboardStats:", error);
        throw error;
    }
};

// Get all cost active courses with pagination and optional search filter
export const getCostCourses = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<PagedResult<Course>>('/courses/cost', {
            params: {
                page,
                size,
                search
            },
            signal
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled for getCostCourses");
            return null;
        }
        console.error("API Error in getCostCourses:", error);
        throw error;
    }
};

// Get all free active courses with pagination and optional search filter
export const getFreeCourses = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<PagedResult<Course>>('/courses/free', {
            params: {
                page,
                size,
                search
            },
            signal
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled for getFreeCourses");
            return null;
        }
        console.error("API Error in getFreeCourses:", error);
        throw error;
    }
};
