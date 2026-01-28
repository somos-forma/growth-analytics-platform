import { useQuery } from "@tanstack/react-query";
import { MetricCard, type Unit } from "@/components/metric-card";
import { OverviewSkeleton } from "@/components/skeletons/overview-skeleton";

function aggregateOverviewData(rows: any[]) {
  const grouped = rows.reduce(
    (acc: { [fecha: string]: { inversion_total: number; conversiones_total: number } }, row: any) => {
      const fecha = row.fecha;
      if (!acc[fecha]) {
        acc[fecha] = { inversion_total: row.inversion_total || 0, conversiones_total: row.conversiones_total || 0 };
      }
      return acc;
    },
    {} as { [fecha: string]: { inversion_total: number; conversiones_total: number } },
  );

  const totalInversion = (Object.values(grouped) as { inversion_total: number; conversiones_total: number }[]).reduce(
    (sum, day) => sum + day.inversion_total,
    0,
  );
  const totalConversiones = (
    Object.values(grouped) as { inversion_total: number; conversiones_total: number }[]
  ).reduce((sum, day) => sum + day.conversiones_total, 0);

  return {
    inversion_total: totalInversion,
    conversiones_total: totalConversiones,
    cpa_total: totalConversiones > 0 ? totalInversion / totalConversiones : 0,
  };
}
export const OverviewLeads = ({ date }: { date: { from: string; to?: string } }) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["google-ads-monthly-overview-leads", date.from, date.to],
    queryFn: async () => {
      // Calculate previous year date
      const currentDate = new Date(date.from);
      const previousDate = new Date(currentDate);
      previousDate.setFullYear(previousDate.getFullYear() - 1);
      const previousFrom = previousDate.toISOString().split("T")[0];

      // Fetch current period data
      const currentResponse = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "daily_campaign_google_ads_summary",
          filters: {
            event_date_between: [date.from, date.to],
          },
          limit: 1000,
        }),
      });
      if (!currentResponse.ok) {
        throw new Error("Network response was not ok for current data");
      }
      const currentJson = await currentResponse.json();
      const currentRows = currentJson.rows || [];
      const currentOverview = aggregateOverviewData(currentRows);

      // Fetch previous period data
      const previousResponse = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "daily_campaign_google_ads_summary",
          filters: {
            event_date_between: [previousFrom, previousDate.toISOString().split("T")[0]],
          },
          limit: 1000,
        }),
      });
      if (!previousResponse.ok) {
        throw new Error("Network response was not ok for previous data");
      }
      const previousJson = await previousResponse.json();
      const previousRows = previousJson.rows || [];
      const previousOverview = aggregateOverviewData(previousRows);

      const titlesMap: { [key: string]: string } = {
        inversion_total: "Inversión",
        conversiones_total: "Conversiones",
        cpa_total: "CPA",
      };

      const unitsByKey: { [key: string]: Unit } = {
        inversion_total: "currency",
        conversiones_total: "number",
        cpa_total: "currency",
      };

      function calcChange(curr: number, prev: number) {
        if (!prev || prev === 0) return 0;
        return ((curr - prev) / prev) * 100;
      }

      const transformed = Object.keys(titlesMap).map((key) => {
        const currValue = (currentOverview as any)[key] ?? 0;
        const prevValue = (previousOverview as any)[key] ?? 0;
        const change = calcChange(currValue, prevValue);
        return {
          id: key,
          title: titlesMap[key],
          value: currValue,
          unit: unitsByKey[key] || "number",
          change,
          isPositive: change > 0,
        };
      });
      return transformed;
    },
  });

  if (isPending) {
    return (
      <div className="space-y-5">
        <h1 className="text-left font-bold text-2xl">Resultados Generales</h1>
        <OverviewSkeleton items={3} />
      </div>
    );
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }
  return (
    <div className="space-y-5">
      <div className="p-2">
        <h1 className="text-left font-bold text-2xl">Resultados Generales</h1>
        <p className="text-muted-foreground">
          Visión consolidada del desempeño digital, considerando inversión, volumen de conversiones y eficiencia.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {data.map((metric) => (
          <MetricCard
            key={metric.id}
            id={metric.id}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            change={metric.change}
            isPositive={metric.isPositive}
          />
        ))}
      </div>
    </div>
  );
};
