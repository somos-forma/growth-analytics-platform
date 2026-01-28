import { useQuery } from "@tanstack/react-query";
import { Pie, PieChart } from "recharts";
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

export const UserByDevice = ({ date }: { date: { from: string; to?: string } }) => {
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-1)",
    },
    desktop: {
      label: "Desktop",
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
    other: {
      label: "Other",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetch-users-by-device", date.from, date.to],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "daily_device_users",
          filters: {
            event_date_between: [date.from, date.to || date.from],
          },
          limit: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const fillMap: { [key: string]: string } = {
        desktop: "var(--color-desktop)",
        mobile: "var(--color-mobile)",
        tablet: "var(--color-tablet)",
        smarttv: "var(--color-smarttv)",
        "(other)": "var(--color-other)",
      };
      const json = await response.json();
      const aggregated = json.rows.reduce((acc: { [key: string]: number }, row: any) => {
        const device = row.device_category.replace(/\s+/g, "").replace(/[()]/g, "").toLowerCase();
        acc[device] = (acc[device] || 0) + row.usuarios_activos;
        return acc;
      }, {});

      const data = Object.entries(aggregated).map(([device, visitors]) => ({
        device,
        visitors,
        fill: fillMap[device] || "var(--color-other)",
      }));

      return data;
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
        <CardTitle>Usuarios por Dispositivos</CardTitle>
        <CardDescription>Distribución del tráfico por tipo de dispositivo.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend className="flex flex-wrap" content={<ChartLegendContent />} />
            <Pie data={data} dataKey="visitors" nameKey="device" innerRadius={50} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
