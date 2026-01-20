import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { format, subYears, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPercentage } from "@/utils/formatters";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

type ChannelGroupMetrics = {
  id: string;
  channel_group: string;
  new_users: number;
  new_users_delta: number;
  session_interaction: number;
  session_interaction_delta: number;
  step: number;
  step_delta: number;
};

export const columns: ColumnDef<ChannelGroupMetrics>[] = [
  {
    accessorKey: "channel_group",
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
    accessorKey: "new_users_delta",
    header: "Sesiones",
    cell: (data) => {
      return formatPercentage(data.getValue() as number);
    },
  },
  {
    accessorKey: "session_interaction",
    header: "Eventos Clave",
    cell: (data) => {
      return formatNumber(data.getValue() as number);
    },
  },
  {
    accessorKey: "session_interaction_delta",
    header: "Tasa evento clave",
    cell: (data) => {
      return formatPercentage(data.getValue() as number);
    },
  },
  // {
  //   accessorKey: "step",
  //   header: "Step 1",
  //   cell: (data) => {
  //     return formatNumber(data.getValue() as number);
  //   },
  // },
  // {
  //   accessorKey: "step_delta",
  //   header: " % Δ",
  //   cell: (data) => {
  //     return formatPercentage(data.getValue() as number);
  //   },
  // },
];

export const data: ChannelGroupMetrics[] = [
  {
    id: "1",
    channel_group: "Direct",
    new_users: 1200,
    new_users_delta: 0.05,
    session_interaction: 0.25,
    session_interaction_delta: 0.02,
    step: 0.15,
    step_delta: 0.01,
  },
  {
    id: "2",
    channel_group: "Paid Search",
    new_users: 900,
    new_users_delta: -0.03,
    session_interaction: 0.2,
    session_interaction_delta: -0.01,
    step: 0.1,
    step_delta: -0.005,
  },
];

export const ChannelGroupMetricsTable = () => {
  // Usar noviembre como mes actual ya que diciembre aún no tiene datos completos
  const currentDate = new Date();
  const lastMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );
  const currentMonthStart = format(startOfMonth(lastMonth), "yyyy-MM-dd");
  const lastYearMonthStart = format(
    startOfMonth(subYears(lastMonth, 1)),
    "yyyy-MM-dd"
  );

  console.log("Dates:", { currentMonthStart, lastYearMonthStart });

  const {
    data: apiData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["channel-group-metrics", currentMonthStart, lastYearMonthStart],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "channel_grouping_monthly",
          filters: {
            event_date_between: [lastYearMonthStart, currentMonthStart],
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
      console.log("API Response:", result);
      return result;
    },
  });

  console.log("Query state:", { isLoading, error, hasData: !!apiData });

  const transformedData: ChannelGroupMetrics[] = React.useMemo(() => {
    console.log("Transform - apiData:", apiData);

    if (!apiData) {
      console.log("apiData is undefined");
      return [];
    }

    if (!apiData.rows || apiData.rows.length === 0) {
      console.log("No data in response or empty array");
      return [];
    }

    // Group data by channel
    const channelMap = new Map<string, { current?: any; previous?: any }>();

    apiData.rows.forEach((item: any) => {
      const channel = item.session_default_channel_grouping;
      const itemDate = item.month_start;

      console.log("Processing item:", {
        channel,
        itemDate,
        usuarios_nuevos: item.usuarios_nuevos,
        sesiones_con_interaccion: item.sesiones_con_interaccion,
        fullItem: item,
      });

      if (!channelMap.has(channel)) {
        channelMap.set(channel, {});
      }

      const channelData = channelMap.get(channel)!;

      // Comparar solo la fecha (YYYY-MM-DD) sin hora
      const itemDateStr = itemDate?.substring(0, 10);

      console.log("Date comparison:", {
        itemDateStr,
        currentMonthStart,
        lastYearMonthStart,
        matchesCurrent: itemDateStr === currentMonthStart,
        matchesPrevious: itemDateStr === lastYearMonthStart,
      });

      if (itemDateStr === currentMonthStart) {
        console.log(`Setting CURRENT data for ${channel}`, item);
        channelData.current = item;
      } else if (itemDateStr === lastYearMonthStart) {
        console.log(`Setting PREVIOUS data for ${channel}`, item);
        channelData.previous = item;
      }
    });

    // Transform to ChannelGroupMetrics format
    const result: ChannelGroupMetrics[] = [];
    let index = 0;

    console.log("Channel Map:", channelMap);

    channelMap.forEach((value, channel) => {
      const currentData = value.current;
      const previousData = value.previous;

      console.log(`Channel: ${channel}`, {
        currentData,
        previousData,
        hasCurrentData: !!currentData,
        hasPreviousData: !!previousData,
      });

      const newUsers = currentData?.usuarios_nuevos || 0;
      const previousNewUsers = previousData?.usuarios_nuevos || 0;

      console.log(`${channel} - Users:`, {
        newUsers,
        previousNewUsers,
        currentDataKeys: currentData ? Object.keys(currentData) : [],
      });

      const newUsersDelta =
        previousNewUsers !== 0
          ? (newUsers - previousNewUsers) / previousNewUsers
          : 0;

      const sessionInteraction = currentData?.sesiones_con_interaccion || 0;
      const previousSessionInteraction =
        previousData?.sesiones_con_interaccion || 0;
      const sessionInteractionDelta =
        previousSessionInteraction !== 0
          ? (sessionInteraction - previousSessionInteraction) /
            previousSessionInteraction
          : 0;

      result.push({
        id: String(index++),
        channel_group: channel,
        new_users: newUsers,
        new_users_delta: newUsersDelta,
        session_interaction: sessionInteraction,
        session_interaction_delta: sessionInteractionDelta,
        step: 0,
        step_delta: 0,
      });
    });

    console.log("Transformed result:", result);
    return result;
  }, [apiData, currentMonthStart, lastYearMonthStart]);

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
          <div className="text-red-500">
            Error cargando datos: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle> Tabla 1 Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={transformedData} />
      </CardContent>
    </Card>
  );
};
