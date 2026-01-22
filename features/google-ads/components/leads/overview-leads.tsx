import { useQuery } from "@tanstack/react-query";
import { MetricCard, type Unit } from "@/components/metric-card";
import { OverviewSkeleton } from "@/components/skeletons/overview-skeleton";
export const OverviewLeads = ({ date }: { date: { from: string } }) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["google-ads-monthly-overview-leads", date.from],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "campaign_google_ads_summary",
          filters: {
            event_date_between: [date.from],
          },
          limit: 1000,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      const overview = json.rows[0];

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

      const transformed = Object.keys(titlesMap).map((key) => {
        return {
          id: key,
          title: titlesMap[key],
          value: overview[key] ?? 0,
          unit: unitsByKey[key] || "number",
          change: 0,
          isPositive: true,
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
