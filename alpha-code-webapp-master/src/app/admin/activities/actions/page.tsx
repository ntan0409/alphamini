"use client"

import { createColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { useQuery } from "@tanstack/react-query"
import { getPagedActions } from "@/features/activities/api/action-api"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CreateActionModal } from "@/app/admin/activities/actions/action-modal"
import { DeleteActionModal } from "@/app/admin/activities/actions/delete-action-modal"
import { ViewActionModal } from "@/app/admin/activities/actions/view-action-modal"
import { Action } from "@/types/action"
import { useAction } from "@/features/activities/hooks/use-action"
import { toast } from "sonner"
import LoadingGif from "@/components/ui/loading-gif"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { getAllRobotModels } from "@/features/robots/api/robot-model-api"

export default function ActionsPage() {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editAction, setEditAction] = useState<Action | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteAction, setDeleteAction] = useState<Action | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewAction, setViewAction] = useState<Action | null>(null)
  const [robotModelId, setRobotModelId] = useState<string>("")

  const { useDeleteAction } = useAction()
  const deleteActionMutation = useDeleteAction()

  // ✅ Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // ✅ Reset về trang 1 khi đổi robot model filter
  useEffect(() => {
    setPage(1)
  }, [robotModelId])

  // ✅ Fetch actions
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["actions", page, size, debouncedSearchTerm, robotModelId],
    queryFn: async ({ queryKey }) => {
      const controller = new AbortController()
      setTimeout(() => controller.abort(), 10000)

      const [, currentPage, currentSize, search, modelId] = queryKey

      try {
        return await getPagedActions(
          currentPage as number,
          currentSize as number,
          search as string,
          controller.signal,
          modelId as string
        )
      } catch (error) {
        console.error("Failed to fetch actions:", error)
      }
    },
    retry: 2,
    retryDelay: 1000,
  })

  // ✅ Fetch danh sách robot models
  const { data: robotModels } = useQuery({
    queryKey: ["robot-models"],
    queryFn: getAllRobotModels,
  })

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
          <div className="text-lg text-red-600 mb-4">Lỗi tải danh sách hành động</div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  const actions = data?.data || []

  const handleSizeChange = (newSize: number) => {
    setSize(newSize)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => setPage(newPage)
  const handleAddAction = () => {
    setEditAction(null)
    setIsCreateModalOpen(true)
  }

  const handleEditAction = (action: Action) => {
    setEditAction(action)
    setIsCreateModalOpen(true)
  }

  const handleViewAction = (action: Action) => {
    setViewAction(action)
    setIsViewModalOpen(true)
  }

  const handleDeleteAction = (action: Action) => {
    setDeleteAction(action)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteAction) return
    try {
      await deleteActionMutation.mutateAsync(deleteAction.id)
      toast.success("Đã xóa hành động thành công!")
      setIsDeleteModalOpen(false)
      setDeleteAction(null)
    } catch (error) {
      console.error("Error deleting action:", error)
      toast.error("Không thể xóa hành động. Vui lòng thử lại.")
    }
  }

  const columns = createColumns(handleEditAction, handleDeleteAction, handleViewAction)

  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h1 className="text-2xl font-bold">Quản lý hành động</h1>

          <div className="flex flex-wrap gap-3 items-center">
            {/* ✅ Dropdown lọc robot model */}
            <Select
              value={robotModelId || "all"}
              onValueChange={(value) => {
                setRobotModelId(value === "all" ? "" : value);
              }}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Lọc theo Robot Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả model</SelectItem>
                {robotModels?.data?.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleAddAction} variant="outline">
              Thêm hành động
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        size={size}
        data={actions}
        onSizeChange={handleSizeChange}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm hành động..."
        pageCount={data?.total_pages || 0}
        page={page}
        onPageChange={handlePageChange}
        total={data?.total_count || 0}
      />

      {/* Modals */}
      <CreateActionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        editAction={editAction}
        mode={editAction ? "edit" : "create"}
      />
      <ViewActionModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        action={viewAction}
      />
      <DeleteActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        action={deleteAction}
        isDeleting={deleteActionMutation.isPending}
      />
    </div>
  )
}
