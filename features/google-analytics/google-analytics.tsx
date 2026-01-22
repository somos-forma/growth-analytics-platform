"use client";
import { ChevronDownIcon, Download, StarsIcon } from "lucide-react";
import { useState } from "react";
import { MetricCard } from "@/components/metric-card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GoogleAnalyticsOverview } from "./components/ecommerce/google-analytics-overview";
import { MonthlyIndicators } from "./components/ecommerce/monthly-indicators";
import { NewUsersByChannel } from "./components/ecommerce/new-users-by-channel";
import { PerformanceByChannelTable } from "./components/ecommerce/performance-by-channel-table";
import { PerformanceByPaidTable } from "./components/ecommerce/performance-by-paid-table";
import { ResultsByPaidTable } from "./components/ecommerce/results-by-paid-table";

import { RevenueByChannel } from "./components/ecommerce/revenue-by-channel";
import { RevenueByDevices } from "./components/ecommerce/revenue-by-devices";
import { RevenueByPaidMedium } from "./components/ecommerce/revenue-by-paid-medium";

import { SessionsByChannel } from "./components/ecommerce/sessions-by-channel";
import { SessionByPaidMedium } from "./components/ecommerce/sessions-by-paid-medium";
import { TransactionsByPaidMedium } from "./components/ecommerce/transactions-by-paid-medium";

import { UserByDevice } from "./components/ecommerce/user-by-device";

import { ChannelGroupMetricsChangeTable } from "./components/leads/channel-group-metric-change-table";
import { ChannelGroupMetricsTable } from "./components/leads/channel-group-metrics-table";

import { UsersByAge } from "./components/leads/users-by-age";
import { UsersBySex } from "./components/leads/users-by-sex";

export const GoogleAnalytics = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [type, _] = useState<"ecommerce" | "leads">("leads");

  const fakeData = [
    {
      id: 1,
      title: "Total de usuarios",
      value: 230143,
      unit: "number",
      change: 0,
      isPositive: true,
    },
    {
      id: 2,
      title: "Usuarios nuevos",
      value: 204143,
      unit: "number",
      change: 0,
      isPositive: true,
    },
    {
      id: 3,
      title: "Sesiones",
      value: 170143,
      unit: "number",
      change: 0,
      isPositive: true,
    },
    {
      id: 4,
      title: "Sesiones con interacción",
      value: 94143,
      unit: "number",
      change: 0,
      isPositive: true,
    },
    {
      id: 5,
      title: "Duracion media de la sesión",
      value: 147,
      unit: "seconds",
      change: 0,
      isPositive: true,
    },
    {
      id: 6,
      title: "Tasa de rebote",
      value: 5944,
      unit: "percentage",
      change: 0,
      isPositive: false,
    },
    {
      id: 7,
      title: "Eventos Clave",
      value: 4156,
      unit: "number",
      change: 0,
      isPositive: true,
    },
    {
      id: 8,
      title: "Tasa evento clave",
      value: 20,
      unit: "percentage",
      change: 0,
      isPositive: true,
    },
  ];

  if (type === "leads") {
    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-4xl">Google Analytics 4 </h1>
            <p className="text-muted-foreground">
              Analiza el comportamiento de usuarios y el rendimiento de tu sitio web
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
                  {date ? date.toLocaleDateString() : "Seleccionar fecha"}
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
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date);
                    setOpen(false);
                  }}
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
        <div className="space-y-7">
          <div className="space-y-7"></div>
          {/* <FunnelIndicators /> */}
          <div className="p-2">
            <h2 className="font-bold text-2xl">Perfomance General del sitio Web </h2>
            <p className="text-muted-foreground">
              Visión integral del rendimiento digital del sitio, que permite evaluar la capacidad real del ecosistema
              para atraer, retener y convertir usuarios.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {fakeData.map((item, i) => (
              <MetricCard
                key={i}
                id={item.id}
                title={item.title}
                value={item.value}
                unit={item.unit}
                change={item.change}
                isPositive={item.isPositive}
              />
            ))}
          </div>
          <div className="p-2">
            <h2 className="font-bold text-2xl">Performance del sitio web por canal de adquisición</h2>
            <p className="text-muted-foreground">
              Análisis comparativo de los canales para identificar cuáles aportan mayor volumen, eficiencia y calidad de
              resultados, y dónde existen oportunidades de optimización.
            </p>
          </div>
          <ChannelGroupMetricsTable />
          <div className="p-2">
            <h2 className="font-bold text-2xl">Performance del sitio web por fuente / medio</h2>
            <p className="text-muted-foreground">
              Profundización a nivel de origen de tráfico para entender qué combinaciones de fuente y medio generan
              impacto real en los objetivos de negocio.
            </p>
          </div>
          <ChannelGroupMetricsChangeTable />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <UserByDevice date={{ from: "2025-11-01" }} />
            <UsersByAge />
            <UsersBySex />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-4xl">Google Analytics 4 </h1>
            <p className="text-muted-foreground">
              Analiza el comportamiento de usuarios y el rendimiento de tu sitio web
              <br />
              <span className=" italic">(Comparación del mes actual con el mismo mes del año anterior)</span>
            </p>
          </div>
          {/* actions */}
          <div className="flex gap-3 ">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" id="date" className="w-48 justify-between font-semibold">
                  {date ? date.toLocaleDateString() : "Seleccionar fecha"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
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
          <GoogleAnalyticsOverview />
          <PerformanceByChannelTable />
          <PerformanceByPaidTable date={{ from: "2025-11-01" }} />
          <MonthlyIndicators />
          <div className="grid md:grid-cols-2 gap-5">
            <UserByDevice date={{ from: "2025-11-01" }} />
            {/* <UserByAge /> */}
            {/* <UserBySex /> */}
            <RevenueByDevices date={{ from: "2025-11-01" }} />
            {/* <RevenueByAge /> */}
            {/* <RevenueBySex /> */}
            <RevenueByChannel date={{ from: "2025-11-01" }} />
            <SessionsByChannel date={{ from: "2025-11-01" }} />
            <NewUsersByChannel date={{ from: "2025-11-01" }} />
            <SessionByPaidMedium date={{ from: "2025-11-01" }} />
            <TransactionsByPaidMedium date={{ from: "2025-11-01" }} />
            <RevenueByPaidMedium date={{ from: "2025-11-01" }} />
          </div>
          <ResultsByPaidTable date={{ from: "2025-11-01" }} />
        </div>
      </div>
    );
  }
};
