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
};

const escapePdfText = (value: string) => value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

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

const buildReportPdf = (title: string, rangeText: string, tables: TableSpec[]) => {
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

  const baselineOffset = (rowHeight: number, size: number) => (rowHeight - size) / 2 + size * 0.8;

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
    const fitted = fitText(text, maxWidth, size);
    const textWidth = estimateTextWidth(fitted, size);
    const x = align === "right" ? Math.max(colX + paddingX, colX + colWidth - paddingX - textWidth) : colX + paddingX;
    drawText(fitted, x, yTop + baselineOffset(rowHeight, size), size);
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
    const rowHeight = 20;
    const tableX = margin;
    const tableWidth = table.widths.reduce((sum, width) => sum + width, 0);

    const tableHeight = 24 + headerHeight + table.rows.length * rowHeight + 28;
    if (cursorY + tableHeight > PAGE_HEIGHT - margin) {
      finishPage();
      startPage();
    }

    drawText(table.title, tableX, cursorY + 12, 13);
    cursorY += 24;

    setFill(0.95, 0.95, 0.95);
    drawRect(tableX, cursorY, tableWidth, headerHeight, true);
    setFill(0, 0, 0);

    drawRect(tableX, cursorY, tableWidth, headerHeight + table.rows.length * rowHeight);

    let colX = tableX;
    table.widths.forEach((width) => {
      drawLine(colX, cursorY, colX, cursorY + headerHeight + table.rows.length * rowHeight);
      colX += width;
    });
    drawLine(colX, cursorY, colX, cursorY + headerHeight + table.rows.length * rowHeight);

    let headerX = tableX;
    table.headers.forEach((header, index) => {
      drawCellText(header, headerX, table.widths[index], cursorY, headerHeight, 11, "left");
      headerX += table.widths[index];
    });

    table.rows.forEach((row, rowIndex) => {
      const rowTop = cursorY + headerHeight + rowIndex * rowHeight;
      drawLine(tableX, rowTop, tableX + tableWidth, rowTop);

      let cellX = tableX;
      row.forEach((cell, cellIndex) => {
        const align = table.align?.[cellIndex] ?? "left";
        drawCellText(cell, cellX, table.widths[cellIndex], rowTop, rowHeight, 11, align);
        cellX += table.widths[cellIndex];
      });
    });

    drawLine(
      tableX,
      cursorY + headerHeight + table.rows.length * rowHeight,
      tableX + tableWidth,
      cursorY + headerHeight + table.rows.length * rowHeight,
    );
    cursorY += headerHeight + table.rows.length * rowHeight + 28;
  };

  tables.forEach((table) => renderTable(table));

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

  objects.push({ id: fontId, body: "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>" });

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
const formatPercentage = (value: unknown) => (typeof value === "number" ? `${value.toFixed(2)}%` : "-");

export const exportGoogleAnalyticsPdf = async ({ type, dateRange, date, formattedDate }: ExportOptions) => {
  const rangeText =
    type === "leads"
      ? `Rango: ${dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "-"} a ${dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "-"}`
      : `Fecha: ${date ? format(date, "yyyy-MM-dd") : "-"}`;

  const tables: TableSpec[] = [];

  if (type === "leads") {
    const dateFilter = {
      event_date_between: [
        dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : formattedDate,
        dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : formattedDate,
      ],
    };

    const [general, channelGroup, sourceMedium, usersByDevice] = await Promise.all([
      fetchAnalytics("daily_ga4_traffic_campaign_yoy", dateFilter),
      fetchAnalytics("daily_ga4_traffic_channel_kpis", dateFilter),
      fetchAnalytics("daily_ga4_traffic_source_medium_kpis", dateFilter),
      fetchAnalytics("daily_device_users", dateFilter),
    ]);

    const generalData = (general?.rows || []).reduce(
      (acc: any, row: any) => {
        acc.total_users += row.total_usuarios ?? 0;
        acc.new_users += row.new_users ?? 0;
        acc.sessions += row.sessions ?? 0;
        acc.engaged_sessions += row.engaged_sessions ?? 0;
        acc.average_session_duration += row.duracion_media_sesion ?? 0;
        acc.bounce_rate += row.tasa_rebote ?? 0;
        acc.key_events += row.evento_clave ?? 0;
        acc.key_event_rate += row.tasa_evento_clave ?? 0;
        return acc;
      },
      {
        total_users: 0,
        new_users: 0,
        sessions: 0,
        engaged_sessions: 0,
        average_session_duration: 0,
        bounce_rate: 0,
        key_events: 0,
        key_event_rate: 0,
      },
    );

    tables.push({
      title: "Performance general",
      headers: ["Metrica", "Valor"],
      widths: [320, 140],
      align: ["left", "right"],
      rows: [
        ["Total de usuarios", formatNumber(generalData.total_users)],
        ["Usuarios nuevos", formatNumber(generalData.new_users)],
        ["Sesiones", formatNumber(generalData.sessions)],
        ["Sesiones con interaccion", formatNumber(generalData.engaged_sessions)],
        ["Duracion media de la sesion", formatNumber(generalData.average_session_duration)],
        ["Porcentaje de rebote", formatNumber(generalData.bounce_rate)],
        ["Eventos clave", formatNumber(generalData.key_events)],
        ["Tasa evento clave", formatNumber(generalData.key_event_rate)],
      ],
    });

    tables.push({
      title: "Performance por canal",
      headers: ["Canal", "Usuarios", "Sesiones", "Eventos", "Tasa evento clave"],
      widths: [140, 80, 80, 80, 90],
      align: ["left", "right", "right", "right", "right"],
      rows: (channelGroup?.rows || [])
        .slice(0, 8)
        .map((row: any) => [
          String(row.session_default_channel_group ?? "-"),
          formatNumber(row.usuarios_nuevos),
          formatNumber(row.sesiones),
          formatNumber(row.eventos_clave),
          formatPercentage(row.tasa_eventos_clave),
        ]),
    });

    tables.push({
      title: "Performance por fuente / medio",
      headers: ["Fuente / medio", "Usuarios", "Sesiones", "Eventos", "Tasa evento clave"],
      widths: [140, 80, 80, 80, 90],
      align: ["left", "right", "right", "right", "right"],
      rows: (sourceMedium?.rows || [])
        .slice(0, 8)
        .map((row: any) => [
          String(row.session_source_medium ?? "-"),
          formatNumber(row.usuarios_nuevos),
          formatNumber(row.sesiones),
          formatNumber(row.eventos_clave),
          formatPercentage(row.tasa_eventos_clave),
        ]),
    });

    const deviceAgg = (usersByDevice?.rows || []).reduce((acc: Record<string, number>, row: any) => {
      const device = row.device_category.replace(/\s+/g, "").replace(/[()]/g, "").toLowerCase();
      acc[device] = (acc[device] || 0) + (row.usuarios_activos ?? 0);
      return acc;
    }, {});

    tables.push({
      title: "Usuarios por dispositivo",
      headers: ["Dispositivo", "Usuarios"],
      widths: [220, 120],
      align: ["left", "right"],
      rows:
        Object.entries(deviceAgg).length > 0
          ? Object.entries(deviceAgg).map(([device, value]) => [device, formatNumber(value)])
          : [["Sin datos", "-"]],
    });
  } else {
    tables.push({
      title: "Exportacion ecommerce",
      headers: ["Estado"],
      widths: [360],
      align: ["left"],
      rows: [["Pendiente de configurar"]],
    });
  }

  const blob = buildReportPdf("Google Analytics 4", rangeText, tables);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "google-analytics-report.pdf";
  link.click();
  URL.revokeObjectURL(url);
};
