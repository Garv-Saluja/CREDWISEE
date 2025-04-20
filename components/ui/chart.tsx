"use client"

import type React from "react"
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"

interface ChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

const CustomTooltip = ({
  active,
  payload,
  label,
  valueFormatter,
}: TooltipProps<number, string> & { valueFormatter?: (value: number) => string }) => {
  if (active && payload && payload.length) {
    return (
      <Card className="border shadow-sm">
        <CardContent className="p-2">
          <p className="text-sm font-medium">{label}</p>
          <div className="mt-1 space-y-1">
            {payload.map((entry, index) => (
              <div key={`item-${index}`} className="flex items-center text-xs">
                <div className="mr-1 h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="mr-2 font-medium">{entry.name}:</span>
                <span>{valueFormatter ? valueFormatter(entry.value as number) : entry.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}

export const BarChart: React.FC<ChartProps> = ({ data, index, categories, colors, valueFormatter, className }) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={index} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => (valueFormatter ? valueFormatter(value) : value)}
          />
          <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          {categories.map((category, i) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[i % colors.length]}
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const LineChart: React.FC<ChartProps> = ({ data, index, categories, colors, valueFormatter, className }) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={index} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => (valueFormatter ? valueFormatter(value) : value)}
          />
          <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          {categories.map((category, i) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

export const PieChart: React.FC<ChartProps> = ({ data, index, categories, colors, valueFormatter, className }) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey={categories[0]} nameKey={index}>
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}
