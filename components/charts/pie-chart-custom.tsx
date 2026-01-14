"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LabelList, Pie, PieChart } from "recharts";

export function PieChartCustom({
  chartData,
  chartConfig,
  nameKey,
}: {
  chartData: any[];
  chartConfig: ChartConfig;
  nameKey: string;
}) {
  return (
    <ChartContainer config={chartConfig} className="max-h-[300px] mx-auto">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey={nameKey} />} />
        <Pie data={chartData} dataKey="value">
          {/* <LabelList
            dataKey="channel"
            className="fill-background"
            stroke="none"
            fontSize={12}
            formatter={(value: any) => {
              return value;
            }}
          /> */}
        </Pie>
        <ChartLegend
          content={
            <ChartLegendContent className="flex-wrap" nameKey={nameKey} />
          }
        />
      </PieChart>
    </ChartContainer>
  );
}
