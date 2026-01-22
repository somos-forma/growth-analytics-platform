import { useQuery } from "@tanstack/react-query";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
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
import { formatNumberAbbreviated } from "@/utils/formatters";

export function transformTrafficRevenue(rows) {
  if (!rows || rows.length === 0) return [];

  const MONTH_NAMES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Convertimos a mapa por mes "YYYY-MM"
  const byMonth = {};
  for (const r of rows) byMonth[r.mes] = r;

  // Encontramos el año más reciente (2025 en tu data)
  const years = rows.map((r) => Number(r.mes.split("-")[0]));
  const maxYear = Math.max(...years);

  const result = [];

  for (let month = 1; month <= 12; month++) {
    const monthStr = String(month).padStart(2, "0");

    const currentKey = `${maxYear}-${monthStr}`;
    const previousKey = `${maxYear - 1}-${monthStr}`;

    const current = byMonth[currentKey];
    if (!current) continue; // si falta el mes actual, no se agrega

    const previous = byMonth[previousKey] || null;

    result.push({
      month: MONTH_NAMES[month - 1],
      sessions: current.total_sesiones,
      previousYearSessions: previous?.total_sesiones ?? 0,
      revenue: current.total_ingreso_neto,
      previousYearRevenue: previous?.total_ingreso_neto ?? 0,
    });
  }

  return result;
}

export const MonthlyIndicators = () => {
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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["conversion-and-rate-by-day"],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "monthly_traffic_revenue",
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();

      const transformed = transformTrafficRevenue(json.rows);
      // const transformed = json.rows.map((raw: any) => ({
      //   month: raw.mes,
      //   previousYearSessions: raw.total_sesiones ?? 0,
      //   previousYearRevenue: raw.total_ingreso_neto ?? 0,
      // }));
      console.log(transformed);
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
        <CardTitle>Indicadores Mensuales</CardTitle>
        <CardDescription>
          <span className=" italic">(Ultimos 12 meses)</span>
        </CardDescription>
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
                  value: "Sesiones",
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
                  value: "Ingresos",
                  angle: -90,
                  dx: 30,
                }}
                tickFormatter={(value) => formatNumberAbbreviated(value)}
              />
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="sessions" fill="var(--color-sessions)" radius={4} yAxisId="left" />
              <Bar dataKey="previousYearSessions" fill="var(--color-previousYearSessions)" radius={4} yAxisId="left" />
              <Line dataKey="revenue" stroke="var(--color-revenue)" yAxisId="right" />
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
