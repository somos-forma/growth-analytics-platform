import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const ConversionAndRateByHour = () => {
  const chartData = [
    {
      hour: "0",
      conversion: 150,
      conversion_rate: 75,
    },
    {
      hour: "1",
      conversion: 180,
      conversion_rate: 380,
    },
    {
      hour: "2",
      conversion: 180,
      conversion_rate: 380,
    },
    {
      hour: "3",
      conversion: 90,
      conversion_rate: 50,
    },
  ];
  const chartConfig = {
    conversion: {
      label: "Conversiones",
      color: "var(--chart-1)",
    },
    conversion_rate: {
      label: "Tasa de conversión",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversión y tasa de conversión por Hora </CardTitle>
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
                  value: "Conversiones",
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
                  value: "Tasa de conversión",
                  angle: -90,
                  dx: 30,
                }}
              />
              <XAxis dataKey="hour" tickLine={false} tickMargin={10} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="conversion" fill="var(--color-conversion)" radius={4} yAxisId="left" />

              <Line dataKey="conversion_rate" stroke="var(--color-conversion_rate)" yAxisId="right" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
