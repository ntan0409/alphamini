import { Section } from "@/types/courses";
import { PagedResult } from "@/types/page-result";
import { coursesHttp } from "@/utils/http";

// Get all sections by course ID
export const getSectionsByCourseId = async (courseId: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Section[]>(`/sections/courses/${courseId}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getSectionsByCourseId:", error);
        throw error;
    }
};

// Get section by ID
export const getSectionById = async (courseId: string, sectionId: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Section>(`/courses/${courseId}/sections/${sectionId}`, {
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getSectionById:", error);
        throw error;
    }
};

// Create new section
export const createSection = async (
    courseId: string,
    data: { title: string }
) => {
    try {
        const response = await coursesHttp.post<Section>(`/sections`, {
            ...data,
            courseId, // ✅ thêm courseId theo đúng DTO
        });
        return response.data;
    } catch (error) {
        console.error("API Error in createSection:", error);
        throw error;
    }
};


// Update section
export const updateSection = async (sectionId: string, data: {
    title: string;
    orderNumber: number;
}) => {
    try {
        const response = await coursesHttp.put<Section>(`/sections/${sectionId}`, data);
        return response.data;
    } catch (error) {
        console.error("API Error in updateSection:", error);
        throw error;
    }
};

// Delete section
export const deleteSection = async (sectionId: string) => {
    try {
        const response = await coursesHttp.delete(`/sections/${sectionId}`);
        return response.data;
    } catch (error) {
        console.error("API Error in deleteSection:", error);
        throw error;
    }
};

// Update section order (reorder sections)
export const updateSectionOrder = async (courseId: string, sections: Array<{ id: string; orderNumber: number }>) => {
    try {
        const response = await coursesHttp.put(`/sections/${courseId}/sections/reorder`, { sections });
        return response.data;
    } catch (error) {
        console.error("API Error in updateSectionOrder:", error);
        throw error;
    }
};

//Get setion with accountId and courseId
export const getSectionByAccountIdAndCourseId = async (courseId: string, accountId: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Section[]>(`/sections/with-account-lessons`, {
            params: {
                courseId,
                accountId,
            },
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getSectionByAccountIdAndCourseId:", error);
        throw error;
    }
};

//Get section with accountId and courseSlug
export const getSectionByAccountIdAndCourseSlug = async (slug: string, accountId: string, signal?: AbortSignal) => {
    try {
        const response = await coursesHttp.get<Section[]>(`/sections/with-account-lessons/by-slug`, {
            params: {
                slug,
                accountId,
            },
            signal
        });
        return response.data;
    } catch (error) {
        console.error("API Error in getSectionByAccountIdAndCourseSlug:", error);
        throw error;
    }
};