import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPercentage } from "@/utils/formatters";

type ChannelGroupMetrics = {
  id: string;
  channel: string;
  new_users: number;
  sessions: number;
  key_events: number;
  key_events_rate: number;
};

export const columns: ColumnDef<ChannelGroupMetrics>[] = [
  {
    accessorKey: "channel",
    header: "Canal",
  },
  {
    accessorKey: "new_users",
    header: "Usuarios nuevos",
    cell: (data) => {
      return formatNumber(data.getValue() as number);
    },
  },
  {
    accessorKey: "sessions",
    header: "Sesiones",
    cell: (data) => {
      return formatNumber(data.getValue() as number);
    },
  },
  {
    accessorKey: "key_events",
    header: "Eventos Clave",
    cell: (data) => {
      return formatNumber(data.getValue() as number);
    },
  },
  {
    accessorKey: "key_events_rate",
    header: "Tasa evento clave",
    cell: (data) => {
      return formatPercentage(data.getValue() as number);
    },
  },
];

export const data: ChannelGroupMetrics[] = [
  {
    id: "1",
    channel: "Direct",
    new_users: 1200,
    sessions: 0.05,
    key_events: 0.25,
    key_events_rate: 0.15,
  },
  {
    id: "2",
    channel: "Organic Search",
    new_users: 900,
    sessions: 0.03,
    key_events: 0.2,
    key_events_rate: 0.1,
  },
];

export const ChannelGroupMetricsTable = ({ date }: { date: { from: string; to?: string } }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["channel-group-metrics", date.from],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "ga4_traffic_channel_monthly_kpis",
          filters: {
            event_date_between: [date.from],
          },
          limit: 1000,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const result = await response.json();

      return result;
    },
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle> Tabla 1 Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Error cargando datos: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  const transformedData: ChannelGroupMetrics[] = data.rows?.map((item: unknown, index: number) => ({
    id: index.toString(),
    channel: item?.session_default_channel_group,
    new_users: item?.usuarios_nuevos,
    sessions: item?.sesiones,
    key_events: item?.eventos_clave,
    key_events_rate: item?.tasa_eventos_clave,
  }));
  return (
    <Card>
      <CardHeader>{/* <CardTitle> Tabla 1 Leads</CardTitle> */}</CardHeader>
      <CardContent>
        <DataTable columns={columns} data={transformedData} />
      </CardContent>
    </Card>
  );
};
