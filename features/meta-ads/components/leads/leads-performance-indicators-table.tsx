import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/utils/formatters";
import { useQuery } from "@tanstack/react-query";
import { Table } from "lucide-react";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { format } from "date-fns/format";

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
    header: "Clics",
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

export const LeadsPerformanceIndicatorsTable = ({
  date,
}: {
  date: { from: string; to: string };
}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["meta-ads-fetch-performance-indicators-table-leads"],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "monthly_meta_campaign_performance",
          filters: {
            event_date_between: [date.from],
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
      const filteredData = data.filter(
        (item: any) => item.campaign !== "Total"
      );
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
    <Card>
      <CardHeader>
        <CardTitle>Indicadores de performance</CardTitle>
        <CardDescription>
          Resultados por campaña
          <p className=" italic">(Este mes)</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
};
