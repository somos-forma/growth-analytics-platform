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

export const MonthlyIndicators = () => {
  const chartData = [
    {
      month: "Enero",
      sessions: 1500,
      previousYearSessions: 3420,
      revenue: 8000,
      previousYearRevenue: 7000,
    },
    {
      month: "Febrero",
      sessions: 3005,
      previousYearSessions: 2800,
      revenue: 12000,
      previousYearRevenue: 10000,
    },
    {
      month: "Marzo",
      sessions: 2370,
      previousYearSessions: 2000,
      revenue: 9000,
      previousYearRevenue: 8500,
    },
    {
      month: "Abril",
      sessions: 730,
      previousYearSessions: 900,
      revenue: 4000,
      previousYearRevenue: 4500,
    },
    {
      month: "Mayo",
      sessions: 2090,
      previousYearSessions: 1800,
      revenue: 10000,
      previousYearRevenue: 9500,
    },
    {
      month: "Junio",
      sessions: 2140,
      previousYearSessions: 1900,
      revenue: 11000,
      previousYearRevenue: 10500,
    },
  ];
  const chartConfig = {
    sessions: {
      label: "Sesiones",
      color: "var(--chart-1)",
    },
    previousYearSessions: {
      label: "Sesiones del Año Pasado",
      color: "var(--chart-2)",
    },
    revenue: {
      label: "Ingresos",
      color: "var(--chart-3)",
    },
    previousYearRevenue: {
      label: "Ingresos del Año Pasado",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Indicadores Mensuales</CardTitle>
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
                  value: "Sesiones",
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
                  value: "Ingresos",
                  angle: -90,
                  dx: 30,
                }}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="sessions"
                fill="var(--color-sessions)"
                radius={4}
                yAxisId="left"
              />
              <Bar
                dataKey="previousYearSessions"
                fill="var(--color-previousYearSessions)"
                radius={4}
                yAxisId="left"
              />
              <Line
                dataKey="revenue"
                stroke="var(--color-revenue)"
                yAxisId="right"
              />
              <Line
                dataKey="previousYearRevenue"
                stroke="var(--color-previousYearRevenue)"
                strokeDasharray="1"
                yAxisId="right"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
