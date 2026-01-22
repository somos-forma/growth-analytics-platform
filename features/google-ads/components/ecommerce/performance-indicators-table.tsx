import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber, formatPercentage } from "@/utils/formatters";

type PerformanceIndicators = {
  id: string;
  account: string;
  investment: number;
  impressions: number;
  clicks: number;
  ctr: number;
  sessions: number;
  clicks_or_sessions: number;
  transactions: number;
  cps: number;
  cpc: number;
  cpm: number;
  cpa: number;
};

export const columns: ColumnDef<PerformanceIndicators>[] = [
  {
    accessorKey: "account",
    header: "Cuenta",
  },
  {
    accessorKey: "investment",
    header: "Inversión",
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
    accessorKey: "ctr",
    header: "CTR",
    cell: ({ getValue }) => formatPercentage(getValue<number>()),
  },
  {
    accessorKey: "sessions",
    header: "Sesiones",
    cell: ({ getValue }) => formatNumber(getValue<number>()),
  },
  {
    accessorKey: "clicks_or_sessions",
    header: "Clics o Sesiones",
    cell: ({ getValue }) => formatPercentage(getValue<number>()),
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
    accessorKey: "cpm",
    header: "CPM",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: "cpa",
    header: "CPA",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
];

export const data: PerformanceIndicators[] = [
  {
    id: "1",
    account: "Cuenta A",
    investment: 1500,
    impressions: 100000,
    clicks: 5000,
    ctr: 0.05,
    sessions: 4500,
    clicks_or_sessions: 1.11,
    transactions: 300,
    cps: 5,
    cpc: 0.3,
    cpm: 15,
    cpa: 10,
  },
  {
    id: "2",
    account: "Cuenta B",
    investment: 2500,
    impressions: 200000,
    clicks: 8000,
    ctr: 0.04,
    sessions: 7000,
    clicks_or_sessions: 1.14,
    transactions: 500,
    cps: 5,
    cpc: 0.3125,
    cpm: 12.5,
    cpa: 12.5,
  },
];

export const PerformanceIndicatorsTable = ({ date }: { date: { from: string; to?: string } }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetch-performance-indicators-table"],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "monthly_google_ads_performance",
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
        account: "Integramedica",
        investment: raw.inversion ?? 0,
        impressions: raw.impresiones ?? 0,
        clicks: raw.clics ?? 0,
        ctr: raw.ctr ?? 0,
        sessions: raw.sesiones ?? 0,
        clicks_or_sessions: raw.pct_clics_sesiones ?? 0,
        transactions: raw.transacciones ?? 0,
        cps: raw.cps ?? 0,
        cpc: raw.cpc ?? 0,
        cpm: raw.cpm ?? 0,
        cpa: raw.cpa ?? 0,
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
        <CardTitle>Indicadores de Performance</CardTitle>
        <CardDescription>
          Rendimiento de los principales canales de adquisición
          <br />
          <span className=" italic">(Comparación del mes actual con el mismo mes del año anterior)</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
};
