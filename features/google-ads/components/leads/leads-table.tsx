import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency, formatNumber, formatPercentage } from "@/utils/formatters";

type LeadsTable = {
  id: string;
  campaign: string;
  investment: number;
  conversions: number;
  costs_conversion: number;
  ctr: number;
  lost_impression: number;
};

export const columns: ColumnDef<LeadsTable>[] = [
  {
    accessorKey: "campaign",
    header: "Campaña",
  },
  {
    accessorKey: "investment",
    header: "Inversión",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: "conversions",
    header: "Conversiones",
    cell: ({ getValue }) => formatNumber(getValue<number>()),
  },
  {
    accessorKey: "costs_conversion",
    header: "Coste por Conversión",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: "ctr",
    header: "CTR",
    cell: ({ getValue }) => formatPercentage(getValue<number>()),
  },
  {
    accessorKey: "lost_impression",
    header: "Impresiones Perdidas",
    cell: ({ getValue }) => formatPercentage(getValue<number>()),
  },
];
export const data: LeadsTable[] = [
  {
    id: "1",
    campaign: "Campaña A",
    investment: 5000,
    conversions: 200,
    costs_conversion: 25,
    ctr: 0.05,
    lost_impression: 0.1,
  },
  {
    id: "2",
    campaign: "Campaña B",
    investment: 8000,
    conversions: 350,
    costs_conversion: 22.86,
    ctr: 0.07,
    lost_impression: 0.08,
  },
  {
    id: "3",
    campaign: "Campaña C",
    investment: 6000,
    conversions: 250,
    costs_conversion: 24,
    ctr: 0.06,
    lost_impression: 0.09,
  },
];

export const LeadsTable = ({ date }: { date: { from: string; to: string } }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["google-ads-leads-table", date.from, date.to],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "campaign_google_ads_summary",
          filters: {
            event_date_between: [date.from, date.to],
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
        investment: raw.inversion ?? 0,
        conversions: raw.conversiones ?? 0,
        costs_conversion: raw.coste_por_conversion ?? 0,
        ctr: raw.ctr ?? 0,
        lost_impression: raw.cuota_impresiones_perdidas ?? 0,
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
    <>
      <div className="p-2">
        <h2 className="font-bold text-2xl">Desempeño de campañas </h2>
        <p className="text-muted-foreground">
          Aporte de cada campaña al volumen total de conversiones y a la eficiencia de la inversión.
        </p>
      </div>
      <Card>
        <CardHeader>
          {/* <CardTitle>Indicadores Performance de Campañas</CardTitle>
        <CardDescription>
          Tabla de indicadores clave de rendimiento para campañas
        </CardDescription> */}
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </>
  );
};
