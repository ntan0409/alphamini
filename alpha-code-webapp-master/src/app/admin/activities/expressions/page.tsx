"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

import { createColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import LoadingGif from "@/components/ui/loading-gif"
import { Button } from "@/components/ui/button"

import { getPagedExpressions } from "@/features/activities/api/expression-api"
import { getAllRobotModels } from "@/features/robots/api/robot-model-api"
import { useExpression } from "@/features/activities/hooks/use-expression"

import { CreateExpressionModal } from "@/app/admin/activities/expressions/expression-modal"
import { DeleteExpressionModal } from "@/app/admin/activities/expressions/delete-expression-modal"
import { ViewExpressionModal } from "@/app/admin/activities/expressions/view-expression-modal"

import { Expression } from "@/types/expression"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

function ExpressionsPage() {
  // -------------------- STATE --------------------
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [robotModelId, setRobotModelId] = useState<string>("")

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editExpression, setEditExpression] = useState<Expression | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteExpression, setDeleteExpression] = useState<Expression | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewExpression, setViewExpression] = useState<Expression | null>(null)

  const { useDeleteExpression } = useExpression()
  const deleteExpressionMutation = useDeleteExpression()

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

  // -------------------- FETCH EXPRESSIONS --------------------
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["expressions", page, size, debouncedSearchTerm, robotModelId],
    queryFn: async ({ queryKey }) => {
      const [, currentPage, currentSize, search, modelId] = queryKey
      const controller = new AbortController()
      setTimeout(() => controller.abort(), 10000)
      return await getPagedExpressions(
        currentPage as number,
        currentSize as number,
        search as string,
        modelId as string,
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
        <LoadingGif size="lg" message="Đang tải biểu cảm..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Lỗi tải dữ liệu biểu cảm</div>
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

  const expressions = data?.data || []

  // -------------------- COLUMNS --------------------
  const columns = createColumns(
    (expression) => {
      setEditExpression(expression)
      setIsCreateModalOpen(true)
    },
    (expression) => {
      setDeleteExpression(expression)
      setIsDeleteModalOpen(true)
    },
    (expression) => {
      setViewExpression(expression)
      setIsViewModalOpen(true)
    }
  )

  // -------------------- RENDER --------------------
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Quản lý biểu cảm</h1>
          <Button
            onClick={() => {
              setEditExpression(null)
              setIsCreateModalOpen(true)
            }}
            variant="outline"
          >
            Thêm biểu cảm
          </Button>
        </div>

        {/* Filter Robot Model */}
        <div className="flex flex-wrap gap-3 items-center mb-4">
          <Select
            value={robotModelId || "all"}
            onValueChange={(value) => setRobotModelId(value === "all" ? "" : value)}
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
      </div>

      <DataTable
        columns={columns}
        data={expressions}
        size={size}
        onSizeChange={(newSize) => {
          setSize(newSize)
          setPage(1)
        }}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm biểu cảm..."
        pageCount={data?.total_pages || 0}
        page={page}
        onPageChange={setPage}
        total={data?.total_count || 0}
      />

      {/* Modals */}
      <CreateExpressionModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setEditExpression(null)
        }}
        editExpression={editExpression}
        mode={editExpression ? "edit" : "create"}
      />

      <ViewExpressionModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setViewExpression(null)
        }}
        expression={viewExpression}
      />

      <DeleteExpressionModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setDeleteExpression(null)
        }}
        onConfirm={async () => {
          if (!deleteExpression) return
          try {
            await deleteExpressionMutation.mutateAsync(deleteExpression.id)
            toast.success("Xóa thành công!")
            setIsDeleteModalOpen(false)
            setDeleteExpression(null)
            refetch()
          } catch {
            toast.error("Xóa thất bại. Vui lòng thử lại.")
          }
        }}
        expression={deleteExpression}
        isDeleting={deleteExpressionMutation.isPending}
      />
    </div>
  )
}

export default ExpressionsPage
