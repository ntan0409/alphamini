"use client"

import { SubscriptionPlan } from "@/types/subscription"
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
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Eye, Star } from "lucide-react"

// Helper format
const formatPrice = (price: number) =>
  price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })

const formatBillingCycle = (cycle: number) => {
  switch (cycle) {
    case 1:
      return "1 tháng"
    case 3:
      return "3 tháng"
    case 9:
      return "9 tháng"
    case 12:
      return "1 năm"
    default:
      return "Không xác định"
  }
}

// Header cells
const IdHeaderCell = () => (
  <span className="flex items-center gap-1 text-gray-700 font-semibold">ID</span>
)

const NameHeaderCell = ({ column }: { column: Column<SubscriptionPlan, unknown> }) => (
  <span className="flex items-center gap-1 text-purple-700 font-semibold">
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="p-0 h-auto min-w-0 font-semibold"
    >
      Tên gói
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  </span>
)

const DescriptionHeaderCell = () => (
  <span className="flex items-center gap-1 text-yellow-700 font-semibold">Mô tả</span>
)

const PriceHeaderCell = () => (
  <span className="flex items-center gap-1 text-blue-700 font-semibold">Giá</span>
)

const BillingCycleHeaderCell = () => (
  <span className="flex items-center gap-1 text-indigo-700 font-semibold">
    Chu kỳ thanh toán
  </span>
)

const RecommendedHeaderCell = () => (
  <span className="flex items-center gap-1 text-orange-700 font-semibold">
    <Star className="w-4 h-4 text-orange-500" />
    Đề xuất
  </span>
)

const StatusHeaderCell = () => (
  <span className="flex items-center gap-1 text-green-700 font-semibold">Trạng thái</span>
)

// Cells
const DescriptionCell = ({ description }: { description?: string }) => (
  <div
    className="prose prose-sm max-w-xs text-gray-700 line-clamp-5 overflow-hidden"
    dangerouslySetInnerHTML={{
      __html: description || "<p><i>Không có dữ liệu</i></p>",
    }}
  />
)

const PriceCell = ({ price }: { price: number }) => (
  <span className="text-blue-700 font-medium">{formatPrice(price)}</span>
)

const BillingCycleCell = ({ billingCycle }: { billingCycle: number }) => (
  <span className="text-indigo-600 font-medium">{formatBillingCycle(billingCycle)}</span>
)

// ✅ Recommended Cell
const RecommendedCell = ({ isRecommended  }: { isRecommended : boolean }) => (
  <div className="flex items-center justify-center">
    {isRecommended  ? (
      <span className="inline-flex items-center px-2 py-1 rounded bg-orange-100 text-orange-700 font-semibold text-xs">
        <Star className="w-3 h-3 mr-1 fill-orange-500" />
        Có
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-600 font-semibold text-xs">
        Không
      </span>
    )}
  </div>
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
  plan,
  onEdit,
  onDelete,
  onView,
}: {
  plan: SubscriptionPlan
  onEdit?: (plan: SubscriptionPlan) => void
  onDelete?: (plan: SubscriptionPlan) => void
  onView?: (plan: SubscriptionPlan) => void
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
      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(plan.id)}>
        Sao chép ID
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onView?.(plan)}>
        <Eye className="mr-2 h-4 w-4" />
        Xem chi tiết
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onEdit?.(plan)}>
        <Edit className="mr-2 h-4 w-4" />
        Chỉnh sửa
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => onDelete?.(plan)}
        className="text-red-600 focus:text-red-600"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Xóa
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

// ✅ Column definition
export const createColumns = (
  onEdit?: (plan: SubscriptionPlan) => void,
  onDelete?: (plan: SubscriptionPlan) => void,
  onView?: (plan: SubscriptionPlan) => void
): ColumnDef<SubscriptionPlan>[] => [
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
    cell: ({ row }) => <DescriptionCell description={row.original.description} />,
  },
  {
    accessorKey: "price",
    header: () => <PriceHeaderCell />,
    cell: ({ row }) => <PriceCell price={row.original.price} />,
  },
  {
    accessorKey: "billingCycle",
    header: () => <BillingCycleHeaderCell />,
    cell: ({ row }) => <BillingCycleCell billingCycle={row.original.billingCycle} />,
  },
  // ✅ Thêm cột Recommended
  {
    accessorKey: "isRecommended ",
    header: () => <RecommendedHeaderCell />,
    cell: ({ row }) => <RecommendedCell isRecommended={row.original.isRecommended ?? false} />,
  },
  {
    accessorKey: "status",
    header: () => <StatusHeaderCell />,
    cell: ({ row }) => <StatusCell status={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <ActionCell plan={row.original} onEdit={onEdit} onDelete={onDelete} onView={onView} />
    ),
  },
]
