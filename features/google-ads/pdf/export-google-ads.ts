"use client";

import { format } from "date-fns";

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
    throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
  }

  return response.json();
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

const formatNumber = (value: unknown) => (typeof value === "number" ? value.toLocaleString("es-ES") : "-");
const formatCurrency = (value: unknown) => (typeof value === "number" ? `$${value.toLocaleString("es-ES")}` : "-");
const formatPercentage = (value: unknown) => (typeof value === "number" ? `${(value * 100).toFixed(2)}%` : "-");

const aggregateOverviewData = (rows: any[]) => {
  const grouped = rows.reduce(
    (acc: { [fecha: string]: { inversion_total: number; conversiones_total: number } }, row: any) => {
      const fecha = row.fecha;
      if (!acc[fecha]) {
        acc[fecha] = { inversion_total: row.inversion_total || 0, conversiones_total: row.conversiones_total || 0 };
      }
      return acc;
    },
    {} as { [fecha: string]: { inversion_total: number; conversiones_total: number } },
  );

  const totalInversion = (Object.values(grouped) as { inversion_total: number; conversiones_total: number }[]).reduce(
    (sum, day) => sum + day.inversion_total,
    0,
  );
  const totalConversiones = (
    Object.values(grouped) as { inversion_total: number; conversiones_total: number }[]
  ).reduce((sum, day) => sum + day.conversiones_total, 0);

  return {
    inversion_total: totalInversion,
    conversiones_total: totalConversiones,
    cpa_total: totalConversiones > 0 ? totalInversion / totalConversiones : 0,
  };
};

