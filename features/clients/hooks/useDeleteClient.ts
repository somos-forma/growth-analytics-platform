import { useMutation } from "@tanstack/react-query";
import { deleteClient } from "../services/client";

export const useDeleteClient = () => {
  return useMutation({
    mutationFn: deleteClient,
  });
};
