"use client"

import { Addon } from "@/types/addon"
import { ColumnDef, Column } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"

// ===== Helper format =====
const formatPrice = (price: number) =>
  price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })

const formatCategory = (category: number) => {
  switch (category) {
    case 0:
      return "Không xác định"
    case 1:
      return "Osmo"
    case 2:
      return "Qr Code"
    case 3:
      return "Nhà thông minh"
    case 4:
      return "Lập trình Blockly"
    case 5:
      return "Phép thuật tranh vẽ"
    default:
      return "Khác"
  }
}

// ===== Header cells =====
const IdHeaderCell = () => (
  <span className="flex items-center gap-1 text-gray-700 font-semibold">ID</span>
)

const NameHeaderCell = ({ column }: { column: Column<Addon, unknown> }) => (
  <span className="flex items-center gap-1 text-purple-700 font-semibold">
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="p-0 h-auto min-w-0 font-semibold"
    >
      Tên Addon
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  </span>
)

const DescriptionHeaderCell = () => (
  <span className="flex items-center gap-1 text-yellow-700 font-semibold">
    Mô tả
  </span>
)

const PriceHeaderCell = () => (
  <span className="flex items-center gap-1 text-blue-700 font-semibold">Giá</span>
)

const CategoryHeaderCell = () => (
  <span className="flex items-center gap-1 text-indigo-700 font-semibold">
    Phân loại
  </span>
)

const StatusHeaderCell = () => (
  <span className="flex items-center gap-1 text-green-700 font-semibold">Trạng thái</span>
)

// ===== Cells =====
const DescriptionCell = ({ description }: { description?: string }) => (
  <div className="max-w-xs">
    <p className="text-sm text-gray-700 line-clamp-5 whitespace-normal break-words">
      {description || "Không có dữ liệu"}
    </p>
  </div>
)

const PriceCell = ({ price }: { price: number }) => (
  <span className="text-blue-700 font-medium">{formatPrice(price)}</span>
)

const CategoryCell = ({ category }: { category: number }) => (
  <span className="text-indigo-600 font-medium">{formatCategory(category)}</span>
)

const StatusCell = ({ status }: { status: number }) => {
  let color = "bg-gray-200 text-gray-700"
  let text = "Không xác định"
  let icon = null

  if (status === 1) {
    color = "bg-green-100 text-green-700"
    text = "Kích hoạt"
    icon = <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
  } else if (status === 0) {
    color = "bg-red-100 text-red-700"
    text = "Không kích hoạt"
    icon = <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded ${color} font-semibold text-xs`}>
      {icon}
      {text}
    </span>
  )
}

const ActionCell = ({
  addon,
  onEdit,
  onDelete,
  onView,
}: {
  addon: Addon
  onEdit?: (addon: Addon) => void
  onDelete?: (addon: Addon) => void
  onView?: (addon: Addon) => void
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Thao tác</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(addon.id)}>
        Sao chép ID
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onView?.(addon)}>
        <Eye className="mr-2 h-4 w-4" />
        Xem chi tiết
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onEdit?.(addon)}>
        <Edit className="mr-2 h-4 w-4" />
        Chỉnh sửa
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => onDelete?.(addon)}
        className="text-red-600 focus:text-red-600"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Xóa
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

// ===== Column definition =====
export const createColumns = (
  onEdit?: (addon: Addon) => void,
  onDelete?: (addon: Addon) => void,
  onView?: (addon: Addon) => void
): ColumnDef<Addon>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: () => <IdHeaderCell />,
      cell: ({ row }) => (
        <span className="text-gray-700 font-semibold">
          {row.original.id.substring(0, 8)}...
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => <NameHeaderCell column={column} />,
      cell: ({ row }) => (
        <span className="text-purple-700 font-semibold">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "description",
      header: () => <DescriptionHeaderCell />,
      cell: ({ row }) => (
        <div
          className="line-clamp-3" // hoặc thêm CSS để giới hạn chiều cao
          dangerouslySetInnerHTML={{ __html: row.original.description || "" }}
        />
      ),
    },
    {
      accessorKey: "price",
      header: () => <PriceHeaderCell />,
      cell: ({ row }) => <PriceCell price={row.original.price} />,
    },
    {
      accessorKey: "category",
      header: () => <CategoryHeaderCell />,
      cell: ({ row }) => <CategoryCell category={row.original.category} />,
    },
    {
      accessorKey: "status",
      header: () => <StatusHeaderCell />,
      cell: ({ row }) => <StatusCell status={row.original.status} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ActionCell addon={row.original} onEdit={onEdit} onDelete={onDelete} onView={onView} />
      ),
    },
  ]
