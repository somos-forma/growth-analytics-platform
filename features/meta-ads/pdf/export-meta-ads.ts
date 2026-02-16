"use client";

import { format } from "date-fns";
import { formatCurrency, formatNumber, formatPercentage } from "@/utils/formatters";

type DateRange = {
  from?: Date;
  to?: Date;
};

type ExportOptions = {
  type: "ecommerce" | "leads";
  dateRange: DateRange;
  date?: Date;
  formattedDate: string;
};

type TableSpec = {
  title: string;
  headers: string[];
  rows: string[][];
  widths: number[];
  align?: Array<"left" | "right">;
  rowHeight?: number;
};

type ChartPoint = {
  label: string;
  investment: number;
  conversions: number;
  cpa: number;
};

type ChartSpec = {
  title: string;
  points: ChartPoint[];
};

const winAnsiOverrides: Record<string, number> = {
  á: 0xe1,
  é: 0xe9,
  í: 0xed,
  ó: 0xf3,
  ú: 0xfa,
  Á: 0xc1,
  É: 0xc9,
  Í: 0xcd,
  Ó: 0xd3,
  Ú: 0xda,
  ñ: 0xf1,
  Ñ: 0xd1,
  ü: 0xfc,
  Ü: 0xdc,
  "¿": 0xbf,
  "¡": 0xa1,
};

const escapePdfText = (value: string) => {
  const escaped = value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  let output = "";
  for (let i = 0; i < escaped.length; i += 1) {
    const char = escaped[i];
    const override = winAnsiOverrides[char];
    const code = override ?? escaped.charCodeAt(i);
    if (code < 128) {
      output += char;
    } else if (code <= 255) {
      output += `\\${code.toString(8).padStart(3, "0")}`;
    } else {
      output += "?";
    }
  }
  return output;
};

