import { Category } from "@/types/courses";
import { PagedResult } from "@/types/page-result";
import { coursesHttp } from "@/utils/http";

// Get all active categories with pagination
export const getCategories = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<PagedResult<Category>>('/categories', {
            params: {
                page: page || 1,
                size,
                search
            },
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getCategories:", error);
        throw error;
    }
};

// Get all none delete categories with pagination
export const getNoneDeleteCategories = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<PagedResult<Category>>('/categories/none-delete', {
            params: {
                page,
                size,
                search
            },
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getCategories:", error);
        throw error;
    }
};

// Get category by ID
export const getCategoryById = async (id: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Category>(`/categories/${id}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getCategoryById:", error);
        throw error;
    }
};

// Get category by slug
export const getCategoryBySlug = async (slug: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Category>('/categories/get-by-slug/' + slug, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getCategoryBySlug:", error);
        throw error;
    }
};

// Create new category
export const createCategory = async (data: {
    name: string;
    description: string;
    image: File;
}) => {
    try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('image', data.image);

        const response = await coursesHttp.post<Category>('/categories', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("API Error in createCategory:", error);
        throw error;
    }
};

// Update category
export const updateCategory = async (id: string, data: FormData) => {
    try {
        const response = await coursesHttp.put<Category>(`/categories/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("API Error in updateCategory:", error);
        throw error;
    }
};

// Delete category
export const deleteCategory = async (id: string) => {
    try {
        const response = await coursesHttp.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error("API Error in deleteCategory:", error);
        throw error;
    }
};

// Get category statistics
export const getCategoryStats = async (signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<{
            totalCategories: number;
            activeCategories: number;
            totalCourses: number;
        }>('/categories/stats', {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getCategoryStats:", error);
        throw error;
    }
};
