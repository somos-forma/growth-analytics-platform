import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/utils/formatters";
import { TrendingDown, TrendingUp } from "lucide-react";

export type Unit = "number" | "percentage" | "currency";

export interface MetricCard {
  id: string;
  title: string;
  value: number; // Valor numérico crudo (sin formato)
  unit: Unit; // Define el formato del valor
  change: number; // Valor de cambio porcentual (ej: +15.7 o -0.2)
  isPositive: boolean; // Indica si el cambio es positivo o negativo
}

export const MetricCard = ({
  id,
  title,
  value,
  unit,
  change,
  isPositive,
}: MetricCard) => {
  function formatValue(value: number, unit: Unit) {
    switch (unit) {
      case "currency":
        return formatCurrency(value);
      case "percentage":
        return formatPercentage(value);
      case "number":
      default:
        return formatNumber(value);
    }
  }
  const newValue = formatValue(value, unit);

  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex justify-between">
          {title}
        </CardDescription>
        <CardTitle className="text-xl sm:text-2xl  font-bold">
          {newValue}
        </CardTitle>
        {change !== 0 && (
          <p className="flex gap-2">
            {isPositive ? (
              <TrendingUp className="text-green-500" />
            ) : (
              <TrendingDown className="text-destructive" />
            )}{" "}
            {formatPercentage(change, 1)}
          </p>
        )}
      </CardHeader>
    </Card>
  );
};
