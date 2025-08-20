"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Dot, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart"
import type { ChartConfig } from "~/components/ui/chart"

export const description = "A line chart showing suburb median values by year"

interface MedianValueData {
  year: string | number;
  value: number;
  fill?: string;
}

interface SuburbMedianChartProps {
  data: MedianValueData[];
  suburbName: string;
  className?: string;
}

const chartConfig = {
  value: {
    label: "Median Value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function SuburbMedianChart({ data, suburbName, className }: SuburbMedianChartProps) {
  // Early return if no valid data
  if (!data || data.length === 0 || !data.some(item => item.value > 0)) {
    return null;
  }

  // Filter out invalid data points
  const validData = data.filter(item => item.value > 0);
  
  // Early return if no valid data after filtering
  if (validData.length === 0) {
    return null;
  }

  // Transform the data to ensure proper format and add fill colors
  const chartData = validData.map((item, index) => ({
    year: item.year.toString(),
    value: item.value,
    fill: `var(--chart-${(index % 5) + 1})`, // Cycle through chart colors
  }));

  // Calculate trend
  const firstValue = chartData[0]?.value || 0;
  const lastValue = chartData[chartData.length - 1]?.value || 0;
  const trendPercentage = firstValue > 0 ? (((lastValue - firstValue) / firstValue) * 100).toFixed(1) : 0;
  const isPositiveTrend = Number(trendPercentage) > 0;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Median Property Values</CardTitle>
        <CardDescription>Historical median values by year in {suburbName}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 24,
              left: 24,
              right: 24,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatCurrency}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  nameKey="value"
                  hideLabel
                  formatter={(value: any) => [formatCurrency(Number(value)), " Median Value"]}
                />
              }
            />
            <Line
              dataKey="value"
              type="natural"
              stroke="var(--color-value)"
              strokeWidth={3}
              dot={({ payload, ...props }) => {
                return (
                  <Dot
                    key={payload.year}
                    r={6}
                    cx={props.cx}
                    cy={props.cy}
                    fill={payload.fill}
                    stroke={payload.fill}
                    strokeWidth={2}
                  />
                )
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {isPositiveTrend ? (
            <>
              Trending up by {trendPercentage}% <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Trending down by {Math.abs(Number(trendPercentage))}% <TrendingUp className="h-4 w-4 rotate-180" />
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
