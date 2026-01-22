"use client";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export const description = "A horizontal bar chart";

export function RevenueByAge() {
  const chartData = [
    { age: "18-24", revenue: 120 },
    { age: "25-34", revenue: 200 },
    { age: "35-44", revenue: 150 },
    { age: "45-54", revenue: 80 },
    { age: "55-64", revenue: 50 },
    { age: "65+", revenue: 30 },
  ];

  const chartConfig = {
    revenue: {
      label: "Ingresos",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos por edad</CardTitle>
        <CardDescription>Descripción del gráfico de ingresos por edad</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <ResponsiveContainer>
            <BarChart accessibilityLayer data={chartData} layout="vertical">
              <XAxis type="number" dataKey="revenue" />
              <YAxis dataKey="age" type="category" tickLine={false} tickMargin={10} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={5} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
