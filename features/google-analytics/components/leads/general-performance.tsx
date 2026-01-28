"use client";

import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/metric-card";
import { OverviewSkeleton } from "@/components/skeletons/overview-skeleton";

export const GeneralPerformance = ({ date }: { date: { from: string; to?: string } }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["ga4_traffic_campaign_monthly_yoy", date.from, date.to],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "daily_ga4_traffic_campaign_yoy",
          filters: {
            event_date_between: [date.from, date.to || date.from],
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
    return <OverviewSkeleton />;
  }

  function aggregateData(rows: any[]) {
    return rows.reduce(
      (acc: any, row: any) => {
        acc.total_users += row.total_usuarios ?? 0;
        acc.diff_total_users += row.diff_pct_total_users ?? 0;
        acc.new_users += row.new_users ?? 0;
        acc.diff_new_users += row.diff_pct_new_users ?? 0;
        acc.sessions += row.sessions ?? 0;
        acc.diff_sessions += row.diff_pct_sessions ?? 0;
        acc.engaged_sessions += row.engaged_sessions ?? 0;
        acc.diff_engaged_sessions += row.diff_pct_engaged_sessions ?? 0;
        acc.average_session_duration += row.duracion_media_sesion ?? 0;
        acc.diff_average_session_duration += row.diff_duracion_media_sesion ?? 0;
        acc.bounce_rate += row.tasa_rebote ?? 0;
        acc.diff_bounce_rate += row.diff_abs_tasa_rebote ?? 0;
        acc.key_events += row.evento_clave ?? 0;
        acc.diff_key_events += row.diff_pct_evento_clave ?? 0;
        acc.key_event_rate += row.tasa_evento_clave ?? 0;
        acc.diff_key_event_rate += row.diff_abs_tasa_evento_clave ?? 0;
        return acc;
      },
      {
        total_users: 0,
        diff_total_users: 0,
        new_users: 0,
        diff_new_users: 0,
        sessions: 0,
        diff_sessions: 0,
        engaged_sessions: 0,
        diff_engaged_sessions: 0,
        average_session_duration: 0,
        diff_average_session_duration: 0,
        bounce_rate: 0,
        diff_bounce_rate: 0,
        key_events: 0,
        diff_key_events: 0,
        key_event_rate: 0,
        diff_key_event_rate: 0,
      },
    );
  }

  const aggregatedData = aggregateData(data?.rows || []);

  const DICTIONARY = {
    total_users: "Total de usuarios",
    new_users: "Usuarios nuevos",
    sessions: "Sesiones",
    engaged_sessions: "Sesiones con interacción",
    average_session_duration: "Duracion media de la sesión",
    bounce_rate: "Porcentaje de rebote",
    key_events: "Eventos Clave",
    key_event_rate: "Tasa evento clave",
  };

  const test = Object.entries(aggregatedData)
    .map(([key, value]: [string, any]) => {
      if (key.startsWith("diff_") || key === "id") return null;

      const diffKey = `diff_${key}`;
      return {
        id: key,
        title: DICTIONARY[key as keyof typeof DICTIONARY] || key,
        value: value,
        unit:
          key === "bounce_rate" || key === "key_event_rate"
            ? "percentage"
            : key === "average_session_duration"
              ? "time"
              : "number",
        diff: aggregatedData[diffKey],
        isPositive: aggregatedData[diffKey] >= 0,
      };
    })
    .filter((item) => item !== null);
  console.log("DATA", test);
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      {test.map((item, i) => (
        <MetricCard
          key={i}
          id={item.id}
          title={item.title}
          value={item.value}
          unit={item.unit}
          change={item.diff}
          isPositive={item.isPositive}
        />
      ))}
    </div>
  );
};
