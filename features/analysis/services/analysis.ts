import type { Analysis } from "../types/analysis.type";

export const getAnalysis = async (): Promise<Analysis[]> => {
  const response = await fetch("/api/meridian", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data.items as Analysis[];
};
