import { Pie, PieChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const UsersBySex = () => {
  const chartData = [
    { sex: "male", quantity: 275, fill: "var(--color-male)" },
    { sex: "female", quantity: 200, fill: "var(--color-female)" },
    { sex: "other", quantity: 187, fill: "var(--color-other)" },
  ];
  const chartConfig = {
    quantity: {
      label: "Quantity",
    },
    male: {
      label: "Hombres",
      color: "var(--chart-1)",
    },
    female: {
      label: "Mujeres",
      color: "var(--chart-2)",
    },
    other: {
      label: "Otros",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuarios por Sexo</CardTitle>
        <CardDescription>Distribución de usuarios según el sexo</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Pie data={chartData} dataKey="quantity" nameKey="sex" innerRadius={60} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