export const exportGoogleAdsPdf = async ({ type, dateRange, formattedDate }: ExportOptions) => {
  let rangeText = `Rango: ${dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "-"} a ${dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "-"}`;

  const tables: TableSpec[] = [];

  if (type === "leads") {
    const fixedFrom = "2025-01-01";
    const fixedTo = "2026-01-01";
    rangeText = `Rango: ${fixedFrom} a ${fixedTo}`;
    const dateFilter = {
      event_date_between: [fixedFrom, fixedTo],
    };

    const baseDate = new Date(fixedFrom);
    const previousDate = new Date(baseDate);
    previousDate.setFullYear(previousDate.getFullYear() - 1);
    const previousFrom = previousDate.toISOString().split("T")[0];

    const [overviewData, previousOverviewData, chartData, campaignData, keywordsData] = await Promise.all([
      fetchAnalytics("daily_campaign_google_ads_summary", dateFilter),
      fetchAnalytics("daily_campaign_google_ads_summary", {
        event_date_between: [previousFrom, previousDate.toISOString().split("T")[0]],
      }),
      fetchAnalytics("daily_google_ads_performance", dateFilter),
      fetchAnalytics("daily_campaign_google_ads_summary", dateFilter),
      fetchAnalytics("daily_gads_top_keywords", dateFilter),
    ]);

    const overviewRows = overviewData?.rows || [];
    const previousRows = previousOverviewData?.rows || [];
    const currentOverview = aggregateOverviewData(overviewRows);
    const previousOverview = aggregateOverviewData(previousRows);

    const calcChange = (curr: number, prev: number) => (prev ? ((curr - prev) / prev) * 100 : 0);

    tables.push({
      title: "Resultados Generales",
      headers: ["Metrica", "Valor", "Variacion"],
      widths: [180, 90, 90],
      align: ["left", "right", "right"],
      rows: [
        [
          "Inversion",
          formatCurrency(currentOverview.inversion_total),
          formatPercentage(calcChange(currentOverview.inversion_total, previousOverview.inversion_total) / 100),
        ],
        [
          "Conversiones",
          formatNumber(currentOverview.conversiones_total),
          formatPercentage(calcChange(currentOverview.conversiones_total, previousOverview.conversiones_total) / 100),
        ],
        [
          "CPA",
          formatCurrency(currentOverview.cpa_total),
          formatPercentage(calcChange(currentOverview.cpa_total, previousOverview.cpa_total) / 100),
        ],
      ],
    });

    const chartGrouped = (chartData?.rows || []).reduce(
      (acc: Record<string, { investment: number; conversions: number }>, curr: any) => {
        const { coste, conversiones, fecha } = curr;
        const month = String(fecha ?? "").slice(0, 7);

        if (!month) {
          return acc;
        }

        if (!acc[month]) {
          acc[month] = { investment: 0, conversions: 0 };
        }

        acc[month].investment += coste ?? 0;
        acc[month].conversions += conversiones ?? 0;

        return acc;
      },
      {},
    );

    const chartPoints = Object.keys(chartGrouped)
      .sort()
      .map((month) => {
        const investment = chartGrouped[month].investment;
        const conversions = chartGrouped[month].conversions;
        const cpa = conversions > 0 ? investment / conversions : 0;
        return {
          label: month,
          investment,
          conversions,
          cpa,
        };
      });

    const chartRows = chartPoints.map((point) => [
      point.label,
      formatCurrency(point.investment),
      formatNumber(point.conversions),
      formatCurrency(point.cpa),
    ]);

    tables.push({
      title: "Evolucion de inversion, conversiones y CPA",
      headers: ["Mes", "Inversion", "Conversiones", "CPA"],
      widths: [80, 100, 90, 90],
      align: ["left", "right", "right", "right"],
      rows: chartRows.length > 0 ? chartRows : [["Sin datos", "-", "-", "-"]],
    });

    const campaignRows = (campaignData?.rows || []).slice(0, 20).map((row: any) => {
      const name = String(row.campaign_name ?? "-");
      const trimmed = name.length > 70 ? `${name.slice(0, 67)}...` : name;
      const wrapped = trimmed.replace(/\s*\|\s*/g, " | ");
      const parts = wrapped.split(" | ");
      let threeLine = wrapped;
      if (parts.length > 2) {
        const thirdLine = parts.slice(4).join(" | ");
        threeLine = `${parts.slice(0, 2).join(" | ")}\n${parts.slice(2, 4).join(" | ")}\n${thirdLine}`;
      } else if (parts.length > 1) {
        threeLine = `${parts.slice(0, 2).join(" | ")}\n${parts.slice(2).join(" | ")}`;
      }
      return [
        threeLine,
        formatCurrency(row.inversion ?? 0),
        formatNumber(row.conversiones ?? 0),
        formatCurrency(row.coste_por_conversion ?? 0),
        formatPercentage(row.ctr ?? 0),
        formatPercentage(row.cuota_impresiones_perdidas ?? 0),
      ];
    });

    tables.push({
      title: "Desempeño de campañas",
      headers: ["Campaña", "Inv.", "Conv.", "C/Conv.", "CTR", "Cuota"],
      widths: [160, 90, 90, 90, 60, 60],
      align: ["left", "right", "right", "right", "right", "right"],
      rowHeight: 40,
      rows: campaignRows.length > 0 ? campaignRows : [["Sin datos", "-", "-", "-", "-", "-"]],
    });

    const keywordRows = (keywordsData?.rows || []).slice(0, 20).map((row: any) => {
      const keyword = String(row.palabra_clave ?? "-");
      const trimmed = keyword.length > 60 ? `${keyword.slice(0, 57)}...` : keyword;
      return [
        trimmed,
        formatCurrency(row.coste ?? 0),
        formatNumber(row.impresiones ?? 0),
        formatNumber(row.clics ?? 0),
        formatNumber(row.conversiones ?? 0),
        formatCurrency(row.coste_por_conversion ?? 0),
      ];
    });

    tables.push({
      title: "Desempeño de keywords",
      headers: ["Keyword", "Costo", "Impres.", "Clics", "Conv.", "C/Conv."],
      widths: [170, 80, 80, 70, 70, 80],
      align: ["left", "right", "right", "right", "right", "right"],
      rowHeight: 30,
      rows: keywordRows.length > 0 ? keywordRows : [["Sin datos", "-", "-", "-", "-", "-"]],
    });
  } else {
    // Ecommerce section
    const dateFilter = {
      event_date_between: [
        dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : formattedDate,
        dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : formattedDate,
      ],
    };

    const [performanceData] = await Promise.all([fetchAnalytics("daily_campaign_google_ads_summary", dateFilter)]);

    // Indicadores de rendimiento generales
    const totalInvestment = (performanceData?.rows || []).reduce(
      (sum: number, row: any) => sum + (row.cost_micros ? row.cost_micros / 1000000 : 0),
      0,
    );
    const totalClicks = (performanceData?.rows || []).reduce((sum: number, row: any) => sum + (row.clicks ?? 0), 0);
    const totalImpressions = (performanceData?.rows || []).reduce(
      (sum: number, row: any) => sum + (row.impressions ?? 0),
      0,
    );
    const avgCtr = totalClicks / (totalImpressions || 1);
    const avgCpc = totalInvestment / (totalClicks || 1);
    const avgCpm = totalInvestment / ((totalImpressions || 1) / 1000);

    tables.push({
      title: "Indicadores de Rendimiento Generales",
      headers: ["Métrica", "Valor"],
      widths: [200, 160],
      align: ["left", "right"],
      rows: [
        ["Inversión Total", formatCurrency(totalInvestment)],
        ["Impresiones", formatNumber(totalImpressions)],
        ["Clics", formatNumber(totalClicks)],
        ["CTR", formatPercentage(avgCtr)],
        ["CPC Promedio", formatCurrency(avgCpc)],
        ["CPM Promedio", formatCurrency(avgCpm)],
      ],
    });

    // Simular datos de diferentes tipos de campaña
    tables.push({
      title: "Rendimiento por Tipo de Campaña - Search",
      headers: ["Cuenta", "Inversión", "Impresiones", "Clics", "CTR", "CPC"],
      widths: [100, 70, 80, 50, 50, 50],
      align: ["left", "right", "right", "right", "right", "right"],
      rows: [
        [
          "Cuenta A",
          formatCurrency(1200),
          formatNumber(45000),
          formatNumber(2250),
          formatPercentage(0.05),
          formatCurrency(0.53),
        ],
        [
          "Cuenta B",
          formatCurrency(1800),
          formatNumber(67000),
          formatNumber(3350),
          formatPercentage(0.05),
          formatCurrency(0.54),
        ],
        [
          "Cuenta C",
          formatCurrency(950),
          formatNumber(38000),
          formatNumber(1900),
          formatPercentage(0.05),
          formatCurrency(0.5),
        ],
      ],
    });

    tables.push({
      title: "Rendimiento por Tipo de Campaña - Performance Max",
      headers: ["Cuenta", "Inversión", "Impresiones", "Clics", "CTR", "CPC"],
      widths: [100, 70, 80, 50, 50, 50],
      align: ["left", "right", "right", "right", "right", "right"],
      rows: [
        [
          "Cuenta A",
          formatCurrency(800),
          formatNumber(120000),
          formatNumber(2400),
          formatPercentage(0.02),
          formatCurrency(0.33),
        ],
        [
          "Cuenta B",
          formatCurrency(1200),
          formatNumber(180000),
          formatNumber(3600),
          formatPercentage(0.02),
          formatCurrency(0.33),
        ],
        [
          "Cuenta C",
          formatCurrency(600),
          formatNumber(90000),
          formatNumber(1800),
          formatPercentage(0.02),
          formatCurrency(0.33),
        ],
      ],
    });

    // Indicadores de costos
    tables.push({
      title: "Indicadores de Costos por Día",
      headers: ["Fecha", "Costo", "Conversiones", "Costo/Conv.", "Tasa Conv."],
      widths: [80, 60, 70, 70, 70],
      align: ["left", "right", "right", "right", "right"],
      rows: [
        ["2025-11-01", formatCurrency(150), formatNumber(12), formatCurrency(12.5), formatPercentage(0.08)],
        ["2025-11-02", formatCurrency(180), formatNumber(15), formatCurrency(12), formatPercentage(0.083)],
        ["2025-11-03", formatCurrency(120), formatNumber(10), formatCurrency(12), formatPercentage(0.083)],
        ["2025-11-04", formatCurrency(200), formatNumber(18), formatCurrency(11.11), formatPercentage(0.09)],
        ["2025-11-05", formatCurrency(160), formatNumber(14), formatCurrency(11.43), formatPercentage(0.088)],
      ],
    });

    // Keywords para ecommerce
    tables.push({
      title: "Palabras Clave - Ecommerce",
      headers: ["Keyword", "Costo", "Impresiones", "Clics", "Transacciones", "CPS"],
      widths: [100, 60, 70, 50, 70, 50],
      align: ["left", "right", "right", "right", "right", "right"],
      rows: [
        [
          "comprar online",
          formatCurrency(450),
          formatNumber(15000),
          formatNumber(750),
          formatNumber(38),
          formatCurrency(11.84),
        ],
        [
          "tienda virtual",
          formatCurrency(380),
          formatNumber(12000),
          formatNumber(600),
          formatNumber(30),
          formatCurrency(12.67),
        ],
        [
          "ecommerce barato",
          formatCurrency(320),
          formatNumber(10000),
          formatNumber(500),
          formatNumber(25),
          formatCurrency(12.8),
        ],
        [
          "compras online",
          formatCurrency(290),
          formatNumber(9500),
          formatNumber(475),
          formatNumber(24),
          formatCurrency(12.08),
        ],
        [
          "tienda online",
          formatCurrency(260),
          formatNumber(8500),
          formatNumber(425),
          formatNumber(21),
          formatCurrency(12.38),
        ],
      ],
    });
  }

  const blob = buildReportPdf("Google Ads", rangeText, tables);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "google-ads-report.pdf";
  link.click();
  URL.revokeObjectURL(url);
};
