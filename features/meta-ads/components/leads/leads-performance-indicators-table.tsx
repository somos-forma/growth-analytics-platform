import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/utils/formatters";

type PerformanceIndicators = {
  id: string;
  campaign: string;
  costs: number;
  impressions: number;
  clicks: number;
  frequency: number;
  scope: number;
};

export const columns: ColumnDef<PerformanceIndicators>[] = [
  {
    accessorKey: "campaign",
    header: "Campaña",
  },
  {
    accessorKey: "costs",
    header: "Total de Costos",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: "impressions",
    header: "Impresiones",
    cell: ({ getValue }) => formatNumber(getValue<number>()),
  },
  {
    accessorKey: "clicks",
    header: "Clicks",
    cell: ({ getValue }) => formatNumber(getValue<number>()),
  },
  {
    accessorKey: "frequency",
    header: "Frecuencia",
    cell: ({ getValue }) => formatNumber(getValue<number>()),
  },
  {
    accessorKey: "scope",
    header: "Alcance",
    cell: ({ getValue }) => formatNumber(getValue<number>()),
  },
];
export const data: PerformanceIndicators[] = [
  {
    id: "1",
    campaign: "Campaña A",
    costs: 5000,
    impressions: 150000,
    clicks: 12000,
    frequency: 3.5,
    scope: 80000,
  },
  {
    id: "2",
    campaign: "Campaña B",
    costs: 7000,
    impressions: 200000,
    clicks: 15000,
    frequency: 4.0,
    scope: 100000,
  },
];

export const LeadsPerformanceIndicatorsTable = ({ date }: { date: { from: string; to?: string } }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["meta-ads-fetch-performance-indicators-table-leads", date.from, date.to],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "daily_meta_campaign_performance",
          filters: {
            event_date_between: [date.from, date.to || date.from],
          },
          limit: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      const data = json.rows.map((raw: any, index: number) => ({
        id: String(index + 1),
        campaign: raw.campaign_name,
        costs: raw.total_cost ?? 0,
        impressions: raw.impresiones ?? 0,
        clicks: raw.clicks ?? 0,
        frequency: raw.frecuencia ?? 0,
        scope: raw.alcance ?? 0,
      }));
      const filteredData = data.filter((item: any) => item.campaign !== "Total");
      return filteredData;
    },
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <>
      <div className="p-2">
        <h2 className="font-bold text-2xl">Desempeño de campañas</h2>
        <p className="text-muted-foreground">
          Aporte de cada campaña a la inversión, alcance e interacción con los usuarios.
        </p>
      </div>
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </>
  );
};
