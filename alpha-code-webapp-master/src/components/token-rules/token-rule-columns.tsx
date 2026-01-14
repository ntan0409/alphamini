"use client"

import { ColumnDef } from "@tanstack/react-table"
import { TokenRule } from "@/types/pricing"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Eye, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TokenRuleColumnsProps {
  onView: (tokenRule: TokenRule) => void
  onEdit: (tokenRule: TokenRule) => void
  onDelete: (tokenRule: TokenRule) => void
}

export const createTokenRuleColumns = ({ 
  onView, 
  onEdit, 
  onDelete 
}: TokenRuleColumnsProps): ColumnDef<TokenRule>[] => [
  {
    accessorKey: "code",
    header: "Mã luật",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("code")}</div>
    ),
  },
  {
    accessorKey: "cost",
    header: "Chi phí",
    cell: ({ row }) => {
      const cost = row.getValue("cost") as number
      return (
        <div className="font-medium">
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(cost)}
        </div>
      )
    },
  },
  {
    accessorKey: "note",
    header: "Ghi chú",
    cell: ({ row }) => {
      const note = row.getValue("note") as string
      return (
        <div className="max-w-[200px] truncate" title={note}>
          {note || "—"}
        </div>
      )
    },
  },
  {
    accessorKey: "createdDate",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdDate"))
      return <div>{date.toLocaleDateString('vi-VN')}</div>
    },
  },
  {
    accessorKey: "lastUpdated",
    header: "Cập nhật cuối",
    cell: ({ row }) => {
      const date = new Date(row.getValue("lastUpdated"))
      return <div>{date.toLocaleDateString('vi-VN')}</div>
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const tokenRule = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(tokenRule)}>
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(tokenRule)}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(tokenRule)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]