import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/utils/formatters";

type IndicatorsKeywords = {
  id: string;
  campaign: string;
  text: string;
  revenue: number;
  sessions: number;
};

export const columns: ColumnDef<IndicatorsKeywords>[] = [
  {
    accessorKey: "campaign",
    header: "Campaña",
  },
  {
    accessorKey: "text",
    header: "Texto",
  },
  {
    accessorKey: "revenue",
    header: "Ingresos",
    cell: ({ row }) => formatCurrency(row.original.revenue),
  },
  {
    accessorKey: "sessions",
    header: "Sesiones",
    cell: ({ row }) => formatNumber(row.original.sessions),
  },
];

export const data: IndicatorsKeywords[] = [
  {
    id: "1",
    campaign: "Campaña A",
    text: "Keyword 1",
    revenue: 1500,
    sessions: 300,
  },
  {
    id: "2",
    campaign: "Campaña B",
    text: "Keyword 2",
    revenue: 2500,
    sessions: 450,
  },
  {
    id: "3",
    campaign: "Campaña C",
    text: "Keyword 3",
    revenue: 1800,
    sessions: 350,
  },
];

export const IndicatorsKeywordsTable = ({ date }: { date: { from: string; to?: string } }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["indicators-keywords-table"],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "monthly_keyword_performance",
          filters: {
            event_date_between: [date.from, date.to],
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
        text: raw.palabra_clave,
        revenue: raw.ingresos ?? 0,
        sessions: raw.sesiones ?? 0,
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
        <CardTitle>Indicadores keywords</CardTitle>
        <CardDescription>Tabla de indicadores clave relacionados con las keywords.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
};
