import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Convierte una fecha ISO (u objeto Date) en formato "hace X tiempo".
 *
 * @param {string|Date} date - Fecha en formato ISO o Date.
 * @returns {string} - Texto relativo, ej: "hace 3 horas" o "hace 2 días".
 */

export function formatTimeAgo(date: string | Date = ""): string {
  if (!date) return "";

  try {
    const d = date instanceof Date ? date : new Date(date);
    return `Última sincronización: ${formatDistanceToNow(d, {
      addSuffix: true,
      locale: es,
    })}`;
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return "";
  }
}

/**
 * Formatea números grandes con separadores de miles.
 * Ejemplo: 2066178 → "2,066,178"
 */
export const formatNumber = (value: number, locale: string = "es-PE"): string => {
  return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
};

/**
 * Formatea porcentajes.
 * Ejemplo: 0.31 → "0.31%" o con decimales limitados.
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formatea moneda.
 * Ejemplo: 9408 → "US$ 9,408.00"
 */
export const formatCurrency = (value: number, currency: string = "CLP", locale: string = "US-en"): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formatea tiempo en segundos a formato HH:MM:SS.
 * Ejemplo: 107 → "00:01:47"
 */
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const remainingAfterHours = seconds % 3600;
  const minutes = Math.floor(remainingAfterHours / 60);
  const secs = Math.ceil(remainingAfterHours % 60);

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Formatea números grandes con abreviaciones (K, M, B, T) usando Intl.NumberFormat.
 * Ejemplo: 2046642 → "$2.0M"
 */
export const formatNumberAbbreviated = (
  value: number,
  prefix: string = "$",
  decimals: number = 0,
  locale: string = "US-en",
): string => {
  if (value === 0) return `${prefix}0`;

  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  const units = [
    { threshold: 1e12, suffix: "T" }, // Trillones
    { threshold: 1e9, suffix: "B" }, // Billones
    { threshold: 1e6, suffix: "M" }, // Millones
    { threshold: 1e3, suffix: "K" }, // Miles
  ];

  const unit = units.find((u) => abs >= u.threshold);

  if (!unit) {
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${prefix}${sign}${formatter.format(abs)}`;
  }

  const abbreviated = abs / unit.threshold;
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${prefix}${sign}${formatter.format(abbreviated)}${unit.suffix}`;
};

/**
 * Formatea una fecha ISO (YYYY-MM-DD) a formato abreviado en español.
 * Ejemplo: "2025-01-01" → "Ene 2025"
 */
export const formatMonthYear = (dateString: string, locale: string = "es-ES"): string => {
  if (!dateString) return "";

  try {
    // Parse as local year-month to avoid timezone shifting one month back.
    // Supports both "YYYY-MM" and "YYYY-MM-DD" inputs.
    const parts = dateString.split("-");
    const year = Number(parts[0]);
    const monthIndex = parts.length > 1 ? Number(parts[1]) - 1 : 0; // 0-based
    const date = new Date(year, isNaN(monthIndex) ? 0 : monthIndex, 1);

    const formatter = new Intl.DateTimeFormat(locale, {
      month: "short",
      year: "numeric",
    });

    return formatter.format(date);
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return dateString;
  }
};

/**
 * Formatea una fecha ISO (YYYY-MM-DD) a formato español completo.
 * Ejemplo: "2025-11-03" → "3 de nov 2025"
 */
export const formatSpanishDate = (dateString: string, locale: string = "es-ES"): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    // Formatear y ajustar para el formato español deseado
    const formatted = formatter.format(date);
    // Reemplazar el formato estándar por el formato "X de mes YYYY"
    return formatted.replace(/(\d+)\s+(\w+)\s+(\d+)/, "$1 de $2 $3");
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return dateString;
  }
};

/**
 * Retorna la fecha del primer día del mes actual en formato YYYY-MM-DD.
 * Ejemplo: "2026-01-01"
 */
export const getCurrentMonthStart = (date?: Date): string => {
  try {
    const now = date || new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return firstOfMonth.toISOString().slice(0, 10);
  } catch (error) {
    console.error("Error obteniendo el primer día del mes:", error);
    return "";
  }
};

export const getCurrentYearRange = (date?: Date): { from: string; to: string } => {
  try {
    const now = date || new Date();
    const currentYear = now.getFullYear();
    const from = new Date(currentYear, 0, 1).toISOString().slice(0, 10);
    const to = new Date(currentYear, 11, 31).toISOString().slice(0, 10);
    return { from, to };
  } catch (error) {
    console.error("Error obteniendo el rango del año actual:", error);
    return { from: "", to: "" };
  }
};

/**
 * Formatea el status de un job de Meridian a un label en español.
 */
export const formatStatus = (status: string): string => {
  switch (status) {
    case "DONE":
      return "Completado";
    case "QUEUED":
      return "En espera";
    case "RUNNING":
      return "En ejecución";
    case "ERROR":
      return "Error";
    default:
      return status;
  }
};
