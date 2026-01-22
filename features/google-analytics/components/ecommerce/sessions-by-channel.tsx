"use client";
import { useQuery } from "@tanstack/react-query";
import { PieChartCustom } from "@/components/charts/pie-chart-custom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";

export function SessionsByChannel({ date }: { date: { from: string; to?: string } }) {
  const chartConfig = {
    value: {
      label: "Ingresos",
    },
    direct: {
      label: "Direct",
      color: "var(--chart-1)",
    },
    organicshopping: {
      label: "Organic Shopping",
      color: "var(--chart-2)",
    },
    email: {
      label: "Email",
      color: "var(--chart-3)",
    },
    other: {
      label: "(Other)",
      color: "var(--chart-4)",
    },
    unassigned: {
      label: "Unassigned",
      color: "var(--chart-5)",
    },
    "cross-network": {
      label: "Cross Network",
      color: "var(--chart-6)",
    },
    paidother: {
      label: "Paid Other",
      color: "var(--chart-7)",
    },
    paidvideo: {
      label: "Paid Video",
      color: "var(--chart-8)",
    },
    organicsearch: {
      label: "Organic Search",
      color: "var(--chart-9)",
    },
    paidsocial: {
      label: "Paid Social",
      color: "var(--chart-10)",
    },
    display: {
      label: "Display",
      color: "var(--chart-11)",
    },
    organicvideo: {
      label: "Organic Video",
      color: "var(--chart-12)",
    },
    paidsearch: {
      label: "Paid Search",
      color: "var(--chart-13)",
    },
    organicsocial: {
      label: "Organic Social",
      color: "var(--chart-14)",
    },
    referral: {
      label: "Referral",
      color: "var(--chart-15)",
    },
  } satisfies ChartConfig;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetch-sessions-by-channel"],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "monthly_channel_metrics",
          filters: {
            event_date_between: [date.from],
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const fillMap: { [key: string]: string } = {
        direct: "var(--color-direct)",
        organicshopping: "var(--color-organicshopping)",
        email: "var(--color-email)",
        "(other)": "var(--color-other)",
        unassigned: "var(--color-unassigned)",
        "cross-network": "var(--color-cross-network)",
        paidother: "var(--color-paidother)",
        paidvideo: "var(--color-paidvideo)",
        organicsearch: "var(--color-organicsearch)",
        paidsocial: "var(--color-paidsocial)",
        display: "var(--color-display)",
        organicvideo: "var(--color-organicvideo)",
        paidsearch: "var(--color-paidsearch)",
        organicsocial: "var(--color-organicsocial)",
        referral: "var(--color-referral)",
      };

      const json = await response.json();
      const data = json.rows.map((raw: any) => ({
        channel: raw.canal.toLowerCase().replace(/\s+/g, "").replace(/[()]/g, ""),
        value: raw.sesiones,
        fill: fillMap[raw.canal.replace(/\s+/g, "").toLowerCase()],
      }));

      return data;
    },
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }
  const totalValue = data.reduce((sum: any, item: any) => sum + item.value, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Sesiones por canales</CardTitle>
        <CardDescription>Descripción de las sesiones por canales</CardDescription>
      </CardHeader>
      <CardContent>
        {totalValue === 0 ? (
          <div className="text-muted-foreground text-center h-[250px] flex items-center justify-center">
            Sin datos para mostrar
          </div>
        ) : (
          <PieChartCustom chartData={data} chartConfig={chartConfig} nameKey="channel" />
        )}
      </CardContent>
    </Card>
  );
}
