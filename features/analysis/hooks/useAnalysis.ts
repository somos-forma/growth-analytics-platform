import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { getAnalysis } from "../services/analysis";

export default function useAnalysis() {
  const user_id = Number(localStorage.getItem("userId"));
  const { selectedClientId } = useAuthStore();
  const client_id = Number(selectedClientId);

  return useQuery({
    queryKey: ["analysis", user_id, client_id],
    queryFn: () => getAnalysis(user_id, client_id),
    // refetchInterval: 20000,
    refetchIntervalInBackground: true,
    enabled: Number.isFinite(user_id) && Number.isFinite(client_id),
  });
}
