"use client";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

type PerformanceByPaid = {
  id: string;
  paid: string;
  sessions: number;
  session_delta: number;
  transactions: number;
  transactions_delta: number;
  revenue: number;
  revenue_delta: number;
  tickets_average: number;
  tickets_average_delta: number;
  conversion_rate: number;
};

export const columns: ColumnDef<PerformanceByPaid>[] = [
  {
    accessorKey: "paid",
    header: "Paid Medium",
  },
  {
    accessorKey: "sessions",
    header: "Sesiones",
  },
  {
    accessorKey: "session_delta",
    header: "Δ Sesiones",
  },
  {
    accessorKey: "transactions",
    header: "Transacciones",
  },
  {
    accessorKey: "transactions_delta",
    header: "Δ Transacciones",
  },
  {
    accessorKey: "revenue",
    header: "Ingresos",
  },
  {
    accessorKey: "revenue_delta",
    header: "Δ Ingresos",
  },
  {
    accessorKey: "tickets_average",
    header: "Ticket Medio",
  },
  {
    accessorKey: "tickets_average_delta",
    header: "Δ Ticket Medio",
  },
  {
    accessorKey: "conversion_rate",
    header: "Tasa de Conversión",
  },
];

export const data: PerformanceByPaid[] = [
  {
    id: "1",
    paid: "Google Ads",
    sessions: 1000,
    session_delta: 100,
    transactions: 100,
    transactions_delta: 10,
    revenue: 5000,
    revenue_delta: 500,
    tickets_average: 50,
    tickets_average_delta: 5,
    conversion_rate: 10,
  },
];

export const PerformanceByPaidTable = ({
  date,
}: {
  date: { from: string };
}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["performance-by-paid"],
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

      const json = await response.json();
      const data = json.rows.map((raw: any, index: number) => ({
        id: String(index + 1),
        paid: raw.medio,
        sessions: raw.sesiones ?? 0,
        session_delta: raw.pct_sesiones ?? 0,
        transactions: raw.transacciones ?? 0,
        transactions_delta: raw.pct_transacciones ?? 0,
        revenue: raw.ingresos ?? 0,
        revenue_delta: raw.pct_ingresos ?? 0,
        tickets_average: raw.ticket_promedio ?? 0,
        tickets_average_delta: raw.ticket_promedio ?? 0,
        conversion_rate: raw.tasa_conversion_pct ?? 0,
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
  return (
    <Card>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
};
