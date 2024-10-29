'use client'

import * as React from 'react'
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface ChartProps {
  title: string
  description?: string
  data: any[]
  type: 'line' | 'bar' | 'pie'
  dataKeys: {
    x: string
    y: string | string[]
  }
  colors?: string[]
}

export function Chart({ title, description, data, type, dataKeys, colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'] }: ChartProps) {
  const config = React.useMemo(() => {
    return Array.isArray(dataKeys.y) 
      ? dataKeys.y.reduce((acc, key, index) => {
          acc[key] = {
            label: key,
            color: colors[index % colors.length],
          }
          return acc
        }, {} as Record<string, { label: string; color: string }>)
      : { 
          [dataKeys.y]: {
            label: dataKeys.y,
            color: colors[0],
          }
        }
  }, [dataKeys.y, colors])

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <XAxis dataKey={dataKeys.x} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {Array.isArray(dataKeys.y) ? (
              dataKeys.y.map((key, index) => (
                <Line 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={`var(--color-${key})`} 
                  name={key} 
                />
              ))
            ) : (
              <Line 
                type="monotone" 
                dataKey={dataKeys.y} 
                stroke={`var(--color-${dataKeys.y})`} 
                name={dataKeys.y} 
              />
            )}
          </LineChart>
        )
      case 'bar':
        return (
          <BarChart data={data}>
            <XAxis dataKey={dataKeys.x} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {Array.isArray(dataKeys.y) ? (
              dataKeys.y.map((key, index) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  fill={`var(--color-${key})`} 
                  name={key} 
                />
              ))
            ) : (
              <Bar 
                dataKey={dataKeys.y} 
                fill={`var(--color-${dataKeys.y})`} 
                name={dataKeys.y} 
              />
            )}
          </BarChart>
        )
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={Array.isArray(dataKeys.y) ? dataKeys.y[0] : dataKeys.y}
              nameKey={dataKeys.x}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
          </PieChart>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// Example usage
export function ExampleCharts() {
  const lineData = [
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
  ]

  const barData = [
    { name: 'A', value: 12 },
    { name: 'B', value: 19 },
    { name: 'C', value: 3 },
    { name: 'D', value: 5 },
    { name: 'E', value: 2 },
  ]

  const pieData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ]

  return (
    <div className="space-y-8">
      <Chart
        title="Monthly Sales"
        description="Comparison of UV and PV over months"
        data={lineData}
        type="line"
        dataKeys={{ x: 'name', y: ['uv', 'pv'] }}
      />
      <Chart
        title="Product Sales"
        description="Sales distribution by product"
        data={barData}
        type="bar"
        dataKeys={{ x: 'name', y: 'value' }}
      />
      <Chart
        title="Customer Segments"
        description="Distribution of customer groups"
        data={pieData}
        type="pie"
        dataKeys={{ x: 'name', y: 'value' }}
      />
    </div>
  )
}