"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon, Download, StarsIcon } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "./components/ecommerce/overview";
import { PerformanceIndicatorsTable } from "./components/ecommerce/performance-indicators-table";
import { PerformanceIndicatorsSearchTable } from "./components/ecommerce/performance-indicators-search-table";
import { PerformanceIndicatorsPmaxTable } from "./components/ecommerce/performance-indicators-pmax-table";
import { PerformanceIndicatorsGenTable } from "./components/ecommerce/performance-indicators-gen";
import { CostAndConversionByDay } from "./components/ecommerce/cost-and-convertion-by-day";
import { ConversionAndRateByDay } from "./components/ecommerce/conversion-and-rate-by-day";
import { IndicatorsKeywordsTable } from "./components/ecommerce/indicators-keywords-table";
import { OverviewLeads } from "./components/leads/overview-leads";
import { LeadsCharts } from "./components/leads/leads-charts";
import { LeadsTable } from "./components/leads/leads-table";
import { LeadsKeywordsTable } from "./components/leads/leads-keywords-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CostAndConversionByHour } from "./components/ecommerce/cost-and-convertion-by-hour";
import { ConversionAndRateByHour } from "./components/ecommerce/conversion-and-rate-by-hour";

export const GoogleAds = () => {
  const [type, setType] = useState<"ecommerce" | "leads">("leads");

  if (type === "leads") {
    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-4xl">Google Ads </h1>
            <p className="text-muted-foreground">
              Análisis detallado de tus campañas de Google Ads
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
          <OverviewLeads
            date={{
              from: "2025-11-01",
            }}
          />
          <LeadsCharts date={{ from: "2025-01-01", to: "2025-12-31" }} />
          <LeadsTable
            date={{
              from: "2025-11-01",
            }}
          />
          <LeadsKeywordsTable
            date={{
              from: "2025-11-01",
            }}
          />
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
              <span className=" italic">
                (Comparación del mes actual con el mismo mes del año anterior)
              </span>
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
            <CostAndConversionByDay
              date={{ from: "2025-11-01", to: "2025-11-30" }}
            />
            {/* <CostAndConversionByHour /> */}
            <ConversionAndRateByDay
              date={{ from: "2025-11-01", to: "2025-11-30" }}
            />
            {/* <ConversionAndRateByHour /> */}
          </div>
          <IndicatorsKeywordsTable
            date={{ from: "2025-11-01", to: "2025-11-30" }}
          />
        </div>
      </div>
    );
  }
};
