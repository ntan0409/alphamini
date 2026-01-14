
"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { DashboardStats } from "@/types/dashboard";

interface GrowthTrendChartProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

export function GrowthTrendChart({ stats, isLoading }: GrowthTrendChartProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-40 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  // Tạo dữ liệu xu hướng dựa trên stats hiện tại
  const generateTrendData = () => {
    const months = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
    const currentMonth = new Date().getMonth();
    const data = [];
    for (let i = 0; i < 6; i++) {
      const monthIndex = (currentMonth - 5 + i + 12) % 12;
      const month = months[monthIndex];
      const baseGrowth = stats.growthRate;
      const variation = (Math.random() - 0.5) * 20; // Biến động ngẫu nhiên
      const growth = i === 5 ? stats.growthRate : baseGrowth + variation;
      data.push({
        month,
        growth: growth,
        users: Math.max(0, stats.total - (5 - i) * stats.newThisMonth + Math.floor(Math.random() * 10))
      });
    }
    return data;
  };

  const trendData = generateTrendData();

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Phân tích xu hướng tăng trưởng</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${stats.growthRate >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium">
            {stats.growthRate >= 0 ? 'Tăng trưởng' : 'Sụt giảm'}
          </span>
        </div>
      </div>
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              domain={['dataMin - 20', 'dataMax + 20']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: string | number | undefined, name: string | undefined) => {
                if (name === "growth") {
                  return [`${Number(value ?? 0).toFixed(1)}%`, 'Tốc độ tăng trưởng'];
                }
                return [value ?? 0, 'Người dùng'];
              }}
            />
            <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="5 5" />
            <Line 
              type="monotone" 
              dataKey="growth" 
              stroke={stats.growthRate >= 0 ? "#10b981" : "#ef4444"}
              strokeWidth={3}
              dot={{ fill: stats.growthRate >= 0 ? "#10b981" : "#ef4444", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Tổng kết xu hướng */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">Xu hướng hiện tại</div>
          <div className={`text-lg font-semibold ${stats.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.growthRate >= 0 ? '📈 Tích cực' : '� Tiêu cực'}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">Tốc độ thay đổi</div>
          <div className={`text-lg font-semibold ${stats.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.growthRate > 0 ? '+' : ''}{stats.growthRate.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}
