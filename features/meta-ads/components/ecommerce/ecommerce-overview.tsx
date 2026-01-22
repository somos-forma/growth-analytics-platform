import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/metric-card";
import { OverviewSkeleton } from "@/components/skeletons/overview-skeleton";

export const EcommerceOverview = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["meta-ads-ecommerce-metrics"],
    queryFn: async () => {
      const response = await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          table: "meta_campaign_performance",
          // filters: {
          //   event_date_between: ["2025-11-01"],
          // },
          // limit: 1,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      const overview = json.rows[0];

      const titlesMap: { [key: string]: string } = {
        total_cost: "Total de costos",
        impresiones: "Impresiones",
        clicks: "Link Clics",
        alcance: "Reach",
        // falta total de ingresos
        ctr: "Links CTR",
        cpc: "CPC",
        cpm: "CPM",
        // falta porcentaje de rebote
        cpa: "CPA (Meta)",
      };

      const unitsByKey: { [key: string]: string } = {
        total_cost: "currency",
        impresiones: "number",
        clicks: "number",
        alcance: "number",
        // falta total de ingresos
        ctr: "percentage",
        cpc: "number",
        cpm: "number",
        // falta porcentaje de rebote
        cpa: "currency",
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
    return <OverviewSkeleton items={6} />;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4   gap-3">
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
  );
};
