"use client"

import * as React from "react"
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"

import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"

// Chart data type - each object can have dynamic properties
type ChartData = Record<string, string | number>

interface LineChartComponentProps {
  data: ChartData[]
  config: ChartConfig
  className?: string
  xAxisKey?: string
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
}

export function LineChartComponent({
  data,
  config,
  className,
  xAxisKey = "name",
  showGrid = true,
  showTooltip = true,
  showLegend = false,
}: LineChartComponentProps) {
  return (
    <ChartContainer config={config} className={className}>
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        {showGrid && <CartesianGrid vertical={false} />}
        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis hide />
        {showTooltip && <Tooltip />}
        {Object.keys(config).map((key) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            dot={false}
          />
        ))}
        {showLegend && <Legend />}
      </LineChart>
    </ChartContainer>
  )
}
