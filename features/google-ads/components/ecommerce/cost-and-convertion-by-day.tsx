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
import { useQuery } from "@tanstack/react-query";
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton";
import {
  formatMonthYear,
  formatNumberAbbreviated,
  formatSpanishDate,
} from "@/utils/formatters";

export const CostAndConversionByDay = ({
  date,
}: {
  date: { from: string; to?: string };
}) => {
  const chartData = [
    {
      day: "1 ago 2025",
      cost: 150,
      cost_conversion: 75,
    },
    {
      day: "2 ago 2025",
      cost: 180,
      cost_conversion: 380,
    },
    {
      day: "3 ago 2025",
      cost: 180,
      cost_conversion: 380,
    },
    {
      day: "4 ago 2025",
      cost: 90,
      cost_conversion: 50,
    },
    {
      day: "5 ago 2025",
      cost: 200,
      cost_conversion: 120,
    },
    {
      day: "6 ago 2025",
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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["google-ads-daily-cost-conversion"],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "daily_google_ads_performance",
          filters: {
            event_date_between: [date.from, date.to],
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();

      const transformed = json.rows.map((raw: any) => ({
        day: raw.fecha,
        cost: raw.coste ?? 0,
        cost_conversion: raw.coste_por_conversion ?? 0,
      }));

      return transformed;
    },
  });
  if (isLoading) {
    return <ChartSkeleton />;
  }
  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Coste y Coste/Conversión por Día</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px]  w-full">
          <ResponsiveContainer>
            <ComposedChart accessibilityLayer data={data}>
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
                tickFormatter={(value) => formatNumberAbbreviated(value)}
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
                tickFormatter={(value) => formatNumberAbbreviated(value)}
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => formatSpanishDate(value)}
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