const fetchAnalytics = async (table: string, filters: Record<string, unknown>) => {
  try {
    const response = await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table,
        filters,
        limit: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Failed to fetch ${table}: ${response.status} ${errorText}`);
      return { rows: [] }; // Return empty data instead of throwing
    }

    return response.json();
  } catch (error) {
    console.warn(`Error fetching ${table}:`, error);
    return { rows: [] }; // Return empty data on error
  }
};

type MetaAdsKpisOverview = {
  costos: number;
  impresiones: number;
  clicks: number;
  alcance: number;
  frecuencia: number;
  ctr: number;
  cpc: number;
  cpm: number;
};

const aggregateMetaAdsKpis = (rows: any[]): MetaAdsKpisOverview => {
  return (rows || []).reduce(
    (acc: MetaAdsKpisOverview, row: any) => {
      acc.costos += row.costos || 0;
      acc.impresiones += row.impresiones || 0;
      acc.clicks += row.clicks || 0;
      acc.alcance += row.alcance || 0;
      acc.frecuencia = acc.frecuencia || row.frecuencia || 0;
      acc.ctr = acc.ctr || row.ctr || 0;
      acc.cpc = acc.cpc || row.cpc || 0;
      acc.cpm = acc.cpm || row.cpm || 0;
      return acc;
    },
    { costos: 0, impresiones: 0, clicks: 0, alcance: 0, frecuencia: 0, ctr: 0, cpc: 0, cpm: 0 },
  );
};

const calcYoYChange = (curr: number, prev: number) => {
  if (!prev || prev === 0) return 0;
  return ((curr - prev) / prev) * 100;
};

const formatMetricValue = (value: number, unit: "currency" | "number" | "percentage") => {
  if (unit === "currency") return formatCurrency(value);
  if (unit === "percentage") return formatPercentage(value, 2);
  return formatNumber(value);
};

const buildReportPdf = (title: string, rangeText: string, tables: TableSpec[], charts: ChartSpec[] = []) => {
  const encoder = new TextEncoder();
  const byteLength = (value: string) => encoder.encode(value).length;
  const PAGE_HEIGHT = 792;
  const margin = 48;
  const paddingX = 10;
  const pages: string[] = [];
  let ops: string[] = [];

  const toPdfY = (yTop: number) => PAGE_HEIGHT - yTop;

  const setStroke = (r: number, g: number, b: number) => {
    ops.push(`${r} ${g} ${b} RG`);
  };

  const setFill = (r: number, g: number, b: number) => {
    ops.push(`${r} ${g} ${b} rg`);
  };

  const setLineWidth = (width: number) => {
    ops.push(`${width} w`);
  };

  const drawText = (text: string, x: number, yTop: number, size = 11) => {
    ops.push(`BT /F1 ${size} Tf 1 0 0 1 ${x} ${toPdfY(yTop)} Tm (${escapePdfText(text)}) Tj ET`);
  };

  const estimateTextWidth = (text: string, size: number) => {
    let units = 0;
    for (const char of text) {
      if (char === " ") {
        units += 0.278;
      } else if (/[0-9]/.test(char)) {
        units += 0.556;
      } else if (/[A-Z]/.test(char)) {
        units += 0.667;
      } else if (/[a-z]/.test(char)) {
        units += 0.5;
      } else if (/[.,:%/-]/.test(char)) {
        units += 0.278;
      } else {
        units += 0.5;
      }
    }
    return units * size;
  };

  const fitText = (text: string, maxWidth: number, size: number) => {
    if (estimateTextWidth(text, size) <= maxWidth) {
      return text;
    }
    const ellipsis = "...";
    let trimmed = text;
    while (trimmed.length > 0 && estimateTextWidth(`${trimmed}${ellipsis}`, size) > maxWidth) {
      trimmed = trimmed.slice(0, -1);
    }
    return trimmed.length > 0 ? `${trimmed}${ellipsis}` : "";
  };

  const drawCellText = (
    text: string,
    colX: number,
    colWidth: number,
    yTop: number,
    rowHeight: number,
    size: number,
    align: "left" | "right",
  ) => {
    const maxWidth = Math.max(0, colWidth - paddingX * 2);
    const lines = String(text).split("\n");
    const lineHeight = size + 2;
    const totalHeight = lineHeight * lines.length;
    const startY = yTop + (rowHeight - totalHeight) / 2 + size;

    const leftPadding = 4;
    lines.forEach((line, index) => {
      const fitted = fitText(line, maxWidth, size);
      const textWidth = estimateTextWidth(fitted, size);
      const x =
        align === "right" ? Math.max(colX + paddingX, colX + colWidth - paddingX - textWidth) : colX + leftPadding;
      drawText(fitted, x, startY + index * lineHeight, size);
    });
  };

  const drawRect = (x: number, yTop: number, width: number, height: number, fill = false) => {
    const yBottom = toPdfY(yTop + height);
    ops.push(`${x} ${yBottom} ${width} ${height} re ${fill ? "f" : "S"}`);
  };

  const drawLine = (x1: number, y1Top: number, x2: number, y2Top: number) => {
    ops.push(`${x1} ${toPdfY(y1Top)} m ${x2} ${toPdfY(y2Top)} l S`);
  };

  let cursorY = margin;

  const startPage = () => {
    ops = [];
    cursorY = margin;
    drawText(title, margin, cursorY + 12, 16);
    cursorY += 28;
    drawText(rangeText, margin, cursorY + 4, 11);
    cursorY += 22;
    setStroke(0.8, 0.8, 0.8);
    setLineWidth(1);
  };

  const finishPage = () => {
    pages.push(ops.join("\n"));
  };

  startPage();

  const renderTable = (table: TableSpec) => {
    const headerHeight = 22;
    const rowHeight = table.rowHeight ?? 20;
    const tableX = margin;
    const rawTableWidth = table.widths.reduce((sum, width) => sum + width, 0);
    const pageWidth = 612 - margin * 2;
    const scale = rawTableWidth > 0 ? pageWidth / rawTableWidth : 1;
    const widths = table.widths.map((width) => width * scale);
    const tableWidth = widths.reduce((sum, width) => sum + width, 0);

    // Check if title and header fit on current page
    const titleHeight = 24;
    const headerTotalHeight = titleHeight + headerHeight;
    if (cursorY + headerTotalHeight > PAGE_HEIGHT - margin) {
      finishPage();
      startPage();
    }

    drawText(table.title, tableX, cursorY + 12, 13);
    cursorY += titleHeight;

    // Draw rows in batches that fit on pages
    let rowIndex = 0;
    while (rowIndex < table.rows.length) {
      const availableHeight = PAGE_HEIGHT - margin - cursorY - 28; // 28 for bottom margin
      const rowsPerPage = Math.floor(availableHeight / rowHeight);
      const rowsToDraw = Math.min(rowsPerPage, table.rows.length - rowIndex);

      if (rowsToDraw <= 0) {
        // Not enough space for even one row, start new page
        finishPage();
        startPage();
        // Do not redraw title, just continue with header + rows
        continue;
      }

      // Draw header
      setFill(0.95, 0.95, 0.95);
      drawRect(tableX, cursorY, tableWidth, headerHeight, true);
      setFill(0, 0, 0);

      drawRect(tableX, cursorY, tableWidth, headerHeight + rowsToDraw * rowHeight);

      let colX = tableX;
      widths.forEach((width) => {
        drawLine(colX, cursorY, colX, cursorY + headerHeight + rowsToDraw * rowHeight);
        colX += width;
      });
      drawLine(colX, cursorY, colX, cursorY + headerHeight + rowsToDraw * rowHeight);

      let headerX = tableX;
      table.headers.forEach((header, index) => {
        drawCellText(header, headerX, widths[index], cursorY, headerHeight, 11, "left");
        headerX += widths[index];
      });

      // Draw the rows for this page
      for (let i = 0; i < rowsToDraw; i++) {
        const row = table.rows[rowIndex + i];
        const rowTop = cursorY + headerHeight + i * rowHeight;
        drawLine(tableX, rowTop, tableX + tableWidth, rowTop);

        let cellX = tableX;
        row.forEach((cell, cellIndex) => {
          const align = table.align?.[cellIndex] ?? "left";
          drawCellText(cell, cellX, widths[cellIndex], rowTop, rowHeight, 11, align);
          cellX += widths[cellIndex];
        });
      }

      // Draw bottom line for the batch
      drawLine(
        tableX,
        cursorY + headerHeight + rowsToDraw * rowHeight,
        tableX + tableWidth,
        cursorY + headerHeight + rowsToDraw * rowHeight,
      );

      cursorY += headerHeight + rowsToDraw * rowHeight + 28;
      rowIndex += rowsToDraw;

      // If more rows and not last batch, start new page
      if (rowIndex < table.rows.length) {
        finishPage();
        startPage();
      }
    }
  };

  const renderChart = (chart: ChartSpec) => {
    const chartHeight = 160;
    const chartWidth = 516;
    const chartX = margin;
    const labelHeight = 14;

    const totalHeight = 24 + chartHeight + labelHeight + 24;
    if (cursorY + totalHeight > PAGE_HEIGHT - margin) {
      finishPage();
      startPage();
    }

    drawText(chart.title, chartX, cursorY + 12, 13);
    cursorY += 24;

    const maxValue = Math.max(1, ...chart.points.flatMap((point) => [point.investment, point.conversions, point.cpa]));

    const barAreaBottom = cursorY + chartHeight;
    const barAreaHeight = chartHeight - 16;
    const seriesCount = 3;
    const groupCount = Math.max(1, chart.points.length);
    const groupWidth = chartWidth / groupCount;
    const barWidth = Math.min(12, (groupWidth - 10) / seriesCount);
    const groupPadding = Math.max(4, (groupWidth - barWidth * seriesCount) / 2);

    setStroke(0.85, 0.85, 0.85);
    setLineWidth(0.5);
    drawLine(chartX, barAreaBottom, chartX + chartWidth, barAreaBottom);

    const colors: Array<[number, number, number]> = [
      [0.62, 0.54, 0.94],
      [0.2, 0.78, 0.86],
      [0.86, 0.82, 0.96],
    ];

    const labelStep = Math.max(1, Math.ceil(chart.points.length / 12));

    chart.points.forEach((point, index) => {
      const groupX = chartX + index * groupWidth;
      const values = [point.investment, point.conversions, point.cpa];

      values.forEach((value, seriesIndex) => {
        const height = (value / maxValue) * barAreaHeight;
        const barX = groupX + groupPadding + seriesIndex * barWidth;
        const barYTop = barAreaBottom - height;
        setFill(colors[seriesIndex][0], colors[seriesIndex][1], colors[seriesIndex][2]);
        drawRect(barX, barYTop, barWidth - 2, height, true);
      });

      if (index % labelStep === 0) {
        drawText(point.label, groupX + 2, barAreaBottom + 10, 7);
      }
    });

    setFill(0, 0, 0);
    const legendY = barAreaBottom + labelHeight;
    drawText("Inversion", chartX, legendY, 8);
    drawText("Conversiones", chartX + 80, legendY, 8);
    drawText("CPA", chartX + 190, legendY, 8);

    cursorY = barAreaBottom + labelHeight + 24;
  };

  tables.forEach((table) => renderTable(table));
  charts.forEach((chart) => renderChart(chart));

  finishPage();

  const pageCount = pages.length;
  const fontId = 3 + pageCount * 2;
  const kids = Array.from({ length: pageCount }, (_, index) => `${3 + index * 2} 0 R`).join(" ");
  const objects: Array<{ id: number; body: string }> = [
    { id: 1, body: "<< /Type /Catalog /Pages 2 0 R >>" },
    { id: 2, body: `<< /Type /Pages /Kids [${kids}] /Count ${pageCount} >>` },
  ];

  pages.forEach((contentStream, index) => {
    const pageId = 3 + index * 2;
    const contentId = pageId + 1;
    objects.push({
      id: pageId,
      body: `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${fontId} 0 R >> >> >>`,
    });
    objects.push({
      id: contentId,
      body: `<< /Length ${byteLength(contentStream)} >>\nstream\n${contentStream}\nendstream`,
    });
  });

  objects.push({
    id: fontId,
    body: "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  });

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  for (const obj of objects) {
    offsets.push(byteLength(pdf));
    pdf += `${obj.id} 0 obj\n${obj.body}\nendobj\n`;
  }

  const xrefOffset = byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (const offset of offsets.slice(1)) {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
};

export const exportMetaAdsPdf = async ({ type, dateRange, formattedDate }: ExportOptions) => {
  console.log("Starting Meta Ads PDF export...");
  let rangeText = `Rango: ${dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "-"} a ${dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "-"}`;

  const tables: TableSpec[] = [];

  try {
    if (type === "leads") {
      const from = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : formattedDate;
      const to = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : from;
      rangeText = `Rango: ${from} a ${to}`;

      const dateFilter = {
        event_date_between: [from, to],
      };

      const previousFromDate = new Date(from);
      previousFromDate.setFullYear(previousFromDate.getFullYear() - 1);
      const previousToDate = new Date(to);
      previousToDate.setFullYear(previousToDate.getFullYear() - 1);
      const previousFilter = {
        event_date_between: [format(previousFromDate, "yyyy-MM-dd"), format(previousToDate, "yyyy-MM-dd")],
      };

      const [currentKpisData, previousKpisData, campaignData, costsData] = await Promise.all([
        fetchAnalytics("daily_meta_ads_kpis", dateFilter),
        fetchAnalytics("daily_meta_ads_kpis", previousFilter),
        fetchAnalytics("daily_meta_campaign_performance", dateFilter),
        fetchAnalytics("daily_meta_ads_costs", dateFilter),
      ]);

      const currentOverview = aggregateMetaAdsKpis(currentKpisData?.rows || []);
      const previousOverview = aggregateMetaAdsKpis(previousKpisData?.rows || []);

      const metrics: Array<{
        key: keyof MetaAdsKpisOverview;
        title: string;
        unit: "currency" | "number" | "percentage";
      }> = [
        { key: "costos", title: "Costos", unit: "currency" },
        { key: "impresiones", title: "Impresiones", unit: "number" },
        { key: "clicks", title: "Clicks", unit: "number" },
        { key: "alcance", title: "Alcance", unit: "number" },
        { key: "frecuencia", title: "Frecuencia", unit: "number" },
        { key: "ctr", title: "CTR (all)", unit: "percentage" },
        { key: "cpc", title: "CPC", unit: "number" },
        { key: "cpm", title: "CPM", unit: "number" },
      ];

      const overviewRows = metrics.map((metric) => {
        const curr = Number(currentOverview[metric.key] ?? 0);
        const prev = Number(previousOverview[metric.key] ?? 0);
        const change = calcYoYChange(curr, prev);
        return [metric.title, formatMetricValue(curr, metric.unit), formatPercentage(change, 1)];
      });

      tables.push({
        title: "Resultados generales",
        headers: ["Métrica", "Valor", "Variación"],
        widths: [180, 120, 90],
        align: ["left", "right", "right"],
        rows: overviewRows.length > 0 ? overviewRows : [["Sin datos", "-", "-"]],
      });

      const campaignRows = (campaignData?.rows || [])
        .filter((row: any) => String(row.campaign_name ?? "").toLowerCase() !== "total")
        .slice(0, 20)
        .map((row: any, index: number) => {
          const name = String(row.campaign_name ?? `Campaña ${index + 1}`);
          const trimmed = name.length > 70 ? `${name.slice(0, 67)}...` : name;
          return [
            trimmed,
            formatCurrency(row.total_cost ?? 0),
            formatNumber(row.impresiones ?? 0),
            formatNumber(row.clicks ?? 0),
            formatNumber(row.frecuencia ?? 0),
            formatNumber(row.alcance ?? 0),
          ];
        });

      tables.push({
        title: "Desempeño de campañas",
        headers: ["Campaña", "Costos", "Impresiones", "Clicks", "Frecuencia", "Alcance"],
        widths: [170, 80, 85, 70, 70, 80],
        align: ["left", "right", "right", "right", "right", "right"],
        rowHeight: 30,
        rows: campaignRows.length > 0 ? campaignRows : [["Sin datos", "-", "-", "-", "-", "-"]],
      });

      const costsRows = (costsData?.rows || [])
        .slice(0, 31)
        .map((row: any) => [
          String(row.fecha ?? "-"),
          formatCurrency(row.total_cost ?? 0),
          formatNumber(row.cpm ?? 0),
          formatNumber(row.cpc ?? 0),
        ]);

      tables.push({
        title: "Evolución de la eficiencia de la inversión en medios",
        headers: ["Fecha", "Total costes", "CPM", "CPC"],
        widths: [90, 120, 90, 90],
        align: ["left", "right", "right", "right"],
        rows: costsRows.length > 0 ? costsRows : [["Sin datos", "-", "-", "-"]],
      });
    } else {
      const dateFilter = {
        event_date_between: [
          dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : formattedDate,
          dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : formattedDate,
        ],
      };

      const performanceData = await fetchAnalytics("daily_meta_ads_kpis", dateFilter);
      const overview = aggregateMetaAdsKpis(performanceData?.rows || []);

      tables.push({
        title: "Indicadores de rendimiento generales",
        headers: ["Métrica", "Valor"],
        widths: [220, 160],
        align: ["left", "right"],
        rows: [
          ["Costos", formatCurrency(overview.costos)],
          ["Impresiones", formatNumber(overview.impresiones)],
          ["Clicks", formatNumber(overview.clicks)],
          ["Alcance", formatNumber(overview.alcance)],
          ["Frecuencia", formatNumber(overview.frecuencia)],
          ["CTR (all)", formatPercentage(overview.ctr, 2)],
          ["CPC", formatNumber(overview.cpc)],
          ["CPM", formatNumber(overview.cpm)],
        ],
      });
    }

    const blob = buildReportPdf("Meta Ads", rangeText, tables);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "meta-ads-report.pdf";
    link.click();
    URL.revokeObjectURL(url);
    console.log("Meta Ads PDF export completed successfully.");
  } catch (error) {
    console.error("Error exporting Meta Ads PDF:", error);
    throw error;
  }
};
