import { z } from "zod";

export const basicInfoSchema = z.object({
  analysisName: z.string().min(1, "El nombre del análisis es obligatorio"),
  analysisDescription: z.string().optional(),
});

export const modelSchema = z.object({
  model: z.enum(["meridian", "robyn"]),
});

export const dataSourcesSchema = z.object({
  dataSources: z.enum(["integrate", "locale"]),
});

export const connectionsSchema = z.object({
  integratedConnections: z.array(z.string()).min(2, "Selecciona al menos 2 conexiones"),
  localConnections: z.instanceof(File).optional(),
});

export const dataDivisionMethodSchema = z.object({
  dataDivisionMethod: z.enum(["proportion", "date"]),
  dataDivisionProportion: z.number().optional(),
  dataDivisionDate: z
    .object({
      startDate: z.string(),
      endDate: z.string(),
    })
    .optional(),
});

export type BasicInfoSchemaType = z.infer<typeof basicInfoSchema>;
export type ModelSchemaType = z.infer<typeof modelSchema>;
export type DataSourcesSchemaType = z.infer<typeof dataSourcesSchema>;
export type ConnectionsSchemaType = z.infer<typeof connectionsSchema>;
export type DataDivisionMethodSchemaType = z.infer<typeof dataDivisionMethodSchema>;
