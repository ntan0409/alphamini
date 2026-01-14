import {
  getAllSkills,
  createSkill,
  getSkillByCode,
  getSkillByName,
  getSkillsByRobotModel,
  getSkillById,
  patchSkill,
  updateSkill,
  deleteSkill,
  changeSkillStatus
} from "@/features/activities/api/skill-api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Skill, SkillResponse } from "@/types/skill"


export const useSkill = () => {
  // 🔹 Lấy tất cả skills (phân trang + lọc)
  const useGetAllSkills = (page?: number, size?: number, search?: string, robotModelId?: string) => {
    return useQuery<SkillResponse>({
      queryKey: ["skills", page, size, search],
      queryFn: () =>
        getAllSkills({
          page,
          size,
          search,
          robotModelId,
        }),
      staleTime: 1000 * 60 * 5,
    })
  }

  // 🔹 Lấy skill theo trang (có hỗ trợ filter robot model)
  const useGetPagedSkills = (page: number, size: number, search?: string, robotModelId?: string) => {
    return useQuery<SkillResponse>({
      queryKey: ["skills", "paged", page, size, search || '', robotModelId || ''],
      queryFn: () =>
        getAllSkills({
          page,
          size,
          search,
          robotModelId, // ✅ thêm param này
        }),
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: true,
    })
  }

  // 🔹 Lấy skill theo code
  const useGetSkillByCode = (code: string) => {
    return useQuery<Skill>({
      queryKey: ["skills", "code", code],
      queryFn: () => getSkillByCode(code),
      enabled: !!code,
      staleTime: 1000 * 60 * 5,
    })
  }

  // 🔹 Lấy skill theo name
  const useGetSkillByName = (name: string) => {
    return useQuery<Skill>({
      queryKey: ["skills", "name", name],
      queryFn: () => getSkillByName(name),
      enabled: !!name,
      staleTime: 1000 * 60 * 5,
    })
  }

  // 🔹 Lấy skill theo robot model
  const useGetSkillsByRobotModel = (robotModelId: string, page?: number, size?: number) => {
    return useQuery<SkillResponse>({
      queryKey: ["skills", "robot-model", robotModelId, page, size],
      queryFn: () => getSkillsByRobotModel(robotModelId, page, size),
      enabled: !!robotModelId,
      staleTime: 1000 * 60 * 5,
    })
  }

  // 🔹 Lấy skill theo ID
  const useGetSkillById = (id: string) => {
    return useQuery<Skill>({
      queryKey: ["skills", id],
      queryFn: () => getSkillById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    })
  }

  // 🔹 Tạo skill mới
  const useCreateSkill = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: createSkill,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["skills"] })
      },
    })
  }

  // 🔹 Cập nhật skill
  const useUpdateSkill = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, skillData }: { id: string; skillData: Omit<Skill, "id" | "createdDate" | "lastUpdate"> }) =>
        updateSkill(id, skillData),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["skills"] })
        queryClient.invalidateQueries({ queryKey: ["skills", variables.id] })
      },
    })
  }

  // 🔹 Patch skill
  const usePatchSkill = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, skillData }: { id: string; skillData: Partial<Omit<Skill, "id" | "createdDate" | "lastUpdate">> }) =>
        patchSkill(id, skillData),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["skills"] })
        queryClient.invalidateQueries({ queryKey: ["skills", variables.id] })
      },
    })
  }

  // 🔹 Xóa skill
  const useDeleteSkill = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: deleteSkill,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["skills"] })
      },
    })
  }

  // 🔹 Đổi trạng thái skill
  const useChangeSkillStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, status }: { id: string; status: number }) => changeSkillStatus(id, status),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["skills"] })
        queryClient.invalidateQueries({ queryKey: ["skills", variables.id] })
      },
    })
  }

  return {
    // Queries
    useGetAllSkills,
    useGetPagedSkills,
    useGetSkillByCode,
    useGetSkillByName,
    useGetSkillsByRobotModel,
    useGetSkillById,

    // Mutations
    useCreateSkill,
    useUpdateSkill,
    usePatchSkill,
    useDeleteSkill,
    useChangeSkillStatus,
  }
}
