"use client"

import { createColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { useQuery } from "@tanstack/react-query"
import { getPagedExtendedActions } from "@/features/activities/api/extended-action-api"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CreateExtendedActionModal } from "./extended-action-modal"
import { DeleteExtendedActionModal } from "./delete-extended-action-modal"
import { ViewExtendedActionModal } from "./view-extended-action-modal"
import { ExtendedAction } from "@/types/extended-action"
import { useExtendedActions } from "@/features/activities/hooks/use-extended-actions"
import { toast } from "sonner"
import LoadingGif from "@/components/ui/loading-gif"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import { getAllRobotModels } from "@/features/robots/api/robot-model-api"
import { RobotModel } from "@/types/robot-model"

function ExtendedActionPage() {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [robotModelId, setRobotModelId] = useState<string>("") // ✅ filter
  const [robotModels, setRobotModels] = useState<RobotModel[]>([])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editExtendedAction, setEditExtendedAction] = useState<ExtendedAction | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteExtendedAction, setDeleteExtendedAction] = useState<ExtendedAction | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewExtendedAction, setViewExtendedAction] = useState<ExtendedAction | null>(null)

  const { useDeleteExtendedAction } = useExtendedActions()
  const deleteExtendedActionMutation = useDeleteExtendedAction()

  // ✅ Lấy danh sách robot models cho dropdown
  useEffect(() => {
    const fetchRobotModels = async () => {
      try {
        const res = await getAllRobotModels()
        setRobotModels(res.data)
      } catch (err) {
        console.error("Failed to fetch robot models:", err)
      }
    }
    fetchRobotModels()
  }, [])

  // ✅ debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["extended-actions", page, size, debouncedSearchTerm, robotModelId],
    queryFn: async ({ queryKey }) => {
      const controller = new AbortController()
      setTimeout(() => controller.abort(), 10000)

      const [, currentPage, currentSize, search, modelId] = queryKey
      return await getPagedExtendedActions(
        currentPage as number,
        currentSize as number,
        search as string,
       modelId === "all" ? "" : (modelId as string),
        controller.signal
      )
    },
    retry: 2,
    retryDelay: 1000,
  })

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingGif size="lg" message="Đang tải danh sách hành động nâng cao..." />
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Lỗi tải dữ liệu hành động nâng cao</div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    )

  const extended_actions = data?.data || []

  const handleSizeChange = (newSize: number) => {
    setSize(newSize)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleAddExtendedAction = () => {
    setEditExtendedAction(null)
    setIsCreateModalOpen(true)
  }

  const handleEditExtendedAction = (action: ExtendedAction) => {
    setEditExtendedAction(action)
    setIsCreateModalOpen(true)
  }

  const handleViewExtendedAction = (action: ExtendedAction) => {
    setViewExtendedAction(action)
    setIsViewModalOpen(true)
  }

  const handleDeleteExtendedAction = (action: ExtendedAction) => {
    setDeleteExtendedAction(action)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteExtendedAction) return
    try {
      await deleteExtendedActionMutation.mutateAsync(deleteExtendedAction.id)
      toast.success("Xóa hành động nâng cao thành công!")
      setIsDeleteModalOpen(false)
      setDeleteExtendedAction(null)
    } catch {
      toast.error("Xóa thất bại, vui lòng thử lại.")
    }
  }

  const columns = createColumns(handleEditExtendedAction, handleDeleteExtendedAction, handleViewExtendedAction)

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Quản lý hành động nâng cao</h1>
          <Button onClick={handleAddExtendedAction} variant="outline">
            Thêm hành động nâng cao
          </Button>
        </div>

        {/* ✅ Dropdown filter Robot Model */}
        <div className="flex items-center gap-4">
          <Select value={robotModelId} onValueChange={setRobotModelId}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Lọc theo Robot Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả Robot Models</SelectItem>
              {robotModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        size={size}
        data={extended_actions}
        onSizeChange={handleSizeChange}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm hành động nâng cao..."
        pageCount={data?.total_pages || 0}
        page={page}
        onPageChange={handlePageChange}
        total={data?.total_count || 0}
      />

      <CreateExtendedActionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        editExtendedAction={editExtendedAction}
        mode={editExtendedAction ? "edit" : "create"}
      />

      <ViewExtendedActionModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        extended_actions={viewExtendedAction}
      />

      <DeleteExtendedActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        extended_action={deleteExtendedAction}
        isDeleting={deleteExtendedActionMutation.isPending}
      />
    </div>
  )
}

export default ExtendedActionPage
