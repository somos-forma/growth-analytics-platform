"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../services/client";
import { toast } from "sonner";
import { useClientStore } from "../store";

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}
