import { useQuery } from "@tanstack/react-query";
import { getAnalysis } from "../services/analysis";

export default function useAnalysis() {
  const user_id = Number(localStorage.getItem("userId"));
  const client_id = 2;

  return useQuery({
    queryKey: ["analysis"],
    queryFn: () => getAnalysis(user_id, client_id),
    // refetchInterval: 20000,
    refetchIntervalInBackground: true,
  });
}
