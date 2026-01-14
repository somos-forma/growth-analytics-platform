import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  CartesianGrid,
  XAxis,
  ComposedChart,
  Line,
  YAxis,
  ResponsiveContainer,
  BarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton";
import { formatMonthYear, formatNumberAbbreviated } from "@/utils/formatters";

export const LeadsCharts = ({
  date,
}: {
  date: { from: string; to: string };
}) => {
  const chartData = [
    {
      month: "Enero 2025",
      investment: 1200,
      conversions: 300,
      cpa: 4,
    },
    {
      month: "Febrero 2025",
      investment: 1500,
      conversions: 350,
      cpa: 4.3,
    },
    {
      month: "Marzo 2025",
      investment: 1800,
      conversions: 400,
      cpa: 4.5,
    },
  ];

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
          table: "monthly_google_ads_summary",
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
        month: raw.mes,
        investment: raw.inversion ?? 0,
        conversions: raw.conversiones ?? 0,
        cpa: raw.cpa ?? 0,
      }));

      console.log(`CHART`, transformed);

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
        <CardTitle>Rendimiento mensual</CardTitle>
        <CardDescription>
          Análisis del rendimiento de Google Ads durante el año en curso
        </CardDescription>
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
              <Bar
                dataKey="investment"
                fill="var(--color-investment)"
                radius={4}
              />
              <Bar
                dataKey="conversions"
                fill="var(--color-conversions)"
                radius={4}
              />
              <Bar
                dataKey="cpa"
                fill="var(--color-cpa)"
                radius={4}
                minPointSize={1}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
