"use client"

import * as React from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts"
import { DashboardStats } from "@/types/dashboard"



interface UserDistributionChartProps {
  stats: DashboardStats;
  onlineCount: number;
  isLoading?: boolean;
}


export function UserDistributionChart({ stats, onlineCount, isLoading }: UserDistributionChartProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-44 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const data = [
    {
      name: 'Đang hoạt động',
      value: onlineCount,
      color: '#10b981',
      percentage: stats.total > 0 ? ((onlineCount / stats.total) * 100).toFixed(1) : '0'
    },
    {
      name: 'Ngoại tuyến',
      value: Math.max(0, stats.total - onlineCount),
      color: '#6b7280',
      percentage: stats.total > 0 ? (((stats.total - onlineCount) / stats.total) * 100).toFixed(1) : '0'
    },
    {
      name: 'Mới tháng này',
      value: stats.newThisMonth,
      color: '#3b82f6',
      percentage: stats.total > 0 ? ((stats.newThisMonth / stats.total) * 100).toFixed(1) : '0'
    }
  ];

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Phân bố người dùng</h3>
        <div className="text-sm text-muted-foreground">
          Tổng số: <span className="font-bold text-blue-600">{stats.total}</span>
        </div>
      </div>
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: string | number | undefined, name: string | undefined) => [value, name]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: string, entry: any) => (
                <span style={{ color: entry.color, fontWeight: 'medium' }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Tổng kết phân bố */}
      <div className="grid grid-cols-3 gap-3">
        {data.map((item, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-1">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs text-gray-600">{item.name}</span>
            </div>
            <div className="text-lg font-bold" style={{ color: item.color }}>
              {item.value}
            </div>
            <div className="text-xs text-gray-500">
              {item.percentage}% tổng số
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
