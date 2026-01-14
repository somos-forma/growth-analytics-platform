"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAssignment } from "../services/assignment";

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
}
