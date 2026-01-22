import type { Analysis } from "../types/analysis.type";

export const getAnalysis = async (): Promise<Analysis[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: "1",
      name: "Análisis de Campaña Q1",
      status: "completed",
      model: "Robyn",
      description: "Análisis detallado de la campaña de marketing del Q1.",
      completedAgo: "2025-10-14T14:00:00Z",
      duration: "3h 45m",
    },
    {
      id: "2",
      name: "Análisis de Campaña Q2",
      status: "in_progress",
      model: "Meridiam",
      description: "Análisis en curso de la campaña de marketing del Q2.",
      completedAgo: "2025-10-17T12:00:00Z",
      duration: "3h 45m",
    },
    {
      id: "3",
      name: "Análisis de Campaña Q3",
      status: "failed",
      model: "Meridiam",
      description: "Análisis en curso de la campaña de marketing del Q3.",
      completedAgo: "2025-10-17T12:55:00Z",
      duration: "3h 45m",
    },
  ];
};
