"use client"

import { ColumnDef } from "@tanstack/react-table"
import { RobotApk } from "@/types/robot-apk"
import { Button } from "@/components/ui/button"

export function createColumns(actions: {
  onEdit: (apk: RobotApk) => void
  onDelete: (apk: RobotApk) => void
}): ColumnDef<RobotApk>[] {
  return [
    {
      accessorKey: "name",
      header: "Tên APK",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>
    },
    {
      accessorKey: "robotModelName",
      header: "Model",
      cell: ({ row }) => <span className="font-medium">{row.original.robotModelName}</span>
    },
    {
      accessorKey: "version",
      header: "Phiên bản",
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ getValue }) => {
        const v = String(getValue() ?? "")
        return (
          <div
            className="prose prose-sm max-w-[420px] line-clamp-3"
            dangerouslySetInnerHTML={{ __html: v }}
          />
        )
      }
    },
    {
      accessorKey: "isRequireLicense",
      header: "Yêu cầu license",
      cell: ({ row }) => <span>{row.original.isRequireLicense ? "Có" : "Không"}</span>
    },
    {
      accessorKey: "createdDate",
      header: "Tạo lúc",
      cell: ({ row }) => {
        const d = row.original.createdDate ? new Date(row.original.createdDate) : null
        return <span>{d ? d.toLocaleString() : ""}</span>
      }
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const apk = row.original
        return (
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={() => actions.onEdit(apk)}>Sửa</Button>
            <Button size="sm" variant="destructive" onClick={() => actions.onDelete(apk)}>Xóa</Button>
          </div>
        )
      }
    }
  ]
}


