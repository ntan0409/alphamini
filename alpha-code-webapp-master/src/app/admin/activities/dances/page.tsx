"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

import { createColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import LoadingGif from "@/components/ui/loading-gif"
import { Button } from "@/components/ui/button"

import { getPagedDances } from "@/features/activities/api/dance-api"
import { getAllRobotModels } from "@/features/robots/api/robot-model-api"
import { useDance } from "@/features/activities/hooks/use-dance"

import { CreateDanceModal } from "@/app/admin/activities/dances/dance-modal"
import { DeleteDanceModal } from "@/app/admin/activities/dances/delete-dance-modal"
import { ViewDanceModal } from "@/app/admin/activities/dances/view-dance-modal"

import { Dance } from "@/types/dance"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export default function DancesPage() {
  // -------------------- STATE --------------------
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [robotModelId, setRobotModelId] = useState<string>("")

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editDance, setEditDance] = useState<Dance | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteDance, setDeleteDance] = useState<Dance | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewDance, setViewDance] = useState<Dance | null>(null)

  const { useDeleteDance } = useDance()
  const deleteDanceMutation = useDeleteDance()

  // -------------------- DEBOUNCE SEARCH --------------------
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // -------------------- FETCH ROBOT MODELS --------------------
  const { data: robotModels } = useQuery({
    queryKey: ["robotModels"],
    queryFn: getAllRobotModels,
  })

  // -------------------- FETCH DANCES --------------------
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dances", page, size, debouncedSearchTerm, robotModelId],
    queryFn: async ({ queryKey }) => {
      const [, currentPage, currentSize, search, robotModelId] = queryKey
      const controller = new AbortController()
      setTimeout(() => controller.abort(), 10000)
      return await getPagedDances(
        currentPage as number,
        currentSize as number,
        search as string,
        robotModelId as string,
        controller.signal
      )
    },
    retry: 2,
    retryDelay: 1000,
  })

  // -------------------- LOADING & ERROR STATES --------------------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingGif size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Lỗi tải dữ liệu điệu nhảy</div>
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

  const dances = data?.data || []

  // -------------------- COLUMNS --------------------
  const columns = createColumns(
    (dance) => {
      setEditDance(dance)
      setIsCreateModalOpen(true)
    },
    (dance) => {
      setDeleteDance(dance)
      setIsDeleteModalOpen(true)
    },
    (dance) => {
      setViewDance(dance)
      setIsViewModalOpen(true)
    }
  )

  // -------------------- RENDER --------------------
  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Quản lý điệu nhảy</h1>
          <Button
            onClick={() => {
              setEditDance(null)
              setIsCreateModalOpen(true)
            }}
            variant="outline"
          >
            Thêm điệu nhảy
          </Button>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-3 items-center mb-4">
          {/* ✅ Dropdown lọc robot model */}
          <Select
            value={robotModelId || "all"}
            onValueChange={(value) => {
              setRobotModelId(value === "all" ? "" : value)
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
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={dances}
          size={size}
          onSizeChange={(newSize) => {
            setSize(newSize)
            setPage(1)
          }}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Tìm kiếm điệu nhảy..."
          pageCount={data?.total_pages || 0}
          page={page}
          onPageChange={setPage}
          total={data?.total_count || 0}
        />

        {/* Modals */}
        <CreateDanceModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false)
            setEditDance(null)
          }}
          editDance={editDance}
          mode={editDance ? "edit" : "create"}
        />
        <ViewDanceModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false)
            setViewDance(null)
          }}
          dance={viewDance}
        />
        <DeleteDanceModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setDeleteDance(null)
          }}
          onConfirm={async () => {
            if (!deleteDance) return
            try {
              await deleteDanceMutation.mutateAsync(deleteDance.id)
              toast.success("Xóa thành công!")
              setIsDeleteModalOpen(false)
              setDeleteDance(null)
              refetch()
            } catch {
              toast.error("Xóa thất bại. Vui lòng thử lại.")
            }
          }}
          dance={deleteDance}
          isDeleting={deleteDanceMutation.isPending}
        />
      </div>
    </div>
  )
}
