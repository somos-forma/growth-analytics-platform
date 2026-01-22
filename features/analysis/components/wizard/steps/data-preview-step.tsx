import type { ColumnDef } from "@tanstack/react-table";
import { Rocket } from "lucide-react";
import type React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useWizardStore } from "../wizard-store";

type TableData = {
  id: number;
  date: string;
  variable01: string;
  variable02: string;
  variable03: string;
  variable04: string;
  variable05: string;
};

const columns: ColumnDef<TableData>[] = [
  {
    accessorKey: "date",
    header: "Fecha",
  },
  {
    accessorKey: "variable01",
    header: "Variable 01",
  },
  {
    accessorKey: "variable02",
    header: "Variable 02",
  },
  {
    accessorKey: "variable03",
    header: "Variable 03",
  },
  {
    accessorKey: "variable04",
    header: "Variable 04",
  },
  {
    accessorKey: "variable05",
    header: "Variable 05",
  },
];

export const DataPreviewStep = () => {
  const back = useWizardStore((state) => state.back);

  const allData = useWizardStore((state) => state.data);

  const data: TableData[] = [
    {
      id: 1,
      date: "2023-01-01",
      variable01: "Value 1",
      variable02: "Value 2",
      variable03: "Value 3",
      variable04: "Value 4",
      variable05: "Value 5",
    },
    {
      id: 2,
      date: "2023-01-02",
      variable01: "Value 6",
      variable02: "Value 7",
      variable03: "Value 8",
      variable04: "Value 9",
      variable05: "Value 10",
    },
    {
      id: 3,
      date: "2023-01-03",
      variable01: "Value 11",
      variable02: "Value 12",
      variable03: "Value 13",
      variable04: "Value 14",
      variable05: "Value 15",
    },
  ];

  const chartData = [
    {
      date: "2024-01-01",
      revenue: 10000,
      mntn_tv_spend: 5000,
      fb_ads_mof_spend: 2200,
      fb_ads_tof_spend: 1800,
      fb_ads_bof_spend: 900,
      fb_ads_ret_spend: 1200,
      google_ads_search_no_brand_spend: 3100,
      google_ads_search_brand_spend: 2700,
      google_ads_demand_gen_spend: 800,
      google_ads_video_spend: 900,
      google_ads_performance_max_spend: 3300,
      tiktok_spend: 1400,
      snapchat_spend: 600,
      bing_spend: 400,
    },
    {
      date: "2024-01-02",
      revenue: 11000,
      mntn_tv_spend: 7000,
      fb_ads_mof_spend: 2500,
      fb_ads_tof_spend: 2200,
      fb_ads_bof_spend: 1100,
      fb_ads_ret_spend: 1500,
      google_ads_search_no_brand_spend: 3400,
      google_ads_search_brand_spend: 3000,
      google_ads_demand_gen_spend: 1000,
      google_ads_video_spend: 1200,
      google_ads_performance_max_spend: 3600,
      tiktok_spend: 1600,
      snapchat_spend: 900,
      bing_spend: 500,
    },
    {
      date: "2024-01-03",
      revenue: 12000,
      mntn_tv_spend: 6500,
      fb_ads_mof_spend: 2100,
      fb_ads_tof_spend: 1900,
      fb_ads_bof_spend: 1000,
      fb_ads_ret_spend: 1300,
      google_ads_search_no_brand_spend: 3200,
      google_ads_search_brand_spend: 2800,
      google_ads_demand_gen_spend: 900,
      google_ads_video_spend: 1000,
      google_ads_performance_max_spend: 3400,
      tiktok_spend: 1500,
      snapchat_spend: 700,
      bing_spend: 450,
    },
    {
      date: "2024-01-04",
      revenue: 13500,
      mntn_tv_spend: 8000,
      fb_ads_mof_spend: 2800,
      fb_ads_tof_spend: 2400,
      fb_ads_bof_spend: 1200,
      fb_ads_ret_spend: 1600,
      google_ads_search_no_brand_spend: 3700,
      google_ads_search_brand_spend: 3200,
      google_ads_demand_gen_spend: 1100,
      google_ads_video_spend: 1300,
      google_ads_performance_max_spend: 3900,
      tiktok_spend: 1800,
      snapchat_spend: 1000,
      bing_spend: 600,
    },
    {
      date: "2024-01-05",
      revenue: 14200,
      mntn_tv_spend: 7500,
      fb_ads_mof_spend: 2600,
      fb_ads_tof_spend: 2100,
      fb_ads_bof_spend: 1050,
      fb_ads_ret_spend: 1400,
      google_ads_search_no_brand_spend: 3500,
      google_ads_search_brand_spend: 3100,
      google_ads_demand_gen_spend: 950,
      google_ads_video_spend: 1100,
      google_ads_performance_max_spend: 3700,
      tiktok_spend: 1700,
      snapchat_spend: 850,
      bing_spend: 550,
    },
    {
      date: "2024-01-06",
      revenue: 15000,
      mntn_tv_spend: 8500,
      fb_ads_mof_spend: 3000,
      fb_ads_tof_spend: 2600,
      fb_ads_bof_spend: 1300,
      fb_ads_ret_spend: 1700,
      google_ads_search_no_brand_spend: 3900,
      google_ads_search_brand_spend: 3400,
      google_ads_demand_gen_spend: 1200,
      google_ads_video_spend: 1400,
      google_ads_performance_max_spend: 4100,
      tiktok_spend: 1900,
      snapchat_spend: 1100,
      bing_spend: 650,
    },
    {
      date: "2024-01-07",
      revenue: 13800,
      mntn_tv_spend: 7800,
      fb_ads_mof_spend: 2700,
      fb_ads_tof_spend: 2300,
      fb_ads_bof_spend: 1150,
      fb_ads_ret_spend: 1550,
      google_ads_search_no_brand_spend: 3600,
      google_ads_search_brand_spend: 3150,
      google_ads_demand_gen_spend: 1050,
      google_ads_video_spend: 1250,
      google_ads_performance_max_spend: 3800,
      tiktok_spend: 1750,
      snapchat_spend: 950,
      bing_spend: 575,
    },
    {
      date: "2024-01-08",
      revenue: 12500,
      mntn_tv_spend: 6800,
      fb_ads_mof_spend: 2300,
      fb_ads_tof_spend: 2000,
      fb_ads_bof_spend: 1000,
      fb_ads_ret_spend: 1350,
      google_ads_search_no_brand_spend: 3300,
      google_ads_search_brand_spend: 2900,
      google_ads_demand_gen_spend: 950,
      google_ads_video_spend: 1050,
      google_ads_performance_max_spend: 3500,
      tiktok_spend: 1550,
      snapchat_spend: 800,
      bing_spend: 475,
    },
    {
      date: "2024-01-09",
      revenue: 14500,
      mntn_tv_spend: 8200,
      fb_ads_mof_spend: 2900,
      fb_ads_tof_spend: 2500,
      fb_ads_bof_spend: 1250,
      fb_ads_ret_spend: 1650,
      google_ads_search_no_brand_spend: 3800,
      google_ads_search_brand_spend: 3300,
      google_ads_demand_gen_spend: 1150,
      google_ads_video_spend: 1350,
      google_ads_performance_max_spend: 4000,
      tiktok_spend: 1850,
      snapchat_spend: 1050,
      bing_spend: 625,
    },
    {
      date: "2024-01-10",
      revenue: 15500,
      mntn_tv_spend: 8800,
      fb_ads_mof_spend: 3100,
      fb_ads_tof_spend: 2700,
      fb_ads_bof_spend: 1350,
      fb_ads_ret_spend: 1750,
      google_ads_search_no_brand_spend: 4000,
      google_ads_search_brand_spend: 3500,
      google_ads_demand_gen_spend: 1250,
      google_ads_video_spend: 1450,
      google_ads_performance_max_spend: 4200,
      tiktok_spend: 1950,
      snapchat_spend: 1150,
      bing_spend: 675,
    },
    {
      date: "2024-01-11",
      revenue: 16000,
      mntn_tv_spend: 9000,
      fb_ads_mof_spend: 3200,
      fb_ads_tof_spend: 2800,
      fb_ads_bof_spend: 1400,
      fb_ads_ret_spend: 1800,
      google_ads_search_no_brand_spend: 4100,
      google_ads_search_brand_spend: 3600,
      google_ads_demand_gen_spend: 1300,
      google_ads_video_spend: 1500,
      google_ads_performance_max_spend: 4300,
      tiktok_spend: 2000,
      snapchat_spend: 1200,
      bing_spend: 700,
    },
    {
      date: "2024-01-12",
      revenue: 14800,
      mntn_tv_spend: 8300,
      fb_ads_mof_spend: 2950,
      fb_ads_tof_spend: 2550,
      fb_ads_bof_spend: 1275,
      fb_ads_ret_spend: 1675,
      google_ads_search_no_brand_spend: 3850,
      google_ads_search_brand_spend: 3350,
      google_ads_demand_gen_spend: 1175,
      google_ads_video_spend: 1375,
      google_ads_performance_max_spend: 4050,
      tiktok_spend: 1875,
      snapchat_spend: 1075,
      bing_spend: 640,
    },
    {
      date: "2024-01-13",
      revenue: 13200,
      mntn_tv_spend: 7200,
      fb_ads_mof_spend: 2400,
      fb_ads_tof_spend: 2100,
      fb_ads_bof_spend: 1050,
      fb_ads_ret_spend: 1400,
      google_ads_search_no_brand_spend: 3400,
      google_ads_search_brand_spend: 3000,
      google_ads_demand_gen_spend: 1000,
      google_ads_video_spend: 1150,
      google_ads_performance_max_spend: 3600,
      tiktok_spend: 1600,
      snapchat_spend: 850,
      bing_spend: 500,
    },
    {
      date: "2024-01-14",
      revenue: 14000,
      mntn_tv_spend: 7700,
      fb_ads_mof_spend: 2650,
      fb_ads_tof_spend: 2250,
      fb_ads_bof_spend: 1125,
      fb_ads_ret_spend: 1500,
      google_ads_search_no_brand_spend: 3550,
      google_ads_search_brand_spend: 3100,
      google_ads_demand_gen_spend: 1025,
      google_ads_video_spend: 1225,
      google_ads_performance_max_spend: 3750,
      tiktok_spend: 1700,
      snapchat_spend: 925,
      bing_spend: 540,
    },
    {
      date: "2024-01-15",
      revenue: 15800,
      mntn_tv_spend: 8900,
      fb_ads_mof_spend: 3150,
      fb_ads_tof_spend: 2750,
      fb_ads_bof_spend: 1375,
      fb_ads_ret_spend: 1775,
      google_ads_search_no_brand_spend: 4050,
      google_ads_search_brand_spend: 3550,
      google_ads_demand_gen_spend: 1275,
      google_ads_video_spend: 1475,
      google_ads_performance_max_spend: 4250,
      tiktok_spend: 1975,
      snapchat_spend: 1175,
      bing_spend: 690,
    },
    {
      date: "2024-01-16",
      revenue: 16500,
      mntn_tv_spend: 9200,
      fb_ads_mof_spend: 3300,
      fb_ads_tof_spend: 2900,
      fb_ads_bof_spend: 1450,
      fb_ads_ret_spend: 1850,
      google_ads_search_no_brand_spend: 4200,
      google_ads_search_brand_spend: 3700,
      google_ads_demand_gen_spend: 1350,
      google_ads_video_spend: 1550,
      google_ads_performance_max_spend: 4400,
      tiktok_spend: 2050,
      snapchat_spend: 1250,
      bing_spend: 725,
    },
    {
      date: "2024-01-17",
      revenue: 17000,
      mntn_tv_spend: 9500,
      fb_ads_mof_spend: 3400,
      fb_ads_tof_spend: 3000,
      fb_ads_bof_spend: 1500,
      fb_ads_ret_spend: 1900,
      google_ads_search_no_brand_spend: 4300,
      google_ads_search_brand_spend: 3800,
      google_ads_demand_gen_spend: 1400,
      google_ads_video_spend: 1600,
      google_ads_performance_max_spend: 4500,
      tiktok_spend: 2100,
      snapchat_spend: 1300,
      bing_spend: 750,
    },
    {
      date: "2024-01-18",
      revenue: 16200,
      mntn_tv_spend: 9100,
      fb_ads_mof_spend: 3250,
      fb_ads_tof_spend: 2850,
      fb_ads_bof_spend: 1425,
      fb_ads_ret_spend: 1825,
      google_ads_search_no_brand_spend: 4150,
      google_ads_search_brand_spend: 3650,
      google_ads_demand_gen_spend: 1325,
      google_ads_video_spend: 1525,
      google_ads_performance_max_spend: 4350,
      tiktok_spend: 2025,
      snapchat_spend: 1225,
      bing_spend: 710,
    },
    {
      date: "2024-01-19",
      revenue: 15200,
      mntn_tv_spend: 8600,
      fb_ads_mof_spend: 3050,
      fb_ads_tof_spend: 2650,
      fb_ads_bof_spend: 1325,
      fb_ads_ret_spend: 1725,
      google_ads_search_no_brand_spend: 3950,
      google_ads_search_brand_spend: 3450,
      google_ads_demand_gen_spend: 1225,
      google_ads_video_spend: 1425,
      google_ads_performance_max_spend: 4150,
      tiktok_spend: 1925,
      snapchat_spend: 1125,
      bing_spend: 660,
    },
    {
      date: "2024-01-20",
      revenue: 14300,
      mntn_tv_spend: 8100,
      fb_ads_mof_spend: 2850,
      fb_ads_tof_spend: 2450,
      fb_ads_bof_spend: 1225,
      fb_ads_ret_spend: 1625,
      google_ads_search_no_brand_spend: 3750,
      google_ads_search_brand_spend: 3250,
      google_ads_demand_gen_spend: 1125,
      google_ads_video_spend: 1325,
      google_ads_performance_max_spend: 3950,
      tiktok_spend: 1825,
      snapchat_spend: 1025,
      bing_spend: 615,
    },
    {
      date: "2024-01-21",
      revenue: 13500,
      mntn_tv_spend: 7600,
      fb_ads_mof_spend: 2650,
      fb_ads_tof_spend: 2250,
      fb_ads_bof_spend: 1125,
      fb_ads_ret_spend: 1500,
      google_ads_search_no_brand_spend: 3550,
      google_ads_search_brand_spend: 3100,
      google_ads_demand_gen_spend: 1025,
      google_ads_video_spend: 1225,
      google_ads_performance_max_spend: 3750,
      tiktok_spend: 1700,
      snapchat_spend: 925,
      bing_spend: 570,
    },
    {
      date: "2024-01-22",
      revenue: 14700,
      mntn_tv_spend: 8250,
      fb_ads_mof_spend: 2950,
      fb_ads_tof_spend: 2550,
      fb_ads_bof_spend: 1275,
      fb_ads_ret_spend: 1675,
      google_ads_search_no_brand_spend: 3850,
      google_ads_search_brand_spend: 3350,
      google_ads_demand_gen_spend: 1175,
      google_ads_video_spend: 1375,
      google_ads_performance_max_spend: 4050,
      tiktok_spend: 1875,
      snapchat_spend: 1075,
      bing_spend: 635,
    },
    {
      date: "2024-01-23",
      revenue: 15900,
      mntn_tv_spend: 8950,
      fb_ads_mof_spend: 3200,
      fb_ads_tof_spend: 2800,
      fb_ads_bof_spend: 1400,
      fb_ads_ret_spend: 1800,
      google_ads_search_no_brand_spend: 4100,
      google_ads_search_brand_spend: 3600,
      google_ads_demand_gen_spend: 1300,
      google_ads_video_spend: 1500,
      google_ads_performance_max_spend: 4300,
      tiktok_spend: 2000,
      snapchat_spend: 1200,
      bing_spend: 695,
    },
    {
      date: "2024-01-24",
      revenue: 16800,
      mntn_tv_spend: 9400,
      fb_ads_mof_spend: 3350,
      fb_ads_tof_spend: 2950,
      fb_ads_bof_spend: 1475,
      fb_ads_ret_spend: 1875,
      google_ads_search_no_brand_spend: 4250,
      google_ads_search_brand_spend: 3750,
      google_ads_demand_gen_spend: 1375,
      google_ads_video_spend: 1575,
      google_ads_performance_max_spend: 4450,
      tiktok_spend: 2075,
      snapchat_spend: 1275,
      bing_spend: 735,
    },
    {
      date: "2024-01-25",
      revenue: 17500,
      mntn_tv_spend: 9700,
      fb_ads_mof_spend: 3500,
      fb_ads_tof_spend: 3100,
      fb_ads_bof_spend: 1550,
      fb_ads_ret_spend: 1950,
      google_ads_search_no_brand_spend: 4400,
      google_ads_search_brand_spend: 3900,
      google_ads_demand_gen_spend: 1450,
      google_ads_video_spend: 1650,
      google_ads_performance_max_spend: 4600,
      tiktok_spend: 2150,
      snapchat_spend: 1350,
      bing_spend: 775,
    },
    {
      date: "2024-01-26",
      revenue: 16900,
      mntn_tv_spend: 9350,
      fb_ads_mof_spend: 3375,
      fb_ads_tof_spend: 2975,
      fb_ads_bof_spend: 1488,
      fb_ads_ret_spend: 1888,
      google_ads_search_no_brand_spend: 4275,
      google_ads_search_brand_spend: 3775,
      google_ads_demand_gen_spend: 1388,
      google_ads_video_spend: 1588,
      google_ads_performance_max_spend: 4475,
      tiktok_spend: 2088,
      snapchat_spend: 1288,
      bing_spend: 745,
    },
    {
      date: "2024-01-27",
      revenue: 15600,
      mntn_tv_spend: 8750,
      fb_ads_mof_spend: 3100,
      fb_ads_tof_spend: 2700,
      fb_ads_bof_spend: 1350,
      fb_ads_ret_spend: 1750,
      google_ads_search_no_brand_spend: 4000,
      google_ads_search_brand_spend: 3500,
      google_ads_demand_gen_spend: 1250,
      google_ads_video_spend: 1450,
      google_ads_performance_max_spend: 4200,
      tiktok_spend: 1950,
      snapchat_spend: 1150,
      bing_spend: 680,
    },
    {
      date: "2024-01-28",
      revenue: 14900,
      mntn_tv_spend: 8400,
      fb_ads_mof_spend: 2975,
      fb_ads_tof_spend: 2575,
      fb_ads_bof_spend: 1288,
      fb_ads_ret_spend: 1688,
      google_ads_search_no_brand_spend: 3875,
      google_ads_search_brand_spend: 3375,
      google_ads_demand_gen_spend: 1188,
      google_ads_video_spend: 1388,
      google_ads_performance_max_spend: 4075,
      tiktok_spend: 1888,
      snapchat_spend: 1088,
      bing_spend: 645,
    },
    {
      date: "2024-01-29",
      revenue: 16300,
      mntn_tv_spend: 9150,
      fb_ads_mof_spend: 3275,
      fb_ads_tof_spend: 2875,
      fb_ads_bof_spend: 1438,
      fb_ads_ret_spend: 1838,
      google_ads_search_no_brand_spend: 4175,
      google_ads_search_brand_spend: 3675,
      google_ads_demand_gen_spend: 1338,
      google_ads_video_spend: 1538,
      google_ads_performance_max_spend: 4375,
      tiktok_spend: 2038,
      snapchat_spend: 1238,
      bing_spend: 715,
    },
    {
      date: "2024-01-30",
      revenue: 17200,
      mntn_tv_spend: 9600,
      fb_ads_mof_spend: 3450,
      fb_ads_tof_spend: 3050,
      fb_ads_bof_spend: 1525,
      fb_ads_ret_spend: 1925,
      google_ads_search_no_brand_spend: 4350,
      google_ads_search_brand_spend: 3850,
      google_ads_demand_gen_spend: 1425,
      google_ads_video_spend: 1625,
      google_ads_performance_max_spend: 4550,
      tiktok_spend: 2125,
      snapchat_spend: 1325,
      bing_spend: 760,
    },
    {
      date: "2024-01-31",
      revenue: 18000,
      mntn_tv_spend: 10000,
      fb_ads_mof_spend: 3600,
      fb_ads_tof_spend: 3200,
      fb_ads_bof_spend: 1600,
      fb_ads_ret_spend: 2000,
      google_ads_search_no_brand_spend: 4500,
      google_ads_search_brand_spend: 4000,
      google_ads_demand_gen_spend: 1500,
      google_ads_video_spend: 1700,
      google_ads_performance_max_spend: 4700,
      tiktok_spend: 2200,
      snapchat_spend: 1400,
      bing_spend: 800,
    },
  ];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "var(--chart-1)",
    },
    mntn_tv_spend: {
      label: "MNTN TV Spend",
      color: "var(--chart-2)",
    },
    fb_ads_mof_spend: {
      label: "FB Ads MOF Spend",
      color: "var(--chart-3)",
    },
    fb_ads_tof_spend: {
      label: "FB Ads TOF Spend",
      color: "var(--chart-4)",
    },
    fb_ads_bof_spend: {
      label: "FB Ads BOF Spend",
      color: "var(--chart-5)",
    },
    fb_ads_ret_spend: {
      label: "FB Ads RET Spend",
      color: "var(--chart-6)",
    },
    google_ads_search_no_brand_spend: {
      label: "Google Ads Search No Brand Spend",
      color: "var(--chart-7)",
    },
    google_ads_search_brand_spend: {
      label: "Google Ads Search Brand Spend",
      color: "var(--chart-8)",
    },
    google_ads_demand_gen_spend: {
      label: "Google Ads Demand Gen Spend",
      color: "var(--chart-9)",
    },
    google_ads_video_spend: {
      label: "Google Ads Video Spend",
      color: "var(--chart-10)",
    },
    google_ads_performance_max_spend: {
      label: "Google Ads Performance Max Spend",
      color: "var(--chart-11)",
    },
    tiktok_spend: {
      label: "TikTok Spend",
      color: "var(--chart-12)",
    },
    snapchat_spend: {
      label: "Snapchat Spend",
      color: "var(--chart-13)",
    },
    bing_spend: {
      label: "Bing Spend",
      color: "var(--chart-14)",
    },
  } satisfies ChartConfig;

  const onSubmit = () => {
    // Handle form submission
    toast("Enviaste los siguientes valores:", {
      description: (
        <pre className="bg-code text-code-foreground rounded-md p-4 h-[400px] overflow-x-hidden overflow-y-auto">
          <code>{JSON.stringify(allData, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2 ",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
        width: "420px",
      } as React.CSSProperties,
    });
    // resetAll();
    // router.push("/dashboard/marketing-mix-modeling");
  };

  return (
    <div className="space-y-5">
      <p className="font-medium">Vista previa de los datos</p>
      <DataTable data={data} columns={columns} showTotals={false} />
      <Card>
        <CardHeader>
          <CardTitle>Variables medias</CardTitle>
          <CardDescription>
            Relación temporal entre inversión publicitaria por canal y los ingresos generados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[250px] w-full" config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />

              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              {/* <Line
                dataKey="desktop"
                type="natural"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
              /> */}
              <Line dataKey="revenue" type="natural" stroke={chartConfig.revenue.color} dot={false} />
              <Line dataKey="mntn_tv_spend" type="natural" stroke={chartConfig.mntn_tv_spend.color} dot={false} />
              <Line dataKey="fb_ads_mof_spend" type="natural" stroke={chartConfig.fb_ads_mof_spend.color} dot={false} />
              <Line dataKey="fb_ads_tof_spend" type="natural" stroke={chartConfig.fb_ads_tof_spend.color} dot={false} />
              <Line dataKey="fb_ads_bof_spend" type="natural" stroke={chartConfig.fb_ads_bof_spend.color} dot={false} />
              <Line dataKey="fb_ads_ret_spend" type="natural" stroke={chartConfig.fb_ads_ret_spend.color} dot={false} />
              <Line
                dataKey="google_ads_search_no_brand_spend"
                type="natural"
                stroke={chartConfig.google_ads_search_no_brand_spend.color}
                dot={false}
              />
              <Line
                dataKey="google_ads_search_brand_spend"
                type="natural"
                stroke={chartConfig.google_ads_search_brand_spend.color}
                dot={false}
              />
              <Line
                dataKey="google_ads_demand_gen_spend"
                type="natural"
                stroke={chartConfig.google_ads_demand_gen_spend.color}
                dot={false}
              />
              <Line
                dataKey="google_ads_video_spend"
                type="natural"
                stroke={chartConfig.google_ads_video_spend.color}
                dot={false}
              />
              <Line
                dataKey="google_ads_performance_max_spend"
                type="natural"
                stroke={chartConfig.google_ads_performance_max_spend.color}
                dot={false}
              />
              <Line dataKey="tiktok_spend" type="natural" stroke={chartConfig.tiktok_spend.color} dot={false} />
              <Line dataKey="snapchat_spend" type="natural" stroke={chartConfig.snapchat_spend.color} dot={false} />
              <Line dataKey="bing_spend" type="natural" stroke={chartConfig.bing_spend.color} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <div className="space-x-4">
        <Button onClick={back}>Anterior</Button>
        <Button onClick={onSubmit}>
          Empezar entrenamiento <Rocket />
        </Button>
      </div>
    </div>
  );
};
