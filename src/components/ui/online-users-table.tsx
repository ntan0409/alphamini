"use client"

import * as React from "react"

interface OnlineUsersTableProps {
  count: number
  isLoading?: boolean
}

export function OnlineUsersTable({ count, isLoading }: OnlineUsersTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Online Users</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-8 bg-muted rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Online Users</h3>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Currently Active</p>
        <p className="text-3xl font-bold text-green-600">{count}</p>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <span className="text-xs text-muted-foreground">Real-time count</span>
        </div>
      </div>
    </div>
  )
}
