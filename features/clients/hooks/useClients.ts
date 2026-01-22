import { useQuery } from "@tanstack/react-query";

import { getClients } from "../services/client";

export const useClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });
};
