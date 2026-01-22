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
  return new Intl.NumberFormat(locale).format(value);
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
export const formatCurrency = (value: number, currency: string = "USD", locale: string = "US-en"): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
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
    const date = new Date(dateString);
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
