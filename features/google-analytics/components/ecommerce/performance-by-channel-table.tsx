import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber, formatPercentage } from "@/utils/formatters";
import { useQuery } from "@tanstack/react-query";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

type PerformanceByChannel = {
  id: string;
  channel: string;
  sessions: number;
  session_percentage: number;
  session_delta: number;
  transactions: number;
  transactions_percentage: number;
  transactions_delta: number;
  revenue: number;
  revenue_percentage: number;
  revenue_delta: number;
  tickets_average: number;
  tickets_average_delta: number;
  conversion_rate: number;
  conversion_rate_delta: number;
};

export const columns: ColumnDef<PerformanceByChannel>[] = [
  {
    accessorKey: "channel",
    header: "Canal",
  },
  {
    accessorKey: "sessions",
    header: "Sesiones",
    cell: (data) => {
      return formatNumber(data.getValue() as number);
    },
  },
  {
    accessorKey: "session_percentage",
    header: "% Sesiones",
    cell: (data) => {
      return formatPercentage(data.getValue() as number);
    },
  },
  {
    accessorKey: "session_delta",
    header: "Δ Sesiones",
    cell: (data) => {
      return formatPercentage(data.getValue() as number);
    },
  },
  {
    accessorKey: "transactions",
    header: "Transacciones",
    cell: (data) => {
      return formatNumber(data.getValue() as number);
    },
  },
  {
    accessorKey: "transactions_percentage",
    header: "% Transacciones",
    cell: (data) => {
      return formatPercentage(data.getValue() as number);
    },
  },
  {
    accessorKey: "transactions_delta",
    header: "Δ Transacciones",
    cell: (data) => {
      return formatPercentage(data.getValue() as number);
    },
  },
  {
    accessorKey: "revenue",
    header: "Ingresos",
    cell: (data) => {
      return formatNumber(data.getValue() as number);
    },
  },
  {
    accessorKey: "revenue_percentage",
    header: "% Ingresos",
    cell: (data) => {
      return formatPercentage(data.getValue() as number);
    },
  },
  {
    accessorKey: "revenue_delta",
    header: "Δ Ingresos",
    cell: (data) => {
      return formatPercentage(data.getValue() as number);
    },
  },
  {
    accessorKey: "tickets_average",
    header: "Ticket Medio",
    cell: (data) => {
      return formatNumber(data.getValue() as number);
    },
  },
  {
    accessorKey: "tickets_average_delta",
    header: "Δ Ticket Medio",
    cell: (data) => {
      return formatPercentage(data.getValue() as number);
    },
  },
  {
    accessorKey: "conversion_rate",
    header: "Tasa de Conversión",
    cell: (data) => {
      return formatPercentage(data.getValue() as number);
    },
  },
  {
    accessorKey: "conversion_rate_delta",
    header: "Δ Tasa de Conversión",
    cell: (data) => {
      return formatPercentage(data.getValue() as number);
    },
  },
];

export const dummy: PerformanceByChannel[] = [
  {
    id: "1",
    channel: "Organic Search",
    sessions: 1200,
    session_percentage: 60,
    session_delta: 5,
    transactions: 300,
    transactions_percentage: 25,
    transactions_delta: 3,
    revenue: 15000,
    revenue_percentage: 30,
    revenue_delta: 10,
    tickets_average: 50,
    tickets_average_delta: 2,
    conversion_rate: 2.5,
    conversion_rate_delta: 0.2,
  },
  {
    id: "2",
    channel: "Paid Search",
    sessions: 800,
    session_percentage: 40,
    session_delta: -2,
    transactions: 200,
    transactions_percentage: 20,
    transactions_delta: -1,
    revenue: 10000,
    revenue_percentage: 20,
    revenue_delta: -5,
    tickets_average: 50,
    tickets_average_delta: -1,
    conversion_rate: 2.0,
    conversion_rate_delta: -0.1,
  },
];

export const PerformanceByChannelTable = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetch-performance-by-channel"],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "monthly_channel_performance",
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      const data = json.rows.map((raw: any, index: number) => ({
        id: String(index + 1),
        channel: raw.canal,
        sessions: raw.sesiones_actual ?? 0,
        session_percentage: raw.pct_sesiones ?? 0,
        session_delta: raw.var_sesiones_pct ?? 0,
        transactions: raw.transacciones_actual ?? 0,
        transactions_percentage: raw.pct_transacciones ?? 0,
        transactions_delta: raw.var_transacciones_pct ?? 0,
        revenue: raw.ingresos_actual ?? 0,
        revenue_percentage: raw.pct_ingresos ?? 0,
        revenue_delta: raw.var_ingresos_pct ?? 0,
        tickets_average: raw.ticket_promedio ?? 0,
        tickets_average_delta: raw.var_ticket_promedio_pct ?? 0,
        conversion_rate: raw.tasa_conversion ?? 0,
        conversion_rate_delta: raw.var_tasa_conversion_pct ?? 0,
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
        <CardTitle>Rendimiento por canal</CardTitle>
        <CardDescription>
          Analiza el rendimiento de tus canales de adquisición de tráfico.
          <br />
          <span className=" italic">
            (Comparación del mes actual con el mismo mes del año anterior)
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
};
