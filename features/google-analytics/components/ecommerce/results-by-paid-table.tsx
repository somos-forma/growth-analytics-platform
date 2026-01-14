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
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/utils/formatters";
import { useQuery } from "@tanstack/react-query";

type ResultsByPaid = {
  id: string;
  paid: string;
  sessions: number;
  transactions: number;
  revenue: number;
  tickets_average: number;
  conversion_rate: number;
};

export const columns: ColumnDef<ResultsByPaid>[] = [
  {
    accessorKey: "paid",
    header: "Paid",
  },
  {
    accessorKey: "sessions",
    header: "Sesiones",
    cell: (data) => {
      return formatNumber(data.getValue<number>());
    },
  },
  {
    accessorKey: "transactions",
    header: "Transacciones",
    cell: (data) => {
      return formatNumber(data.getValue<number>());
    },
  },
  {
    accessorKey: "revenue",
    header: "Ingresos",
    cell: (data) => {
      return formatCurrency(data.getValue<number>());
    },
  },
  {
    accessorKey: "tickets_average",
    header: "Ticket Promedio",
    cell: (data) => {
      return formatPercentage(data.getValue<number>());
    },
  },
  {
    accessorKey: "conversion_rate",
    header: "Tasa de Conversión",
    cell: (data) => {
      return formatPercentage(data.getValue<number>());
    },
  },
];

export const data: ResultsByPaid[] = [
  {
    id: "1",
    paid: "Google Ads",
    sessions: 1200,
    transactions: 150,
    revenue: 4500,
    tickets_average: 30,
    conversion_rate: 12.5,
  },
  {
    id: "2",
    paid: "Facebook Ads",
    sessions: 900,
    transactions: 90,
    revenue: 2700,
    tickets_average: 30,
    conversion_rate: 10.0,
  },
];
export const ResultsByPaidTable = ({
  date,
}: {
  date: { from: string; to?: string };
}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["results-by-paid"],
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
        transactions: raw.transacciones ?? 0,
        revenue: raw.ingresos ?? 0,
        tickets_average: raw.ticket_promedio ?? 0,
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
      <CardHeader>
        <CardTitle>Resultados por Paid</CardTitle>
        <CardDescription>Rendimiento de los canales</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
};
