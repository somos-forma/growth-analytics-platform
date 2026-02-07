import { useQuery } from "@tanstack/react-query";
import { getAnalysis } from "../services/analysis";

export default function useAnalysis() {
  // const user_id = localStorage.getItem("userId");
  // const client_id = JSON.parse(localStorage.getItem("clientId") || "[]");
  // const clientId = Array.isArray(client_id) ? client_id[0] : client_id;

  return useQuery({
    queryKey: ["analysis"],
    queryFn: () => getAnalysis(10, 2),
    // refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
}
