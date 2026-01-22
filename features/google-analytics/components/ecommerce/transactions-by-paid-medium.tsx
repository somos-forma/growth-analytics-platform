"use client";
import { useQuery } from "@tanstack/react-query";
import { PieChartCustom } from "@/components/charts/pie-chart-custom";
import { ChartEmpty } from "@/components/empty/chart-empty";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";

export function TransactionsByPaidMedium({ date }: { date: { from: string; to?: string } }) {
  const chartConfig = {
    value: {
      label: "Sesiones",
    },
    googleads: {
      label: "Google Ads",
      color: "var(--chart-1)",
    },
    metaads: {
      label: "Meta Ads",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetch-transactions-by-paid-medium"],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "monthly_paid_media_performance",
          filters: {
            event_date_between: [date.from],
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const fillMap: { [key: string]: string } = {
        googleads: "var(--color-googleads)",
        metaads: "var(--color-metaads)",
      };

      const json = await response.json();
      const data = json.rows.map((raw: any) => ({
        medium: raw.medio.toLowerCase().replace(/\s+/g, "").replace(/[()]/g, ""),
        value: raw.transacciones,
        fill: fillMap[raw.medio.replace(/\s+/g, "").toLowerCase()],
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
        <CardTitle>Transacciones por medio pagado</CardTitle>
        <CardDescription>Descripción de las transacciones por medio pagado</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {totalValue === 0 ? (
          <ChartEmpty />
        ) : (
          <PieChartCustom chartData={data} chartConfig={chartConfig} nameKey="medium" />
        )}
      </CardContent>
    </Card>
  );
}
