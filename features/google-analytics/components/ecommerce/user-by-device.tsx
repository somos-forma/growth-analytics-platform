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
    queryKey: ["fetch-users-by-device", date.from],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "monthly_device_users",
          filters: {
            event_date_between: [date.from],
          },
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
      const data = json.rows.map((raw: any) => ({
        // id: String(index + 1),
        device: raw.device_category.replace(/\s+/g, "").replace(/[()]/g, ""),
        visitors: raw.usuarios_activos,
        fill: fillMap[raw.device_category.replace(/\s+/g, "").toLowerCase()],
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
