"use client"

import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"
import { DashboardStats } from "@/types/dashboard"

interface UserStatsChartProps {
  stats: DashboardStats
  isLoading?: boolean
}

export function UserStatsChart({ stats, isLoading }: UserStatsChartProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-48 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  const chartData = [
    {
      name: "Total Users",
      value: stats.total,
      color: "#3b82f6",
      description: "All registered users"
    },
    {
      name: "New This Month",
      value: stats.newThisMonth,
      color: "#10b981",
      description: "Recently joined"
    },
    {
      name: "Growth Rate (%)",
      value: Math.abs(stats.growthRate),
      color: stats.growthRate >= 0 ? "#10b981" : "#ef4444",
      description: stats.growthRate >= 0 ? "Positive growth" : "Declining trend"
    }
  ]

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">User Statistics Overview</h3>
        <div className="text-sm text-muted-foreground">
          Role: <span className="font-medium capitalize text-purple-600">{stats.role}</span>
        </div>
      </div>
      
      <div className="h-72 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: string | number | undefined, name: string | undefined) => {
                if (name === "Growth Rate (%)") {
                  return [`${stats.growthRate.toFixed(1)}%`, name]
                }
                return [value, name]
              }}
              labelFormatter={(label) => label}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-700">Total Users</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">+{stats.newThisMonth}</div>
          <div className="text-sm text-green-700">New This Month</div>
        </div>
        <div className={`p-4 rounded-lg border ${
          stats.growthRate >= 0 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className={`text-2xl font-bold ${
            stats.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {stats.growthRate > 0 ? '+' : ''}{stats.growthRate.toFixed(1)}%
          </div>
          <div className={`text-sm ${
            stats.growthRate >= 0 ? 'text-green-700' : 'text-red-700'
          }`}>
            Growth Rate
          </div>
        </div>
      </div>
    </div>
  )
}
