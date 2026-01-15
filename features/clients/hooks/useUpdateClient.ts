import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClient } from "../services/client";

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
