import { Skill, SkillResponse } from "@/types/skill"
import { activitiesHttp } from "@/utils/http"

// ✅ Kiểu dữ liệu cho query params (để tránh dùng any)
interface SkillQueryParams {
  page?: number
  size?: number
  search?: string
  robotModelId?: string
  signal?: AbortSignal
}

// ✅ GET /api/v1/skills
export const getAllSkills = async ({
  page,
  size,
  search,
  robotModelId,
  signal,
}: SkillQueryParams): Promise<SkillResponse> => {
  const params: Record<string, unknown> = {}

  if (page !== undefined) params.page = page
  if (size !== undefined) params.size = size
  if (search) params.search = search
  if (robotModelId) params.robotModelId = robotModelId

  const response = await activitiesHttp.get<SkillResponse>("/skills", { params, signal })
  return response.data
}

// ✅ POST /api/v1/skills
export const createSkill = async (
  skillData: Omit<Skill, "id" | "createdDate" | "lastUpdate" | "status" | "statusText">
): Promise<Skill> => {
  const response = await activitiesHttp.post<Skill>("/skills", skillData)
  return response.data
}

// ✅ GET /api/v1/skills/code/{code}
export const getSkillByCode = async (code: string): Promise<Skill> => {
  const response = await activitiesHttp.get<Skill>(`/skills/code/${code}`)
  return response.data
}

// ✅ GET /api/v1/skills/name/{name}
export const getSkillByName = async (name: string): Promise<Skill> => {
  const response = await activitiesHttp.get<Skill>(`/skills/name/${name}`)
  return response.data
}

// ✅ GET /api/v1/skills/robot-model
export const getSkillsByRobotModel = async (
  robotModelId: string,
  page?: number,
  size?: number,
  signal?: AbortSignal
): Promise<SkillResponse> => {
  const params: Record<string, unknown> = { robotModelId }
  if (page !== undefined) params.page = page
  if (size !== undefined) params.size = size

  const response = await activitiesHttp.get<SkillResponse>("/skills/robot-model", {
    params,
    signal,
  })
  return response.data
}

// ✅ GET /api/v1/skills/{id}
export const getSkillById = async (id: string): Promise<Skill> => {
  const response = await activitiesHttp.get<Skill>(`/skills/${id}`)
  return response.data
}

// ✅ PATCH /api/v1/skills/{id}
export const patchSkill = async (
  id: string,
  skillData: Partial<Omit<Skill, "id" | "createdDate" | "lastUpdate">>
): Promise<Skill> => {
  const response = await activitiesHttp.patch<Skill>(`/skills/${id}`, skillData)
  return response.data
}

// ✅ PUT /api/v1/skills/{id}
export const updateSkill = async (
  id: string,
  skillData: Omit<Skill, "id" | "createdDate" | "lastUpdate">
): Promise<Skill> => {
  const response = await activitiesHttp.put<Skill>(`/skills/${id}`, skillData)
  return response.data
}

// ✅ DELETE /api/v1/skills/{id}
export const deleteSkill = async (id: string): Promise<void> => {
  await activitiesHttp.delete(`/skills/${id}`)
}

// ✅ PATCH /api/v1/skills/{id}/change-status
export const changeSkillStatus = async (id: string, status: number): Promise<Skill> => {
  const response = await activitiesHttp.patch<Skill>(`/skills/${id}/change-status`, { status })
  return response.data
}
