import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatMonthYear, formatNumberAbbreviated } from "@/utils/formatters";

export const LeadsCharts = ({ date }: { date: { from: string; to: string } }) => {
  const chartConfig = {
    investment: {
      label: "Inversión",
      color: "var(--chart-1)",
    },
    conversions: {
      label: "Conversiones",
      color: "var(--chart-2)",
    },
    cpa: {
      label: "CPA",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["google-ads-monthly-leads-charts-data"],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "monthly_google_ads_performance",
          filters: {
            event_date_between: [date.from, date.to],
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      console.log(json);

      const transformed = json.rows.map((raw: any) => ({
        month: raw.mes,
        investment: raw.inversion ?? 0,
        conversions: raw.conversiones ?? 0,
        cpa: raw.cpa ?? 0,
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
        <h2 className="font-bold text-2xl">Evolución de inversión, conversiones y CPA </h2>
        <p className="text-muted-foreground">
          Comportamiento de la inversión y su relación directa con los resultados y el costo de conversión en el tiempo.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento mensual</CardTitle>
          <CardDescription>Análisis del rendimiento de Google Ads durante el año en curso</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[350px]  w-full">
            <ResponsiveContainer>
              <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Inversión",
                    angle: -90,
                    dx: -30,
                  }}
                  tickFormatter={(value) => formatNumberAbbreviated(value)}
                />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => formatMonthYear(value)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="investment" fill="var(--color-investment)" radius={4} />
                <Bar dataKey="conversions" fill="var(--color-conversions)" radius={4} />
                <Bar dataKey="cpa" fill="var(--color-cpa)" radius={4} minPointSize={1} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
};
