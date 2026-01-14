"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"

import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// Chart data type - each object can have dynamic properties
type ChartData = Record<string, string | number>

interface BarChartComponentProps {
  data: ChartData[]
  config: ChartConfig
  className?: string
  xAxisKey?: string
  yAxisKey?: string
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
}

export function BarChartComponent({
  data,
  config,
  className,
  xAxisKey = "name",
//   yAxisKey = "value",
  showGrid = true,
  showTooltip = true,
  showLegend = false,
}: BarChartComponentProps) {
  return (
    <ChartContainer config={config} className={className}>
      <BarChart
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
        {showTooltip && (
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
        )}
        {Object.keys(config).map((key) => (
          <Bar
            key={key}
            dataKey={key}
            fill={`var(--color-${key})`}
            radius={8}
          />
        ))}
        {showLegend && <Legend />}
      </BarChart>
    </ChartContainer>
  )
}
