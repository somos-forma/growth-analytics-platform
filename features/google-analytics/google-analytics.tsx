"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { ChevronDownIcon, Download, StarsIcon } from "lucide-react";
import { GoogleAnalyticsOverview } from "./components/ecommerce/google-analytics-overview";
import { PerformanceByChannelTable } from "./components/ecommerce/performance-by-channel-table";
import { PerformanceByPaidTable } from "./components/ecommerce/performance-by-paid-table";
import { ResultsByPaidTable } from "./components/ecommerce/results-by-paid-table";
import { MonthlyIndicators } from "./components/ecommerce/monthly-indicators";
import { UserByDevice } from "./components/ecommerce/user-by-device";
import { RevenueByDevices } from "./components/ecommerce/revenue-by-devices";
import { RevenueByChannel } from "./components/ecommerce/revenue-by-channel";
import { SessionsByChannel } from "./components/ecommerce/sessions-by-channel";
import { NewUsersByChannel } from "./components/ecommerce/new-users-by-channel";
import { TransactionsByPaidMedium } from "./components/ecommerce/transactions-by-paid-medium";
import { RevenueByPaidMedium } from "./components/ecommerce/revenue-by-paid-medium";
import { FunnelIndicators } from "./components/leads/funnel-indicators";

import { UsersByAge } from "./components/leads/users-by-age";
import { UsersBySex } from "./components/leads/users-by-sex";
import { SessionByPaidMedium } from "./components/ecommerce/sessions-by-paid-medium";
import { RevenueByAge } from "./components/ecommerce/revenue-by-age";
import { RevenueBySex } from "./components/ecommerce/revenue-by-sex";
import { UserBySex } from "./components/ecommerce/user-by-sex";
import { UserByAge } from "./components/ecommerce/user-by-age";
import { ChannelGroupMetricsTable } from "./components/leads/channel-group-metrics-table";
import { ChannelGroupMetricsChangeTable } from "./components/leads/channel-group-metric-change-table";

export const GoogleAnalytics = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [type, setType] = useState<"ecommerce" | "leads">("leads");

  if (type === "leads") {
    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-4xl">Google Analytics 4 </h1>
            <p className="text-muted-foreground">
              Analiza el comportamiento de usuarios y el rendimiento de tu sitio
              web
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
        <div className="space-y-5">
          <div className="space-y-5"></div>
          {/* <FunnelIndicators /> */}
          <ChannelGroupMetricsTable />
          <p className="font-bold  text-2xl">Métricas</p>
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
              Analiza el comportamiento de usuarios y el rendimiento de tu sitio
              web
              <br />
              <span className=" italic">
                (Comparación del mes actual con el mismo mes del año anterior)
              </span>
            </p>
          </div>
          {/* actions */}
          <div className="flex gap-3 ">
            <Popover open={open} onOpenChange={setOpen}>
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
