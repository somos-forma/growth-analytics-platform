import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber, formatPercentage } from "@/utils/formatters";

type PerformanceIndicatorsSearch = {
  id: string;
  campaign: string;
  investment: number;
  revenue: number;
  impressions: number;
  sessions: number;
  clics: number;
  transactions: number;
  cps: number;
  cpc: number;
  cpa: number;
  ctr: number;
  conversion_rate: number;
  roas: number;
  ticket_average: number;
};

export const columns: ColumnDef<PerformanceIndicatorsSearch>[] = [
  {
    accessorKey: "campaign",
    header: "Campaña de la sesión",
  },
  {
    accessorKey: "investment",
    header: "Inversión",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: "revenue",
    header: "Ingresos",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: "impressions",
    header: "Impresiones",
    cell: ({ getValue }) => formatNumber(getValue<number>()),
  },
  {
    accessorKey: "sessions",
    header: "Sesiones",
    cell: ({ getValue }) => formatNumber(getValue<number>()),
  },
  {
    accessorKey: "clics",
    header: "Clics",
    cell: ({ getValue }) => formatNumber(getValue<number>()),
  },
  {
    accessorKey: "transactions",
    header: "Transacciones",
    cell: ({ getValue }) => formatNumber(getValue<number>()),
  },
  {
    accessorKey: "cps",
    header: "CPS",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: "cpc",
    header: "CPC",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: "cpa",
    header: "CPA",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: "ctr",
    header: "CTR",
    cell: ({ getValue }) => formatPercentage(getValue<number>()),
  },
  {
    accessorKey: "conversion_rate",
    header: "Tasa de Conversión",
    cell: ({ getValue }) => formatPercentage(getValue<number>()),
  },
  {
    accessorKey: "roas",
    header: "ROAS",
    cell: ({ getValue }) => formatNumber(getValue<number>()),
  },
  {
    accessorKey: "ticket_average",
    header: "Ticket Promedio",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
];
export const data: PerformanceIndicatorsSearch[] = [
  {
    id: "1",
    campaign: "Campaña A",
    investment: 1500,
    revenue: 4500,
    impressions: 100000,
    sessions: 5000,
    clics: 3000,
    transactions: 150,
    cps: 10,
    cpc: 0.5,
    cpa: 20,
    ctr: 3,
    conversion_rate: 5,
    roas: 3,
    ticket_average: 30,
  },
  {
    id: "2",
    campaign: "Campaña B",
    investment: 2000,
    revenue: 6000,
    impressions: 150000,
    sessions: 7000,
    clics: 4000,
    transactions: 200,
    cps: 10,
    cpc: 0.5,
    cpa: 20,
    ctr: 2.67,
    conversion_rate: 5.71,
    roas: 3,
    ticket_average: 30,
  },
];

export const PerformanceIndicatorsSearchTable = ({ date }: { date: { from: string; to?: string } }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetch-performance-indicators-search-table"],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "campaign_google_ads_performance",
          filters: {
            event_date_between: [date.from],
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      const data = json.rows.map((raw: any, index: number) => ({
        id: String(index + 1),
        campaign: raw.campaign_name,
        investment: raw.inversion ?? 0,
        revenue: raw.ingresos ?? 0,
        impressions: raw.impresiones ?? 0,
        sessions: raw.sesiones ?? 0,
        clics: raw.clics ?? 0,
        transactions: raw.transacciones ?? 0,
        cps: raw.cps ?? 0,
        cpc: raw.cpc ?? 0,
        cpa: raw.cpa ?? 0,
        ctr: raw.ctr ?? 0,
        conversion_rate: raw.tasa_conversion ?? 0,
        roas: raw.roas ?? 0,
        ticket_average: raw.ticket_promedio ?? 0,
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
        <CardTitle>Indicadores Performance Search</CardTitle>
        <CardDescription>
          Tabla de indicadores clave de rendimiento para campañas de búsqueda
          <br />
          <span className=" italic">(Este mes)</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
};
