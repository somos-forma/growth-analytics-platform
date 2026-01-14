import { useMutation } from "@tanstack/react-query";
import { updateClient } from "../services/client";

export const useUpdateClient = () => {
  return useMutation({
    mutationFn: updateClient,
  });
};
