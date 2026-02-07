import type { Analysis } from "../types/analysis.type";

export const getAnalysis = async (user_id: number, client_id: number): Promise<Analysis[]> => {
  const response = await fetch(`/api/analysis?user_id=${user_id}&client_id=${client_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch analysis");
  }

  const data = await response.json();
  return data;
};
