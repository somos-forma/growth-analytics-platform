import { useQuery } from "@tanstack/react-query";

import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatNumberAbbreviated, formatSpanishDate } from "@/utils/formatters";

export const CostsIndicatorsCharts = ({ date }: { date: { from: string; to: string } }) => {
  const chartConfig = {
    cost: {
      label: "Total Coste",
      color: "var(--chart-1)",
    },
    cpm: {
      label: "CPM",
      color: "var(--chart-2)",
    },
    cpc: {
      label: "CPC",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["meta-ads-daily-investment-cpm-cpc-leads", date.from, date.to],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "daily_meta_ads_costs",
          filters: {
            event_date_between: [date.from, date.to],
            // event_date_between: ["2025-10-15", "2025-11-11"],
          },
          limit: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();

      const transformed = json.rows.map((raw: any) => ({
        day: raw.fecha,
        cost: raw.total_cost,
        cpm: raw.cpm ?? 0,
        cpc: raw.cpc ?? 0,
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
    <>
      <div className="p-2">
        <h2 className="font-bold text-2xl">Evolución de la eficiencia de la inversión en medios</h2>
        <p className="text-muted-foreground">Comportamiento diario del gasto, CPM y CPC en el período analizado</p>
      </div>
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[350px]  w-full">
            <ResponsiveContainer>
              <ComposedChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Total costes",
                    angle: -90,
                    dx: -30,
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
                <Bar dataKey="cost" fill="var(--color-cost)" radius={4} />
                <Line dataKey="cpm" stroke="var(--color-cpm)" />
                <Line dataKey="cpc" stroke="var(--color-cpc)" />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
};
