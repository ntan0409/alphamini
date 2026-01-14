"use client"

import { createColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CreateAddonModal } from "./addon-modal"
import { DeleteAddonModal } from "./delete-subscription-modal"
import { ViewAddonModal } from "./view-addon-modal"
import { Addon } from "@/types/addon"
import { toast } from "sonner"
import LoadingGif from "@/components/ui/loading-gif"
import { useAddon } from "@/features/addon/hooks/use-addon"

export default function AddonsPage() {
  // ⚙️ Pagination + Search
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  // 🧩 Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editAddon, setEditAddon] = useState<Addon | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteAddon, setDeleteAddon] = useState<Addon | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewAddon, setViewAddon] = useState<Addon | null>(null)

  // 🧠 Hooks
  const { useGetNoneDeletedAddons, useDeleteAddon } = useAddon()
  const deleteAddonMutation = useDeleteAddon()

  // 🕒 Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // 📦 Fetch Addons
  const {
    data,
    isLoading,
    error,
    refetch
  } = useGetNoneDeletedAddons(page, size, debouncedSearchTerm)

  // 🧾 Data list
  const addons = data?.data || []

  // 🧩 Handlers
  const handleAddAddon = () => {
    setEditAddon(null)
    setIsCreateModalOpen(true)
  }

  const handleEditAddon = (addon: Addon) => {
    setEditAddon(addon)
    setIsCreateModalOpen(true)
  }

  const handleViewAddon = (addon: Addon) => {
    setViewAddon(addon)
    setIsViewModalOpen(true)
  }

  const handleDeleteAddon = (addon: Addon) => {
    setDeleteAddon(addon)
    setIsDeleteModalOpen(true)
  }

  // 🗑️ Xác nhận xóa addon
  const handleConfirmDelete = async () => {
    if (!deleteAddon) return
    try {
      await deleteAddonMutation.mutateAsync(deleteAddon.id)
      toast.success("Xóa addon thành công!")
      setIsDeleteModalOpen(false)
      setDeleteAddon(null)
      refetch()
    } catch (err) {
      console.error("Error deleting addon:", err)
      toast.error("Không thể xóa addon. Vui lòng thử lại!")
    }
  }

  // 🧱 Cột bảng
  const columns = createColumns(handleEditAddon, handleDeleteAddon, handleViewAddon)

  // 💡 Trạng thái tải dữ liệu
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingGif size="xl" />
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Lỗi khi tải danh sách Addon</div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    )

  // 🖥️ Render chính
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold">Quản lý Addon</h1>
        <Button onClick={handleAddAddon} variant="outline">
          + Thêm Addon
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={addons}
        size={size}
        onSizeChange={setSize}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm addon..."
        page={page}
        onPageChange={setPage}
        pageCount={data?.total_pages || 0}
        total={data?.total_count || 0}
      />

      <CreateAddonModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        editAddon={editAddon}
        mode={editAddon ? "edit" : "create"}
        onSuccess={() => refetch()}
      />

      <ViewAddonModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        addon={viewAddon}
      />

      <DeleteAddonModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        addon={deleteAddon}
      />
    </div>
  )
}
