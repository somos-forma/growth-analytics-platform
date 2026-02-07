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
  connectionsSelected: z
    .object({
      ga4: z.object({ check: z.boolean() }),
      meta_ads: z.object({ check: z.boolean() }),
      google_ads: z.object({ check: z.boolean() }),
    })
    .refine((data) => {
      const checked = Object.values(data).filter((conn) => conn.check).length;
      return checked >= 3;
    }, "Selecciona al menos 3 conexiones"),
  localConnections: z.instanceof(File).optional(),
});

export const dataDivisionMethodSchema = z.object({
  method: z.object({
    fecha: z.object({
      to: z.string(),
      from: z.string(),
      check: z.boolean(),
    }),
    proporcional: z.object({
      check: z.boolean(),
      pruebas: z.number(),
      entrenamiento: z.number(),
    }),
  }),
});

export type BasicInfoSchemaType = z.infer<typeof basicInfoSchema>;
export type ModelSchemaType = z.infer<typeof modelSchema>;
export type DataSourcesSchemaType = z.infer<typeof dataSourcesSchema>;
export type ConnectionsSchemaType = z.infer<typeof connectionsSchema>;
export type DataDivisionMethodSchemaType = z.infer<typeof dataDivisionMethodSchema>;
