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
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

type PerformanceIndicatorsPmax = {
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

export const columns: ColumnDef<PerformanceIndicatorsPmax>[] = [
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
    header: "Tasa de conversión",
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
export const data: PerformanceIndicatorsPmax[] = [
  {
    id: "1",
    campaign: "Campaña PMAX 1",
    investment: 1500,
    revenue: 4500,
    impressions: 100000,
    sessions: 8000,
    clics: 5000,
    transactions: 300,
    cps: 15,
    cpc: 0.3,
    cpa: 5,
    ctr: 0.05,
    conversion_rate: 0.06,
    roas: 3,
    ticket_average: 15,
  },
  {
    id: "2",
    campaign: "Campaña PMAX 2",
    investment: 2000,
    revenue: 6000,
    impressions: 150000,
    sessions: 12000,
    clics: 7000,
    transactions: 400,
    cps: 12.5,
    cpc: 0.28,
    cpa: 5,
    ctr: 0.0467,
    conversion_rate: 0.0571,
    roas: 3,
    ticket_average: 15,
  },
];

export const PerformanceIndicatorsPmaxTable = ({
  date,
}: {
  date: { from: string; to?: string };
}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetch-performance-indicators-pmax-table"],
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
      const data = json.rows
        .map((raw: any, index: number) => ({
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
        }))
        .filter((item: any) => item.campaign.toLowerCase().includes("pmax"));

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
        <CardTitle>Indicadores Performance PMAX 2025</CardTitle>
        <CardDescription>
          Tabla de indicadores clave de rendimiento para campañas PMAX
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
