"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
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

interface AreaChartComponentProps {
  data: ChartData[]
  config: ChartConfig
  className?: string
  xAxisKey?: string
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  stacked?: boolean
}

export function AreaChartComponent({
  data,
  config,
  className,
  xAxisKey = "name",
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  stacked = false,
}: AreaChartComponentProps) {
  return (
    <ChartContainer config={config} className={className}>
      <AreaChart
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
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stackId={stacked ? "1" : undefined}
            stroke={`var(--color-${key})`}
            fill={`var(--color-${key})`}
            fillOpacity={0.4}
          />
        ))}
        {showLegend && <Legend />}
      </AreaChart>
    </ChartContainer>
  )
}
