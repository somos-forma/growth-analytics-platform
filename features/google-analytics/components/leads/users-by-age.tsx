"use client";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A horizontal bar chart";

const chartData = [
  { age: "18-24", quantity: 120 },
  { age: "25-34", quantity: 200 },
  { age: "35-44", quantity: 150 },
  { age: "45-54", quantity: 80 },
  { age: "55-64", quantity: 50 },
  { age: "65+", quantity: 30 },
];

const chartConfig = {
  quantity: {
    label: "Cantidad",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function UsersByAge() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuarios por edad</CardTitle>
        <CardDescription>
          Descripción del gráfico de usuarios por edad
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <ResponsiveContainer>
            <BarChart accessibilityLayer data={chartData} layout="vertical">
              <XAxis type="number" dataKey="quantity" />
              <YAxis
                dataKey="age"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="quantity" fill="var(--color-quantity)" radius={5} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
