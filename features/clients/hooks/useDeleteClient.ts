import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClient } from "../services/client";

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
