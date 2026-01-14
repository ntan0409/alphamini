"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { createColumns } from "./columns"
import { usePagedRobotApks } from "@/features/apks/hooks/use-robot-apk"
import { RobotApk } from "@/types/robot-apk"
import LoadingGif from "@/components/ui/loading-gif"
import { ApkModal } from "./apk-modal"
import { DeleteApkModal } from "./delete-apk-modal"

export default function AdminApksPage() {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editApk, setEditApk] = useState<RobotApk | null>(null)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteApk, setDeleteApk] = useState<RobotApk | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const { data, isLoading, error, refetch } = usePagedRobotApks(page, size, debouncedSearch)
  const apks = data?.data ?? []

  const columns = createColumns({
    onEdit: (apk) => {
      setEditApk(apk)
      setIsModalOpen(true)
    },
    onDelete: (apk) => {
      setDeleteApk(apk)
      setIsDeleteOpen(true)
    }
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 min-h-[calc(100vh-200px)] flex items-center justify-center">
        <LoadingGif />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="p-3 rounded border text-red-700 bg-red-50">
          Lỗi tải danh sách APK: {(error as Error).message}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Quản lý APK</h1>
        <Button
          onClick={() => {
            setEditApk(null)
            setIsModalOpen(true)
          }}
          variant="outline"
        >
          + Tải lên APK
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={apks}
        size={size}
        onSizeChange={setSize}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm kiếm theo phiên bản/mô tả..."
        page={page}
        onPageChange={setPage}
        pageCount={data?.total_pages || 0}
        total={data?.total_count || 0}
      />

      <ApkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editApk={editApk}
        onSuccess={() => {
          setIsModalOpen(false)
          refetch()
        }}
      />

      <DeleteApkModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        apk={deleteApk}
        onSuccess={() => {
          setIsDeleteOpen(false)
          refetch()
        }}
      />
    </div>
  )
}


