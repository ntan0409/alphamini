import { PagedResult } from "@/types/page-result";
import { ExtendedAction, ExtendedActionResponse } from "@/types/extended-action";
import { activitiesHttp } from "@/utils/http";

export const getAllExtendedActions = async () => {
  try {
    const response = await activitiesHttp.get<ExtendedActionResponse>("/extended-actions");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Sửa: thêm robotModelId vào params để hỗ trợ filter
export const getPagedExtendedActions = async (
  page: number,
  size: number,
  search?: string,
  robotModelId?: string,
  signal?: AbortSignal
) => {
  try {
    const response = await activitiesHttp.get<ExtendedActionResponse>("/extended-actions", {
      params: {
        page,
        size,
        search,
        robotModelId, // ✅ thêm dòng này
      },
      signal,
    });
    return response.data;
  } catch (error) {
    console.error("API Error in getPagedExtendedActions:", error);
    throw error;
  }
};

export const getExtendedActionById = async (id: string) => {
  const response = await activitiesHttp.get<ExtendedAction>(`/extended-actions/${id}`);
  return response.data;
};

export const getExtendedActionByCode = async (code: string) => {
  const response = await activitiesHttp.get<ExtendedAction>(`/extended-actions/code/${code}`);
  return response.data;
};

export const getExtendedActionByName = async (name: string) => {
  const response = await activitiesHttp.get<ExtendedAction>(`/extended-actions/name/${name}`);
  return response.data;
};

export const getExtendedActionsByRobotModel = async (robotModelId: string) => {
  const response = await activitiesHttp.get<ExtendedActionResponse>(
    `/extended-actions/robot-model`,
    { params: { robotModelId } }
  );
  return response.data;
};

export const createExtendedAction = async (
  actionData: Omit<ExtendedAction, "id" | "createdDate" | "lastUpdate" | "status" | "statusText">
) => {
  const response = await activitiesHttp.post("/extended-actions", actionData);
  return response.data;
};

export const updateExtendedAction = async (
  id: string,
  actionData: Partial<Omit<ExtendedAction, "id" | "createdDate" | "lastUpdate">>
) => {
  const response = await activitiesHttp.put(`/extended-actions/${id}`, actionData);
  return response.data;
};

export const patchExtendedAction = async (
  id: string,
  actionData: Partial<Omit<ExtendedAction, "id" | "createdDate" | "lastUpdate">>
) => {
  const response = await activitiesHttp.patch(`/extended-actions/${id}`, actionData);
  return response.data;
};

export const deleteExtendedAction = async (id: string) => {
  const response = await activitiesHttp.delete(`/extended-actions/${id}`);
  return response.data;
};

export const changeExtendedActionStatus = async (id: string, status: number) => {
  const response = await activitiesHttp.patch(`/extended-actions/${id}/change-status`, { status });
  return response.data;
};
