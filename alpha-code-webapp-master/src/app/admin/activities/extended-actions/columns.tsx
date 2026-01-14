"use client"

import { ExtendedAction } from "@/types/extended-action"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"

import { ArrowUpDown } from "lucide-react"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const createColumns = (
  onEdit?: (extended_action: ExtendedAction) => void, 
  onDelete?: (extended_action: ExtendedAction) => void,
  onView?: (extended_action: ExtendedAction) => void
): ColumnDef<ExtendedAction>[] => {
  // Note: We can't use hooks directly in this function since it's not a component
  // Instead, we'll create a wrapper component for the action column
  
  const ActionCell = ({ row }: { row: { original: ExtendedAction } }) => {
    const extended_action = row.original
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Thao tác</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(extended_action.id)}
            className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
          >
            Sao chép ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => onView?.(extended_action)}
            className="hover:bg-green-50 hover:text-green-700 transition-all duration-200 cursor-pointer group"
          >
            <Eye className="mr-2 h-4 w-4 text-gray-600 group-hover:text-green-600 group-hover:scale-110 transition-all duration-200" />
            Xem chi tiết
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onEdit?.(extended_action)}
            className="hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 cursor-pointer group"
          >
            <Edit className="mr-2 h-4 w-4 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-200" />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDelete?.(extended_action)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 cursor-pointer group"
          >
            <Trash2 className="mr-2 h-4 w-4 group-hover:text-red-600 group-hover:scale-110 transition-all duration-200" />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const HeaderCell = ({ text }: { text: string }) => (
    <span className="flex items-center gap-1 text-gray-700 font-semibold">
      {text}
    </span>
  )

  const CodeHeaderCell = () => (
    <span className="flex items-center gap-1 text-blue-700 font-semibold">
      Mã biểu cảm
    </span>
  )

  const NameHeaderCell = ({ column }: { column: { toggleSorting: (isAsc: boolean) => void, getIsSorted: () => string | false } }) => (
    <span className="flex items-center gap-1 text-purple-700 font-semibold">
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 h-auto min-w-0 font-semibold"
      >
        Tên biểu cảm
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </span>
  )

  const ImageHeaderCell = () => (
    <span className="flex items-center gap-1 text-blue-600 font-semibold">
      Hình ảnh
    </span>
  )

  const StatusHeaderCell = () => (
    <span className="flex items-center gap-1 text-green-700 font-semibold">
      Trạng thái
    </span>
  )

  const ImageCell = ({ row }: { row: { original: ExtendedAction } }) => {
    const icon = row.original.icon
    const isUrl = icon?.startsWith("http")

    return (
      <div className="flex items-center justify-center">
        {isUrl ? (
          <Image
            src={icon}
            alt="icon"
            width={40}
            height={40}
            className="rounded object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <span className="text-2xl">{icon || "Không có icon"}</span>
        )}
      </div>
    )
  }

  const StatusCell = ({ row }: { row: { original: ExtendedAction } }) => {
    const status = row.original.status
    let color = "bg-gray-200 text-gray-700"
    let text = "Không xác định"
    let icon = null
    
    if (status === 1) {
      color = "bg-green-100 text-green-700"
      text = "Kích hoạt"
      icon = <svg className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" /></svg>
    } else if (status === 0) {
      color = "bg-red-100 text-red-700"
      text = "Không kích hoạt"
      icon = <svg className="h-4 w-4 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" /></svg>
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded ${color} font-semibold text-xs`}>
        {icon}
        {text}
      </span>
    )
  }

  return [
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
  header: () => <HeaderCell text="ID" />,
        cell: ({ row }) => (
            <span className="text-gray-700 font-semibold">
                {row.original.id.substring(0, 8)}...
            </span>
        ),
    },
    {
        accessorKey: "code",
        header: CodeHeaderCell,
        cell: ({ row }) => (
            <span className="text-blue-700 font-mono bg-blue-50 px-2 py-1 rounded text-sm">
                {row.original.code}
            </span>
        ),
    },
    {
        accessorKey: "name",
        header: NameHeaderCell,
    },
    {
        accessorKey: "icon",
        header: ImageHeaderCell,
        cell: ImageCell,
    },
    {
        accessorKey: "status",
        header: StatusHeaderCell,
        cell: StatusCell,
    },
    {
      accessorKey: "robotModelName",
      header: () => <HeaderCell text="Robot Model" />,
      cell: ({ row }) => (
        <span className="text-gray-700 font-medium">
          {row.original.robotModelName || "Không có"}
        </span>
      ),
    },
    {
        id: "actions",
        cell: ActionCell,
    },
  ]
}
