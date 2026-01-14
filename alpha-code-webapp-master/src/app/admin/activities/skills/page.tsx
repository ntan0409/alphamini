"use client"

import { createColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CreateSkillModal } from "@/app/admin/activities/skills/skill-modal"
import { DeleteSkillModal } from "@/app/admin/activities/skills/delete-skill-modal"
import { ViewSkillModal } from "@/app/admin/activities/skills/view-skill-modal"
import { Skill } from "@/types/skill"
import { useSkill } from "@/features/activities/hooks/use-skill"
import { RobotModel } from "@/types/robot-model"
import { useRobotModel } from "@/features/robots/hooks/use-robot-model"
import { toast } from "sonner"
import LoadingGif from "@/components/ui/loading-gif"

export default function SkillsPage() {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editSkill, setEditSkill] = useState<Skill | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteSkill, setDeleteSkill] = useState<Skill | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewSkill, setViewSkill] = useState<Skill | null>(null)

  // ✅ Thêm filter theo robot model
  const [selectedRobotModelId, setSelectedRobotModelId] = useState<string | undefined>(undefined)

  // 🧠 Hooks
  const { useDeleteSkill, useGetPagedSkills } = useSkill()
  const { useGetAllRobotModels } = useRobotModel()

  const deleteSkillMutation = useDeleteSkill()
  const { data: robotModelsData } = useGetAllRobotModels()
  const robotModels = robotModelsData?.data || []

  // ✅ Gọi API lấy danh sách skill có filter robotModel
  const { data, isLoading, error, refetch } = useGetPagedSkills(
    page,
    size,
    debouncedSearchTerm,
    selectedRobotModelId
  )

  const skills = data?.data || []

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingGif size="xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Error loading skills</div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const handleSizeChange = (newSize: number) => {
    setSize(newSize)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleAddSkill = () => {
    setEditSkill(null)
    setIsCreateModalOpen(true)
  }

  const handleEditSkill = (skill: Skill) => {
    setEditSkill(skill)
    setIsCreateModalOpen(true)
  }

  const handleViewSkill = (skill: Skill) => {
    setViewSkill(skill)
    setIsViewModalOpen(true)
  }

  const handleDeleteSkill = (skill: Skill) => {
    setDeleteSkill(skill)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteSkill) return
    try {
      await deleteSkillMutation.mutateAsync(deleteSkill.id)
      toast.success("Skill deleted successfully!")
      setIsDeleteModalOpen(false)
      setDeleteSkill(null)
      refetch()
    } catch (error) {
      console.error("Error deleting skill:", error)
      toast.error("Failed to delete skill. Please try again.")
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeleteSkill(null)
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setViewSkill(null)
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    setEditSkill(null)
  }

  const columns = createColumns(handleEditSkill, handleDeleteSkill, handleViewSkill)

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        {/* ✅ Header có filter robot model */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Quản lý kỹ năng</h1>
          <div className="flex items-center gap-2">
            <select
              className="border border-gray-300 rounded-md p-2"
              value={selectedRobotModelId || ""}
              onChange={(e) => {
                setSelectedRobotModelId(e.target.value || undefined)
                setPage(1)
              }}
            >
              <option value="">Tất cả Robot Models</option>
              {robotModels.map((model: RobotModel) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>

            <Button onClick={handleAddSkill} variant="outline">
              Thêm kỹ năng
            </Button>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        size={size}
        data={skills}
        onSizeChange={handleSizeChange}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm kỹ năng..."
        pageCount={data?.total_pages || 0}
        page={page}
        onPageChange={handlePageChange}
        total={data?.total_count || 0}
      />

      <CreateSkillModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        editSkill={editSkill}
        mode={editSkill ? "edit" : "create"}
      />

      <ViewSkillModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        skill={viewSkill}
      />

      <DeleteSkillModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        skill={deleteSkill}
        isDeleting={deleteSkillMutation.isPending}
      />
    </div>
  )
}
