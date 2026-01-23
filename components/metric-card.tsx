import { TrendingDown, TrendingUp } from "lucide-react";
import { formatCurrency, formatNumber, formatPercentage, formatTime } from "@/utils/formatters";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export type Unit = "number" | "percentage" | "currency" | "time";

export interface MetricCard {
  id: string;
  title: string;
  value: number; // Valor numérico crudo (sin formato)
  unit: Unit; // Define el formato del valor
  change: number; // Valor de cambio porcentual (ej: +15.7 o -0.2)
  isPositive: boolean; // Indica si el cambio es positivo o negativo
}

export const MetricCard = ({ title, value, unit, change, isPositive }: MetricCard) => {
  function formatValue(value: number, unit: Unit) {
    switch (unit) {
      case "currency":
        return formatCurrency(value);
      case "percentage":
        return formatPercentage(value);
      case "time":
        return formatTime(value);
      default:
        return formatNumber(value);
    }
  }
  const newValue = formatValue(value, unit);

  // console.log(isPositive, change);

  // const hardcodedChange = 6.5;
  // const isHardcodedPositive = hardcodedChange >= 0;

  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex justify-center">{title}</CardDescription>
        <CardTitle className="text-xl flex justify-center sm:text-2xl  font-bold">{newValue}</CardTitle>
        {/* <p className={`flex justify-center ${isHardcodedPositive ? "text-green-500" : "text-destructive"}`}>
          {formatPercentage(hardcodedChange, 1)}
        </p> */}
        {change !== 0 && (
          <p className="flex justify-center gap-2">
            {isPositive ? <TrendingUp className="text-green-500" /> : <TrendingDown className="text-destructive" />}{" "}
            {formatPercentage(change, 1)}
          </p>
        )}
      </CardHeader>
    </Card>
  );
};
