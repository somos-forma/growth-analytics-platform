import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  CartesianGrid,
  XAxis,
  ComposedChart,
  Line,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";

export const CostAndConversionByHour = () => {
  const chartData = [
    {
      hour: "0",
      cost: 150,
      cost_conversion: 75,
    },
    {
      hour: "1",
      cost: 180,
      cost_conversion: 380,
    },
    {
      hour: "2",
      cost: 180,
      cost_conversion: 380,
    },
    {
      hour: "3",
      cost: 90,
      cost_conversion: 50,
    },
    {
      hour: "4",
      cost: 200,
      cost_conversion: 120,
    },
    {
      hour: "5",
      cost: 220,
      cost_conversion: 150,
    },
  ];
  const chartConfig = {
    cost: {
      label: "Coste",
      color: "var(--chart-1)",
    },
    cost_conversion: {
      label: "Coste por Conversión",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coste y Coste/Conversión por Hora</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px]  w-full">
          <ResponsiveContainer>
            <ComposedChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                yAxisId="left"
                label={{
                  value: "Costes",
                  angle: -90,
                  dx: -30,
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                yAxisId="right"
                orientation="right"
                label={{
                  value: "Coste o conversión",
                  angle: -90,
                  dx: 30,
                }}
              />
              <XAxis
                dataKey="hour"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="cost"
                fill="var(--color-cost)"
                radius={4}
                yAxisId="left"
              />

              <Line
                dataKey="cost_conversion"
                stroke="var(--color-cost_conversion)"
                yAxisId="right"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
