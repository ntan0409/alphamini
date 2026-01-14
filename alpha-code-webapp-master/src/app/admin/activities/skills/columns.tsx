"use client"

import { Skill } from "@/types/skill"
import { Column, ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ===========================================
// Cột hiển thị cho bảng danh sách kỹ năng
// ===========================================
export const createColumns = (
  onEdit?: (skill: Skill) => void,
  onDelete?: (skill: Skill) => void,
  onView?: (skill: Skill) => void
): ColumnDef<Skill>[] => {
  // ✅ Action cell (dropdown menu)
  const ActionCell = ({ row }: { row: { original: Skill } }) => {
    const skill = row.original
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(skill.id)}>
            Sao chép ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onView?.(skill)}>
            <Eye className="mr-2 h-4 w-4 text-green-600" /> Xem chi tiết
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit?.(skill)}>
            <Edit className="mr-2 h-4 w-4 text-blue-600" /> Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete?.(skill)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // ✅ Header cell đơn giản
  const HeaderCell = ({ text }: { text: string }) => (
    <span className="font-semibold text-gray-700">{text}</span>
  )

  // ✅ Header có thể sắp xếp
  const SortableHeader = ({
    column,
    text,
  }: {
    column: Column<Skill, unknown>
    text: string
  }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="p-0 h-auto min-w-0 font-semibold text-purple-700"
    >
      {text}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )

  // ✅ Icon / hình ảnh
  const IconCell = ({ row }: { row: { original: Skill } }) => {
    const icon = row.original.icon
    const isUrl = typeof icon === "string" && icon.startsWith("http")

    return (
      <div className="flex items-center justify-center">
        {isUrl ? (
          <Image
            src={icon}
            alt="Skill icon"
            width={48}
            height={48}
            className="rounded object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : icon ? (
          <span className="text-2xl">{icon}</span>
        ) : (
          <span className="text-gray-400 text-sm">Không có</span>
        )}
      </div>
    )
  }

  // ✅ Trạng thái (status)
  const StatusCell = ({ row }: { row: { original: Skill } }) => {
    const { status } = row.original
    const active = status === 1
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
          active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        <span
          className={`w-2 h-2 mr-2 rounded-full ${
            active ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
        {active ? "Kích hoạt" : "Không kích hoạt"}
      </span>
    )
  }

  return [
    // ✅ Checkbox
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

    // ✅ ID
    {
      accessorKey: "id",
      header: () => <HeaderCell text="ID" />,
      cell: ({ row }) => (
        <span className="font-mono text-gray-600">{row.original.id.substring(0, 8)}...</span>
      ),
    },

    // ✅ Code
    {
      accessorKey: "code",
      header: () => <HeaderCell text="Mã kỹ năng" />,
      cell: ({ row }) => (
        <span className="text-blue-700 font-mono bg-blue-50 px-2 py-1 rounded text-sm">
          {row.original.code}
        </span>
      ),
    },

    // ✅ Name
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column} text="Tên kỹ năng" />,
      cell: ({ row }) => (
        <span className="font-semibold text-gray-800">{row.original.name}</span>
      ),
    },

    // ✅ Icon
    {
      accessorKey: "icon",
      header: () => <HeaderCell text="Icon / Hình ảnh" />,
      cell: IconCell,
    },

    // ✅ Status
    {
      accessorKey: "status",
      header: () => <HeaderCell text="Trạng thái" />,
      cell: StatusCell,
    },

    // ✅ Robot Model ID (dùng trực tiếp từ Skill)
    {
      accessorKey: "robotModelName",
      header: () => <HeaderCell text="Robot Model" />,
      cell: ({ row }) => (
        <span className="text-gray-700 font-medium">
          {row.original.robotModelName || "Không có"}
        </span>
      ),
    },

    // ✅ Actions
    {
      id: "actions",
      cell: ActionCell,
    },
  ] satisfies ColumnDef<Skill>[]
}
