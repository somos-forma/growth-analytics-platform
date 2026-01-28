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
          table: "ga4_traffic_campaign_monthly_yoy",
          filters: {
            event_date_between: [date.from, date.to || date.from],
          },
          limit: 1,
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

  const adaptedData = data?.rows?.map((item: any, index: number) => ({
    id: index,
    total_users: item.total_usuarios ?? 0,
    diff_total_users: item.diff_pct_total_users ?? 0,
    new_users: item.new_users ?? 0,
    diff_new_users: item.diff_pct_new_users ?? 0,
    sessions: item.sessions ?? 0,
    diff_sessions: item.diff_pct_sessions ?? 0,
    engaged_sessions: item.engaged_sessions ?? 0,
    diff_engaged_sessions: item.diff_pct_engaged_sessions ?? 0,
    average_session_duration: item.duracion_media_sesion ?? 0,
    diff_average_session_duration: item.diff_duracion_media_sesion ?? 0,
    bounce_rate: item.tasa_rebote ?? 0,
    diff_bounce_rate: item.diff_abs_tasa_rebote ?? 0,
    key_events: item.evento_clave ?? 0,
    diff_key_events: item.diff_pct_evento_clave ?? 0,
    key_event_rate: item.tasa_evento_clave ?? 0,
    diff_key_event_rate: item.diff_abs_tasa_evento_clave ?? 0,
  }));

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

  const test = Object.entries(adaptedData[0] || {})
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
        diff: adaptedData[0][diffKey],
        isPositive: adaptedData[0][diffKey] >= 0,
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
