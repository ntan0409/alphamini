import { Activity, ActivitiesResponse } from '@/types/activities';
import { activitiesHttp } from '@/utils/http';
import { PagedResult } from '@/types/page-result';

export const getAllActivities = async () => {
  try {
    const response = await activitiesHttp.get<PagedResult<Activity>>('/activities');
    return response.data;
  } catch (error) {
    console.error('Error fetching all activities:', error);
    throw error;
  }
};

export const getPagedActivitiesByAccount = async (
  page: number,
  size: number,
  accountId: string,
  search?: string,
  signal?: AbortSignal,
  robotModelId?: string
) => {
  try {
    const response = await activitiesHttp.get<ActivitiesResponse>('/activities/account', {
      params: {
        page,
        size,
        search,
        modelId: robotModelId, // 👈 thêm dòng này
        accountId // 👈 thêm dòng này
      },
      signal,
    });

    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object') {
      const errorObj = error as { name?: string; code?: string };
      if (errorObj.name === 'CanceledError' || errorObj.code === 'ERR_CANCELED') {
        console.log('API Call canceled');
        return Promise.reject(error);
      }
    }
    console.error('Error fetching paged activities:', error);
    throw error;
  }
};

export const getActivityById = async (id: string) => {
    const response = await activitiesHttp.get<Activity>(`/activities/${id}`);
    return response.data;
};

export const createActivity = async (activityData: Omit<Activity, 'id' | 'createdDate' | 'lastUpdated'>) => {
  try {
    const response = await activitiesHttp.post('/activities', activityData);
    return response.data;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};

export const updateActivity = async (id: string, activityData: Partial<Omit<Activity, 'id' | 'createdDate' | 'lastUpdated'>>) => {
    const response = await activitiesHttp.patch(`/activities/${id}`, activityData);
    return response.data;
};

export const deleteActivity = async (id: string) => {
    const response = await activitiesHttp.delete(`/activities/${id}`);
    return response.data;
};