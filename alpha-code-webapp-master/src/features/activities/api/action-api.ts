import { Action, ActionModal } from "@/types/action";
import { PagedResult } from "@/types/page-result";
import { activitiesHttp } from "@/utils/http";

export const getPagedActions = async (
  page: number,
  size: number,
  search?: string,
  signal?: AbortSignal,
  robotModelId?: string
) => {
  try {
    const response = await activitiesHttp.get<PagedResult<Action>>("/actions", {
      params: {
        page,
        size,
        search,
        robotModelId,
      },
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("API Error in getPagedActions:", error);
    throw error;
  }
};

export const createAction = async (actionData: ActionModal) => {
  const response = await activitiesHttp.post('/actions', actionData);
  return response.data;
};

export const updateAction = async (id: string, actionData: ActionModal) => {
  const response = await activitiesHttp.put(`/actions/${id}`, actionData);
  return response.data;
};

export const deleteAction = async (id: string) => {
  const response = await activitiesHttp.delete(`/actions/${id}`);
  return response.data;
};