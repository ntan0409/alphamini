import { Dance, DanceModal } from "@/types/dance";
import { PagedResult } from "@/types/page-result";
import { activitiesHttp } from "@/utils/http";

export const getPagedDances = async (
  page: number,
  size: number,
  search?: string,
  robotModelId?: string,
  signal?: AbortSignal,
) => {
  try {
    // Chỉ thêm param khi có giá trị (tránh gửi undefined lên server)
    const params: Record<string, string | number> = { page, size };

    if (search && search.trim() !== "") params.search = search.trim();
    if (robotModelId && robotModelId.trim() !== "") params.robotModelId = robotModelId.trim();

    const response = await activitiesHttp.get<PagedResult<Dance>>("/dances", {
      params,
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("❌ API Error in getPagedDances:", error);
    throw error;
  }
};

export const createDance = async (danceData: DanceModal) => {
  const response = await activitiesHttp.post('/dances', danceData);
  return response.data;
};

export const updateDance = async (id: string, danceData: DanceModal) => {
  const response = await activitiesHttp.put(`/dances/${id}`, danceData);
  return response.data;
};

export const deleteDance = async (id: string) => {
  const response = await activitiesHttp.delete(`/dances/${id}`);
  return response.data;
};
