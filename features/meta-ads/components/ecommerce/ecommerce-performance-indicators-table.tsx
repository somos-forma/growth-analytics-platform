import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber, formatPercentage } from "@/utils/formatters";

type PerformanceIndicatorsGen = {
  id: string;
  campaign: string;
  costs: number;
  impressions: number;
  reach: number;
  clicks: number;
  frequency: number;
  cost_by_action: number;
  link_ctr: number;
  cpc: number;
  cpm: number;
  page_engagement_rate: number;
  post_comments: number;
};

export const columns: ColumnDef<PerformanceIndicatorsGen>[] = [
  {
    accessorKey: "campaign",
    header: "Campaña",
  },
  {
    accessorKey: "costs",
    header: "Costos",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: "impressions",
    header: "Impresiones",
    cell: ({ getValue }) => formatNumber(getValue<number>()),
  },
  {
    accessorKey: "reach",
    header: "Alcance",
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
    accessorKey: "cost_by_action",
    header: "Costo por acción",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: "link_ctr",
    header: "CTR de enlace",
    cell: ({ getValue }) => formatPercentage(getValue<number>()),
  },
  {
    accessorKey: "cpc",
    header: "CPC",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: "cpm",
    header: "CPM",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: "page_engagement_rate",
    header: "Tasa de participación de la página",
    cell: ({ getValue }) => formatPercentage(getValue<number>()),
  },
  {
    accessorKey: "post_comments",
    header: "Comentarios de la publicación",
    cell: ({ getValue }) => formatNumber(getValue<number>()),
  },
];
export const data: PerformanceIndicatorsGen[] = [
  {
    id: "1",
    campaign: "Campaña Gen 1",
    costs: 1200,
    impressions: 50000,
    reach: 30000,
    clicks: 4000,
    frequency: 1.67,
    cost_by_action: 0.3,
    link_ctr: 0.08,
    cpc: 0.3,
    cpm: 24,
    page_engagement_rate: 0.12,
    post_comments: 150,
  },
  {
    id: "2",
    campaign: "Campaña Gen 2",
    costs: 2500,
    impressions: 100000,
    reach: 60000,
    clicks: 8000,
    frequency: 1.67,
    cost_by_action: 0.31,
    link_ctr: 0.08,
    cpc: 0.31,
    cpm: 25,
    page_engagement_rate: 0.13,
    post_comments: 300,
  },
];
export const EcommercePerformanceIndicatorsTable = ({ date }: { date: { from: string; to?: string } }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["meta-ads-fetch-performance-indicators-table"],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "meta_campaign_performance",
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
        reach: raw.alcance ?? 0,
        clicks: raw.clicks ?? 0,
        frequency: raw.frecuencia ?? 0,
        cost_by_action: raw.cpa ?? 0,
        link_ctr: raw.ctr ?? 0,
        cpc: raw.cpc ?? 0,
        cpm: raw.cpm ?? 0,
        page_engagement_rate: raw.page_engagement_rate ?? 0,
        post_comments: raw.post_comments ?? 0,
      }));

      return data;
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
          Tabla de indicadores clave de rendimiento para campañas
          <p className="italic">(Este mes)</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
};
