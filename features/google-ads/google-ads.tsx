"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, Download, StarsIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ConversionAndRateByDay } from "./components/ecommerce/conversion-and-rate-by-day";
import { CostAndConversionByDay } from "./components/ecommerce/cost-and-convertion-by-day";
import { IndicatorsKeywordsTable } from "./components/ecommerce/indicators-keywords-table";
import { Overview } from "./components/ecommerce/overview";
import { PerformanceIndicatorsGenTable } from "./components/ecommerce/performance-indicators-gen";
import { PerformanceIndicatorsPmaxTable } from "./components/ecommerce/performance-indicators-pmax-table";
import { PerformanceIndicatorsSearchTable } from "./components/ecommerce/performance-indicators-search-table";
import { PerformanceIndicatorsTable } from "./components/ecommerce/performance-indicators-table";
import { LeadsCharts } from "./components/leads/leads-charts";
import { LeadsKeywordsTable } from "./components/leads/leads-keywords-table";
import { LeadsTable } from "./components/leads/leads-table";
import { OverviewLeads } from "./components/leads/overview-leads";

export const GoogleAds = () => {
  const [type, _] = useState<"ecommerce" | "leads">("leads");
  const [date, setDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [open, setOpen] = useState(false);

  if (type === "leads") {
    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-4xl">Google Ads </h1>
            <p className="text-muted-foreground">Análisis detallado de tus campañas de Google Ads</p>
          </div>
          {/* actions */}
          <div className="flex gap-3 ">
            {/* <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" id="date" className="w-48 justify-between font-semibold">
                  {format(date || new Date(), "MMMM yyyy", { locale: es })}
                  <ChevronDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date);
                    setOpen(false);
                  }}
                  locale={es}
                />
              </PopoverContent>
            </Popover> */}
            <Button variant="outline">
              <StarsIcon />
              Resumen con AI
            </Button>
            <Button variant="outline">
              <Download />
              Exportar
            </Button>
          </div>
        </div>
        <div className="space-y-5">
          <div className="w-full flex justify-end">
            <div className="flex flex-row items-end gap-2">
              <p className="text-sm text-muted-foreground m-auto">Seleccione por fecha: </p>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" id="date" className="w-48 justify-between font-semibold">
                    {format(date || new Date(), "MMMM yyyy", { locale: es })}
                    <ChevronDown />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      setDate(date);
                      setOpen(false);
                    }}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <OverviewLeads date={{ from: "2025-01-01", to: "2026-01-31" }} />
          <LeadsCharts date={{ from: "2025-01-01", to: "2026-01-31" }} />
          <LeadsTable date={{ from: "2025-01-01", to: "2026-01-31" }} />
          <LeadsKeywordsTable date={{ from: "2025-01-01", to: "2026-01-31" }} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-4xl">Google Ads </h1>
            <p className="text-muted-foreground">
              Análisis detallado de tus campañas de Google Ads
              <br />
              <span className=" italic">(Comparación del mes actual con el mismo mes del año anterior)</span>
            </p>
          </div>
          {/* actions */}
          <div className="flex gap-3 ">
            {/* <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-semibold"
                >
                  {format(date || new Date(), "MMMM yyyy", { locale: es })}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date);
                    setOpen(false);
                  }}
                  locale={es}
                />
              </PopoverContent>
            </Popover> */}
            <Button variant="outline">
              <StarsIcon />
              Resumen con AI
            </Button>
            <Button variant="outline">
              <Download />
              Exportar
            </Button>
          </div>
        </div>
        <div className="space-y-5">
          <Overview date={{ from: "2024-11-01", to: "2025-11-01" }} />
          <PerformanceIndicatorsTable date={{ from: "2025-11-01" }} />
          <PerformanceIndicatorsSearchTable date={{ from: "2025-11-01" }} />
          <PerformanceIndicatorsPmaxTable date={{ from: "2025-11-01" }} />
          <PerformanceIndicatorsGenTable date={{ from: "2025-11-01" }} />
          <div>
            <p className="font-bold text-xl">Indicadores de Costos</p>
            <span className=" italic">(Este mes)</span>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <CostAndConversionByDay date={{ from: "2025-11-01", to: "2025-11-30" }} />
            {/* <CostAndConversionByHour /> */}
            <ConversionAndRateByDay date={{ from: "2025-11-01", to: "2025-11-30" }} />
            {/* <ConversionAndRateByHour /> */}
          </div>
          <IndicatorsKeywordsTable date={{ from: "2025-11-01", to: "2025-11-30" }} />
        </div>
      </div>
    );
  }
};
