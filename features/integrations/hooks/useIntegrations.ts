import { useQuery } from "@tanstack/react-query";
import { getIntegrations } from "../services/integration";

export const useIntegrations = () => {
  return useQuery({
    queryKey: ["integrations"],
    queryFn: getIntegrations,
  });
};
