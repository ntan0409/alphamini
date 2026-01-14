"use client"

import { createColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CreateSubscriptionModal } from "./subscription-modal"
import { DeleteSubscriptionModal } from "./delete-subscription-modal"
import { ViewSubscriptionModal } from "./view-subscription-modal"
import { SubscriptionPlan } from "@/types/subscription"
import { deleteSubscription, getPagedSubscriptions } from "@/features/subscription/api/subscription-api"
import { toast } from "sonner"
import LoadingGif from "@/components/ui/loading-gif"

export default function SubscriptionPlansPage() {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editPlan, setEditPlan] = useState<SubscriptionPlan | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletePlan, setDeletePlan] = useState<SubscriptionPlan | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewPlan, setViewPlan] = useState<SubscriptionPlan | null>(null)

  // ✅ Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // ✅ Fetch subscription plans
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["subscription-plans", page, size, debouncedSearchTerm],
    queryFn: async ({ queryKey }) => {
      const controller = new AbortController()
      setTimeout(() => controller.abort(), 10000)

      const [, currentPage, currentSize, search] = queryKey
      return await getPagedSubscriptions(
        currentPage as number,
        currentSize as number,
        search as string,
        controller.signal
      )
    },
    retry: 2,
    retryDelay: 1000,
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
          <div className="text-lg text-red-600 mb-4">Error loading subscriptions</div>
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

  const subscriptions = data?.data || []

  const handleSizeChange = (newSize: number) => {
    setSize(newSize)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => setPage(newPage)

  const handleAddSubscription = () => {
    setEditPlan(null)
    setIsCreateModalOpen(true)
  }

  const handleEditSubscription = (plan: SubscriptionPlan) => {
    setEditPlan(plan)
    setIsCreateModalOpen(true)
  }

  const handleViewSubscription = (plan: SubscriptionPlan) => {
    setViewPlan(plan)
    setIsViewModalOpen(true)
  }

  const handleDeleteSubscription = (plan: SubscriptionPlan) => {
    setDeletePlan(plan)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
  if (!deletePlan) return
  try {
    const res = await deleteSubscription(deletePlan.id)
    toast.success(res?.message || "Xóa gói đăng ký thành công!")
    
    // 🔄 Reload lại danh sách
    await refetch()

    // 🔒 Đóng modal
    setIsDeleteModalOpen(false)
    setDeletePlan(null)
 } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      toast.error(errorMessage || "Lỗi khi xóa gói đăng ký. Vui lòng thử lại.")
    }
}

  const columns = createColumns(handleEditSubscription, handleDeleteSubscription, handleViewSubscription)
  
  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h1 className="text-2xl font-bold">Quản lý gói đăng ký</h1>

          <div className="flex flex-wrap gap-3 items-center">
            <Button onClick={handleAddSubscription} variant="outline">
              Thêm gói đăng ký
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        size={size}
        data={subscriptions}
        onSizeChange={handleSizeChange}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm gói đăng ký..."
        pageCount={data?.total_pages || 0}
        page={page}
        onPageChange={handlePageChange}
        total={data?.total_count || 0}
      />

      {/* Modals */}
      <CreateSubscriptionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        editSubscription={editPlan}
        mode={editPlan ? "edit" : "create"}
      />
      <ViewSubscriptionModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        subscription={viewPlan}
      />
      <DeleteSubscriptionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        subscription={deletePlan}
      />
    </div>
  )
}
