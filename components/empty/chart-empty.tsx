import { ChartPie } from "lucide-react";
import React from "react";

export const ChartEmpty = () => {
  return (
    <div className="text-muted-foreground text-center h-[250px] flex items-center justify-center flex-col gap-4">
      <ChartPie size={48} />
      Sin datos para mostrar
    </div>
  );
};
