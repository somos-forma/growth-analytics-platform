import { useQuery } from "@tanstack/react-query";
import { getAnalysis } from "../services/analysis";

export default function useAnalysis() {
  return useQuery({
    queryKey: ["analysis"],
    queryFn: getAnalysis,
  });
}
