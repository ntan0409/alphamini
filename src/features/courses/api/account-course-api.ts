import { AccountCourse } from '@/types/account-course';
import { PagedResult } from '@/types/page-result';
import { coursesHttp } from '@/utils/http';
import axios from 'axios';

// Get list of account courses by accountId
export const getAccountCoursesByAccount = async (
	accountId: string,
	page: number = 1,
	size: number = 10,
	search?: string,
	signal?: AbortSignal
) => {
	try {
		const response = await coursesHttp.get<PagedResult<AccountCourse>>(`/account-courses/by-account/${accountId}`, {
			params: {
				page,
				size,
				search,
			},
			signal,
		});
		return response.data;
	} catch (error) {
		if (axios.isCancel(error)) {
			console.log('Request canceled for getAccountCoursesByAccount');
			return null;
		}
		console.error('API Error in getAccountCoursesByAccount:', error);
		throw error;
	}
};
// Get account courses by courseId and accountId
export const getAccountCourseByCourseAndAccount = async (
	courseId: string,	
	accountId: string,
	signal?: AbortSignal
) => {
	try {
		const response = await coursesHttp.get<AccountCourse | null>(`/account-courses/get-by-account-and-course`, {
			params: {
				courseId,
				accountId,
			},
			signal,
		});
		return response.data;
	} catch (error) {
		console.error('API Error in getAccountCourseByCourseAndAccount:', error);
		throw error;
	}
}
// Get account course by id
export const getAccountCourseById = async (id: string, signal?: AbortSignal) => {
	try {
		const response = await coursesHttp.get<AccountCourse>(`/account-courses/${id}`, { signal });
		return response.data;
	} catch (error) {
		console.error('API Error in getAccountCourseById:', error);
		throw error;
	}
};

// Create a new account course (purchase / assign single course)
export const createAccountCourse = async (data: Partial<AccountCourse>) => {
	try {
		const response = await coursesHttp.post('/account-courses', data);
		return response.data;
	} catch (error) {
		console.error('API Error in createAccountCourse:', error);
		throw error;
	}
};

// Create account courses from bundle
export const createAccountCoursesFromBundle = async (data: unknown) => {
	try {
		const response = await coursesHttp.post('/account-courses/from-bundle', data);
		return response.data;
	} catch (error) {
		console.error('API Error in createAccountCoursesFromBundle:', error);
		throw error;
	}
};

// Delete account course
export const deleteAccountCourse = async (id: string) => {
	try {
		const response = await coursesHttp.delete(`/account-courses/${id}`);
		return response.data;
	} catch (error) {
		console.error('API Error in deleteAccountCourse:', error);
		throw error;
	}
};

// Get learning dashboard for account
export const getLearningDashboard = async (accountId: string, signal?: AbortSignal) => {
	try {
		const response = await coursesHttp.get(`/account-courses/learning-dashboard/${accountId}`, { signal });
		return response.data;
	} catch (error) {
		console.error('API Error in getLearningDashboard:', error);
		throw error;
	}
};

