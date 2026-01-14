import { ChartEmpty } from "@/components/empty/chart-empty";
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
import { useQuery } from "@tanstack/react-query";

import { Pie, PieChart } from "recharts";

export const RevenueByDevices = ({
  date,
}: {
  date: { from: string; to?: string };
}) => {
  const chartData = [
    { device: "mobile", revenue: 1250000, fill: "var(--color-mobile)" },
    { device: "desktop", revenue: 980000, fill: "var(--color-desktop)" },
    { device: "tablet", revenue: 320000, fill: "var(--color-tablet)" },
    { device: "smarttv", revenue: 150000, fill: "var(--color-smarttv)" },
  ];

  const chartConfig = {
    revenue: {
      label: "Ingresos",
    },
    mobile: {
      label: "Móvil",
      color: "var(--chart-1)",
    },
    desktop: {
      label: "Escritorio",
      color: "var(--chart-2)",
    },
    tablet: {
      label: "Tablet",
      color: "var(--chart-3)",
    },
    smarttv: {
      label: "Smart TV",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetch-revenue-by-device"],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "monthly_device_revenue",
          filters: {
            event_date_between: [date.from],
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      const data = json.rows
        .map((raw: any, index: number) => ({
          // id: String(index + 1),
          device: raw.device_category.replace(/\s+/g, ""),
          revenue: raw.ingresos_netos,
          fill: `var(--color-${raw.device_category
            .replace(/\s+/g, "")
            .toLowerCase()})`,
        }))
        .filter((item: any) => item.device !== "(other)");

      return data;
    },
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  const totalRevenue = data.reduce(
    (sum: any, item: any) => sum + item.revenue,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos por Dispositivo</CardTitle>
        <CardDescription>
          Distribución de ingresos según el tipo de dispositivo
        </CardDescription>
      </CardHeader>
      <CardContent>
        {totalRevenue === 0 ? (
          <ChartEmpty />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Pie
                data={data}
                dataKey="revenue"
                nameKey="device"
                innerRadius={60}
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
